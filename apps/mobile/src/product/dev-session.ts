// Metro replaces __DEV__ with false in release builds.
export const devAuthBypass = typeof __DEV__ !== "undefined" && __DEV__ && process.env.EXPO_PUBLIC_MOBILE_DEV_AUTH_BYPASS === "true";
export const devSession = { user: { id: "dev-mobile-test-patient", name: "Test Patient", email: "", onboardingCompleted: true }, session: { expiresAt: "2099-01-01" } };
