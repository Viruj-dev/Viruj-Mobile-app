import { createAuthApiError } from "../features/auth/utils/auth-errors";

const DEFAULT_API_BASE_URL = "https://api.virujhealth.com";
const LOCAL_WEB_API_BASE_URL = "http://localhost:4000";

function isLocalWebPreview(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

  if (isDev && isLocalWebPreview()) {
    return LOCAL_WEB_API_BASE_URL;
  }

  return DEFAULT_API_BASE_URL;
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
