const { expo } = require("./app.json");

module.exports = () => {
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
  const facebookClientToken = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN;
  if (!googleIosClientId || !facebookAppId || !facebookClientToken) throw new Error("Set Google iOS and Facebook app configuration before building.");
  return {
    ...expo,
    ios: { ...expo.ios, bundleIdentifier: "com.virujhealth.app" },
    plugins: [
      ...expo.plugins,
      ["@react-native-google-signin/google-signin", { iosUrlScheme: googleIosClientId.split(".").reverse().join(".") }],
      ["react-native-fbsdk-next", { appID: facebookAppId, clientToken: facebookClientToken, displayName: "Viruj Health", scheme: `fb${facebookAppId}`, advertiserIDCollectionEnabled: false, autoLogAppEventsEnabled: false, isAutoInitEnabled: true }],
    ],
  };
};
