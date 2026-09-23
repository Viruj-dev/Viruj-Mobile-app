import { Platform } from "react-native";

export async function signInWithProvider(provider: "google" | "facebook"): Promise<string> {
  if (Platform.OS === "web") throw new Error("Use the Android or iOS app to sign in.");
  if (provider === "google") {
    const { GoogleSignin, isSuccessResponse } = await import("@react-native-google-signin/google-signin");
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webClientId) throw new Error("Google sign-in is not configured.");
    GoogleSignin.configure({ webClientId, iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID });
    if (Platform.OS === "android") await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) throw new Error("SIGN_IN_CANCELLED");
    if (!response.data.idToken) throw new Error("Google did not return a sign-in token.");
    return response.data.idToken;
  }
  const { LoginManager, AccessToken } = await import("react-native-fbsdk-next");
  const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
  if (result.isCancelled) throw new Error("SIGN_IN_CANCELLED");
  const token = await AccessToken.getCurrentAccessToken();
  if (!token?.accessToken) throw new Error("Facebook did not return a sign-in token.");
  return token.accessToken;
}
