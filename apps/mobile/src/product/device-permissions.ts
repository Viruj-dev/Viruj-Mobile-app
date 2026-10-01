import * as Location from "expo-location";
import { registerPhoneNotifications } from "./device-notifications";
import type { DevicePreferences } from "./device-preferences";

export async function requestLoginPermissions(preferences: DevicePreferences, save: (update: (current: DevicePreferences) => DevicePreferences) => Promise<void>, active: () => boolean) {
  let locationGranted = false;
  if (!preferences.location && !preferences.locationAsked) {
    try { locationGranted = (await Location.requestForegroundPermissionsAsync()).granted; } catch { /* Manual location remains available in settings. */ }
  }
  if (!active()) return;
  if (!preferences.notificationsAsked) {
    try { await registerPhoneNotifications(true); } catch { /* Retry registration on resume; permission choice is still recorded. */ }
  }
  if (!active()) return;
  await save(current => ({ ...current, locationAsked: true, notificationsAsked: true }));
  if (!locationGranted || !active()) return;
  try {
    if (!await Location.hasServicesEnabledAsync()) return;
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    if (active()) await save(current => current.location ? current : { ...current, location: { latitude: position.coords.latitude, longitude: position.coords.longitude, radiusKm: 10, label: "Saved current location" } });
  } catch { /* Login remains usable if GPS is unavailable. */ }
}
