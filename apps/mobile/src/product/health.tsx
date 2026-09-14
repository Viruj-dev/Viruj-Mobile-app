// Native layout from my-health/page.tsx and booking-page/page.tsx.
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { api, type Appointment, type CareItem, type Profile } from "./api";
import { type Navigate } from "./home";
import { useSession } from "./session";
import { previewEnabled } from "./preview";
import { pickImage, pickMedia } from "./media";
import * as Crypto from "expo-crypto";
import { Range, SelectField } from "./web-controls";
import { Body, Button, Card, Empty, ErrorText, Field, Glyph, Heading, ResourceState, Screen, useResource, useBack } from "./ui";
export function Health({ navigate }: { navigate: Navigate }) {
  const result = useResource<{ appointments: Appointment[] }>("/appointments"); const [notice, setNotice] = useState(""); const [record, setRecord] = useState<string>();
  useEffect(() => { const timer = setInterval(() => result.reload(), 30000); return () => clearInterval(timer); }, []);
  const active = (result.data?.appointments || []).filter(a => ["approved", "pending_approval", "rescheduled"].includes(a.status)); const past = (result.data?.appointments || []).filter(a => !["approved", "pending_approval", "rescheduled"].includes(a.status));
  async function upload() { try { const image = await pickImage(); if (image) { setRecord(image.dataUrl); setNotice("Record selected. Upload storage is not connected yet."); } } catch (e) { setNotice(e instanceof Error ? e.message : "Could not select record."); } }
  return <Screen title="My Health" back={() => navigate({ name: "home" })} floating={<Pressable accessibilityRole="button" accessibilityLabel="Upload medical record" onPress={() => void upload()} style={{ position: "absolute", bottom: 96, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: "#7F1D1D", alignItems: "center", justifyContent: "center" }}><Glyph name="cloud-upload-outline" color="white" size={22} /></Pressable>}><View style={{ flexDirection: "row", gap: 12 }}>{([['Health Profile', 'Keep age, vitals, and medical history current.', 'shield-outline'], ['Quick Rebook', 'Jump back into care with one tap from history.', 'arrow-up-outline']] as const).map(([title, text, icon]) => <Pressable accessibilityRole="button" key={title} onPress={() => setNotice(title === "Health Profile" ? "Update your health profile from the profile screen." : "Use your past records to quickly rebook the right doctor.")} style={{ flex: 1, padding: 16, borderRadius: 26, borderWidth: 1, borderColor: "#FEE2E2", backgroundColor: "white", gap: 8 }}><Glyph name={icon} color="#B91C1C" size={20} /><Heading style={{ fontSize: 14, fontWeight: "700", marginTop: 8 }}>{title}</Heading><Body style={{ fontSize: 12, lineHeight: 19 }}>{text}</Body></Pressable>)}</View><ResourceState {...result} />{[["Current Appointments", "Live requests and upcoming consultations.", active], ["Past Appointments", "Your consultation history and rebooking shortcuts.", past]].map(([title, detail, list], index) => <View key={String(title)} style={{ gap: 12 }}><View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}><View style={{ flex: 1 }}><Heading style={{ fontWeight: "700" }}>{String(title)}</Heading><Body>{String(detail)}</Body></View><Body style={{ fontSize: 12 }}>{(list as Appointment[]).length} {index ? "records" : "active"}</Body></View>{(list as Appointment[]).map(item => <AppointmentCard key={item.id} item={item} active={index === 0} navigate={navigate} notice={setNotice} reload={result.reload} />)}{!result.loading && !result.error && !(list as Appointment[]).length && <Card style={{ padding: 32, borderStyle: "dashed", borderColor: "#FECACA", alignItems: "center" }}><Glyph name={index ? "receipt-outline" : "calendar-outline"} size={30} /><Heading style={{ fontSize: 16, textAlign: "center" }}>{index ? "No treatment history yet" : "No active appointments right now"}</Heading><Body style={{ textAlign: "center" }}>{index ? "Once a consultation is completed, its record will live here for quick reference." : "Book a consultation and it will appear here as soon as the request is created."}</Body>{index === 0 && <Button title="Book an Appointment" onPress={() => navigate({ name: "care", kind: "doctors" })} />}</Card>}</View>)}{!!notice && <Card><Body>{notice}</Body><Button title="Dismiss" secondary onPress={() => { setNotice(""); setRecord(undefined); }} />{record && <Image source={{ uri: record }} style={{ height: 180 }} resizeMode="contain" />}</Card>}</Screen>;
}
function AppointmentCard({ item, active, navigate, notice, reload }: { item: Appointment; active: boolean; navigate: Navigate; notice(text: string): void; reload(): void }) {
  async function refresh() {
    if (item.source !== "erp") { reload(); notice("Legacy booking: contact the provider for updates."); return; }
    try { const response = await api.request<{ appointment: Appointment }>(`/appointments/${item.id}`); notice(`${response.appointment.status.replaceAll("_", " ")}${response.appointment.rejectionReason ? ": " + response.appointment.rejectionReason : ""}`); reload(); } catch (e) { notice(e instanceof Error ? e.message : "Could not refresh"); }
  }
  async function cancel() { if (item.source !== "erp") { notice("Contact the provider to cancel this legacy booking."); return; } try { await api.request(`/appointments/${item.id}/cancel`, { method: "POST", body: { expectedVersion: item.version } }); reload(); } catch (e) { notice(e instanceof Error ? e.message : "Could not cancel"); } }
  const status = item.status === "rescheduled" ? "Rescheduled" : active ? item.status === "approved" ? "Live" : "Pending" : item.status === "completed" ? "Checked-Up" : item.status === "cancelled" ? "Cancelled" : item.status === "rejected" ? "Rejected" : "No Show";
  return <Card style={{ padding: 16, borderRadius: 12, borderWidth: active ? 2 : 1, borderColor: active ? "#7F1D1D" : "#FEE2E2", overflow: "hidden" }}><View style={{ height: 4, backgroundColor: "#991B1B", margin: -16, marginBottom: 0 }} /><View style={{ flexDirection: "row", gap: 12 }}><View style={{ backgroundColor: "#FEF2F2", padding: 10, borderRadius: 16 }}><Glyph name="business-outline" size={24} /></View><View style={{ flex: 1 }}><Heading style={{ fontSize: 16 }}>{item.hospitalName || "Viruj Health Partner"}</Heading><Body style={{ fontSize: 12 }}>{item.hospitalAddress || "Location not specified"}</Body></View><View style={{ alignItems: "flex-end" }}><Body style={{ backgroundColor: active ? item.status === "approved" ? "#22C55E" : "#FBBF24" : "#DCFCE7", color: active ? "white" : "#166534", paddingHorizontal: 8, borderRadius: 12, fontSize: 11 }}>{status}</Body><Body style={{ fontSize: 12 }}>{item.appointmentMode === "video" ? "Video" : "In-person"}</Body></View></View><View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}><View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" }}><Body>{item.doctorName.split(" ").map(n => n[0]).join("")}</Body></View><View style={{ flex: 1 }}><Heading style={{ fontSize: 16 }}>{item.doctorName}</Heading><Body style={{ fontSize: 12 }}>{item.doctorSpecialty || item.departmentName || "Specialist"}</Body></View><View><Body style={{ fontSize: 12 }}>{new Date(item.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</Body><Body style={{ fontSize: 12 }}>{item.appointmentTime}</Body></View></View><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}><Button title={item.status === "cancelled" ? "Book Again" : active ? "Live Status" : "Rebook"} onPress={() => active ? void refresh() : navigate(item.doctorId ? { name: "booking", id: String(item.doctorId) } : { name: "care", kind: "doctors" })} style={{ flex: 1, borderRadius: 8, minHeight: 40 }} textStyle={{ fontSize: 12 }} />{item.status !== "cancelled" && <Button title={active ? "Cancel" : "Prescription"} onPress={() => active ? void cancel() : notice("Prescription download is not connected yet.")} style={{ flex: 1, borderRadius: 8, minHeight: 40 }} textStyle={{ fontSize: 12 }} />}</View></Card>;
}
function Section({ title, subtitle }: { title: string; subtitle: string }) { return <View style={{ gap: 8, marginBottom: 16 }}><Heading style={{ fontSize: 24, fontWeight: "700" }}>{title}</Heading><Body style={{ fontSize: 12, color: "#9CA3AF" }}>{subtitle}</Body></View>; }
export function Booking({ doctorId, back, complete }: { doctorId: string; back(): void; complete(): void }) {
  const { session } = useSession();
  const profile = useResource<Profile>(`/users/${session!.user.id}`);
  const doctor = useResource<{ data: CareItem }>(`/doctors/${doctorId}`);
  const [step, setStep] = useState(1), [practiceId, setPracticeId] = useState(""), [slotId, setSlotId] = useState("");
  const [slots, setSlots] = useState<{ id: string; startsAt: string; endsAt: string }[]>([]);
  const [date, setDate] = useState(""), [busy, setBusy] = useState(false), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const [name, setName] = useState(""), [phone, setPhone] = useState(""), [reason, setReason] = useState("");
  const [requestId] = useState(() => Crypto.randomUUID());
  const practices = doctor.data?.data.practices || [];
  const practice = practices.find(p => p.id === practiceId);
  const slot = slots.find(s => s.id === slotId);
  useEffect(() => { if (profile.data) { setName(profile.data.name); setPhone(profile.data.phoneNumber || ""); } }, [profile.data]);
  useEffect(() => {
    setSlotId(""); setSlots([]); setError(""); if (!practiceId) return;
    const controller = new AbortController(); setLoading(true);
    const until = new Date(Date.now() + 14 * 86400000).toISOString();
    api.request<{ data: typeof slots }>(`/doctors/${doctorId}/practices/${practiceId}/slots?startsUntil=${encodeURIComponent(until)}`, { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) { setSlots(result.data); setDate(result.data[0] ? localDate(result.data[0].startsAt) : ""); } })
      .catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [practiceId, doctorId]);
  useBack(step === 2, () => setStep(1));
  async function submit() {
    if (busy || !slot || !practice?.bookingEnabled) return;
    setBusy(true); setError("");
    try {
      await api.request("/appointments", { method: "POST", body: { requestId, doctorId: Number(doctorId), practiceId, scheduleSlotId: slot.id,
        fullName: name, phoneNumber: phone, appointmentType: "in-person", additionalComments: reason } });
      setStep(3);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not submit request"); }
    finally { setBusy(false); }
  }
  return <Screen title="Book Appointment" back={() => step === 2 ? setStep(1) : back()}>
    <ResourceState {...doctor} /><ResourceState {...profile} />
    <Card><Heading>{doctor.data?.data.name || "Doctor"}</Heading><Body>{doctor.data?.data.specialty}</Body></Card>
    {step === 1 && <>
      <Section title="Patient Details" subtitle="Contact information for your appointment" />
      <Field label="Full name" value={name} onChangeText={setName} /><Field label="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <Field label="Reason for visit" multiline value={reason} onChangeText={setReason} />
      <Section title="Practice Location" subtitle="Choose where you want to see this doctor" />
      {practices.map(p => <Pressable key={p.id} accessibilityRole="radio" accessibilityState={{ checked: practiceId === p.id, disabled: !p.bookingEnabled }} disabled={!p.bookingEnabled} onPress={() => setPracticeId(p.id)}><Card style={{ borderColor: practiceId === p.id ? "#7F1D1D" : "#E5E7EB", borderWidth: practiceId === p.id ? 2 : 1 }}><Heading>{p.name}</Heading><Body>{p.address}</Body>{!p.bookingEnabled && <Body>Online booking is unavailable.</Body>}</Card></Pressable>)}
      {!doctor.loading && !practices.length && <Empty title="Online booking is unavailable" detail="This directory provider has no connected booking practice. Contact the provider directly." />}
      <Button title="Choose Schedule" disabled={!practice?.bookingEnabled || !name.trim() || !/^\+?[\d -]{7,20}$/.test(phone)} onPress={() => setStep(2)} />
    </>}
    {step === 2 && <>
      <Section title="Select Date" subtitle="Published availability in India time" />
      <ScrollView horizontal contentContainerStyle={{ gap: 12 }}>{[...new Set(slots.map(s => localDate(s.startsAt)))].map(day => <Button key={day} title={day} secondary={date !== day} onPress={() => { setDate(day); setSlotId(""); }} />)}</ScrollView>
      <Section title="Available Slots" subtitle="In-person consultation" />
      {loading && <Body>Loading availability…</Body>}
      {!loading && !slots.length && !error && <Empty title="No available slots" detail="Choose another practice or check again later." />}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>{slots.filter(s => localDate(s.startsAt) === date).map(s => <Button key={s.id} title={localTime(s.startsAt)} secondary={slotId !== s.id} onPress={() => setSlotId(s.id)} />)}</View>
      <Card><Heading>{practice?.name}</Heading><Body>{practice?.address}</Body></Card>
      <Button title="Submit Appointment Request" busy={busy} disabled={!slot} onPress={() => void submit()} />
    </>}
    <ErrorText message={error} />
    {step === 3 && <Card><Heading>Request Submitted</Heading><Body>Your request is in the selected provider’s appointment queue. You can follow its status in My Health.</Body><Body>{practice?.name} · {slot && localTime(slot.startsAt)}</Body><Button title="View My Health" onPress={complete} /></Card>}
  </Screen>;
}
function localDate(value: string) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value)); }
function localTime(value: string) { return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(value)); }
