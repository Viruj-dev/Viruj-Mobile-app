// Native layout from my-health/page.tsx and booking-page/page.tsx.
import { useEffect, useRef, useState } from "react";
import { AppState, Image, Pressable, View } from "react-native";
import { api, ApiError, type Appointment } from "./api";
import { type Navigate } from "./home";
import { pickImage } from "./media";
import { appointmentDay, upcomingAppointment } from "./booking-validation";
export { Booking } from "./booking";
import { Body, Button, Card, Empty, ErrorText, Glyph, Heading, ResourceState, Screen, useResource } from "./ui";
export function Health({ navigate }: { navigate: Navigate }) {
  const result = useResource<{ appointments: Appointment[] }>("/appointments"); const [notice, setNotice] = useState(""); const [record, setRecord] = useState<string>();
  useAppointmentRefresh(result.reload);
  const active = (result.data?.appointments || []).filter(upcomingAppointment); const past = (result.data?.appointments || []).filter(a => !upcomingAppointment(a));
  async function upload() { try { const image = await pickImage(); if (image) { setRecord(image.dataUrl); setNotice("Record selected. Upload storage is not connected yet."); } } catch (e) { setNotice(e instanceof Error ? e.message : "Could not select record."); } }
  return <Screen title="My Health" back={() => navigate({ name: "home" })} floating={<Pressable accessibilityRole="button" accessibilityLabel="Upload medical record" onPress={() => void upload()} style={{ position: "absolute", bottom: 96, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: "#7F1D1D", alignItems: "center", justifyContent: "center" }}><Glyph name="cloud-upload-outline" color="white" size={22} /></Pressable>}><View style={{ flexDirection: "row", gap: 12 }}>{([['Health Profile', 'Keep age, vitals, and medical history current.', 'shield-outline'], ['Quick Rebook', 'Jump back into care with one tap from history.', 'arrow-up-outline']] as const).map(([title, text, icon]) => <Pressable accessibilityRole="button" key={title} onPress={() => setNotice(title === "Health Profile" ? "Update your health profile from the profile screen." : "Use your past records to quickly rebook the right doctor.")} style={{ flex: 1, padding: 16, borderRadius: 26, borderWidth: 1, borderColor: "#FEE2E2", backgroundColor: "white", gap: 8 }}><Glyph name={icon} color="#B91C1C" size={20} /><Heading style={{ fontSize: 14, fontWeight: "700", marginTop: 8 }}>{title}</Heading><Body style={{ fontSize: 12, lineHeight: 19 }}>{text}</Body></Pressable>)}</View><ResourceState {...result} />{[["Current Appointments", "Live requests and upcoming consultations.", active], ["Past Appointments", "Your consultation history and rebooking shortcuts.", past]].map(([title, detail, list], index) => <View key={String(title)} style={{ gap: 12 }}><View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}><View style={{ flex: 1 }}><Heading style={{ fontWeight: "700" }}>{String(title)}</Heading><Body>{String(detail)}</Body></View><Body style={{ fontSize: 12 }}>{(list as Appointment[]).length} {index ? "records" : "active"}</Body></View>{(list as Appointment[]).map(item => <AppointmentCard key={item.id} item={item} active={index === 0} navigate={navigate} />)}{!result.loading && !result.error && !(list as Appointment[]).length && <Card style={{ padding: 32, borderStyle: "dashed", borderColor: "#FECACA", alignItems: "center" }}><Glyph name={index ? "receipt-outline" : "calendar-outline"} size={30} /><Heading style={{ fontSize: 16, textAlign: "center" }}>{index ? "No appointment history yet" : "No active appointments right now"}</Heading><Body style={{ textAlign: "center" }}>{index ? "Past appointments, including rejected and cancelled requests, appear here." : "Book a consultation and it will appear here as soon as the request is created."}</Body>{index === 0 && <Button title="Book an Appointment" onPress={() => navigate({ name: "care", kind: "doctors" })} />}</Card>}</View>)}{!!notice && <Card><Body>{notice}</Body><Button title="Dismiss" secondary onPress={() => { setNotice(""); setRecord(undefined); }} />{record && <Image source={{ uri: record }} style={{ height: 180 }} resizeMode="contain" />}</Card>}</Screen>;
}
export function useAppointmentRefresh(reload: () => void) {
  const refresh = useRef(reload); refresh.current = reload;
  useEffect(() => {
    const timer = setInterval(() => { if (AppState.currentState === "active") refresh.current(); }, 15000);
    const listener = AppState.addEventListener("change", state => { if (state === "active") refresh.current(); });
    return () => { clearInterval(timer); listener.remove(); };
  }, []);
}
const statusNames: Record<string, string> = { pending_approval: "Pending approval", approved: "Approved", rejected: "Rejected", completed: "Completed", cancelled: "Cancelled", rescheduled: "Rescheduled", no_show: "No show" };
function appointmentStatus(item: Appointment) { return item.status === "completed" && item.arrivalVerifiedAt ? "Attendance verified" : statusNames[item.status] || item.status.replaceAll("_", " "); }
function AppointmentCard({ item, active, navigate }: { item: Appointment; active: boolean; navigate: Navigate }) {
  return <Card style={{ borderColor: active ? "#7F1D1D" : "#E5E7EB", borderWidth: active ? 2 : 1 }}>
    <View style={{ flexDirection: "row", gap: 10 }}><Glyph name="business-outline" /><View style={{ flex: 1 }}><Heading>{item.hospitalName || "Viruj Health Partner"}</Heading><Body>{item.hospitalAddress}</Body></View></View>
    <Body style={{ color: ["rejected", "cancelled", "no_show"].includes(item.status) ? "#B91C1C" : "#7F1D1D", fontWeight: "700" }}>{appointmentStatus(item)}</Body>
    <Heading style={{ fontSize: 16 }}>{item.doctorName}</Heading><Body>{item.doctorSpecialty || item.departmentName}</Body>
    <Body>{appointmentDay(item)} · {item.appointmentTime} · {item.timezone || "Asia/Kolkata"}</Body>
    <Body>{item.appointmentMode === "video" ? "Video consultation" : "In-person appointment"}{item.patientName ? ` · ${item.patientName}` : ""}</Body>
    {item.status === "pending_approval" && <Body>Requested time; awaiting provider confirmation.</Body>}
    {!!item.rejectionReason && <Body>Rejection reason: {item.rejectionReason}</Body>}
    {!!item.cancellationReason && <Body>Cancellation reason: {item.cancellationReason}</Body>}
    <Button title="Appointment Details" onPress={() => navigate({ name: "appointment", id: item.id })} />
    {!active && item.doctorId && item.practiceId && <Button title="Book Again at This Provider" secondary onPress={() => navigate({ name: "booking", id: String(item.doctorId), practiceId: item.practiceId })} />}
  </Card>;
}
export function AppointmentDetails({ id, back }: { id: string; back(): void }) {
  const result = useResource<{ appointment: Appointment }>(`/appointments/${encodeURIComponent(id)}`);
  const [otp, setOtp] = useState<{ otp: string; expiresAt: string } | null>(null), [codeNotice, setCodeNotice] = useState("");
  const [error, setError] = useState(""), [busy, setBusy] = useState(false), [now, setNow] = useState(Date.now()), [confirmCancel, setConfirmCancel] = useState(false);
  const cancelling = useRef(false), codeRequest = useRef(0);
  const item = result.data?.appointment;
  useAppointmentRefresh(result.reload);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    const listener = AppState.addEventListener("change", state => { if (state !== "active") { codeRequest.current++; setOtp(null); } });
    return () => { codeRequest.current++; clearInterval(timer); listener.remove(); };
  }, []);
  useEffect(() => {
    const request = ++codeRequest.current;
    setOtp(null); setCodeNotice("");
    if (item?.source !== "erp" || item.status !== "approved" || result.error || AppState.currentState !== "active") return;
    const controller = new AbortController();
    api.request<{ otp: string; expiresAt: string }>(`/appointments/${encodeURIComponent(id)}/arrival-otp`, { signal: controller.signal })
      .then(value => { if (!controller.signal.aborted && request === codeRequest.current) { setOtp(value); setNow(Date.now()); } })
      .catch(e => { if (!controller.signal.aborted && request === codeRequest.current) setCodeNotice(e instanceof ApiError && e.status === 404 ? "Reception has not requested an arrival code yet." : e instanceof ApiError && e.status === 409 ? "Your arrival code expired. Ask reception for a new code." : e instanceof Error ? e.message : "Could not retrieve your arrival code."); });
    return () => controller.abort();
  }, [result.data, result.error, id]);
  async function cancel() {
    if (cancelling.current || !item || item.source !== "erp") return;
    cancelling.current = true; setBusy(true); setError("");
    try { await api.request(`/appointments/${encodeURIComponent(id)}/cancel`, { method: "POST", body: { expectedVersion: item.version } }); setConfirmCancel(false); result.reload(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not cancel appointment."); result.reload(); }
    finally { cancelling.current = false; setBusy(false); }
  }
  const remaining = otp ? Math.max(0, Math.ceil((new Date(otp.expiresAt).getTime() - now) / 1000)) : 0;
  return <Screen title="Appointment Details" back={back}>
    <ResourceState {...result} /><Button title="Refresh Status" secondary onPress={result.reload} />
    {item && <>
      <Card><Body style={{ color: "#7F1D1D", fontWeight: "700" }}>{appointmentStatus(item)}</Body><Heading>{item.hospitalName}</Heading><Body>{item.hospitalAddress}</Body><Heading style={{ fontSize: 16 }}>{item.doctorName}</Heading><Body>{item.doctorSpecialty || item.departmentName}</Body><Body>Patient: {item.patientName || "Your profile"}</Body><Body>{appointmentDay(item)} · {item.appointmentTime} · {item.timezone || "Asia/Kolkata"}</Body><Body>{item.appointmentMode === "video" ? "Video consultation" : "In-person appointment"}</Body>{!!item.reason && <Body>Reason for visit: {item.reason}</Body>}{!!item.rejectionReason && <Body>Rejection reason: {item.rejectionReason}</Body>}{!!item.cancellationReason && <Body>Cancellation reason: {item.cancellationReason}</Body>}</Card>
      {item.bookingDetails && <Card><Heading>Patient Assessment</Heading><Body>{item.bookingDetails.age ?? "Not supplied"} years · {item.bookingDetails.gender || "Not supplied"}</Body><Body>Height: {item.bookingDetails.height ?? "Not supplied"} cm · Weight: {item.bookingDetails.weight ?? "Not supplied"} kg</Body>{!!item.bookingDetails.complaintPhoto && <Image source={{ uri: item.bookingDetails.complaintPhoto }} accessibilityLabel="Appointment symptom photo" style={{ height: 200 }} resizeMode="contain" />}</Card>}
      {item.status === "pending_approval" && <Card><Heading>Awaiting Provider Approval</Heading><Body>The provider will review your requested time. A notification appears when your appointment is approved or rejected.</Body></Card>}
      {item.status === "rescheduled" && <Card><Heading>Rescheduled</Heading><Body>Your provider changed the appointment time. Review the new details and wait for their confirmation.</Body></Card>}
      {item.source === "erp" && item.status === "approved" && <Card style={{ borderColor: "#7F1D1D", backgroundColor: "#FFF1F2" }}><Heading>Verify Your Arrival</Heading><Body>After you arrive, reception requests a four-digit code. Tell that code to reception for this appointment.</Body>{otp && remaining > 0 && !result.error ? <><Body style={{ fontSize: 36, lineHeight: 48, letterSpacing: 10, color: "#7F1D1D", textAlign: "center" }}>{otp.otp}</Body><Body>Expires in {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</Body></> : <Body>{otp ? "This code expired. Ask reception for a new code." : codeNotice || "Checking for your arrival code…"}</Body>}<Button title="Refresh Arrival Code" secondary onPress={result.reload} /></Card>}
      {item.status === "completed" && <Card><Heading>{appointmentStatus(item)}</Heading><Body>{item.arrivalVerifiedAt ? "Your arrival was verified. This confirms attendance, not that medical treatment has finished." : "This appointment is recorded as completed by your provider."}</Body>{(item.arrivalVerifiedAt || item.completedAt) && <Body>{new Date(item.arrivalVerifiedAt || item.completedAt!).toLocaleString("en-IN", { timeZone: item.timezone || "Asia/Kolkata" })}</Body>}</Card>}
      {item.source === "erp" && ["pending_approval", "approved", "rescheduled"].includes(item.status) && (confirmCancel ? <Card><Heading>Cancel this appointment?</Heading><Button title="Confirm Cancellation" busy={busy} onPress={() => void cancel()} /><Button title="Keep Appointment" secondary disabled={busy} onPress={() => setConfirmCancel(false)} /></Card> : <Button title="Cancel Appointment" secondary onPress={() => setConfirmCancel(true)} />)}
      {item.source !== "erp" && <Body>This historical booking is retained from the previous system. Contact your provider for changes.</Body>}
    </>}
    <ErrorText message={error} />
  </Screen>;
}
