import type { DeviceInfo } from "../api/auth.types";
import { authStorage } from "./auth-storage.service";

type InstallationStorage = Pick<
  typeof authStorage,
  "getInstallationId" | "setInstallationId"
>;

export async function getOrCreateInstallationId(
  storage: InstallationStorage = authStorage
): Promise<string> {
  const existing = await storage.getInstallationId();

  if (existing) {
    return existing;
  }

  const Crypto = await import("expo-crypto");
  const installationId = Crypto.randomUUID();
  await storage.setInstallationId(installationId);
  return installationId;
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const Constants = (await import("expo-constants")).default;
  const { Platform } = await import("react-native");
  const platform = Platform.OS === "ios" || Platform.OS === "web" ? Platform.OS : "android";

  return {
    deviceId: await getOrCreateInstallationId(),
    platform,
    deviceName: Constants.deviceName || "Viruj mobile app",
    appVersion: Constants.expoConfig?.version || "1.0.0",
  };
}