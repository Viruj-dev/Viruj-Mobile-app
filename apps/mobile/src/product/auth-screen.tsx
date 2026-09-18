import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatIndianMobile, maskPhoneNumber, normalizeIndianPhoneNumber, toIndianMobileDigits } from "../features/auth/utils/phone-number";
import { WebAuth, ResetPassword, AuthError } from "./setup";
import { Privacy } from "./legal";
import { AuthIntro } from "./auth-intro";
import { useSession } from "./session";
import { Glyph, useBack } from "./ui";

const CODE_LENGTH = 6;
function message(error: unknown) {
  const value = error instanceof Error ? error.message.toLowerCase() : "";
  if (value.includes("ipblocked") || value.includes("ip blocked")) return "Too many OTP requests. Please wait before trying again.";
  if (value.includes("authenticationfailure")) return "OTP service configuration was rejected by MSG91.";
  if (value.includes("invalid otp")) return "The code you entered is incorrect.";
  if (value.includes("expired")) return "That code has expired. Request a new one.";
  if (value.includes("too many")) return "Too many attempts. Request a new code.";
  if (value.includes("not found")) return "That code is no longer valid. Request a new one.";
  return error instanceof Error ? error.message : "Please try again.";
}

export function AuthScreen() {
  const { requestOtp, resendOtp, verifyOtp } = useSession();
  const [flow, setFlow] = useState("phone");
  const [intro, setIntro] = useState(true);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);
  const input = useRef<TextInput>(null);
  const normalized = useMemo(() => { try { return normalizeIndianPhoneNumber(phone); } catch { return ""; } }, [phone]);
  useBack(!intro && step === "otp", editPhone);
  useEffect(() => { if (!retryAfter) return; const timer = setInterval(() => setRetryAfter(value => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, [retryAfter > 0]);

  function editPhone() { if (busy) return; setStep("phone"); setCode(""); setError(""); }
  async function send() {
    if (busy) return;
    if (!normalized) { setError("Enter a valid 10-digit Indian mobile number."); return; }
    setBusy(true); setError("");
    try { const result = await requestOtp(normalized); setStep("otp"); setRetryAfter(result.retryAfterSeconds); setTimeout(() => input.current?.focus(), 250); }
    catch (e) { setError(message(e)); }
    finally { setBusy(false); }
  }
  async function verify() {
    if (busy || code.length !== CODE_LENGTH) return;
    setBusy(true); setError("");
    try { await verifyOtp(normalized, code); }
    catch (e) { setError(message(e)); setCode(""); input.current?.focus(); }
    finally { setBusy(false); }
  }
  async function resend() {
    if (busy || retryAfter) return;
    setBusy(true); setError("");
    try { const result = await resendOtp(normalized); setRetryAfter(result.retryAfterSeconds); setCode(""); input.current?.focus(); }
    catch (e) { setError(message(e)); }
    finally { setBusy(false); }
  }
  if (intro) return <AuthIntro complete={() => setIntro(false)} />;
  if (flow === "privacy") return <Privacy back={() => setFlow("phone")} navigate={d => setFlow(d.name)} />;
  if (flow === "reset-password") return <ResetPassword back={() => setFlow("phone")} />;
  if (flow === "auth-error") return <AuthError navigate={d => setFlow(d.name)} />;
  if (flow !== "phone") return <WebAuth back={() => setIntro(true)} phone={() => setFlow("phone")} navigate={d => setFlow(d.name)} />;
  return <SafeAreaView style={styles.screen}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}><View style={styles.form}>
    {step === "otp" && <Pressable accessibilityRole="button" accessibilityLabel="Edit phone number" onPress={editPhone} style={styles.back}><Glyph name="arrow-back" color="#7F1D1D" /></Pressable>}
    <View style={styles.header}><View style={styles.icon}><Glyph name={step === "phone" ? "phone-portrait-outline" : "shield-checkmark-outline"} color="#7F1D1D" size={32} /></View><Text accessibilityRole="header" style={styles.title}>{step === "phone" ? "Welcome Back" : "Verify OTP"}</Text><Text style={styles.subtitle}>{step === "phone" ? "Sign in with your mobile number" : `Enter the 6-digit code sent to ${maskPhoneNumber(normalized)}.`}</Text></View>
    {step === "phone" ? <View style={{ gap: 20 }}><View style={{ gap: 8 }}><Text style={styles.label}>Mobile Number</Text><View style={styles.phoneField}><View style={styles.prefix}><Text style={styles.prefixText}>+91</Text></View><TextInput accessibilityLabel="Mobile Number" value={formatIndianMobile(phone)} onChangeText={value => { setPhone(toIndianMobileDigits(value)); setError(""); }} keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel" maxLength={11} placeholder="98765 43210" placeholderTextColor="#9CA3AF" style={styles.phoneInput} onSubmitEditing={() => void send()} /></View></View>{!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}<Button title="Continue with OTP" busy={busy} onPress={() => void send()} /><Text style={styles.terms}>By continuing, you agree to our <Text accessibilityRole="link" style={styles.link} onPress={() => void Linking.openURL("https://app.virujhealth.com/privacy-policy")}>Privacy Policy</Text>.</Text></View>
    : <View style={{ gap: 20 }}><Pressable accessibilityRole="button" accessibilityLabel="Enter verification code" onPress={() => input.current?.focus()} style={styles.codes}>{Array.from({ length: CODE_LENGTH }, (_, index) => <View key={index} style={[styles.code, code[index] && styles.codeActive]}><Text style={styles.codeText}>{code[index] || ""}</Text></View>)}</Pressable><TextInput ref={input} accessibilityLabel="Verification code" value={code} onChangeText={value => { setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH)); setError(""); }} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" maxLength={CODE_LENGTH} style={styles.hidden} onSubmitEditing={() => void verify()} />{!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}<Button title="Verify and continue" busy={busy} disabled={code.length !== CODE_LENGTH} onPress={() => void verify()} /><View style={styles.resend}><Text style={styles.resendText}>Did not receive it? </Text><Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || retryAfter > 0 }} disabled={busy || retryAfter > 0} onPress={() => void resend()} style={styles.linkTouch}><Text style={[styles.link, retryAfter > 0 && { color: "#9CA3AF" }]}>{retryAfter > 0 ? `Resend in ${retryAfter}s` : "Resend"}</Text></Pressable></View></View>}
  </View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
function Button({ title, busy, disabled, onPress }: { title: string; busy: boolean; disabled?: boolean; onPress(): void }) { return <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || disabled, busy }} disabled={busy || disabled} onPress={onPress} style={[styles.button, (busy || disabled) && { opacity: 0.55 }]}>{busy ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{title}</Text>}</Pressable>; }
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" }, scroll: { flexGrow: 1, justifyContent: "center", padding: 16 }, form: { width: "100%", maxWidth: 448, alignSelf: "center", paddingVertical: 24 }, back: { position: "absolute", top: 0, left: 0, width: 48, height: 48, alignItems: "center", justifyContent: "center", zIndex: 1 },
  header: { alignItems: "center", marginBottom: 40 }, icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center", marginBottom: 24 }, title: { fontFamily: "Merienda", fontSize: 36, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 8 }, subtitle: { fontFamily: "Merienda", fontSize: 15, lineHeight: 23, color: "#6B7280", textAlign: "center" }, label: { fontFamily: "Merienda", fontSize: 14, fontWeight: "500", color: "#374151" },
  phoneField: { minHeight: 52, flexDirection: "row", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, backgroundColor: "#F9FAFB", overflow: "hidden" }, prefix: { paddingHorizontal: 16, justifyContent: "center", borderRightWidth: 1, borderRightColor: "#E5E7EB" }, prefixText: { fontFamily: "Merienda", fontWeight: "600", color: "#111827" }, phoneInput: { flex: 1, paddingHorizontal: 16, fontFamily: "Merienda", fontSize: 16, color: "#111827" },
  button: { minHeight: 50, borderRadius: 8, backgroundColor: "#7F1D1D", alignItems: "center", justifyContent: "center" }, buttonText: { fontFamily: "Merienda", color: "white", fontSize: 14 }, error: { fontFamily: "Merienda", color: "#DC2626", fontSize: 12, lineHeight: 18 }, terms: { fontFamily: "Merienda", color: "#6B7280", fontSize: 12, lineHeight: 19, textAlign: "center" }, link: { fontFamily: "Merienda", color: "#7F1D1D", fontWeight: "600" }, linkTouch: { minHeight: 44, justifyContent: "center" },
  codes: { flexDirection: "row", gap: 8 }, code: { flex: 1, height: 58, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }, codeActive: { borderColor: "#7F1D1D", backgroundColor: "#FEF2F2" }, codeText: { fontFamily: "Merienda", fontSize: 20, fontWeight: "700", color: "#111827" }, hidden: { position: "absolute", width: 1, height: 1, opacity: 0 }, resend: { flexDirection: "row", justifyContent: "center", alignItems: "center" }, resendText: { fontFamily: "Merienda", fontSize: 14, color: "#6B7280" },
});

