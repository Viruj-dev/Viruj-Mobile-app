import { useState } from "react";
import { Image, Text, View } from "react-native";
import { api } from "./api";
import { useSession } from "./session";
import { Body, Button, ErrorText, Field, Screen, colors, s } from "./ui";

export function AuthScreen() {
  const { signIn } = useSession();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [sent, setSent] = useState(false);
  async function submit() {
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email."); return; }
    if (mode !== "reset" && password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    if (mode === "signup" && !name.trim()) { setError("Enter your name."); return; }
    setBusy(true); setError("");
    try {
      if (mode === "reset") { await api.request("/auth/forgot-password", { method: "POST", public: true, body: { email: email.trim() } }); setSent(true); }
      else await signIn(email, password, mode === "signup" ? name : undefined);
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); } finally { setBusy(false); }
  }
  const changeMode = (value: typeof mode) => { setMode(value); setError(""); setSent(false); setPassword(""); };
  return <Screen title="" back={mode !== "login" ? () => changeMode("login") : undefined}>
    <View style={{ flex: 1, justifyContent: "center", gap: 26, paddingBottom: 35 }}>
      <Image source={require("../../assets/auth/virujlogo.png")} accessibilityLabel="Viruj Health" style={{ width: 68, height: 68, resizeMode: "contain" }} />
      <View style={{ gap: 10 }}><Text style={s.eyebrow}>VIRUJ HEALTH</Text><Text style={{ fontSize: 42, fontWeight: "700", color: colors.ink, letterSpacing: -1.8 }}>{mode === "signup" ? "Your care.\nOne account." : mode === "reset" ? "Reset your\npassword." : "Welcome\nback."}</Text><Body>{mode === "reset" ? "We’ll email you a reset link." : "Use your Viruj Health account."}</Body></View>
      {sent ? <Body>Check your email for the reset link.</Body> : <View style={{ gap: 16 }}>{mode === "signup" && <Field label="Full name" value={name} onChangeText={setName} autoComplete="name" />}<Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />{mode !== "reset" && <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoComplete={mode === "signup" ? "new-password" : "current-password"} />}<ErrorText message={error} /><Button title={mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"} busy={busy} onPress={() => void submit()} /></View>}
      {mode === "login" && <><Button title="Forgot password?" secondary onPress={() => changeMode("reset")} /><Button title="Create an account" secondary onPress={() => changeMode("signup")} /></>}
    </View>
  </Screen>;
}
