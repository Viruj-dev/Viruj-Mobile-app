import { Platform } from "react-native";

export async function signInWithProvider(provider: "google" | "facebook"): Promise<string> {
  if (Platform.OS === "web") throw new Error("Use the Android or iOS app to sign in.");
  if (provider === "google") {
    const { GoogleOneTapSignIn, isSuccessResponse, isNoSavedCredentialFoundResponse } = await import("react-native-nitro-google-signin");
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webClientId) throw new Error("Google sign-in is not configured.");
    if (Platform.OS === "ios" && !process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) throw new Error("Google sign-in is not configured for iOS.");
    GoogleOneTapSignIn.configure({ webClientId, iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, autoSelectOnSignIn: false });
    await GoogleOneTapSignIn.checkPlayServices();
    let response = await GoogleOneTapSignIn.signIn();
    if (isNoSavedCredentialFoundResponse(response)) response = await GoogleOneTapSignIn.createAccount();
    if (!isSuccessResponse(response)) throw new Error("SIGN_IN_CANCELLED");
    if (!response.data.idToken) throw new Error("Google did not return a sign-in token.");
    return response.data.idToken;
  }
  if (process.env.EXPO_PUBLIC_ENABLE_FACEBOOK_SIGN_IN !== "true") throw new Error("Facebook sign-in is not available yet.");
  const { LoginManager, AccessToken } = await import("react-native-fbsdk-next");
  const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
  if (result.isCancelled) throw new Error("SIGN_IN_CANCELLED");
  const token = await AccessToken.getCurrentAccessToken();
  if (!token?.accessToken) throw new Error("Facebook did not return a sign-in token.");
  return token.accessToken;
}

export async function signOutFromProviders() {
  if (Platform.OS === "web") return;
  const { GoogleOneTapSignIn } = await import("react-native-nitro-google-signin");
  await GoogleOneTapSignIn.signOut().catch(() => {});
  if (process.env.EXPO_PUBLIC_ENABLE_FACEBOOK_SIGN_IN === "true") {
    const { LoginManager } = await import("react-native-fbsdk-next");
    LoginManager.logOut();
  }
}
