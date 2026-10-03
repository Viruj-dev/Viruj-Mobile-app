import { MedicalReportCard, type MedicalReport } from "./reports";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { previewEnabled } from "./preview";
import { SearchInput } from "./care";
import { IconAction } from "./web-controls";
import { useEffect, useRef, useState } from "react";
import { useDevicePreferences } from "./device-preferences";
import { Image, Modal, Pressable, ScrollView, Share, Text, TextInput, View } from "react-native";
import { api, type ChatSession, type Message } from "./api";
import { pickImage, VoiceInput } from "./media";
import { Body, Button, Card, colors, Empty, ErrorText, Field, Heading, ResourceState, Screen, Glyph, useResource, useBack } from "./ui";
type Booking = { token: string; doctorName: string; specialty: string; practiceName: string; startsAt: string; timezone: string };
type Reply = { response: string; sessionId: string; suggestedTitle?: string; report?: MedicalReport; booking?: Booking; historySaved?: boolean; availabilityError?: boolean; recommendations?: { id: number; name: string; specialty: string; distanceKm?: number }[] };
const confirmsBooking = (text: string) => /^(?:yes[, ]+)?(?:book (?:it|this|this slot|the appointment)|confirm (?:booking|the booking)|please book it|हाँ बुक कर दो|बुक कर दो)[.!?\s]*$/i.test(text.trim());
export function Chat({ back }: { back(): void }) {
  const { preferences } = useDevicePreferences();
  const [messages, setMessages] = useState<Message[]>([]), [text, setText] = useState("");
  const [sessionId, setSessionId] = useState<string>(), [report, setReport] = useState<MedicalReport>();
  const [booking, setBooking] = useState<Booking>(), [recommendations, setRecommendations] = useState<Reply["recommendations"]>([]);
  const [image, setImage] = useState<string>(), [history, setHistory] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [readAloud, setReadAloud] = useState(true);
  const locked = useRef(false), scroll = useRef<ScrollView>(null);
  useEffect(() => () => { void Speech.stop(); }, []);
  useBack(history, () => setHistory(false));
  function reset() { void Speech.stop(); setMessages([]); setSessionId(undefined); setText(""); setImage(undefined); setReport(undefined); setBooking(undefined); setRecommendations([]); setError(""); }
  async function attach() { try { const value = await pickImage(); if (value) setImage(value.base64); } catch(e) { setError(e instanceof Error ? e.message : "Could not select image."); } }
  async function send(override?: string, regenerate = false, voice = false) {
    const prompt = override ?? text.trim();
    if (locked.current || (!prompt && !image)) return;
    locked.current = true; setBusy(true); setError(""); void Speech.stop();
    const location = preferences.location;
    try {
      const result = await api.request<Reply>("/ai/chat", { method: "POST", body: { message: prompt, sessionId, image, regenerate, bookingToken: !regenerate && booking && confirmsBooking(prompt) ? booking.token : undefined, location: location ? { latitude: location.latitude, longitude: location.longitude, radiusKm: location.radiusKm } : undefined } });
      const lastUser = messages.map(m => m.sender).lastIndexOf("user");
      const base = regenerate && lastUser >= 0 ? messages.slice(0, lastUser) : messages;
      setMessages([...base, { sender: "user", text: prompt || "Attached a photo", image }, { sender: "ai", text: result.response }]);
      setSessionId(result.sessionId); setText(""); setImage(undefined); setReport(result.report); setBooking(result.booking); setRecommendations(result.recommendations || []);
      if (result.historySaved === false) setError("Appointment submitted. Conversation history could not be updated; check Appointments for its status.");
      if (result.availabilityError) setError("Reply received. Some clinic slots could not be checked; try asking again.");
      if (voice && readAloud) {
        const slot = result.booking;
        const spoken = result.response + (slot ? ` Next available slot with ${slot.doctorName}: ${new Date(slot.startsAt).toLocaleString("en-IN", { timeZone: slot.timezone })}. Say book it to request this slot.` : "");
        Speech.speak(spoken, { onError: () => setError("Reply received. Could not read it aloud.") });
      }
    } catch(e) { setError(e instanceof Error ? e.message : "Could not send. Please retry."); if (voice) setText(prompt); }
    finally { locked.current = false; setBusy(false); }
  }
  return <Screen title="Talk to Viruj" back={back} scroll={false} right={<View style={{ flexDirection: "row" }}><IconAction label="New conversation" icon="add" color="white" onPress={() => { if (!busy) reset(); }} /><IconAction label="Conversation history" icon="time-outline" color="white" onPress={() => { if (!busy) setHistory(true); }} /></View>}>
    <View style={{ flex: 1, backgroundColor: "#FAF8F6" }}>
      <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 18 }}>
        {!messages.length && <View style={{ paddingVertical: 24, gap: 16 }}><Heading style={{ fontSize: 30 }}>Tell me what’s bothering you</Heading><Body>Talk in your own words. I can help you understand symptoms, find nearby care, and request an appointment.</Body><Body style={{ fontSize: 12 }}>I’m an AI health assistant. For urgent symptoms, seek emergency care.</Body>{["I have had a fever for two days. Find a doctor near me.", "Help me understand my medical report", "How can I manage my health condition?"].map(prompt => <Button key={prompt} title={prompt} secondary disabled={busy} onPress={() => void send(prompt)} />)}</View>}
        {messages.map((message, index) => <View key={index} style={{ alignItems: message.sender === "user" ? "flex-end" : "flex-start", gap: 6 }}><View style={{ maxWidth: "94%", borderRadius: 18, padding: 16, backgroundColor: message.sender === "user" ? "#FCECEA" : "white", gap: 10 }}>{message.image && <Image source={{ uri: `data:image/jpeg;base64,${message.image}` }} style={{ width: 200, height: 160, borderRadius: 12 }} />}<Text selectable style={{ color: "#292524", fontSize: 17, lineHeight: 26 }}>{message.text}</Text></View>{message.sender === "ai" && <View style={{ flexDirection: "row" }}><IconAction label="Listen to reply" icon="volume-high-outline" onPress={() => { void Speech.stop(); Speech.speak(message.text); }} /><IconAction label="Copy reply" icon="copy-outline" onPress={() => { void Clipboard.setStringAsync(message.text).catch(() => setError("Could not copy.")); }} />{index === messages.length - 1 && <IconAction label="Try another response" icon="refresh" onPress={() => { const prompt = [...messages].reverse().find(m => m.sender === "user")?.text; if (prompt && !busy) void send(prompt, true); }} />}</View>}</View>)}
        {!booking && recommendations?.map(doctor => <Card key={doctor.id}><Heading>{doctor.name}</Heading><Body>{doctor.specialty}{doctor.distanceKm !== undefined ? ` · ${doctor.distanceKm} km away` : ""}</Body><Body>No available booking slot found in the next seven days. Browse Care for other times.</Body></Card>)}
        {booking && <Card><Body>Next available appointment</Body><Heading>{booking.doctorName}</Heading><Body>{booking.specialty} · {booking.practiceName}</Body><Heading style={{ fontSize: 18 }}>{new Date(booking.startsAt).toLocaleString("en-IN", { timeZone: booking.timezone })}</Heading><Body>Say “book it” or tap below. The clinic may need to approve your request.</Body><Button title="Book this slot" disabled={busy} onPress={() => void send("Book this slot")} /></Card>}
        {report && <MedicalReportCard report={report} />}
        {busy && <Body>Viruj is listening to your concern…</Body>}<ErrorText message={error} />
      </ScrollView>
      <View style={{ padding: 16, gap: 10, borderTopWidth: 1, borderColor: "#EEE1DE", backgroundColor: "white" }}>
        {image && <View style={{ flexDirection: "row", alignItems: "center" }}><Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={{ width: 56, height: 56, borderRadius: 12 }} /><IconAction label="Remove image" icon="close" onPress={() => setImage(undefined)} /></View>}
        <VoiceInput disabled={busy} onText={value => { void send(value, false, true); }} onRecording={() => { void Speech.stop(); }} />
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: readAloud }} onPress={() => { setReadAloud(!readAloud); void Speech.stop(); }}><Body style={{ fontSize: 12, textAlign: "center" }}>Read voice replies aloud: {readAloud ? "On" : "Off"}</Body></Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><IconAction label="Attach a photo" icon="image-outline" onPress={() => { if (!busy) void attach(); }} /><TextInput accessibilityLabel="Tell Viruj how you feel" placeholder="Or type here…" value={text} onChangeText={setText} editable={!busy} onSubmitEditing={() => void send()} style={{ flex: 1, minHeight: 48, fontSize: 16 }} /><Button title="Send" disabled={busy || (!text.trim() && !image)} onPress={() => void send()} /></View>
      </View>
    </View>
    <Modal visible={history} animationType="slide" onRequestClose={() => setHistory(false)}><History back={() => setHistory(false)} newChat={() => { reset(); setHistory(false); }} select={item => { reset(); setMessages(item.messages); setSessionId(item.id); setHistory(false); }} /></Modal>
  </Screen>;
}

