import { expect, mock, test } from "bun:test";
import type { DevicePreferences } from "./device-preferences";

const calls: string[] = [];
let locationGranted = false, notificationsGranted = false, active = true;
mock.module("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  getForegroundPermissionsAsync: async () => ({ granted: locationGranted, canAskAgain: true }),
  requestForegroundPermissionsAsync: async () => { calls.push("location prompt"); return { granted: locationGranted, canAskAgain: true }; },
  hasServicesEnabledAsync: async () => true,
  getCurrentPositionAsync: async () => { calls.push("position"); return { coords: { latitude: 28.6692, longitude: 77.4538 } }; },
}));
mock.module("./device-notifications", () => ({
  notificationModule: async () => ({
    IosAuthorizationStatus: { PROVISIONAL: 3 },
    getPermissionsAsync: async () => ({ granted: notificationsGranted, canAskAgain: true }),
    requestPermissionsAsync: async () => { calls.push("notification prompt"); return { granted: notificationsGranted, canAskAgain: true }; },
  }),
}));
const { requestLoginPermissions, canEnterApp } = await import("./device-permissions");

test("Home requires both actual grants and saved coordinates, including after access is revoked", async () => {
  let preferences: DevicePreferences = {};
  const save = async (update: (current: DevicePreferences) => DevicePreferences) => { preferences = update(preferences); };
  let access = await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual(["location prompt", "notification prompt"]);
  expect(canEnterApp(access, preferences.location)).toBe(false);

  calls.length = 0; locationGranted = true; notificationsGranted = true;
  access = await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual(["position"]);
  expect(canEnterApp(access, preferences.location)).toBe(true);

  notificationsGranted = false;
  access = await requestLoginPermissions(preferences, save, () => active, false);
  expect(canEnterApp(access, preferences.location)).toBe(false);
  notificationsGranted = true; locationGranted = false;
  access = await requestLoginPermissions(preferences, save, () => active, false);
  expect(canEnterApp(access, preferences.location)).toBe(false);

  calls.length = 0; active = false;
  access = await requestLoginPermissions({}, save, () => active);
  expect(calls).toEqual(["location prompt"]);
  expect(canEnterApp(access, preferences.location)).toBe(false);
});
