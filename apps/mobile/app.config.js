const { expo } = require("./app.json");

module.exports = () => {
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const facebookEnabled = process.env.EXPO_PUBLIC_ENABLE_FACEBOOK_SIGN_IN === "true";
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
  const facebookClientToken = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN;
  if (facebookEnabled && (!facebookAppId || !facebookClientToken)) throw new Error("Set Facebook app ID and client token to enable Facebook sign-in.");
  return {
    ...expo,
    ios: { ...expo.ios, bundleIdentifier: "com.virujhealth.app" },
    plugins: [
      ...expo.plugins,
      ...(googleIosClientId ? [["react-native-nitro-google-signin", { iosUrlScheme: googleIosClientId.split(".").reverse().join(".") }]] : []),
      ...(facebookEnabled ? [["react-native-fbsdk-next", { appID: facebookAppId, clientToken: facebookClientToken, displayName: "Viruj Health", scheme: `fb${facebookAppId}`, advertiserIDCollectionEnabled: false, autoLogAppEventsEnabled: false, isAutoInitEnabled: true }]] : []),
    ],
  };
};
