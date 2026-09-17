import type { AuthSession } from "../features/auth/api/auth.types";
import { authStorage } from "../features/auth/services/auth-storage.service";
import { getOrCreateInstallationId } from "../features/auth/services/device.service";
import { createAuthApiError } from "../features/auth/utils/auth-errors";
import { validateApiBaseUrl } from "./env";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  retry?: boolean;
  binary?: boolean;
  unwrap?: boolean;
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
let sessionGeneration = 0;
let authFailureHandler: (() => void) | null = null;
let sessionRefreshedHandler: ((session: AuthSession) => void) | null = null;

export function setAccessToken(token: string | null) {
  sessionGeneration++;
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

function unwrapPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const body = payload as Record<string, unknown>;

  if (body.success === true && "data" in body) {
    return body.data;
  }

  return payload;
}
function createNetworkError(error: unknown) {
  return createAuthApiError({
    code: "NETWORK_ERROR",
    message: error instanceof Error ? `Cannot reach the Viruj API: ${error.message}` : undefined,
  });
}

async function sendRequest(fetcher: typeof fetch, input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetcher(input, init);
  } catch (error) {
    throw createNetworkError(error);
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
  let refreshPromise: Promise<AuthSession> | null = null;
  async function refreshSession(): Promise<AuthSession> {
    if (!refreshPromise) {
      const generation = sessionGeneration;
      refreshPromise = (async () => {
        const refreshToken = await storage.getRefreshToken();

        if (!refreshToken) {
          throw createAuthApiError({ code: "AUTH_INVALID_REFRESH_TOKEN", status: 401 });
        }

        const deviceId = await getDeviceId();
        const response = await sendRequest(fetcher, `${baseUrl}/api/mobile/auth/refresh-token`, {
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

        const session = unwrapPayload(payload) as AuthSession;
        if (generation !== sessionGeneration) throw createAuthApiError({ code: "AUTH_UNAUTHORIZED", status: 401 });
        if (!session?.accessToken || !session.refreshToken) throw createAuthApiError({ code: "UNKNOWN", status: 502 });
        await storage.setRefreshToken(session.refreshToken);
        if (generation !== sessionGeneration) { await storage.clearAuthStorage(); throw createAuthApiError({ code: "AUTH_UNAUTHORIZED", status: 401 }); }
        accessToken = session.accessToken;
        // Refresh returns tokens only; load the safe user shape before notifying consumers.
        const state = await request<{ user: AuthSession["user"]; requiresOnboarding: boolean }>("/api/mobile/auth/session", { auth: true, retry: false });
        Object.assign(session, state);
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
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("..")) throw new Error("Invalid API path");
    const generation = sessionGeneration;
    const headers = new Headers(options.headers);
    const multipart = typeof FormData !== "undefined" && options.body instanceof FormData;
    if (options.body !== undefined && !multipart) {
      headers.set("Content-Type", "application/json");
    }

    if (options.auth && accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await sendRequest(fetcher, `${baseUrl}${path}`, {
      ...options,
      headers,
      credentials: "omit",
      signal: options.signal ?? AbortSignal.timeout(path.includes("/ai/") ? 90_000 : 20_000),
      body: options.body === undefined ? undefined : multipart ? options.body as FormData : JSON.stringify(options.body),
    });
    const payload = options.binary && response.ok ? await response.arrayBuffer() : await parseResponse(response);
    if (options.auth && generation !== sessionGeneration) throw createAuthApiError({ code: "AUTH_UNAUTHORIZED", status: 401 });

    if (response.status === 401 && options.auth && options.retry !== false) {
      try {
        await refreshSession();
        return request<T>(path, { ...options, retry: false });
      } catch (error) {
        const status = (error as { status?: number }).status;
        if ((status === 401 || status === 403) && generation === sessionGeneration) {
          setAccessToken(null);
          await storage.clearAuthStorage();
          onAuthFailed?.();
          authFailureHandler?.();
        }
        throw error;
      }
    }

    if (!response.ok) {
      throw createAuthApiError({
        code: readErrorCode(payload),
        status: response.status,
      });
    }

    return (options.unwrap === false ? payload : unwrapPayload(payload)) as T;
  }

  return {
    request,
    refreshSession,
  };
}

export const apiClient = createApiClient();
