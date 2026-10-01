import { expect, mock, spyOn, test } from "bun:test";
import { createApiClient, getAccessToken, setAccessToken } from "../lib/api-client";
import { authStorage, createAuthStorage } from "../features/auth/services/auth-storage.service";
import * as authApi from "../features/auth/api/auth.api";
import { apiClient } from "../lib/api-client";
import * as device from "../features/auth/services/device.service";

test("booking rejection preserves the backend reason without exposing server failures", async () => {
  for (const [status, expected] of [[422, "Choose a valid future appointment interval"], [409, "Provider already has an active appointment for this slot"], [500, "Something went wrong. Please try again."]] as const) {
    const message = status === 422 ? "Choose a valid future appointment interval" : status === 409 ? "Provider already has an active appointment for this slot" : "private database details";
    const client = createApiClient({ baseUrl: "https://backend.test", fetcher: (async () => Response.json({ error: status === 409 ? "conflict" : "validation_error", message }, { status })) as unknown as typeof fetch });
    await expect(client.request("/api/mobile/appointments", { method: "POST", body: {} })).rejects.toThrow(expected);
  }
});

test("requests work when React Native lacks AbortSignal.timeout", async () => {
  const original = Object.getOwnPropertyDescriptor(AbortSignal, "timeout");
  Object.defineProperty(AbortSignal, "timeout", { value: undefined, configurable: true });
  try {
    const fetcher = mock(async (_url: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return Response.json({ success: true, data: { ok: true } });
    });
    const client = createApiClient({ baseUrl: "https://backend.test", fetcher: fetcher as unknown as typeof fetch });
    expect(await client.request<{ ok: boolean }>("/api/mobile/auth/provider-session")).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  } finally {
    if (original) Object.defineProperty(AbortSignal, "timeout", original);
  }
});

test("logout submits the device-bound refresh token to viruj-backend", async () => {
  const token = spyOn(authStorage, "getRefreshToken").mockResolvedValue("refresh-token");
  const installation = spyOn(device, "getOrCreateInstallationId").mockResolvedValue("device-id");
  const request = spyOn(apiClient, "request").mockResolvedValue(undefined);
  try {
    await authApi.logout();
    expect(request).toHaveBeenCalledWith("/api/mobile/auth/logout", { method: "POST", body: { refreshToken: "refresh-token", deviceId: "device-id" } });
  } finally { token.mockRestore(); installation.mockRestore(); request.mockRestore(); }
});

test("temporary refresh outage preserves the stored session", async () => {
  const values = new Map([["viruj.auth.refreshToken", "refresh-old"]]);
  const storage = createAuthStorage({ getItemAsync: async key => values.get(key) ?? null, setItemAsync: async (key, value) => { values.set(key, value); }, deleteItemAsync: async key => { values.delete(key); } });
  setAccessToken("access-old");
  const client = createApiClient({ baseUrl: "https://backend.test", storage, getDeviceId: async () => "device-id", fetcher: (async url => String(url).endsWith("refresh-token") ? Response.json({}, { status: 503 }) : Response.json({}, { status: 401 })) as typeof fetch });
  try {
    await expect(client.request("/api/mobile/me", { auth: true })).rejects.toThrow();
    expect(await storage.getRefreshToken()).toBe("refresh-old");
    expect(getAccessToken()).toBe("access-old");
  } finally { setAccessToken(null); }
});

test("a late refresh response cannot restore tokens after logout", async () => {
  let respond!: (response: Response) => void;
  let started!: () => void;
  const ready = new Promise<void>(resolve => { started = resolve; });
  const save = mock(async (_value: string) => {});
  const client = createApiClient({ baseUrl: "https://backend.test", storage: { getRefreshToken: async () => "refresh-old", setRefreshToken: save, clearAuthStorage: async () => {} }, getDeviceId: async () => "device-id", fetcher: (async () => { started(); return new Promise<Response>(resolve => { respond = resolve; }); }) as unknown as typeof fetch });
  setAccessToken("access-old");
  const refreshing = client.refreshSession();
  await ready;
  setAccessToken(null);
  respond(Response.json({ success: true, data: { accessToken: "access-new", refreshToken: "refresh-new" } }));
  await expect(refreshing).rejects.toThrow();
  expect(save).not.toHaveBeenCalled();
  expect(getAccessToken()).toBeNull();
});

