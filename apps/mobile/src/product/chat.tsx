import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { api, type ChatSession, type Message } from "./api";
import { pickImage, VoiceInput } from "./media";
import { Body, Button, Card, colors, Empty, ErrorText, Field, Heading, ResourceState, Screen, useResource, useBack } from "./ui";
export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]); const [text, setText] = useState(""); const [sessionId, setSessionId] = useState<string>(); const [title, setTitle] = useState("New conversation");
  const [history, setHistory] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [saveError, setSaveError] = useState("");
  const [image, setImage] = useState<string>();
  async function attach() { try { const selected = await pickImage(); if (selected) setImage(selected.base64); } catch (e) { setError(e instanceof Error ? e.message : "Could not select image."); } }
  async function send() {
    if (busy || !text.trim()) return;
    setBusy(true); setError(""); setSaveError("");
    const prompt = text.trim();
    try {
      const result = await api.request<{ response: string; sessionId: string; suggestedTitle?: string }>("/ai/chat", { method: "POST", body: { message: prompt, history: messages.slice(-20), sessionId, image } });
      const updated: Message[] = [...messages, { sender: "user", text: prompt }, { sender: "ai", text: result.response }];
      setMessages(updated); setText(""); setImage(undefined); setSessionId(result.sessionId); const nextTitle = result.suggestedTitle || title; setTitle(nextTitle);
      try { await api.request("/ai/sessions", { method: "POST", body: { sessionId: result.sessionId, title: nextTitle, preview: result.response.slice(0, 100), messages: updated } }); } catch { setSaveError("Reply received. Could not save conversation history."); }
    } catch (e) { setError(e instanceof Error ? e.message : "Could not send."); } finally { setBusy(false); }
  }
  useBack(history, () => setHistory(false));
  if (history) return <History back={() => setHistory(false)} select={item => { setMessages(item.messages); setSessionId(item.id); setTitle(item.title); setHistory(false); }} />;
  return <Screen title="Ask Viruj" subtitle="AI ASSISTANT"><View style={{ flexDirection: "row", gap: 10 }}><Button title="History" secondary disabled={busy} onPress={() => setHistory(true)} /><Button title="New chat" secondary disabled={busy} onPress={() => { setMessages([]); setSessionId(undefined); setTitle("New conversation"); setError(""); }} /></View><Body>AI guidance can be inaccurate. It does not replace a clinician.</Body>{messages.length === 0 && <Empty icon="sparkles-outline" title="What’s on your mind?" detail="Ask a health question." />}{messages.map((message, index) => <View key={index} style={{ backgroundColor: message.sender === "user" ? colors.deep : "white", padding: 18, borderRadius: 20, alignSelf: message.sender === "user" ? "flex-end" : "stretch", maxWidth: "100%", gap: 8 }}><Text style={{ color: message.sender === "user" ? "#FEE2E2" : colors.deep, fontWeight: "700", fontSize: 12 }}>{message.sender === "user" ? "YOU" : "VIRUJ AI"}</Text><Text selectable style={{ color: message.sender === "user" ? "white" : colors.ink, fontSize: 16, lineHeight: 25 }}>{message.text}</Text></View>)}<ErrorText message={error || saveError} /><Button title={image ? "Replace image" : "Attach image"} secondary disabled={busy} onPress={() => void attach()} />{image && <Button title="Remove image" secondary onPress={() => setImage(undefined)} />}<VoiceInput disabled={busy} onText={setText} /><Field label="Message" placeholder="Ask a question" value={text} onChangeText={setText} multiline maxLength={5000} /><Button title="Send" icon="arrow-up" busy={busy} disabled={!text.trim()} onPress={() => void send()} /></Screen>;
}
function History({ back, select }: { back(): void; select(item: ChatSession): void }) {
  const history = useResource<{ sessions: ChatSession[] }>("/ai/sessions"); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function remove(id: string) { if (busy) return; setBusy(true); try { await api.request(`/ai/sessions?sessionId=${encodeURIComponent(id)}`, { method: "DELETE" }); history.reload(); } catch (e) { setError(e instanceof Error ? e.message : "Could not delete."); } finally { setBusy(false); } }
  return <Screen title="Conversations" back={back}><ResourceState {...history} /><ErrorText message={error} />{history.data?.sessions.length === 0 && <Empty title="No conversations yet" />}{history.data?.sessions.map(item => <Card key={item.id}><Heading>{item.title}</Heading><Body>{item.preview}</Body><Button title="Open conversation" secondary onPress={() => select(item)} /><Button title="Delete conversation" secondary disabled={busy} onPress={() => Alert.alert("Delete conversation?", "This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => void remove(item.id) }])} /></Card>)}</Screen>;
}
