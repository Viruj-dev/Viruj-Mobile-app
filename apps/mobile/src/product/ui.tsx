import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle, type TextStyle, type StyleProp } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "./api";

export const colors = { primary: "#B91C1C", deep: "#7F1D1D", ink: "#111827", muted: "#6B7280", bg: "#F8FAFC", line: "#EEE1DE", soft: "#FCECEA", white: "#FFFFFF", red: "#AC3434" };
export type Icon = keyof typeof Ionicons.glyphMap;
export function useBack(active: boolean, back: () => void) {
  useEffect(() => { if (!active) return; const subscription = BackHandler.addEventListener("hardwareBackPress", () => { back(); return true; }); return () => subscription.remove(); }, [active, back]);
}
export function Glyph({ name, color = colors.primary, size = 24 }: { name: Icon; color?: string; size?: number }) { return <Ionicons name={name} color={color} size={size} />; }
export function Button({ title, onPress, busy, secondary, disabled, icon, style, textStyle }: { title: string; onPress(): void; busy?: boolean; secondary?: boolean; disabled?: boolean; icon?: Icon; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle> }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: disabled || busy, busy }} disabled={disabled || busy} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, (pressed || disabled || busy) && { opacity: 0.6 }, style]}>{busy ? <ActivityIndicator color={secondary ? colors.primary : "white"} /> : <>{icon && <Glyph name={icon} color={secondary ? colors.deep : "white"} size={20} />}<Text style={[s.buttonText, secondary && { color: colors.deep }, textStyle]}>{title}</Text></>}</Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) { return <View style={{ gap: 7 }}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[s.input, props.multiline && { minHeight: 105, textAlignVertical: "top" }, props.style]} /></View>; }
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) { return <View style={[s.card, style]}>{children}</View>; }
export function Heading({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) { return <Text accessibilityRole="header" style={[s.heading, style]}>{children}</Text>; }
export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) { return <Text style={[s.body, style]}>{children}</Text>; }
export function ErrorText({ message }: { message?: string }) { return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.error}>{message}</Text> : null; }
export function Empty({ icon = "leaf-outline", title, detail }: { icon?: Icon; title: string; detail?: string }) { return <View style={s.empty}><Glyph name={icon} size={34} /><Heading>{title}</Heading>{detail && <Body>{detail}</Body>}</View>; }
export function Screen({ title, subtitle, back, children, right, scroll = true }: { title: string; subtitle?: string; back?: () => void; children: ReactNode; right?: ReactNode; scroll?: boolean }) {
  return <SafeAreaView edges={["top", "left", "right"]} style={s.screen}><View style={[s.header, Platform.OS === "web" ? { backgroundImage: "linear-gradient(90deg, #7C1117 0%, #62090F 60%, #271513 100%)" } as ViewStyle : { experimental_backgroundImage: "linear-gradient(90deg, #7C1117 0%, #62090F 60%, #271513 100%)" }]}>{back && <Pressable accessibilityLabel="Back" accessibilityRole="button" onPress={back} style={s.iconButton}><Glyph name="arrow-back" color={colors.ink} /></Pressable>}<View style={{ flex: 1 }}><Text accessibilityRole="header" style={s.title}>{title}</Text></View>{right}</View><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>{scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>{children}</ScrollView> : children}</KeyboardAvoidingView></SafeAreaView>;
}
export function Row({ title, detail, icon, onPress }: { title: string; detail?: string; icon: Icon; onPress(): void }) { return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={s.row}><View style={s.iconTile}><Glyph name={icon} /></View><View style={{ flex: 1, gap: 4 }}><Text style={s.rowTitle}>{title}</Text>{detail && <Text style={s.body}>{detail}</Text>}</View><Glyph name="chevron-forward" size={18} color={colors.muted} /></Pressable>; }
export function useResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(""); setData(null);
    api.request<T>(path, { signal: controller.signal }).then(value => { if (!controller.signal.aborted) setData(value); }).catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path, version]);
  return { data, error, loading, reload: () => setVersion(v => v + 1) };
}
export function ResourceState({ loading, error, reload }: { loading: boolean; error: string; reload(): void }) { return loading ? <ActivityIndicator accessibilityLabel="Loading" color={colors.primary} style={{ padding: 30 }} /> : error ? <Card><ErrorText message={error} /><Button title="Try again" secondary onPress={reload} /></Card> : null; }
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, header: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 64, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: "#62090F", flexDirection: "row", alignItems: "center", gap: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }, title: { fontFamily: "Merienda", fontSize: 18, fontWeight: "600", letterSpacing: 0.45, color: "white" }, eyebrow: { color: colors.deep, fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }, content: { padding: 16, paddingBottom: 120, gap: 24, flexGrow: 1 }, heading: { fontFamily: "Merienda", fontSize: 18, fontWeight: "600", letterSpacing: 0, color: colors.ink }, body: { fontFamily: "Merienda", fontSize: 14, lineHeight: 21, color: colors.muted }, label: { fontFamily: "Merienda", fontSize: 13, fontWeight: "600", color: colors.ink }, input: { fontFamily: "Merienda", borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 15, minHeight: 52, color: colors.ink, backgroundColor: "white", fontSize: 16 }, button: { minHeight: 52, borderRadius: 16, backgroundColor: colors.deep, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 18, paddingVertical: 12, gap: 8 }, secondary: { backgroundColor: colors.soft }, buttonText: { fontFamily: "Merienda", fontSize: 15, fontWeight: "600", color: "white" }, card: { backgroundColor: "white", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", gap: 12 }, error: { color: colors.red, fontSize: 14, lineHeight: 21 }, empty: { paddingVertical: 38, alignItems: "center", gap: 12 }, iconButton: { backgroundColor: "white", borderRadius: 8, minWidth: 40, minHeight: 40, alignItems: "center", justifyContent: "center" }, row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 76, paddingVertical: 8 }, rowTitle: { fontFamily: "Merienda", fontSize: 16, fontWeight: "600", color: colors.ink }, iconTile: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
});
