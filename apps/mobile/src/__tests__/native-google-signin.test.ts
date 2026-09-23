import { expect, mock, test } from "bun:test";

const signIn = mock(async () => ({ type: "noSavedCredentialFound", data: null }));
const createAccount = mock(async () => ({ type: "success", data: { idToken: "google-id-token" } }));
mock.module("react-native", () => ({ Platform: { OS: "android" } }));
mock.module("react-native-nitro-google-signin", () => ({
  GoogleOneTapSignIn: { configure: () => {}, checkPlayServices: async () => {}, signIn, createAccount },
  isSuccessResponse: (response: { type: string }) => response.type === "success",
  isNoSavedCredentialFoundResponse: (response: { type: string }) => response.type === "noSavedCredentialFound",
}));

test("Google uses the native account chooser when no saved credential exists", async () => {
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = "test.apps.googleusercontent.com";
  const { signInWithProvider } = await import("../features/auth/services/social-signin.service");
  expect(await signInWithProvider("google")).toBe("google-id-token");
  expect(signIn).toHaveBeenCalledTimes(1);
  expect(createAccount).toHaveBeenCalledTimes(1);
});
