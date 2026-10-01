import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { previewEnabled } from "./preview";

export type SavedLocation = { latitude: number; longitude: number; label: string; radiusKm: number };
export type DevicePreferences = { location?: SavedLocation; notificationsAsked?: boolean; haptics?: boolean };
export let hapticsEnabled = true;
type State = { preferences: DevicePreferences; loading: boolean; error: string; save(value: DevicePreferences): Promise<void>; reload(): void };
const Context = createContext<State | null>(null);
function storageKey(userId: string) { return `viruj.preferences.${userId.split("").map(c => c.charCodeAt(0).toString(16)).join("-")}`; }
export function validSavedLocation(value: unknown): value is SavedLocation {
  const point = value as SavedLocation | null;
  return !!point && typeof point.latitude === "number" && Number.isFinite(point.latitude) && Math.abs(point.latitude) <= 90 && typeof point.longitude === "number" && Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180 && typeof point.label === "string" && point.label.trim().length > 0 && Number.isFinite(point.radiusKm) && point.radiusKm >= 1 && point.radiusKm <= 100;
}
export function DevicePreferencesProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [preferences, setPreferences] = useState<DevicePreferences>({});
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [version, setVersion] = useState(0);
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
        if (active) { setPreferences(value); hapticsEnabled = value.haptics !== false; setError(""); }
      } catch { if (active) setError("Could not load your saved preferences. Please try again."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; hapticsEnabled = true; };
  }, [key, version]);
  async function save(value: DevicePreferences) {
    if (value.location && !validSavedLocation(value.location)) throw new Error("Choose a valid location and radius.");
    const raw = JSON.stringify(value);
    if (Platform.OS === "web") localStorage.setItem(key, raw);
    else await SecureStore.setItemAsync(key, raw);
    setPreferences(value); hapticsEnabled = value.haptics !== false;
  }
  return <Context.Provider value={{ preferences, loading, error, save, reload: () => setVersion(v => v + 1) }}>{children}</Context.Provider>;
}
export function useDevicePreferences() { const value = useContext(Context); if (!value) throw new Error("Device preferences provider missing"); return value; }
export function nearbyPath(path: string, location?: SavedLocation) {
  if (!location) return path;
  return `${path}${path.includes("?") ? "&" : "?"}latitude=${location.latitude}&longitude=${location.longitude}&radiusKm=${location.radiusKm}`;
}
export function useDiscoveryPath(path: string) {
  const state = useContext(Context);
  const discovery = /^\/(?:doctors(?:\?|$)|hospitals(?:\?|$|\/[^/]+\/(?:doctors|departments)(?:\?|$))|clinics(?:\?|$)|departments\/[^/]+\/doctors(?:\?|$)|search(?:\?|$)|providers(?:\?|$))/.test(path);
  return discovery ? nearbyPath(path, state?.preferences.location) : path;
}
