import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AppState, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { previewEnabled } from "./preview";
import { isDiscoveryPath, nearbyPath, validSavedLocation, type SavedLocation } from "./device-location";
import { requestLoginPermissions, type DeviceAccess } from "./device-permissions";
export type { SavedLocation } from "./device-location";

export type DevicePreferences = { location?: SavedLocation; locationAsked?: boolean; notificationsAsked?: boolean };
type State = { preferences: DevicePreferences; loading: boolean; error: string; access: DeviceAccess; checkingAccess: boolean; requestAccess(): Promise<void>; save(value: DevicePreferences | ((current: DevicePreferences) => DevicePreferences)): Promise<void>; reload(): void };
const Context = createContext<State | null>(null);
function storageKey(userId: string) { return `viruj.preferences.${userId.split("").map(c => c.charCodeAt(0).toString(16)).join("-")}`; }
export function DevicePreferencesProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [preferences, setPreferences] = useState<DevicePreferences>({});
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [access, setAccess] = useState<DeviceAccess>({ location: false, notifications: false });
  const [checkingAccess, setCheckingAccess] = useState(true);
  const latest = useRef(preferences), checking = useRef(false);
  latest.current = preferences;
  const key = storageKey(userId);
  useEffect(() => {
    let active = true;
    setLoading(true);
    void (async () => {
      try {
        const raw = Platform.OS === "web" ? localStorage.getItem(key) : await SecureStore.getItemAsync(key);
        const stored: DevicePreferences = raw ? JSON.parse(raw) : {};
        const value = { ...stored, location: validSavedLocation(stored?.location) ? stored.location : undefined };
        if (previewEnabled && !value.location) value.location = { latitude: 28.6692, longitude: 77.4538, radiusKm: 10, label: "Ghaziabad · sample location" };
        if (active) { setPreferences(value); setError(""); if (Platform.OS === "web" || previewEnabled) setCheckingAccess(false); }
      } catch { if (active) setError("Could not load your saved preferences. Please try again."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [key, version]);
  useEffect(() => {
    if (loading || error || Platform.OS === "web" || previewEnabled) return;
    let active = true;
    void requestAccess(true, () => active).catch(() => {});
    const listener = AppState.addEventListener("change", state => { if (state === "active" && active) void requestAccess(false, () => active).catch(() => {}); });
    return () => { active = false; listener.remove(); };
  }, [loading, error]);
  async function requestAccess(ask = true, active = () => true) {
    if (checking.current || loading || error || Platform.OS === "web" || previewEnabled) return;
    checking.current = true; setCheckingAccess(true);
    try { const next = await requestLoginPermissions(latest.current, save, active, ask); if (active()) setAccess(next); }
    catch { if (active()) setAccess({ location: false, notifications: false }); }
    finally { checking.current = false; if (active()) setCheckingAccess(false); }
  }
  async function save(update: DevicePreferences | ((current: DevicePreferences) => DevicePreferences)) {
    const value = typeof update === "function" ? update(latest.current) : update;
    if (value.location && !validSavedLocation(value.location)) throw new Error("Choose a valid location and radius.");
    const raw = JSON.stringify(value);
    if (Platform.OS === "web") localStorage.setItem(key, raw);
    else await SecureStore.setItemAsync(key, raw);
    latest.current = value; setPreferences(value);
  }
  return <Context.Provider value={{ preferences, loading, error, access, checkingAccess, requestAccess, save, reload: () => setVersion(v => v + 1) }}>{children}</Context.Provider>;
}
export function useDevicePreferences() { const value = useContext(Context); if (!value) throw new Error("Device preferences provider missing"); return value; }
export function useDiscoveryPath(path: string) {
  const state = useContext(Context);
  return isDiscoveryPath(path) && state ? state.preferences.location ? nearbyPath(path, state.preferences.location) : null : path;
}