function History({ back, select, newChat }: { back(): void; select(item: ChatSession): void; newChat(): void }) {
 const history = useResource<{ sessions: ChatSession[] }>("/ai/sessions"); const [query, setQuery] = useState(""); const [error, setError] = useState(""); const [confirm, setConfirm] = useState<string>(); const [busy, setBusy] = useState(false);
 async function remove() { if (!confirm || busy) return; setBusy(true); try { const ids = confirm === "all" ? (history.data?.sessions || []).map(s => s.id) : [confirm]; for (const id of ids) await api.request(`/ai/sessions?sessionId=${encodeURIComponent(id)}`, { method: "DELETE" }); history.reload(); setConfirm(undefined); } catch(e) { setError(e instanceof Error ? e.message : "Could not delete."); } finally { setBusy(false); } }
 const sessions = history.data?.sessions || []; async function exportHistory(json: boolean) { const content = json ? JSON.stringify(sessions, null, 2) : sessions.map(s => `${s.title}\n\n${s.messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n\n")}`).join("\n\n"); try { await Share.share({ message: content || "No chat history yet" }); } catch { setError("Could not export history."); } }
 return <View style={{ flex: 1 }}><View style={{ padding: 24, gap: 16, borderBottomWidth: 1, borderBottomColor: "#F4F4F5" }}><View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Heading style={{ fontSize: 20 }}>Chat History</Heading><IconAction label="Close Chat History" icon="close" onPress={back} /></View><Button title="New Chat" icon="add" onPress={newChat} style={{ backgroundColor: "#DC2626" }} /><SearchInput value={query} onChange={setQuery} placeholder="Search conversations..." /></View><ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}><ResourceState {...history} /><ErrorText message={error} />{!sessions.length && <Empty icon="chatbox-outline" title="No chat history yet" detail="Start a conversation to see it here" />}{sessions.filter(s => `${s.title} ${s.preview}`.toLowerCase().includes(query.toLowerCase())).map(item => <View key={item.id} style={{ flexDirection: "row", borderWidth: 1, borderColor: "#F4F4F5", borderRadius: 16, padding: 16 }}><Pressable accessibilityRole="button" onPress={() => select(item)} style={{ flex: 1, gap: 4 }}><Heading style={{ fontSize: 14 }}>{item.title}</Heading><Body style={{ fontSize: 12 }}>{item.preview}</Body></Pressable><IconAction label={`Delete ${item.title}`} icon="trash-outline" onPress={() => setConfirm(item.id)} /></View>)}</ScrollView><View style={{ padding: 16, gap: 12, backgroundColor: "#FAFAFA" }}><Heading style={{ fontSize: 14 }}>Settings & Export</Heading><Button title="Export as JSON" secondary onPress={() => void exportHistory(true)} /><Button title="Export as Text" secondary onPress={() => void exportHistory(false)} /><Button title="Delete All Data" secondary onPress={() => setConfirm("all")} /><Body style={{ fontSize: 12, textAlign: "center" }}>{sessions.length} conversations saved</Body></View><Modal visible={Boolean(confirm)} transparent onRequestClose={() => setConfirm(undefined)}><View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#00000080" }}><Card style={{ borderRadius: 24, padding: 24 }}><Heading>{confirm === "all" ? "Delete All Data?" : "Delete Chat?"}</Heading><Body>This will permanently delete {confirm === "all" ? "all conversations" : "this conversation"}. This action cannot be undone.</Body><Button title="Cancel" secondary onPress={() => setConfirm(undefined)} /><Button title="Delete" busy={busy} onPress={() => void remove()} /></Card></View></Modal></View>;
}
