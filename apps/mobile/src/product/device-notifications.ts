import { Platform } from "react-native";
import Constants from "expo-constants";
import { api } from "./api";
import { getOrCreateInstallationId } from "../features/auth/services/device.service";
import { previewEnabled } from "./preview";

export const nativePushSupported = Platform.OS !== "web" && Constants.executionEnvironment !== "storeClient";
// Lazy import keeps web and Expo Go previews usable without native push support.
export async function notificationModule() {
  if (!nativePushSupported) return null;
  return import("expo-notifications");
}
export async function registerPhoneNotifications(requestPermission = false) {
  if (previewEnabled) return "Sample preview: phone notifications are unavailable.";
  const notifications = await notificationModule();
  if (!notifications) return "Phone notifications require the installed Viruj app.";
  if (Platform.OS === "android") await notifications.setNotificationChannelAsync("important", { name: "Important updates", importance: notifications.AndroidImportance.HIGH, vibrationPattern: [0, 200, 100, 200], lockscreenVisibility: notifications.AndroidNotificationVisibility.PRIVATE });
  let permission = await notifications.getPermissionsAsync();
  if (!permission.granted && requestPermission && permission.canAskAgain) permission = await notifications.requestPermissionsAsync();
  if (!permission.granted && permission.ios?.status !== notifications.IosAuthorizationStatus.PROVISIONAL) {
    await unregisterPhoneNotifications();
    return "Notifications are off. You can enable them in your phone settings.";
  }
  const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  if (!projectId) throw new Error("Phone alerts need the Expo project configured in this app build.");
  const token = (await notifications.getExpoPushTokenAsync({ projectId })).data;
  await api.request("/push-devices", { method: "POST", body: { installationId: await getOrCreateInstallationId(), token } });
  return "Phone notifications are enabled.";
}
export async function unregisterPhoneNotifications() {
  if (!nativePushSupported || previewEnabled) return;
  await api.request("/push-devices", { method: "DELETE", body: { installationId: await getOrCreateInstallationId() } });
}
