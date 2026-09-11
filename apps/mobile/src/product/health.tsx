import { useState } from "react";
import { Text, View } from "react-native";
import { api, type Appointment, type Profile } from "./api";
import { useSession } from "./session";
import { Body, Button, Card, colors, Empty, ErrorText, Field, Heading, ResourceState, Screen, useResource } from "./ui";
export function Health() {
  const result = useResource<{ appointments: Appointment[] }>("/appointments");
  return <Screen title="My health" subtitle="YOUR CARE"><Heading>Appointments</Heading><ResourceState {...result} />{result.data?.appointments.length === 0 && <Empty title="No appointments yet" detail="Your appointment requests will appear here." />}{result.data?.appointments.map(item => <Card key={item.id}><View style={{ alignSelf: "flex-start", backgroundColor: colors.mint, borderRadius: 8, padding: 8 }}><Text style={{ color: colors.deep, fontWeight: "600", textTransform: "capitalize", fontSize: 12 }}>{item.status.replaceAll("_", " ")}</Text></View><Heading>{item.doctorName}</Heading><Body>{item.hospitalName}</Body><Body>{new Date(item.appointmentDate).toLocaleDateString()} · {item.appointmentTime}</Body><Body>{item.appointmentMode === "video" ? "Video consultation" : "In person"}</Body>{item.reason && <Body>{item.reason}</Body>}</Card>)}</Screen>;
}
export function Booking({ doctorId, back, complete }: { doctorId: string; back(): void; complete(): void }) {
  const { session } = useSession();
  const profile = useResource<Profile>(`/users/${session!.user.id}`);
  const [date, setDate] = useState(""); const [time, setTime] = useState(""); const [reason, setReason] = useState(""); const [mode, setMode] = useState("in-person");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState(false);
  async function submit() {
    if (busy || success) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || Date.parse(`${date}T23:59:59`) < Date.now()) { setError("Enter a future date as YYYY-MM-DD."); return; }
    if (!/^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/i.test(time.trim())) { setError("Enter a time such as 10:30 AM."); return; }
    setBusy(true); setError("");
    try { await api.request("/appointments", { method: "POST", body: { doctorId: Number(doctorId), selectedDate: date, selectedTimeSlot: time.trim().toUpperCase(), appointmentType: mode, fullName: profile.data?.name, additionalComments: reason.trim() } }); setSuccess(true); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not request appointment."); } finally { setBusy(false); }
  }
  return <Screen title={success ? "Request received" : "Request appointment"} back={back}>{success ? <><Empty icon="checkmark-circle-outline" title="Awaiting approval" detail="You’ll see updates in My health." /><Button title="View appointments" onPress={complete} /></> : <><ResourceState {...profile} /><Body>This is a preferred time. Your provider will confirm availability.</Body><Field label="Date · YYYY-MM-DD" value={date} onChangeText={setDate} placeholder="2026-09-20" keyboardType="numbers-and-punctuation" /><Field label="Preferred time" value={time} onChangeText={setTime} placeholder="10:30 AM" autoCapitalize="characters" /><View style={{ flexDirection: "row", gap: 10 }}><Button title="In person" secondary={mode !== "in-person"} onPress={() => setMode("in-person")} /><Button title="Video" secondary={mode !== "video"} onPress={() => setMode("video")} /></View><Field label="Reason (optional)" value={reason} onChangeText={setReason} multiline maxLength={2000} /><ErrorText message={error} /><Button title="Send request" busy={busy} disabled={!profile.data} onPress={() => void submit()} /></>}</Screen>;
}
