import { expect, mock, test } from "bun:test";

const signIn = mock(async () => ({ type: "noSavedCredentialFound", data: null }));
const createAccount = mock(async () => ({ type: "noSavedCredentialFound", data: null }));
const presentExplicitSignIn = mock(async () => ({ type: "success", data: { idToken: "google-id-token" } }));
const signOut = mock(async () => {});
mock.module("react-native", () => ({ Platform: { OS: "android" } }));
const nativeGoogleModule = {
  GoogleOneTapSignIn: { configure: () => {}, checkPlayServices: async () => {}, signIn, createAccount, presentExplicitSignIn, signOut },
  isSuccessResponse: (response: { type: string }) => response.type === "success",
  isNoSavedCredentialFoundResponse: (response: { type: string }) => response.type === "noSavedCredentialFound",
};
mock.module("react-native-nitro-google-signin", () => nativeGoogleModule);
mock.module(require.resolve("react-native-nitro-google-signin"), () => nativeGoogleModule);

test("Google uses the native account chooser when no saved credential exists", async () => {
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = "test.apps.googleusercontent.com";
  const { signInWithProvider } = await import("../features/auth/services/social-signin.service");
  expect(await signInWithProvider("google")).toBe("google-id-token");
  expect(signIn).toHaveBeenCalledTimes(1);
  expect(createAccount).toHaveBeenCalledTimes(1);
  expect(presentExplicitSignIn).toHaveBeenCalledTimes(1);
});

test("sign-out uses the same native Google module as sign-in", async () => {
  const { signOutFromProviders } = await import("../features/auth/services/social-signin.service");
  await signOutFromProviders();
  expect(signOut).toHaveBeenCalledTimes(1);
});
