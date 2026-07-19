import type { AuthSession } from "../features/auth/api/auth.types";
import { authStorage } from "../features/auth/services/auth-storage.service";
import { getOrCreateInstallationId } from "../features/auth/services/device.service";
import { createAuthApiError } from "../features/auth/utils/auth-errors";
import { validateApiBaseUrl } from "./env";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  retry?: boolean;
};

type ApiClientOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
  storage?: Pick<
    typeof authStorage,
    "getRefreshToken" | "setRefreshToken" | "clearAuthStorage"
  >;
  getDeviceId?: () => Promise<string>;
  onSessionRefreshed?: (session: AuthSession) => void;
  onAuthFailed?: () => void;
};

let accessToken: string | null = null;
let refreshPromise: Promise<AuthSession> | null = null;
let authFailureHandler: (() => void) | null = null;
let sessionRefreshedHandler: ((session: AuthSession) => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setAuthFailureHandler(handler: (() => void) | null) {
  authFailureHandler = handler;
}

export function setSessionRefreshedHandler(
  handler: ((session: AuthSession) => void) | null
) {
  sessionRefreshedHandler = handler;
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readErrorCode(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const body = payload as Record<string, unknown>;
  return String(body.code || body.errorCode || body.error || "") || undefined;
}

export function createApiClient({
  baseUrl = validateApiBaseUrl(),
  fetcher = fetch,
  storage = authStorage,
  getDeviceId = getOrCreateInstallationId,
  onSessionRefreshed,
  onAuthFailed,
}: ApiClientOptions = {}) {
  async function refreshSession(): Promise<AuthSession> {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = await storage.getRefreshToken();

        if (!refreshToken) {
          throw createAuthApiError({ code: "AUTH_INVALID_REFRESH_TOKEN", status: 401 });
        }

        const deviceId = await getDeviceId();
        const response = await fetcher(`${baseUrl}/api/mobile/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken, deviceId }),
        });
        const payload = await parseResponse(response);

        if (!response.ok) {
          throw createAuthApiError({
            code: readErrorCode(payload) || "AUTH_INVALID_REFRESH_TOKEN",
            status: response.status,
          });
        }

        const session = payload as AuthSession;
        await storage.setRefreshToken(session.refreshToken);
        setAccessToken(session.accessToken);
        onSessionRefreshed?.(session);
        sessionRefreshedHandler?.(session);
        return session;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  }

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (options.auth && accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetcher(`${baseUrl}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const payload = await parseResponse(response);

    if (response.status === 401 && options.auth && options.retry !== false) {
      try {
        await refreshSession();
        return request<T>(path, { ...options, retry: false });
      } catch (error) {
        await storage.clearAuthStorage();
        setAccessToken(null);
        onAuthFailed?.();
        authFailureHandler?.();
        throw error;
      }
    }

    if (!response.ok) {
      throw createAuthApiError({
        code: readErrorCode(payload),
        status: response.status,
      });
    }

    return payload as T;
  }

  return {
    request,
    refreshSession,
  };
}

export const apiClient = createApiClient();
