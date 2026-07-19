import { createAuthApiError } from "../features/auth/utils/auth-errors";

const DEFAULT_API_BASE_URL = "https://api.virujhealth.com";
const LOCAL_WEB_API_BASE_URL = "http://localhost:4000";
const LOCAL_API_PORT = "4000";

type ExpoConstants = {
  expoConfig?: { hostUri?: string } | null;
  platform?: { hostUri?: string } | null;
};

function isLocalWebPreview(): boolean {
  const hostname = typeof window === "undefined" ? undefined : window.location?.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function getExpoHostUri(): string | undefined {
  try {
    const mod = require("expo-constants") as { default?: ExpoConstants } & ExpoConstants;
    const constants = mod.default ?? mod;
    return constants.expoConfig?.hostUri ?? constants.platform?.hostUri;
  } catch {
    return undefined;
  }
}

function getHostFromUri(hostUri?: string): string | undefined {
  const host = hostUri?.split(":")[0];

  if (!host || host === "localhost" || host === "127.0.0.1") {
    return undefined;
  }

  return host;
}

export function getApiBaseUrl(expoHostUri = getExpoHostUri()): string {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

  if (isDev && isLocalWebPreview()) {
    return LOCAL_WEB_API_BASE_URL;
  }

  const expoDevHost = isDev ? getHostFromUri(expoHostUri) : undefined;
  if (expoDevHost) {
    return `http://${expoDevHost}:${LOCAL_API_PORT}`;
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
