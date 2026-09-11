import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "./api";

export const colors = { teal: "#0E9996", deep: "#096C69", ink: "#152F32", muted: "#627577", bg: "#F8FAF7", line: "#E2E9E4", mint: "#E6F5EE", white: "#FFFFFF", red: "#AC3434" };
export type Icon = keyof typeof Ionicons.glyphMap;
export function Glyph({ name, color = colors.teal, size = 24 }: { name: Icon; color?: string; size?: number }) { return <Ionicons name={name} color={color} size={size} />; }
export function Button({ title, onPress, busy, secondary, disabled, icon }: { title: string; onPress(): void; busy?: boolean; secondary?: boolean; disabled?: boolean; icon?: Icon }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: disabled || busy, busy }} disabled={disabled || busy} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, (pressed || disabled || busy) && { opacity: 0.6 }]}>{busy ? <ActivityIndicator color={secondary ? colors.teal : "white"} /> : <>{icon && <Glyph name={icon} color={secondary ? colors.deep : "white"} size={20} />}<Text style={[s.buttonText, secondary && { color: colors.deep }]}>{title}</Text></>}</Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) { return <View style={{ gap: 7 }}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[s.input, props.multiline && { minHeight: 105, textAlignVertical: "top" }, props.style]} /></View>; }
export function Card({ children }: { children: ReactNode }) { return <View style={s.card}>{children}</View>; }
export function Heading({ children }: { children: ReactNode }) { return <Text accessibilityRole="header" style={s.heading}>{children}</Text>; }
export function Body({ children }: { children: ReactNode }) { return <Text style={s.body}>{children}</Text>; }
export function ErrorText({ message }: { message?: string }) { return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.error}>{message}</Text> : null; }
export function Empty({ icon = "leaf-outline", title, detail }: { icon?: Icon; title: string; detail?: string }) { return <View style={s.empty}><Glyph name={icon} size={34} /><Heading>{title}</Heading>{detail && <Body>{detail}</Body>}</View>; }
export function Screen({ title, subtitle, back, children, right, scroll = true }: { title: string; subtitle?: string; back?: () => void; children: ReactNode; right?: ReactNode; scroll?: boolean }) {
  return <SafeAreaView edges={["top", "left", "right"]} style={s.screen}><View style={s.header}>{back && <Pressable accessibilityLabel="Back" accessibilityRole="button" onPress={back} style={s.iconButton}><Glyph name="arrow-back" color={colors.ink} /></Pressable>}<View style={{ flex: 1 }}>{subtitle && <Text style={s.eyebrow}>{subtitle}</Text>}<Text accessibilityRole="header" style={s.title}>{title}</Text></View>{right}</View><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>{scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>{children}</ScrollView> : children}</KeyboardAvoidingView></SafeAreaView>;
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
export function ResourceState({ loading, error, reload }: { loading: boolean; error: string; reload(): void }) { return loading ? <ActivityIndicator accessibilityLabel="Loading" color={colors.teal} style={{ padding: 30 }} /> : error ? <Card><ErrorText message={error} /><Button title="Try again" secondary onPress={reload} /></Card> : null; }
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, header: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 20, flexDirection: "row", alignItems: "center", gap: 10 }, title: { fontSize: 30, fontWeight: "700", letterSpacing: -1, color: colors.ink }, eyebrow: { color: colors.deep, fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }, content: { paddingHorizontal: 22, paddingBottom: 32, gap: 18, flexGrow: 1 }, heading: { fontSize: 20, fontWeight: "600", letterSpacing: -0.5, color: colors.ink }, body: { fontSize: 14, lineHeight: 21, color: colors.muted }, label: { fontSize: 13, fontWeight: "600", color: colors.ink }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 15, minHeight: 52, color: colors.ink, backgroundColor: "white", fontSize: 16 }, button: { minHeight: 52, borderRadius: 16, backgroundColor: colors.deep, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 18, paddingVertical: 12, gap: 8 }, secondary: { backgroundColor: colors.mint }, buttonText: { fontSize: 15, fontWeight: "600", color: "white" }, card: { backgroundColor: "white", padding: 19, borderRadius: 22, borderWidth: 1, borderColor: colors.line, gap: 12 }, error: { color: colors.red, fontSize: 14, lineHeight: 21 }, empty: { paddingVertical: 38, alignItems: "center", gap: 12 }, iconButton: { minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center" }, row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 76, paddingVertical: 8 }, rowTitle: { fontSize: 16, fontWeight: "600", color: colors.ink }, iconTile: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center" },
});
