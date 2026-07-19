export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "authenticated"
  | "requiresOnboarding";

export type AuthPurpose = "LOGIN";

export type SafeMobileUser = {
  id: string;
  phoneNumber: string;
  name?: string | null;
  email?: string | null;
  [key: string]: unknown;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: SafeMobileUser;
  requiresOnboarding: boolean;
};

export type AuthSessionState = {
  user: SafeMobileUser;
  requiresOnboarding: boolean;
};

export type OtpChallenge = {
  challengeId: string;
  expiresInSeconds: number;
  retryAfterSeconds: number;
  developmentOtp?: string;
};

export type DeviceInfo = {
  deviceId: string;
  platform: "android" | "ios" | "web";
  deviceName: string;
  appVersion: string;
};

export type AuthErrorCode =
  | "OTP_INVALID_PHONE_NUMBER"
  | "OTP_RATE_LIMITED"
  | "OTP_CHALLENGE_NOT_FOUND"
  | "OTP_INVALID"
  | "OTP_EXPIRED"
  | "OTP_ALREADY_USED"
  | "OTP_TOO_MANY_ATTEMPTS"
  | "AUTH_INVALID_REFRESH_TOKEN"
  | "AUTH_REFRESH_TOKEN_REUSED"
  | "AUTH_SESSION_REVOKED"
  | "AUTH_UNAUTHORIZED"
  | "UNKNOWN";

export type AuthApiError = Error & {
  code: AuthErrorCode;
  status?: number;
};
