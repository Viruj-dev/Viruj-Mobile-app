/// <reference types="bun-types" />
import { describe, expect, mock, test } from "bun:test";
import { createApiClient, getAccessToken, setAccessToken } from "../lib/api-client";
import { createAuthStorage } from "../features/auth/services/auth-storage.service";
import { getMobileAuthPlatform, getOrCreateInstallationId } from "../features/auth/services/device.service";
import { authReducer, initialAuthState } from "../features/auth/state/auth.reducer";
import { selectRootRoute } from "../navigation/routes";
import {
  formatIndianMobile,
  isValidIndianMobile,
  maskPhoneNumber,
  normalizeIndianPhoneNumber,
} from "../features/auth/utils/phone-number";
import {
  getAuthErrorMessage,
  shouldShowDevelopmentOtp,
} from "../features/auth/utils/auth-errors";
import { formatCountdown, nextCountdown } from "../features/auth/utils/countdown";
import { getApiBaseUrl } from "../lib/env";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItemAsync: mock(async (key: string) => store.get(key) ?? null),
    setItemAsync: mock(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: mock(async (key: string) => {
      store.delete(key);
    }),
    store,
  };
}

const session = {
  accessToken: "access-2",
  refreshToken: "refresh-2",
  user: { id: "u1", phoneNumber: "+919876543210" },
  requiresOnboarding: false,
};

describe("phone number utilities", () => {
  test("validates and normalizes Indian mobile numbers", () => {
    expect(isValidIndianMobile("98765 43210")).toBe(true);
    expect(isValidIndianMobile("12345 43210")).toBe(false);
    expect(normalizeIndianPhoneNumber("+91 98765 43210")).toBe("+919876543210");
  });

  test("formats and masks phone numbers", () => {
    expect(formatIndianMobile("9876543210")).toBe("98765 43210");
    expect(maskPhoneNumber("+919876543210")).toBe("+91 ***** 3210");
  });
});

describe("otp state helpers", () => {
  test("stores OTP request state", () => {
    const state = authReducer(initialAuthState, {
      type: "OTP_REQUESTED",
      challenge: {
        phoneNumber: "+919876543210",
        challengeId: "c1",
        expiresInSeconds: 300,
        retryAfterSeconds: 30,
      },
    });

    expect(state.challenge?.challengeId).toBe("c1");
    expect(state.status).toBe("unauthenticated");
  });

  test("routes verification success from backend onboarding state", () => {
    const state = authReducer(initialAuthState, {
      type: "AUTHENTICATED",
      session: { ...session, requiresOnboarding: true },
    });

    expect(state.status).toBe("requiresOnboarding");
  });

  test("maps backend snake_case OTP errors", () => {
    expect(getAuthErrorMessage("otp_request_cooldown")).toBe(
      "Too many OTP requests. Please wait before trying again."
    );
    expect(getAuthErrorMessage("otp_challenge_consumed")).toBe(
      "That code has already been used. Request a new one."
    );
  });

  test("keeps generic backend validation errors generic", () => {
    expect(getAuthErrorMessage("invalid_request")).toBe(
      "Something went wrong. Please try again."
    );
  });
  test("keeps verification failures user-safe", () => {
    expect(getAuthErrorMessage("OTP_INVALID")).toBe("The code you entered is incorrect.");
    expect(getAuthErrorMessage("OTP_EXPIRED")).toBe("That code has expired. Request a new one.");
    expect(getAuthErrorMessage("OTP_RATE_LIMITED")).toBe(
      "Too many OTP requests. Please wait before trying again."
    );
  });

  test("guards development OTP visibility", () => {
    expect(shouldShowDevelopmentOtp(true, "482913")).toBe(true);
    expect(shouldShowDevelopmentOtp(false, "482913")).toBe(false);
    expect(shouldShowDevelopmentOtp(true)).toBe(false);
  });

  test("calculates resend and expiry countdowns", () => {
    expect(nextCountdown(1)).toBe(0);
    expect(nextCountdown(0)).toBe(0);
    expect(formatCountdown(65)).toBe("1:05");
  });
});

describe("device info", () => {
  test("uses a mobile platform for Expo web preview auth", () => {
    expect(getMobileAuthPlatform("web")).toBe("android");
    expect(getMobileAuthPlatform("ios")).toBe("ios");
  });
});

