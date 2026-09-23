import { useRef, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignInButton } from "react-native-nitro-google-signin";
import { useSession } from "./session";

export function AuthScreen() {
  const { signIn } = useSession();
  const pending = useRef(false);
  const [busy, setBusy] = useState<"google" | "facebook" | null>(null);
  const [error, setError] = useState("");
  async function continueWith(provider: "google" | "facebook") {
    if (pending.current) return;
    pending.current = true;
    setBusy(provider);
    setError("");
    try { await signIn(provider); }
    catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      const code = cause && typeof cause === "object" && "code" in cause ? String(cause.code) : "";
      if (!message.includes("SIGN_IN_CANCELLED") && code !== "SIGN_IN_CANCELLED") setError(code === "account_link_requires_verification" ? "This email is already in use. Please contact support to connect your accounts." : code === "NETWORK_ERROR" || code === "provider_unavailable" ? "Connection lost. Check your internet and try again." : "Sign-in could not be completed. Please try again.");
    } finally { pending.current = false; setBusy(null); }
  }
  return <SafeAreaView style={styles.screen}><View style={styles.content}>
    <View style={styles.brand}><Image source={require("../../assets/auth/virujlogo.png")} style={styles.logo} resizeMode="contain" /><Text style={styles.brandName}>VIRUJ HEALTH</Text></View>
    <View style={styles.heading}><Text style={styles.title}>Your health, all in one place.</Text><Text style={styles.subtitle}>Sign in or create your account to get started.</Text></View>
    <View style={styles.actions}>
      <View style={styles.google}>{busy === "google" ? <ActivityIndicator color="#202124" /> : <GoogleSignInButton accessibilityLabel="Continue with Google" colorScheme="light" size="wide" signInBehavior="none" disabled={busy !== null} onPress={() => void continueWith("google")} />}</View>
      <Pressable accessibilityRole="button" accessibilityLabel="Continue with Facebook" accessibilityState={{ disabled: busy !== null, busy: busy === "facebook" }} disabled={busy !== null} onPress={() => void continueWith("facebook")} style={styles.facebook}>{busy === "facebook" ? <ActivityIndicator color="white" /> : <><Text style={styles.facebookMark}>f</Text><Text style={styles.facebookText}>Continue with Facebook</Text></>}</Pressable>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
    <Text style={styles.legal}>By continuing, you agree to our <Text accessibilityRole="link" style={styles.link} onPress={() => void Linking.openURL("https://app.virujhealth.com/privacy-policy")}>Privacy Policy</Text>.</Text>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFDFC" }, content: { flex: 1, paddingHorizontal: 28, paddingVertical: 28, justifyContent: "space-between", maxWidth: 480, width: "100%", alignSelf: "center" },
  brand: { alignItems: "center", marginTop: 28 }, logo: { width: 96, height: 96 }, brandName: { fontFamily: "Merienda", fontSize: 15, color: "#7F1D1D", letterSpacing: 2, fontWeight: "700" },
  heading: { gap: 14 }, title: { fontFamily: "Merienda", fontSize: 34, lineHeight: 46, fontWeight: "700", color: "#241817", textAlign: "center" }, subtitle: { fontSize: 16, lineHeight: 24, color: "#6B6260", textAlign: "center" },
  actions: { gap: 14 }, google: { minHeight: 56, justifyContent: "center", alignItems: "center" },
  facebook: { minHeight: 56, borderRadius: 12, backgroundColor: "#0866FF", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }, facebookMark: { fontSize: 27, fontWeight: "700", color: "white" }, facebookText: { fontSize: 16, fontWeight: "700", color: "white" }, error: { color: "#B42318", textAlign: "center", fontSize: 14 }, legal: { fontSize: 12, color: "#6B6260", textAlign: "center", lineHeight: 19 }, link: { color: "#7F1D1D", textDecorationLine: "underline" },
});
