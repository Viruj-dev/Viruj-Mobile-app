import { webPages } from "./web-pages";
import { Support } from "./more-screens";
import { Privacy, PublicDeletion } from "./legal";
import { Setup } from "./setup";
import { Reports } from "./reports";
import { BlurView } from "expo-blur";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, AppState, BackHandler, Linking, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthScreen } from "./auth-screen";
import { Care, CareDetail } from "./care";
import { Chat } from "./chat";
import { Community } from "./community";
import { AppointmentDetails, Booking, Health } from "./health";
import { Home, type Destination } from "./home";
import { Inbox } from "./inbox";
import { DeleteAccount, EditProfile, Feedback, Profile } from "./profile";
import { useSession } from "./session";
import { Body, Button, colors, ErrorText, Glyph, ResourceState, Row, Screen, useResource, type Icon } from "./ui";
import { previewEnabled } from "./preview";
import { api, type CareItem } from "./api";
import { devAuthBypass } from "./dev-session";
import { DevicePreferencesProvider, useDevicePreferences } from "./device-preferences";
import { canEnterApp } from "./device-permissions";
import { ManualLocation } from "./manual-location";
import { notificationModule, registerPhoneNotifications } from "./device-notifications";
import { notificationDestination } from "./booking-validation";
const tabs: { name: string; label: string; icon: Icon }[] = [{ name: "home", label: "Home", icon: "home" }, { name: "health", label: "My Health", icon: "shield-checkmark" }, { name: "chat", label: "Ask AI", icon: "sparkles-outline" }, { name: "community", label: "Community", icon: "people-outline" }, { name: "profile", label: "Profile", icon: "person-circle" }];
export function PatientApp() {
  const [reviewPages, setReviewPages] = useState(false);
  const { session, loading, error, restore, logout, preview } = useSession();
  if (loading) return <Screen title="Viruj Health"><ActivityIndicator color={colors.primary} /></Screen>;
  if (!session && error) return <Screen title="Connection unavailable"><ErrorText message={error} /><Button title="Try again" onPress={() => void restore()} /><Button title="Sign in with another account" secondary onPress={() => void logout().catch(() => {})} /></Screen>;
  if (!session) return <View style={{ flex: 1 }}><AuthScreen />{__DEV__ && process.env.EXPO_PUBLIC_ENABLE_UI_PREVIEW === "true" && <View style={{ padding: 12, backgroundColor: colors.bg }}><Button title="Sample data preview (offline)" secondary onPress={() => { setReviewPages(false); preview(); }} /><Button title="Review all web app pages" secondary onPress={() => { setReviewPages(true); preview(); }} /></View>}</View>;
  return <View style={{ flex: 1 }}>{devAuthBypass && <View style={{ padding: 8, backgroundColor: "#FEF3C7" }}><Body>Development test session · Live backend data</Body></View>}<DevicePreferencesProvider key={session.user.id} userId={session.user.id}><AccessGate>{session.user.onboardingCompleted !== true ? <Setup back={() => {}} /> : <Workspace reviewPages={reviewPages} />}</AccessGate></DevicePreferencesProvider></View>;
}
function AccessGate({ children }: { children: ReactNode }) {
  const { preferences, loading, error, access, checkingAccess, requestAccess, reload } = useDevicePreferences();
  if (loading || checkingAccess) return <Screen title="Setting up Viruj"><ActivityIndicator color={colors.primary} /></Screen>;
  if (error) return <Screen title="Setting up Viruj"><ErrorText message={error} /><Button title="Try again" onPress={reload} /></Screen>;
  if (previewEnabled) return <>{children}</>;
  if (Platform.OS === "web") return preferences.location ? <>{children}</> : <ManualLocation />;
  if (!access.notifications) return <Screen title="Allow notifications"><Body>Viruj needs phone notifications before you can continue.</Body><Button title="Try again" onPress={() => void requestAccess()} /><Button title="Open phone settings" secondary onPress={() => void Linking.openSettings()} /></Screen>;
  if (!canEnterApp(access, preferences.location)) return <ManualLocation />;
  return <>{children}</>;
}
function Workspace({ reviewPages }: { reviewPages: boolean }) {
  const { loading, error, reload } = useDevicePreferences();
  const ready = !loading && !error;
  const insets = useSafeAreaInsets(); const [tab, setTab] = useState(reviewPages ? "web-pages" : "home"); const [stack, setStack] = useState<Destination[]>([]);
  const route = stack[stack.length - 1];
  const back = () => setStack(value => value.slice(0, -1));
  const navigate = useCallback((destination: Destination) => { if (tabs.some(item => item.name === destination.name)) { setTab(destination.name); setStack([]); } else setStack(value => [...value, destination]); }, []);
  useEffect(() => {
    if (!ready || previewEnabled) return;
    let active = true;
    let removeResponse: (() => void) | undefined;
    let removeToken: (() => void) | undefined;
    const register = () => void registerPhoneNotifications().catch(() => {});
    register();
    const appState = AppState.addEventListener("change", state => { if (state === "active") register(); });
    void notificationModule().then(async notifications => {
      if (!active || !notifications) return;
      notifications.setNotificationHandler({ handleNotification: async () => ({ shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }) });
      const open = async (response: import("expo-notifications").NotificationResponse) => {
        const id = response.notification.request.content.data.notificationId;
        if (typeof id !== "string" || !id || id.length > 160) return;
        try {
          // Fetch the notification under the current account before routing a cold tap.
          const item = await api.request<{ actionUrl?: string }>(`/notifications/${encodeURIComponent(id)}`);
          if (active) { navigate(item.actionUrl ? notificationDestination(item.actionUrl) : { name: "notifications" }); await notifications.clearLastNotificationResponseAsync(); }
        } catch { if (active) navigate({ name: "notifications" }); }
      };
      const responseListener = notifications.addNotificationResponseReceivedListener(response => void open(response));
      const tokenListener = notifications.addPushTokenListener(register);
      removeResponse = () => responseListener.remove(); removeToken = () => tokenListener.remove();
      const response = await notifications.getLastNotificationResponseAsync();
      if (response && active) await open(response);
    }).catch(() => {});
    return () => { active = false; appState.remove(); removeResponse?.(); removeToken?.(); };
  }, [ready, navigate]);
  useEffect(() => { const listener = BackHandler.addEventListener("hardwareBackPress", () => { if (stack.length) { setStack(value => value.slice(0, -1)); return true; } if (tab !== "home") { setTab("home"); return true; } return false; }); return () => listener.remove(); }, [stack.length, tab]);
  if (loading) return <Screen title="Care near you"><ActivityIndicator color={colors.primary} /></Screen>;
  if (error) return <Screen title="Care near you"><ErrorText message={error} /><Button title="Try again" onPress={reload} /></Screen>;
  const name = route?.name || tab;
  let screen;
  if (__DEV__ && name === "web-pages") screen = <Screen title="Web app page review"><Body>All 25 source routes. Sample data only.</Body>{webPages.map(p => <Button key={p.path} title={p.path} secondary onPress={() => setStack(value => [...value, p.destination])} />)}</Screen>;
  else if (name === "care") screen = <Care key={`${route!.kind}/${route!.query || ""}`} kind={route!.kind!} department={route!.query} departmentPage={Boolean(route!.query)} navigate={navigate} back={back} />;
  else if (name === "detail") screen = <CareDetail key={`${route!.kind}/${route!.id}/${route!.providerId}`} kind={route!.kind!} id={route!.id!} providerId={route!.providerId} navigate={navigate} back={back} />;
  else if (name === "hospital-doctors") screen = <Care kind="doctors" hospitalId={route!.id!} back={back} navigate={navigate} />;
  else if (name === "booking") screen = <Booking key={`${route!.id}/${route!.providerId}/${route!.practiceId}`} doctorId={route!.id!} providerId={route!.providerId} initialPracticeId={route!.practiceId} back={back} complete={() => navigate({ name: "health" })} />;
  else if (name === "appointment") screen = <AppointmentDetails key={route!.id} id={route!.id!} back={back} />;
  else if (name === "notifications") screen = <Inbox back={back} navigate={navigate} />;
  else if (name === "edit-profile") screen = <EditProfile back={back} />;
  else if (name === "device-settings") screen = <ManualLocation back={back} />;
  else if (name === "feedback") screen = <Feedback back={back} />;
  else if (name === "delete-account") screen = <DeleteAccount back={back} navigate={navigate} />;
  else if (name === "department-doctors") screen = <Care kind="doctors" department={route!.query} back={back} navigate={navigate} />;
  else if (name === "profile-setup" || name === "onboarding") screen = <Setup back={back} />;
  else if (name === "public-deletion") screen = <PublicDeletion back={back} navigate={navigate} />;
  else if (name === "pathlab-placeholder") screen = <Screen title="Pathlab Details" back={back}><Body>Please select a pathlab from the list to view details.</Body></Screen>;
  else if (name === "reports") screen = <Reports back={back} />;
  else if (name === "support") screen = <Support back={back} />;
  else if (name === "privacy") screen = <Privacy navigate={navigate} back={back} />;
  else if (name === "health") screen = <Health navigate={navigate} />;
  else if (name === "chat") screen = <Chat back={() => navigate({ name: "home" })} />;
  else if (name === "community") screen = <Community />;
  else if (name === "profile") screen = <Profile navigate={navigate} />;
  else screen = <Home navigate={navigate} />;
  return <View style={{ flex: 1, backgroundColor: colors.bg }}>{screen}{!["edit-profile", "booking", "profile-setup", "onboarding", "privacy", "delete-account", "public-deletion", "chat", "web-pages", "device-settings"].includes(name) && <BlurView intensity={70} tint="light" experimentalBlurMethod="dimezisBlurView" style={{ position: "absolute", left: 16, right: 16, bottom: Math.max(insets.bottom, 16), height: 80, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#FFFFFF80", backgroundColor: "#FFFFFF66", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>{tabs.map(item => <Pressable key={item.name} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: tab === item.name }} onPress={() => navigate({ name: item.name })} style={{ flex: 1, minHeight: 64, alignItems: "center", justifyContent: "center" }}>{item.name === "chat" ? <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#EF3038", borderWidth: 2, borderColor: "#FFFFFF55", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}><Text style={{ fontFamily: "Merienda", fontSize: 18, fontWeight: "700", color: "white" }}>AI</Text></View> : <><View style={{ padding: 8, borderRadius: 12, backgroundColor: tab === item.name ? "#00000012" : "transparent" }}><Glyph name={item.icon} color={tab === item.name ? "#171717" : "#4B5563"} size={20} /></View><Text style={{ fontFamily: "Merienda", marginTop: 4, fontSize: 10, color: tab === item.name ? "#171717" : "#4B5563" }}>{item.label}</Text></>}</Pressable>)}</BlurView>}</View>;
}

