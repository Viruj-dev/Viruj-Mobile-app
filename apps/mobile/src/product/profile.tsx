import { useEffect, useState } from "react";
import { Alert, Image, Linking, View } from "react-native";
import { api, type Profile as ProfileData, webOrigin } from "./api";
import { useSession } from "./session";
import { type Navigate } from "./home";
import { Body, Button, Card, ErrorText, Field, Heading, ResourceState, Row, Screen, useResource } from "./ui";
export function Profile({ navigate }: { navigate: Navigate }) {
  const { session, logout } = useSession(); const [error, setError] = useState("");
  const profile = useResource<ProfileData>(`/users/${session!.user.id}`);
  return <Screen title="Profile"><ResourceState {...profile} /><Card>{profile.data?.image && <Image source={{ uri: profile.data.image }} style={{ width: 72, height: 72, borderRadius: 36 }} />}<Heading>{profile.data?.name || session!.user.name}</Heading><Body>{session!.user.email}</Body></Card><Card><Row title="Edit profile" icon="person-outline" onPress={() => navigate({ name: "edit-profile" })} /><Row title="Notifications" icon="notifications-outline" onPress={() => navigate({ name: "notifications" })} /><Row title="Feedback" icon="chatbox-outline" onPress={() => navigate({ name: "feedback" })} /><Row title="Privacy policy" icon="shield-checkmark-outline" onPress={() => void Linking.openURL(`${webOrigin}/privacy-policy`).catch(() => setError("Could not open the privacy policy."))} /></Card><ErrorText message={error} /><Button title="Sign out" secondary onPress={() => Alert.alert("Sign out?", "", [{ text: "Cancel", style: "cancel" }, { text: "Sign out", onPress: () => void logout().catch(() => {}) }])} /></Screen>;
}
export function EditProfile({ back }: { back(): void }) {
  const { session } = useSession(); const profile = useResource<ProfileData>(`/users/${session!.user.id}`);
  const [form, setForm] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [saved, setSaved] = useState(false);
  useEffect(() => { if (profile.data) setForm(Object.fromEntries(Object.entries(profile.data).filter(([, value]) => typeof value === "string" || typeof value === "number").map(([key, value]) => [key, String(value)]))); }, [profile.data]);
  async function save() {
    if (busy) return; if (!form.name?.trim()) { setError("Enter your name."); return; }
    const age = form.age ? Number(form.age) : null;
    if (age !== null && (!Number.isInteger(age) || age < 0 || age > 130)) { setError("Enter a valid age."); return; }
    setBusy(true); setError(""); setSaved(false);
    try { await api.request(`/users/${session!.user.id}`, { method: "PATCH", body: { ...Object.fromEntries(["name", "phoneNumber", "address", "bloodGroup", "height", "weight", "medicalHistory", "gender"].map(key => [key, form[key]?.trim() || null])), age, onboardingCompleted: true } }); setSaved(true); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not save."); } finally { setBusy(false); }
  }
  return <Screen title="Edit profile" back={back}><ResourceState {...profile} />{profile.data && <>{[["name", "Full name"], ["phoneNumber", "Phone"], ["age", "Age"], ["gender", "Gender · male, female, other"], ["bloodGroup", "Blood group"], ["height", "Height"], ["weight", "Weight"], ["address", "Address"], ["medicalHistory", "Medical history"]].map(([key, label]) => <Field key={key} label={label!} value={form[key!] || ""} onChangeText={value => { setSaved(false); setForm(f => ({ ...f, [key!]: value })); }} keyboardType={key === "age" ? "number-pad" : key === "phoneNumber" ? "phone-pad" : "default"} multiline={key === "medicalHistory"} autoCapitalize={key === "gender" ? "none" : "sentences"} />)}<ErrorText message={error} />{saved && <Body>Profile saved.</Body>}<Button title="Save changes" busy={busy} onPress={() => void save()} /></>}</Screen>;
}
export function Feedback({ back }: { back(): void }) {
  const [rating, setRating] = useState(5); const [text, setText] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [sent, setSent] = useState(false);
  async function submit() { if (busy) return; setBusy(true); setError(""); try { await api.request("/feedback", { method: "POST", body: { rating, feedback: text, category: "mobile" } }); setSent(true); } catch (e) { setError(e instanceof Error ? e.message : "Could not send."); } finally { setBusy(false); } }
  return <Screen title="Feedback" back={back}>{sent ? <Heading>Thank you for your feedback.</Heading> : <><Heading>How was your experience?</Heading><View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>{[1, 2, 3, 4, 5].map(n => <Button key={n} title={String(n)} secondary={rating !== n} onPress={() => setRating(n)} />)}</View><Field label="Your feedback" value={text} onChangeText={setText} multiline maxLength={3000} /><ErrorText message={error} /><Button title="Send feedback" onPress={() => void submit()} busy={busy} /></>}</Screen>;
}
