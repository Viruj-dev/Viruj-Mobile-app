export type SavedLocation = { latitude: number; longitude: number; label: string; radiusKm: number };
export function validSavedLocation(value: unknown): value is SavedLocation {
  const point = value as SavedLocation | null;
  return !!point && typeof point.latitude === "number" && Number.isFinite(point.latitude) && Math.abs(point.latitude) <= 90 && typeof point.longitude === "number" && Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180 && typeof point.label === "string" && point.label.trim().length > 0 && Number.isFinite(point.radiusKm) && point.radiusKm >= 1 && point.radiusKm <= 100;
}
export function isDiscoveryPath(path: string) {
  return /^\/(?:doctors(?:\?|$)|hospitals(?:\?|$|\/[^/]+\/(?:doctors|departments)(?:\?|$))|clinics(?:\?|$)|departments\/[^/]+\/doctors(?:\?|$)|search(?:\?|$)|providers(?:\?|$))/.test(path);
}
export function nearbyPath(path: string, location?: SavedLocation) {
  if (!location) return path;
  return `${path}${path.includes("?") ? "&" : "?"}latitude=${location.latitude}&longitude=${location.longitude}&radiusKm=${location.radiusKm}`;
}
