export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "authenticated"
  | "requiresOnboarding";

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
  session: { expiresAt: string };
};

export type DeviceInfo = {
  deviceId: string;
  platform: "android" | "ios";
  deviceName: string;
  appVersion: string;
};

export type AuthErrorCode =
  | "AUTH_INVALID_REFRESH_TOKEN"
  | "AUTH_REFRESH_TOKEN_REUSED"
  | "AUTH_SESSION_REVOKED"
  | "AUTH_UNAUTHORIZED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export type AuthApiError = Error & {
  code: AuthErrorCode;
  status?: number;
};
