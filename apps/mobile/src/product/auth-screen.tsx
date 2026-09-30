import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthIntro } from "./auth-intro";
import { Button, Field, useBack } from "./ui";
import { useSession } from "./session";

// The native Google button imports the React Native bridge, which is unavailable on web.
const GoogleSignInButton = Platform.OS === "web" ? null : require("react-native-nitro-google-signin").GoogleSignInButton as typeof import("react-native-nitro-google-signin").GoogleSignInButton;

export function AuthScreen() {
  const { signIn, loginEmail, signupEmail, sendPhoneOtp, verifyPhoneOtp } = useSession();
  const [intro, setIntro] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<"submit" | "google" | null>(null);
  const [error, setError] = useState("");
  useBack(!intro && mode === "signup", () => { setMode("login"); setError(""); });

  async function submit() {
    if (busy) return;
    if (method === "phone") {
      if (!/^[6-9]\d{9}$/.test(phone.trim())) { setError("Enter a valid 10-digit Indian mobile number."); return; }
      if (codeSent && !/^\d{6}$/.test(code.trim())) { setError("Enter the 6-digit code."); return; }
      setBusy("submit"); setError("");
      try {
        const phoneNumber = `+91${phone.trim()}`;
        if (codeSent) await verifyPhoneOtp(phoneNumber, code.trim());
        else { await sendPhoneOtp(phoneNumber); setCodeSent(true); }
      } catch (cause) { setError(authMessage(cause)); }
      finally { setBusy(null); }
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    if (mode === "signup" && name.trim().length < 2) { setError("Name must be at least 2 characters."); return; }
    if (mode === "signup" && password.length < 8) { setError("Use a password with at least 8 characters."); return; }
    if (mode === "signup" && password !== confirmation) { setError("Passwords do not match."); return; }
    if (mode === "signup" && !accepted) { setError("Accept the Privacy Policy to continue."); return; }
    setBusy("submit"); setError("");
    try {
      if (mode === "signup") await signupEmail(name.trim(), email.trim().toLowerCase(), password);
      else await loginEmail(email.trim().toLowerCase(), password);
    } catch (cause) { setError(authMessage(cause)); }
    finally { setBusy(null); }
  }

  async function google() {
    if (busy) return;
    setBusy("google"); setError("");
    try { await signIn("google"); }
    catch (cause) { if ((cause as Error)?.message !== "SIGN_IN_CANCELLED") setError(authMessage(cause)); }
    finally { setBusy(null); }
  }

  if (intro) return <AuthIntro complete={() => setIntro(false)} />;
  return <SafeAreaView style={styles.screen}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}><View style={styles.content}>
      <View style={styles.header}><Text accessibilityRole="header" style={styles.title}>{method === "phone" ? "Sign in with phone" : mode === "signup" ? "Create Account" : "Welcome Back"}</Text><Text style={styles.subtitle}>{method === "phone" ? "We'll text you a verification code" : mode === "signup" ? "Join us today" : "Sign in to continue"}</Text></View>
      <View style={styles.fields}>
        {method === "phone" ? <>
          <Field label="Mobile number (+91)" placeholder="9876543210" value={phone} onChangeText={value => { setPhone(value); setCodeSent(false); setCode(""); }} keyboardType="phone-pad" autoComplete="tel" />
          {codeSent && <Field label="Verification code" placeholder="6-digit code" value={code} onChangeText={setCode} keyboardType="number-pad" autoComplete="sms-otp" />}
        </> : <>
        {mode === "signup" && <Field label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" />}
        <Field label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} autoComplete="email" keyboardType="email-address" />
        <Field label="Password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
        <View style={styles.passwordActions}><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword(value => !value)} style={styles.show}><Text style={styles.link}>{showPassword ? "Hide password" : "Show password"}</Text></Pressable>{mode === "login" && <Pressable accessibilityRole="link" onPress={() => void Linking.openURL("https://app.virujhealth.com/auth/reset-password")} style={styles.show}><Text style={styles.link}>Forgot password?</Text></Pressable>}</View>
        {mode === "signup" && <Field label="Confirm Password" placeholder="Repeat password" value={confirmation} onChangeText={setConfirmation} secureTextEntry={!showPassword} autoCapitalize="none" autoComplete="new-password" />}
        {mode === "signup" && <Pressable accessibilityRole="checkbox" accessibilityLabel="Accept Privacy Policy" accessibilityState={{ checked: accepted }} onPress={() => setAccepted(value => !value)} style={styles.privacy}><View style={[styles.checkbox, accepted && styles.checked]}>{accepted && <Text style={{ color: "white" }}>✓</Text>}</View><Text style={styles.privacyText}>I accept the <Text style={styles.link} onPress={() => void Linking.openURL("https://app.virujhealth.com/privacy-policy")}>Privacy Policy</Text></Text></Pressable>}
        </>}
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Button title={method === "phone" ? codeSent ? "Verify and continue" : "Send code" : mode === "signup" ? "Create account" : "Sign in"} busy={busy === "submit"} disabled={busy === "google"} onPress={() => void submit()} style={styles.submit} />
        {method === "phone" && codeSent && <Pressable accessibilityRole="button" onPress={() => { setCodeSent(false); setCode(""); setError(""); }}><Text style={styles.link}>Resend code</Text></Pressable>}
      </View>
      <Pressable accessibilityRole="button" onPress={() => { setMethod(method === "phone" ? "email" : "phone"); setError(""); }} style={styles.switch}><Text style={styles.link}>{method === "phone" ? "Use email instead" : "Sign in with phone"}</Text></Pressable>
      {method === "email" && <>
      <View style={styles.divider}><View style={styles.line} /><Text style={styles.dividerText}>or continue with</Text><View style={styles.line} /></View>
      <View style={styles.google}>{busy === "google" ? <ActivityIndicator color="#202124" /> : GoogleSignInButton ? <GoogleSignInButton accessibilityLabel="Continue with Google" colorScheme="light" size="wide" signInBehavior="none" disabled={busy !== null} onPress={() => void google()} /> : <Text style={styles.subtitle}>Google sign-in is available in the Android and iOS apps.</Text>}</View>
      <View style={styles.switch}><Text style={styles.switchText}>{mode === "signup" ? "Already have an account? " : "Don't have an account? "}</Text><Pressable accessibilityRole="button" onPress={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setPassword(""); setConfirmation(""); }}><Text style={styles.link}>{mode === "signup" ? "Sign in" : "Sign up"}</Text></Pressable></View>
      </>}
    </View></ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}

