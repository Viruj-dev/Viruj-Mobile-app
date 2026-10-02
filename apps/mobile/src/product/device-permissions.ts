import * as Location from "expo-location";
import { notificationModule } from "./device-notifications";
import type { DevicePreferences } from "./device-preferences";
import { validSavedLocation, type SavedLocation } from "./device-location";

export type DeviceAccess = { location: boolean; notifications: boolean };
export function canEnterApp(access: DeviceAccess, location?: SavedLocation) { return access.notifications && validSavedLocation(location); }

export async function requestLoginPermissions(
  preferences: DevicePreferences,
  save: (update: (current: DevicePreferences) => DevicePreferences) => Promise<void>,
  active: () => boolean,
  ask = true,
): Promise<DeviceAccess> {
  let location = await Location.getForegroundPermissionsAsync();
  if (!location.granted && ask && location.canAskAgain) location = await Location.requestForegroundPermissionsAsync();
  if (!active()) return { location: false, notifications: false };

  const notifications = await notificationModule();
  let notificationPermission = await notifications?.getPermissionsAsync();
  if (notifications && notificationPermission && !notificationPermission.granted && ask && notificationPermission.canAskAgain) {
    notificationPermission = await notifications.requestPermissionsAsync();
  }
  const grantedNotifications = !!notificationPermission && (notificationPermission.granted || notificationPermission.ios?.status === notifications?.IosAuthorizationStatus.PROVISIONAL);
  if (!active()) return { location: false, notifications: false };
  await save(current => ({ ...current, locationAsked: true, notificationsAsked: true }));

  if (location.granted && (ask || !preferences.location)) {
    try {
      if (await Location.hasServicesEnabledAsync()) {
        const position = await Location.getLastKnownPositionAsync({ maxAge: 300000, requiredAccuracy: 5000 }) ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (active()) await save(current => ({ ...current, location: { latitude: position.coords.latitude, longitude: position.coords.longitude, radiusKm: 50, label: "Current location" } }));
      }
    } catch { /* Stay on the access screen until a usable location is saved. */ }
  }
  return { location: location.granted, notifications: grantedNotifications };
}
