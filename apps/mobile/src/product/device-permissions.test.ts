import { expect, mock, test } from "bun:test";
import type { DevicePreferences } from "./device-preferences";

const calls: string[] = [];
let granted = true, active = true;
mock.module("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: async () => { calls.push("location"); return { granted }; },
  hasServicesEnabledAsync: async () => true,
  getCurrentPositionAsync: async () => { calls.push("position"); return { coords: { latitude: 28.6692, longitude: 77.4538 } }; },
}));
mock.module("./device-notifications", () => ({ registerPhoneNotifications: async (ask: boolean) => { calls.push(`notifications:${ask}`); throw new Error("Unconfigured Expo project"); } }));
const { requestLoginPermissions } = await import("./device-permissions");

test("login prompts once, saves GPS automatically, and tolerates denied access and push configuration errors", async () => {
  let preferences: DevicePreferences = {};
  const save = async (update: (current: DevicePreferences) => DevicePreferences) => { preferences = update(preferences); };
  await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual(["location", "notifications:true", "position"]);
  expect(preferences.location?.latitude).toBe(28.6692);
  expect(preferences.notificationsAsked).toBe(true);
  calls.length = 0;
  await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual([]);

  granted = false; preferences = {};
  await requestLoginPermissions(preferences, save, () => active);
  expect(preferences.location).toBeUndefined();
  expect(preferences.locationAsked).toBe(true);
  expect(preferences.notificationsAsked).toBe(true);

  calls.length = 0; granted = true; preferences = {}; active = false;
  await requestLoginPermissions(preferences, save, () => active);
  expect(calls).toEqual(["location"]);
  expect(preferences).toEqual({});
});