describe("secure storage and installation id", () => {
  test("stores refresh tokens in the secure storage adapter", async () => {
    const adapter = memoryStorage();
    const storage = createAuthStorage(adapter);

    await storage.setRefreshToken("refresh-1");
    expect(await storage.getRefreshToken()).toBe("refresh-1");
    await storage.clearRefreshToken();
    expect(await storage.getRefreshToken()).toBeNull();
  });

  test("persists installation id", async () => {
    const adapter = memoryStorage();
    const storage = createAuthStorage(adapter);

    await storage.setInstallationId("install-1");
    expect(await getOrCreateInstallationId(storage)).toBe("install-1");
  });
});

describe("api response handling", () => {
  test("unwraps backend success data envelopes", async () => {
    const fetcher = mock(async () => jsonResponse({ success: true, data: { challengeId: "c1" } })) as unknown as typeof fetch;
    const client = createApiClient({ baseUrl: "https://api.test", fetcher });

    await expect(client.request("/otp", { method: "POST" })).resolves.toEqual({ challengeId: "c1" });
  });
});
describe("session and refresh behavior", () => {
  test("bootstraps without token to unauthenticated reducer state", () => {
    const state = authReducer(initialAuthState, { type: "UNAUTHENTICATED" });
    expect(state.status).toBe("unauthenticated");
  });

  test("bootstraps valid token to authenticated reducer state", () => {
    const state = authReducer(initialAuthState, {
      type: "AUTHENTICATED",
      session,
    });
    expect(state.status).toBe("authenticated");
    expect(state.accessToken).toBe("access-2");
  });

  test("rotates refresh token and retries concurrent 401s once", async () => {
    setAccessToken("expired");
    const calls: string[] = [];
    const fetcher = mock(async (url: string) => {
      calls.push(url);
      if (url.endsWith("/protected")) {
        return calls.filter((call) => call.endsWith("/protected")).length <= 2
          ? jsonResponse({ code: "AUTH_UNAUTHORIZED" }, 401)
          : jsonResponse({ ok: true });
      }

      return jsonResponse(session);
    }) as unknown as typeof fetch;

    const storage = createAuthStorage(memoryStorage({ "viruj.auth.refreshToken": "refresh-1" }));
    const client = createApiClient({
      baseUrl: "https://api.test",
      fetcher,
      storage,
      getDeviceId: async () => "install-1",
      onSessionRefreshed: () => {},
    });

    const results = await Promise.all([
      client.request("/protected", { auth: true }),
      client.request("/protected", { auth: true }),
    ]);

    expect(results).toEqual([{ ok: true }, { ok: true }]);
    expect(calls.filter((call) => call.endsWith("/refresh-token"))).toHaveLength(1);
    expect(getAccessToken()).toBe("access-2");
  });

  test("clears auth on refresh failure", async () => {
    setAccessToken("expired");
    let failed = false;
    const fetcher = mock(async (url: string) =>
      url.endsWith("/protected")
        ? jsonResponse({ code: "AUTH_UNAUTHORIZED" }, 401)
        : jsonResponse({ code: "AUTH_INVALID_REFRESH_TOKEN" }, 401)
    ) as unknown as typeof fetch;

    const storage = createAuthStorage(memoryStorage({ "viruj.auth.refreshToken": "refresh-1" }));
    const client = createApiClient({
      baseUrl: "https://api.test",
      fetcher,
      storage,
      getDeviceId: async () => "install-1",
      onAuthFailed: () => {
        failed = true;
      },
    });

    await expect(client.request("/protected", { auth: true })).rejects.toThrow();
    expect(failed).toBe(true);
    expect(getAccessToken()).toBeNull();
  });
});

describe("logout and navigation guards", () => {
  test("logout reducer clears user state", () => {
    const loggedIn = authReducer(initialAuthState, { type: "AUTHENTICATED", session });
    const loggedOut = authReducer(loggedIn, { type: "LOGGED_OUT" });
    expect(loggedOut.status).toBe("unauthenticated");
    expect(loggedOut.accessToken).toBeNull();
  });

  test("maps auth statuses to guarded navigation groups", () => {
    expect(selectRootRoute("bootstrapping")).toBe("splash");
    expect(selectRootRoute("unauthenticated")).toBe("auth");
    expect(selectRootRoute("requiresOnboarding")).toBe("onboarding");
    expect(selectRootRoute("authenticated")).toBe("app");
  });
});
describe("environment configuration", () => {
  test("uses local API for Expo web preview on localhost", () => {
    const previousWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { hostname: "localhost" } },
    });

    expect(getApiBaseUrl()).toBe("http://localhost:4000");

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    });
  });
});
