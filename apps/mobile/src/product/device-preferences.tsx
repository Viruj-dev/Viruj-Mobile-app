import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { previewEnabled } from "./preview";
import { isDiscoveryPath, nearbyPath, validSavedLocation, type SavedLocation } from "./device-location";
export type { SavedLocation } from "./device-location";

export type DevicePreferences = { location?: SavedLocation; notificationsAsked?: boolean; haptics?: boolean };
export let hapticsEnabled = true;
type State = { preferences: DevicePreferences; loading: boolean; error: string; save(value: DevicePreferences): Promise<void>; reload(): void };
const Context = createContext<State | null>(null);
function storageKey(userId: string) { return `viruj.preferences.${userId.split("").map(c => c.charCodeAt(0).toString(16)).join("-")}`; }
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
export function useDiscoveryPath(path: string) {
  const state = useContext(Context);
  return isDiscoveryPath(path) ? nearbyPath(path, state?.preferences.location) : path;
}