function authMessage(cause: unknown) {
  const code = cause && typeof cause === "object" && "code" in cause ? String(cause.code) : "";
  if (code === "email_in_use") return "This email already has an account. Please sign in.";
  if (code === "invalid_credentials") return "Email or password is incorrect.";
  if (code === "too_many_attempts") return "Too many attempts. Please try again later.";
  if (code === "invalid_otp") return "Incorrect or expired code. Please try again.";
  if (code === "sms_gateway_not_configured") return "SMS gateway setup is incomplete. Please use email or Google for now.";
  if (code === "account_link_requires_verification") return "This email is already in use. Please contact support to connect your accounts.";
  if (code === "provider_unavailable") return "Sign-in service is unavailable. Please try again.";
  if (code === "NETWORK_ERROR") return "Connection lost. Check your internet and try again.";
  return "Sign-in could not be completed. Please try again.";
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" }, scroll: { flexGrow: 1, justifyContent: "center", padding: 20 }, content: { width: "100%", maxWidth: 448, alignSelf: "center", paddingVertical: 28 },
  header: { alignItems: "center", marginBottom: 36 }, title: { fontSize: 36, fontWeight: "700", color: "#111827", textAlign: "center" }, subtitle: { fontSize: 16, color: "#6B7280", marginTop: 8 },
  fields: { gap: 18 }, passwordActions: { flexDirection: "row", justifyContent: "space-between", marginTop: -14 }, show: { minHeight: 32, justifyContent: "center" }, submit: { backgroundColor: "#7F1D1D", borderRadius: 8, marginTop: 8 },
  privacy: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 }, checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: "#9CA3AF", alignItems: "center", justifyContent: "center" }, checked: { backgroundColor: "#7F1D1D", borderColor: "#7F1D1D" }, privacyText: { color: "#374151", fontSize: 14, flex: 1 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 28 }, line: { height: 1, backgroundColor: "#E5E7EB", flex: 1 }, dividerText: { marginHorizontal: 12, color: "#9CA3AF", fontSize: 14 }, google: { minHeight: 56, alignItems: "center", justifyContent: "center" },
  switch: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 28 }, switchText: { color: "#4B5563", fontSize: 14 }, link: { color: "#7F1D1D", fontSize: 14, fontWeight: "600" }, error: { color: "#B42318", fontSize: 14 },
});
