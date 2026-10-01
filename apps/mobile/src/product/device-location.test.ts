import { expect, test } from "bun:test";
import { isDiscoveryPath, nearbyPath, validSavedLocation } from "./device-location";

test("saved location validates boundaries and scopes every discovery path without changing owned health resources", () => {
  const location = { latitude: 28.6692, longitude: 77.4538, label: "Ghaziabad", radiusKm: 10 };
  expect(validSavedLocation(location)).toBe(true);
  expect(validSavedLocation({ ...location, latitude: 0, longitude: 0 })).toBe(true);
  for (const invalid of [null, {}, { ...location, latitude: 91 }, { ...location, longitude: Infinity }, { ...location, latitude: "28" }, { ...location, radiusKm: 0 }, { ...location, label: " " }]) expect(validSavedLocation(invalid)).toBe(false);
  for (const path of ["/doctors?limit=4", "/hospitals?page=2", "/clinics", "/search?q=ent", "/departments/ent/doctors", "/hospitals/123/doctors", "/hospitals/123/departments", "/providers"]) {
    expect(isDiscoveryPath(path)).toBe(true);
    const url = new URL(nearbyPath(path, location), "https://test.invalid");
    expect(url.searchParams.get("latitude")).toBe("28.6692");
    expect(url.searchParams.get("radiusKm")).toBe("10");
  }
  for (const path of ["/doctors/1", "/hospitals/123", "/appointments", "/appointments/1/arrival-otp", "/notifications", "/users/1"]) expect(isDiscoveryPath(path)).toBe(false);
  expect(nearbyPath("/doctors")).toBe("/doctors");
});
