import { useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthScreen } from "./auth-screen";
import { Care, CareDetail } from "./care";
import { Chat } from "./chat";
import { Community } from "./community";
import { Booking, Health } from "./health";
import { Home, type Destination } from "./home";
import { Inbox } from "./inbox";
import { DeleteAccount, EditProfile, Feedback, Profile } from "./profile";
import { useSession } from "./session";
import { Button, colors, ErrorText, Glyph, ResourceState, Row, Screen, useResource, type Icon } from "./ui";
import { type CareItem } from "./api";
const tabs: { name: string; label: string; icon: Icon }[] = [{ name: "home", label: "Home", icon: "grid-outline" }, { name: "health", label: "My health", icon: "heart-outline" }, { name: "chat", label: "Ask AI", icon: "sparkles-outline" }, { name: "community", label: "Community", icon: "people-outline" }, { name: "profile", label: "Profile", icon: "person-outline" }];
export function PatientApp() {
  const { session, loading, error, restore, logout } = useSession();
  if (loading) return <Screen title="Viruj Health"><ActivityIndicator color={colors.primary} /></Screen>;
  if (!session && error) return <Screen title="Connection unavailable"><ErrorText message={error} /><Button title="Try again" onPress={() => void restore()} /><Button title="Sign in with another account" secondary onPress={() => void logout().catch(() => {})} /></Screen>;
  if (!session) return <AuthScreen />;
  return <Workspace key={session.user.id} />;
}
function Workspace() {
  const insets = useSafeAreaInsets(); const [tab, setTab] = useState("home"); const [stack, setStack] = useState<Destination[]>([]);
  const route = stack[stack.length - 1];
  const back = () => setStack(value => value.slice(0, -1));
  const navigate = (destination: Destination) => { if (tabs.some(item => item.name === destination.name)) { setTab(destination.name); setStack([]); } else setStack(value => [...value, destination]); };
  useEffect(() => { const listener = BackHandler.addEventListener("hardwareBackPress", () => { if (stack.length) { setStack(value => value.slice(0, -1)); return true; } if (tab !== "home") { setTab("home"); return true; } return false; }); return () => listener.remove(); }, [stack.length, tab]);
  const name = route?.name || tab;
  let screen;
  if (name === "care") screen = <Care key={route!.kind} kind={route!.kind!} navigate={navigate} back={back} />;
  else if (name === "detail") screen = <CareDetail key={`${route!.kind}/${route!.id}`} kind={route!.kind!} id={route!.id!} navigate={navigate} back={back} />;
  else if (name === "hospital-doctors") screen = <HospitalDoctors id={route!.id!} back={back} navigate={navigate} />;
  else if (name === "booking") screen = <Booking doctorId={route!.id!} back={back} complete={() => navigate({ name: "health" })} />;
  else if (name === "notifications") screen = <Inbox back={back} />;
  else if (name === "edit-profile") screen = <EditProfile back={back} />;
  else if (name === "feedback") screen = <Feedback back={back} />;
  else if (name === "delete-account") screen = <DeleteAccount back={back} />;
  else if (name === "health") screen = <Health />;
  else if (name === "chat") screen = <Chat />;
  else if (name === "community") screen = <Community />;
  else if (name === "profile") screen = <Profile navigate={navigate} />;
  else screen = <Home navigate={navigate} />;
  return <View style={{ flex: 1, backgroundColor: colors.bg }}>{screen}{!route && <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: "white", paddingTop: 10, paddingBottom: Math.max(insets.bottom, 12) }}>{tabs.map(item => <Pressable key={item.name} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: tab === item.name }} onPress={() => setTab(item.name)} style={{ flex: 1, minHeight: 50, alignItems: "center", justifyContent: "center", gap: 6 }}><Glyph name={item.icon} color={tab === item.name ? colors.deep : colors.muted} size={22} /><Text style={{ fontSize: 10, fontWeight: tab === item.name ? "700" : "500", color: tab === item.name ? colors.deep : colors.muted }}>{item.label}</Text></Pressable>)}</View>}</View>;
}
function HospitalDoctors({ id, back, navigate }: { id: string; back(): void; navigate(destination: Destination): void }) { const result = useResource<{ data: CareItem[] }>(`/hospitals/${id}/doctors`); return <Screen title="Hospital doctors" back={back}><ResourceState {...result} />{result.data?.data.map(item => <Row key={item.id} title={item.name} detail={item.specialty} icon="medkit-outline" onPress={() => navigate({ name: "detail", kind: "doctors", id: String(item.id) })} />)}</Screen>; }
