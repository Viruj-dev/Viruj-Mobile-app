import { expect, mock, spyOn, test } from "bun:test";
let savedSession: unknown;
mock.module("react", () => ({
  createContext: () => ({ Provider: "provider" }), useCallback: (callback: unknown) => callback,
  useContext: () => null, useEffect: () => {}, useRef: (value: unknown) => ({ current: value }),
  useState: (initial: unknown) => [initial, (value: unknown) => { savedSession = value; }],
}));
mock.module("react-native", () => ({ AppState: {} }));
mock.module("react/jsx-dev-runtime", () => ({ jsxDEV: (_type: unknown, props: unknown) => ({ props }) }));
mock.module("react/jsx-runtime", () => ({ jsx: (_type: unknown, props: unknown) => ({ props }) }));
const auth = await import("../apps/mobile/src/features/auth/api/auth.api");
const device = await import("../apps/mobile/src/features/auth/services/device.service");
const { authStorage } = await import("../apps/mobile/src/features/auth/services/auth-storage.service");
const { SessionProvider } = await import("../apps/mobile/src/product/session");
const { getAccessToken, setAccessToken } = await import("../apps/mobile/src/lib/api-client");

test("mobile OTP requires entry, sends challenge/device binding, stores tokens and restores safe session", async () => {
  const phone = "+919876543210";
  const session = { user: { id: "patient", name: "Patient", email: "" }, session: { expiresAt: "2030-01-01" }, requiresOnboarding: false };
  const request = spyOn(auth, "requestOtp").mockResolvedValue({ challengeId: "challenge-1", developmentOtp: "123456", expiresInSeconds: 300, retryAfterSeconds: 60 });
  const verify = spyOn(auth, "verifyOtp").mockResolvedValue({ accessToken: "access", refreshToken: "refresh", user: { id: "patient", phoneNumber: phone }, requiresOnboarding: false });
  const getSession = spyOn(auth, "getSession").mockResolvedValue(session);
  const getDevice = spyOn(device, "getDeviceInfo").mockResolvedValue({ deviceId: "install-1", platform: "android", deviceName: "test", appVersion: "1" });
  const save = spyOn(authStorage, "setRefreshToken").mockResolvedValue();
  try {
    savedSession = null;
    const controller = SessionProvider({ children: null }).props.value;
    await controller.requestOtp(phone);
    expect(verify).not.toHaveBeenCalled();
    expect(savedSession).toBeNull();
    await expect(controller.verifyOtp("+919876543211", "123456")).rejects.toThrow("Request a new code");
    await controller.verifyOtp(phone, "123456");
    expect(verify).toHaveBeenCalledWith({ phoneNumber: phone, challengeId: "challenge-1", otp: "123456", device: { deviceId: "install-1", platform: "android", deviceName: "test", appVersion: "1" } });
    expect(save).toHaveBeenCalledWith("refresh");
    expect(getAccessToken()).toBe("access");
    expect(savedSession).toEqual(session);
    await expect(controller.verifyOtp(phone, "123456")).rejects.toThrow("Request a new code");
    await controller.requestOtp(phone);
    verify.mockRejectedValue(new Error("Incorrect code"));
    await expect(controller.verifyOtp(phone, "000000")).rejects.toThrow("Incorrect code");
    expect(save).toHaveBeenCalledTimes(1);
  } finally { for (const spy of [request, verify, getSession, getDevice, save]) spy.mockRestore(); setAccessToken(null); }
});
