import { useState, type ReactNode } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text as NativeText, TextInput, View, type TextProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "./api";
import { useSession } from "./session";
import { Glyph, useBack } from "./ui";
import { AuthIntro } from "./auth-intro";
import { validateAuth, type AuthMode } from "./auth-validation";
function Text(props: TextProps) { return <NativeText {...props} style={[{ fontFamily: "Merienda", color: "#374151" }, props.style]} />; }
function Action({ title, onPress, busy, secondary }: { title: string; onPress(): void; busy?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={onPress} style={[styles.button, secondary && { backgroundColor: "white", borderWidth: 1, borderColor: "#E5E7EB" }]}>{busy ? <ActivityIndicator color={secondary ? "#7F1D1D" : "white"} /> : <Text style={{ color: secondary ? "#374151" : "white", fontSize: 14 }}>{title}</Text>}</Pressable>;
}
function Checkbox({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange(): void; disabled?: boolean }) {
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked, disabled }} disabled={disabled} onPress={onChange} style={{ minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}><View style={{ width: 16, height: 16, borderRadius: 3, borderWidth: 1, borderColor: checked ? "#7F1D1D" : "#D1D5DB", backgroundColor: checked ? "#7F1D1D" : "white", alignItems: "center", justifyContent: "center" }}>{checked && <Glyph name="checkmark" size={12} color="white" />}</View></Pressable>;
}
export function AuthScreen() {
  const { signIn } = useSession();
  const [intro, setIntro] = useState(true);
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirmation, setConfirmation] = useState("");
  const [remember, setRemember] = useState(false); const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); const [showConfirmation, setShowConfirmation] = useState(false);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [sent, setSent] = useState(false);
  function changeMode(value: AuthMode) { if (busy) return; setMode(value); setError(""); setSent(false); setPassword(""); setConfirmation(""); setShowPassword(false); setShowConfirmation(false); setAccepted(false); }
  useBack(!intro && mode !== "login", () => changeMode("login"));
  async function submit() {
    if (busy) return;
    const invalid = validateAuth(mode, { name, email, password, confirmation, accepted });
    if (invalid) { setError(invalid); return; }
    setBusy(true); setError("");
    try {
      if (mode === "reset") { await api.request("/auth/forgot-password", { method: "POST", public: true, body: { email: email.trim().toLowerCase() } }); setSent(true); }
      else await signIn(email, password, mode === "signup" ? name : undefined, remember);
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); } finally { setBusy(false); }
  }
  function field(label: string, value: string, onChangeText: (value: string) => void, type: "email" | "name" | "password" | "confirm") {
    const secret = type === "password" || type === "confirm";
    const shown = type === "confirm" ? showConfirmation : showPassword;
    return <View style={{ gap: 8 }}><Text style={styles.label}>{label}</Text><View><TextInput accessibilityLabel={label} editable={!busy} value={value} onChangeText={onChangeText} placeholder={secret ? "••••••••" : type === "email" ? "you@example.com" : "John Doe"} placeholderTextColor="#9CA3AF" autoCapitalize={type === "name" ? "words" : "none"} autoCorrect={false} keyboardType={type === "email" ? "email-address" : "default"} autoComplete={type === "email" ? "email" : type === "name" ? "name" : mode === "signup" ? "new-password" : "current-password"} secureTextEntry={secret && !shown} style={[styles.input, secret && { paddingRight: 48 }]} onSubmitEditing={() => { if (mode === "login" && type === "password" || mode === "reset") void submit(); }} />{secret && <Pressable accessibilityRole="button" accessibilityLabel={`${shown ? "Hide" : "Show"} ${type === "confirm" ? "confirm password" : "password"}`} onPress={() => type === "confirm" ? setShowConfirmation(!shown) : setShowPassword(!shown)} style={{ position: "absolute", right: 4, top: 0, bottom: 0, width: 44, alignItems: "center", justifyContent: "center" }}><Glyph name={shown ? "eye-off-outline" : "eye-outline"} color="#9CA3AF" size={20} /></Pressable>}</View></View>;
  }
  if (intro) return <AuthIntro complete={() => setIntro(false)} />;
  let content: ReactNode;
  if (sent) content = <><View style={styles.header}><View style={[styles.roundIcon, { backgroundColor: "#F0FDF4" }]}><Glyph name="checkmark-circle-outline" color="#16A34A" size={32} /></View><Text style={[styles.title, { fontSize: 30 }]}>Check Your Email</Text><Text style={styles.subtitle}>We've sent a password reset link to {email.trim()}. Please check your inbox.</Text></View><View style={{ gap: 12 }}><Action title="Back to Login" onPress={() => changeMode("login")} busy={busy} /><Action title="Resend Email" secondary busy={busy} onPress={() => void submit()} /></View>{!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}</>;
  else content = <>
    <View style={styles.header}>{mode === "reset" && <View style={styles.roundIcon}><Glyph name="shield-outline" color="#7F1D1D" size={32} /></View>}<Text accessibilityRole="header" style={styles.title}>{mode === "signup" ? "Create Account" : mode === "reset" ? "Forgot Password" : "Welcome Back"}</Text><Text style={styles.subtitle}>{mode === "signup" ? "Join us today" : mode === "reset" ? "Enter your email to reset your password" : "Sign in to continue"}</Text></View>
    <View style={{ gap: 20 }}>
      {mode === "signup" && field("Full Name", name, setName, "name")}
      {field(mode === "reset" ? "Email Address" : "Email", email, setEmail, "email")}
      {mode !== "reset" && field("Password", password, setPassword, "password")}
      {mode === "signup" && field("Confirm Password", confirmation, setConfirmation, "confirm")}
      {mode === "login" && <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View style={{ flexDirection: "row", alignItems: "center", marginLeft: -14 }}><Checkbox label="Remember me" checked={remember} onChange={() => setRemember(!remember)} disabled={busy} /><Text style={{ fontSize: 12, color: "#6B7280" }} onPress={() => !busy && setRemember(!remember)}>Remember me</Text></View><Pressable accessibilityRole="button" disabled={busy} onPress={() => changeMode("reset")} style={styles.linkTouch}><Text style={[styles.link, { fontSize: 12 }]}>Forgot password?</Text></Pressable></View>}
      {mode === "signup" && <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -14 }}><Checkbox label="Accept privacy policy" checked={accepted} onChange={() => setAccepted(!accepted)} disabled={busy} /><Text style={{ flex: 1, fontSize: 14 }}>I accept the <Text accessibilityRole="link" style={styles.link} onPress={() => void Linking.openURL("https://app.virujhealth.com/privacy-policy").catch(() => setError("Could not open the privacy policy."))}>Privacy Policy</Text></Text></View>}
      {!!error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
      <Action title={mode === "signup" ? "Create account" : mode === "reset" ? "Send Reset Link" : "Sign in"} busy={busy} onPress={() => void submit()} />
    </View>
    {mode !== "reset" && <><View style={styles.divider}><View style={styles.line} /><Text style={{ fontSize: 14, color: "#9CA3AF", marginHorizontal: 16 }}>or continue with</Text><View style={styles.line} /></View><View style={{ flexDirection: "row", gap: 12 }}>{["Google", "Facebook"].map(provider => <Pressable key={provider} accessibilityRole="button" disabled={busy} onPress={() => setError(`${provider} sign-in is not available in this mobile build yet. Please use email.`)} style={styles.social}>{provider === "Google" ? <Image source={require("../../assets/auth/google.png")} style={{ width: 20, height: 20 }} /> : <Glyph name="logo-facebook" color="#2563EB" size={20} />}<Text style={{ fontSize: 14 }}>{provider}</Text></Pressable>)}</View></>}
    <View style={{ marginTop: 24, alignItems: "center" }}>{mode === "reset" ? <Pressable accessibilityRole="button" onPress={() => changeMode("login")} style={styles.linkTouch}><Text style={styles.link}>← Back to login</Text></Pressable> : <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 14, color: "#4B5563" }}>{mode === "signup" ? "Already have an account? " : "Don't have an account? "}</Text><Pressable accessibilityRole="button" disabled={busy} onPress={() => changeMode(mode === "signup" ? "login" : "signup")} style={styles.linkTouch}><Text style={styles.link}>{mode === "signup" ? "Sign in" : "Sign up"}</Text></Pressable></View>}</View>
  </>;
  return <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}><View style={{ width: "100%", maxWidth: 448, alignSelf: "center", paddingVertical: 16 }}>{content}</View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 40 }, title: { fontSize: 36, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 8 }, subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24 },
  roundIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151" }, input: { fontFamily: "Merienda", minHeight: 48, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#F9FAFB", color: "#111827", fontSize: 14 },
  button: { minHeight: 48, backgroundColor: "#7F1D1D", borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 12 }, link: { color: "#7F1D1D", fontSize: 14 }, linkTouch: { minHeight: 44, justifyContent: "center" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 32 }, line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" }, social: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, error: { color: "#DC2626", fontSize: 12, lineHeight: 18 },
});
