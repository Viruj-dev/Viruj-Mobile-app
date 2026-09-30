// Native patient identity, assessment and schedule sections from the web booking page.
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import * as Crypto from "expo-crypto";
import { api, type CareItem, type Profile } from "./api";
import { useSession } from "./session";
import { pickImage } from "./media";
import { bookingDate, bookingPractices, bookingTime, requestedSchedule, validComplaintPhoto } from "./booking-validation";
import { Range, SelectField } from "./web-controls";
import { Body, Button, Card, Empty, ErrorText, Field, Heading, ResourceState, Screen, useResource, useBack } from "./ui";

type Slot = { id: string; startsAt: string; endsAt: string };
export function Booking({ doctorId, providerId, initialPracticeId, back, complete }: { doctorId: string; providerId?: string; initialPracticeId?: string; back(): void; complete(): void }) {
  const { session } = useSession();
  const profile = useResource<Profile>(`/users/${session!.user.id}`);
  const doctor = useResource<{ data: CareItem }>(`/doctors/${encodeURIComponent(doctorId)}`);
  const [step, setStep] = useState(1), [practiceId, setPracticeId] = useState(initialPracticeId || ""), [slotId, setSlotId] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]), [slotsLoading, setSlotsLoading] = useState(false), [slotsError, setSlotsError] = useState("");
  const [date, setDate] = useState(bookingDate(new Date())), [time, setTime] = useState(""), [error, setError] = useState("");
  const [name, setName] = useState(""), [phone, setPhone] = useState(""), [reason, setReason] = useState("");
  const [age, setAge] = useState(""), [gender, setGender] = useState(""), [height, setHeight] = useState(170), [weight, setWeight] = useState(70);
  const [photo, setPhoto] = useState<string>(), [busy, setBusy] = useState(false), [slotsVersion, setSlotsVersion] = useState(0);
  const submitting = useRef(false), request = useRef<{ id: string; payload: string } | null>(null);
  const practices = bookingPractices(doctor.data?.data.practices || [], providerId, initialPracticeId);
  const practice = practices.find(p => p.id === practiceId), slot = slots.find(s => s.id === slotId);
  const schedule = slot ? { startsAt: slot.startsAt, endsAt: slot.endsAt } : requestedSchedule(date, time);
  const identityValid = name.trim().length > 0 && /^\+?[\d -]{7,20}$/.test(phone) && /^\d{1,3}$/.test(age) && Number(age) > 0 && Number(age) <= 120 && ["male", "female", "other"].includes(gender);
  useEffect(() => { if (profile.data) { setName(profile.data.name); setPhone(profile.data.phoneNumber || ""); setAge(profile.data.age ? String(profile.data.age) : ""); setGender(profile.data.gender?.toLowerCase() || ""); setHeight(Number.parseInt(profile.data.height || "") || 170); setWeight(Number.parseInt(profile.data.weight || "") || 70); } }, [profile.data]);
  useEffect(() => {
    const available = bookingPractices(doctor.data?.data.practices || [], providerId, initialPracticeId).filter(p => p.bookingEnabled);
    setPracticeId(current => available.some(p => p.id === current) ? current : available.length === 1 ? available[0]!.id : "");
  }, [doctor.data, providerId, initialPracticeId]);
  useEffect(() => {
    setSlotId(""); setSlots([]); setSlotsError(""); setSlotsLoading(false); if (!practiceId) return;
    const controller = new AbortController(); setSlotsLoading(true);
    api.request<{ data: Slot[] }>(`/doctors/${encodeURIComponent(doctorId)}/practices/${encodeURIComponent(practiceId)}/slots?startsUntil=${encodeURIComponent(new Date(Date.now() + 14 * 86400000).toISOString())}`, { signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setSlots(response.data); })
      .catch(e => { if (!controller.signal.aborted) setSlotsError(e instanceof Error ? e.message : "Could not load published times."); })
      .finally(() => { if (!controller.signal.aborted) setSlotsLoading(false); });
    return () => controller.abort();
  }, [doctorId, practiceId, slotsVersion]);
  useBack(step === 2, () => setStep(1));
  async function choosePhoto() { try { const selected = await pickImage(); if (selected) { if (!validComplaintPhoto(selected.dataUrl)) throw new Error("Choose a JPEG, PNG or WebP photo under 2 MB."); setPhoto(selected.dataUrl); setError(""); } } catch (e) { setError(e instanceof Error ? e.message : "Could not select photo."); } }
  async function submit() {
    const selected = slot ? { startsAt: slot.startsAt, endsAt: slot.endsAt } : requestedSchedule(date, time);
    if (submitting.current || !selected || !identityValid || !practice?.bookingEnabled) return;
    if (new Date(selected.startsAt).getTime() <= Date.now()) { setError("Choose a future requested time."); return; }
    submitting.current = true; setBusy(true); setError("");
    const body = { doctorId: Number(doctorId), practiceId: practice.id, ...selected, scheduleSlotId: slot?.id, fullName: name.trim(), phoneNumber: phone.trim(), age: Number(age), gender, height, weight, complaintPhoto: photo, appointmentType: "in-person", additionalComments: reason.trim() };
    const payload = JSON.stringify(body);
    // Keep the same idempotency key when retrying a request whose response was lost.
    if (request.current?.payload !== payload) request.current = { id: Crypto.randomUUID(), payload };
    try { await api.request("/appointments", { method: "POST", body: { ...body, requestId: request.current!.id } }); setStep(3); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not submit request."); }
    finally { submitting.current = false; setBusy(false); }
  }
  const days = Array.from({ length: 14 }, (_, i) => bookingDate(new Date(Date.now() + i * 86400000)));
  return <Screen title="Book Appointment" back={() => step === 2 ? setStep(1) : back()}>
    <ResourceState {...doctor} /><ResourceState {...profile} />
    <View style={{ flexDirection: "row", gap: 8 }}>{["Patient", "Schedule & Review", "Submitted"].map((label, i) => <Body key={label} style={{ flex: 1, fontSize: 11, color: step === i + 1 ? "#7F1D1D" : "#9CA3AF", borderBottomWidth: 3, borderBottomColor: step === i + 1 ? "#7F1D1D" : "#E5E7EB", paddingBottom: 10 }}>{i + 1}. {label}</Body>)}</View>
    <Card><Heading>{doctor.data?.data.name || "Doctor"}</Heading><Body>{doctor.data?.data.specialty}</Body><Body>{doctor.data?.data.qualifications}</Body>{practice && <Body>{practice.name}</Body>}</Card>
    {step === 1 && <>
      <Heading>Patient Identity</Heading><Body>Booking for your own health profile.</Body>
      <Field label="Full name" value={name} onChangeText={setName} maxLength={200} />
      <Field label="Age" keyboardType="number-pad" value={age} onChangeText={setAge} maxLength={3} />
      <SelectField label="Gender" value={gender} options={["male", "female", "other"]} onChange={setGender} />
      <Field label="Phone number (include country code)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={20} />
      <Heading>Body Assessment</Heading><Range label="Height" value={height} onChange={setHeight} min={30} max={250} unit="cm" /><Range label="Weight" value={weight} onChange={setWeight} min={1} max={250} unit="kg" />
      <Field label="Reason for visit / additional comments" multiline value={reason} onChangeText={setReason} maxLength={2000} />
      <Button title="Attach symptom photo (optional)" secondary onPress={() => void choosePhoto()} /><Body>JPEG, PNG or WebP · Maximum 2 MB</Body>
      {photo && <Card><Image source={{ uri: photo }} accessibilityLabel="Selected symptom photo" style={{ height: 180 }} resizeMode="contain" /><Button title="Remove photo" secondary onPress={() => setPhoto(undefined)} /></Card>}
      <Heading>Practice Location</Heading><Body>{providerId || initialPracticeId ? "Your selected provider is preserved for this request." : "Choose where you want to see this doctor."}</Body>
      {practices.map(p => <Pressable key={p.id} accessibilityRole="radio" accessibilityState={{ checked: practiceId === p.id, disabled: !p.bookingEnabled }} disabled={!p.bookingEnabled} onPress={() => setPracticeId(p.id)}><Card style={{ borderColor: practiceId === p.id ? "#7F1D1D" : "#E5E7EB", borderWidth: practiceId === p.id ? 2 : 1 }}><Heading>{p.name}</Heading><Body>{p.address}</Body>{!p.bookingEnabled && <Body>Online booking is unavailable.</Body>}</Card></Pressable>)}
      {!doctor.loading && !practices.length && <Empty title="Online booking is unavailable" detail="This provider has no connected booking practice for this doctor. Contact the provider directly." />}
      <Button title="Choose Schedule" disabled={!practice?.bookingEnabled || !identityValid} onPress={() => setStep(2)} />
    </>}
    {step === 2 && <>
      <Heading>Requested Date & Time</Heading><Body>India time (Asia/Kolkata). The provider reviews availability before approving your request.</Body>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>{days.map(day => <Button key={day} title={day.slice(5)} secondary={date !== day} onPress={() => { setDate(day); setSlotId(""); }} />)}</ScrollView>
      <Field label="Requested date (YYYY-MM-DD)" value={date} onChangeText={value => { setDate(value); setSlotId(""); }} maxLength={10} />
      <Field label="Requested time (24-hour HH:mm)" placeholder="18:00" value={time} onChangeText={value => { setTime(value); setSlotId(""); }} maxLength={5} keyboardType="numbers-and-punctuation" />
      {!schedule && <Body>Choose a valid future date and time.</Body>}
      <Heading>Published Times (Optional)</Heading><Body>These times also need provider approval.</Body>
      {slotsLoading && <Body>Loading published times…</Body>}<ErrorText message={slotsError} />
      {!!slotsError && <Button title="Retry Published Times" secondary onPress={() => setSlotsVersion(v => v + 1)} />}
      {!slotsLoading && !slots.length && !slotsError && <Body>No published times. You can still request a time above.</Body>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{slots.filter(s => bookingDate(new Date(s.startsAt)) === date).map(s => <Button key={s.id} title={bookingTime(s.startsAt)} secondary={slotId !== s.id} onPress={() => { setSlotId(s.id); setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }).format(new Date(s.startsAt))); }} />)}</View>
      <Card><Heading>Review Your Request</Heading><Body>{practice?.name}</Body><Body>{practice?.address}</Body><Body>{doctor.data?.data.name} · In-person</Body><Body>{name} · {age} years · {gender}</Body><Body>{phone}</Body><Body>{date} · {time || "Select a time"} IST</Body>{!!reason && <Body>{reason}</Body>}<Body>Pending approval after submission. Wait for confirmation before travelling.</Body></Card>
      <Button title="Submit Appointment Request" busy={busy} disabled={!schedule || !identityValid || !practice?.bookingEnabled} onPress={() => void submit()} />
    </>}
    <ErrorText message={error} />
    {step === 3 && <Card><Heading>Request Submitted</Heading><Body>Pending provider approval. Follow approval, rejection and arrival verification in My Health.</Body><Body>{practice?.name} · {date} · {time} IST</Body><Button title="View My Health" onPress={complete} /></Card>}
  </Screen>;
}
