import type { AuthApiError, AuthErrorCode } from "../api/auth.types";

const MESSAGES: Record<AuthErrorCode, string> = {
  AUTH_INVALID_REFRESH_TOKEN: "Your session has expired. Please sign in again.",
  AUTH_REFRESH_TOKEN_REUSED: "Your session was reset for security. Please sign in again.",
  AUTH_SESSION_REVOKED: "Your session has ended. Please sign in again.",
  AUTH_UNAUTHORIZED: "Please sign in again.",
  NETWORK_ERROR: "Cannot reach the Viruj API. Check your backend URL and network.",
  UNKNOWN: "Something went wrong. Please try again.",
};

const BACKEND_ERROR_CODES: Record<string, AuthErrorCode> = {
  refresh_token_invalid: "AUTH_INVALID_REFRESH_TOKEN",
  refresh_device_mismatch: "AUTH_INVALID_REFRESH_TOKEN",
  refresh_token_reused: "AUTH_REFRESH_TOKEN_REUSED",
  refresh_token_reuse_detected: "AUTH_REFRESH_TOKEN_REUSED",
  refresh_token_expired: "AUTH_INVALID_REFRESH_TOKEN",
  refresh_session_revoked: "AUTH_SESSION_REVOKED",
  mobile_session_invalid: "AUTH_SESSION_REVOKED",
  mobile_access_token_invalid: "AUTH_UNAUTHORIZED",
};

export function normalizeAuthErrorCode(code?: string): AuthErrorCode {
  if (!code) {
    return "UNKNOWN";
  }

  return BACKEND_ERROR_CODES[code] ?? (code as AuthErrorCode);
}

export function getAuthErrorMessage(code?: string): string {
  return MESSAGES[normalizeAuthErrorCode(code)] ?? MESSAGES.UNKNOWN;
}

export function createAuthApiError({
  code,
  status,
  message,
}: {
  code?: string;
  status?: number;
  message?: string;
}): AuthApiError {
  const normalizedCode = normalizeAuthErrorCode(code);
  const error = new Error(message || getAuthErrorMessage(normalizedCode)) as AuthApiError;
  error.code = normalizedCode;
  error.status = status;
  return error;
}

export function getErrorCode(error: unknown): AuthErrorCode {
  if (error && typeof error === "object" && "code" in error) {
    return normalizeAuthErrorCode(String(error.code));
  }

  return "UNKNOWN";
}

export function getDisplayError(error: unknown): string {
  return getAuthErrorMessage(getErrorCode(error));
}

export function getSignInErrorMessage(cause: unknown): string {
  const code = getErrorCode(cause) as string;
  if (code === "email_in_use") return "This email already has an account. Please sign in.";
  if (code === "invalid_credentials") return "Email or password is incorrect.";
  if (code === "too_many_attempts") return "Too many attempts. Please try again later.";
  if (code === "invalid_otp") return "Incorrect or expired code. Please try again.";
  if (code === "sms_gateway_not_configured") return "SMS gateway setup is incomplete. Please use email or Google for now.";
  if (code === "account_link_requires_verification") return "This email is already in use. Please contact support to connect your accounts.";
  if (code === "provider_token_invalid") return "Google could not verify your sign-in. Please select your account again.";
  if (code === "provider_unavailable") return "Sign-in service is unavailable. Please try again.";
  if (code === "NETWORK_ERROR") return "Connection lost. Check your internet and try again.";
  const status = cause && typeof cause === "object" && "status" in cause ? Number(cause.status) : 0;
  if (status === 404) return "Sign-in is unavailable on this server. Please contact support.";
  if (status >= 500) return "Sign-in service is unavailable. Please try again later.";
  return "Sign-in could not be completed. Please try again.";
}

