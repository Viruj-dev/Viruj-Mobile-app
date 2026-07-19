import type { AuthApiError, AuthErrorCode } from "../api/auth.types";

const MESSAGES: Record<AuthErrorCode, string> = {
  OTP_INVALID_PHONE_NUMBER: "Enter a valid 10-digit Indian mobile number.",
  OTP_RATE_LIMITED: "Too many OTP requests. Please wait before trying again.",
  OTP_CHALLENGE_NOT_FOUND: "That verification code has expired. Request a new one.",
  OTP_INVALID: "The code you entered is incorrect.",
  OTP_EXPIRED: "That code has expired. Request a new one.",
  OTP_ALREADY_USED: "That code has already been used. Request a new one.",
  OTP_TOO_MANY_ATTEMPTS: "Too many incorrect attempts. Request a new code.",
  AUTH_INVALID_REFRESH_TOKEN: "Your session has expired. Please sign in again.",
  AUTH_REFRESH_TOKEN_REUSED: "Your session was reset for security. Please sign in again.",
  AUTH_SESSION_REVOKED: "Your session has ended. Please sign in again.",
  AUTH_UNAUTHORIZED: "Please sign in again.",
  NETWORK_ERROR: "Cannot reach the Viruj API. Check your backend URL and network.",
  UNKNOWN: "Something went wrong. Please try again.",
};

const BACKEND_ERROR_CODES: Record<string, AuthErrorCode> = {
  otp_request_cooldown: "OTP_RATE_LIMITED",
  otp_phone_hourly_limit: "OTP_RATE_LIMITED",
  otp_ip_hourly_limit: "OTP_RATE_LIMITED",
  otp_temporarily_blocked: "OTP_RATE_LIMITED",
  otp_delivery_failed: "OTP_RATE_LIMITED",
  otp_challenge_not_found: "OTP_CHALLENGE_NOT_FOUND",
  otp_challenge_phone_mismatch: "OTP_CHALLENGE_NOT_FOUND",
  otp_challenge_purpose_mismatch: "OTP_CHALLENGE_NOT_FOUND",
  otp_challenge_superseded: "OTP_CHALLENGE_NOT_FOUND",
  otp_invalid: "OTP_INVALID",
  otp_expired: "OTP_EXPIRED",
  otp_challenge_consumed: "OTP_ALREADY_USED",
  otp_attempt_limit: "OTP_TOO_MANY_ATTEMPTS",
  refresh_token_invalid: "AUTH_INVALID_REFRESH_TOKEN",
  refresh_device_mismatch: "AUTH_INVALID_REFRESH_TOKEN",
  refresh_token_reused: "AUTH_REFRESH_TOKEN_REUSED",
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

export function shouldShowDevelopmentOtp(isDev: boolean, otp?: string): boolean {
  return isDev && Boolean(otp);
}
