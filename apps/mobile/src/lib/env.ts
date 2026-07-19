import { createAuthApiError } from "../features/auth/utils/auth-errors";

const DEFAULT_API_BASE_URL = "https://api.virujhealth.com";

export function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function validateApiBaseUrl(baseUrl = getApiBaseUrl()): string {
  try {
    const parsed = new URL(baseUrl);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    throw createAuthApiError({
      code: "UNKNOWN",
      message: "Invalid API base URL. Check EXPO_PUBLIC_API_BASE_URL.",
    });
  }
}
