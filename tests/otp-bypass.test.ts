import { expect, mock, spyOn, test } from "bun:test";

let savedSession: unknown;
mock.module("react", () => ({
  createContext: () => ({ Provider: "provider" }),
  useCallback: (callback: unknown) => callback,
  useContext: () => null,
  useEffect: () => {},
  useState: (initial: unknown) => [initial, (value: unknown) => { savedSession = value; }],
}));
mock.module("react-native", () => ({ AppState: {} }));
mock.module("react/jsx-dev-runtime", () => ({ jsxDEV: (_type: unknown, props: unknown) => ({ props }) }));
mock.module("react/jsx-runtime", () => ({ jsx: (_type: unknown, props: unknown) => ({ props }) }));
const { api } = await import("../apps/mobile/src/product/api");
const { SessionProvider } = await import("../apps/mobile/src/product/session");

test("fixture OTP auto-signs in only in development, preserving real OTP and failures", async () => {
  const runtime = globalThis as typeof globalThis & { __DEV__: boolean };
  const previous = runtime.__DEV__;
  const session = { user: { id: "synthetic-patient" } };
  let code: string | undefined = "123456";
  let fail = false;
  const request = spyOn(api, "request").mockImplementation(async (path, options) => {
    if (path.endsWith("send-otp")) return { developmentOtp: code };
    if (path.endsWith("/verify")) {
      expect(options?.body).toEqual({ phoneNumber: "+919876543210", code: "123456" });
      if (fail) throw new Error("Verification failed");
      return {};
    }
    return session;
  });
  try {
    for (const development of [true, false]) {
      runtime.__DEV__ = development;
      savedSession = null;
      request.mockClear();
      await SessionProvider({ children: null }).props.value.requestOtp("+919876543210");
      expect(request).toHaveBeenCalledTimes(development ? 3 : 1);
      expect(savedSession).toEqual(development ? session : null);
    }
    runtime.__DEV__ = true;
    code = undefined;
    request.mockClear();
    await SessionProvider({ children: null }).props.value.requestOtp("+919876543210");
    expect(request).toHaveBeenCalledTimes(1);
    code = "123456";
    fail = true;
    await expect(SessionProvider({ children: null }).props.value.requestOtp("+919876543210")).rejects.toThrow("Verification failed");
  } finally { request.mockRestore(); runtime.__DEV__ = previous; }
});
