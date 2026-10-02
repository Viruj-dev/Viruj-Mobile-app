import { expect, mock, test } from "bun:test";
import type { DevicePreferences } from "./device-preferences";

const calls: string[] = [];
let locationGranted = false, notificationsGranted = false, active = true;
mock.module("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  getForegroundPermissionsAsync: async () => ({ granted: locationGranted, canAskAgain: true }),
  requestForegroundPermissionsAsync: async () => { calls.push("location prompt"); return { granted: locationGranted, canAskAgain: true }; },
  hasServicesEnabledAsync: async () => true,
  getLastKnownPositionAsync: async () => { calls.push("last known position"); return { coords: { latitude: 28.6692, longitude: 77.4538 } }; },
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

test("allowed GPS saves 50 km automatically; denied GPS accepts a manually saved place", async () => {
  let preferences: DevicePreferences = {};
  const save = async (update: (current: DevicePreferences) => DevicePreferences) => { preferences = update(preferences); };
  let access = await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual(["location prompt", "notification prompt"]);
  expect(canEnterApp(access, preferences.location)).toBe(false);

  calls.length = 0; locationGranted = true; notificationsGranted = true;
  access = await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual(["last known position"]);
  expect(preferences.location?.radiusKm).toBe(50);
  expect(canEnterApp(access, preferences.location)).toBe(true);

  notificationsGranted = false;
  access = await requestLoginPermissions(preferences, save, () => active, false);
  expect(canEnterApp(access, preferences.location)).toBe(false);
  notificationsGranted = true; locationGranted = false;
  access = await requestLoginPermissions(preferences, save, () => active, false);
  expect(canEnterApp(access, preferences.location)).toBe(true);
  preferences = { ...preferences, location: undefined };
  expect(canEnterApp(access, preferences.location)).toBe(false);
  await save(current => ({ ...current, location: { latitude: 28.6, longitude: 77.4, label: "Manual Delhi", radiusKm: 50 } }));
  expect(canEnterApp(access, preferences.location)).toBe(true);

  calls.length = 0; active = false;
  access = await requestLoginPermissions({}, save, () => active);
  expect(calls).toEqual(["location prompt"]);
  expect(canEnterApp(access, preferences.location)).toBe(false);
});
