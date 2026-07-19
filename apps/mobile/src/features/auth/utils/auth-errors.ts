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
  UNKNOWN: "Something went wrong. Please try again.",
};

export function getAuthErrorMessage(code?: string): string {
  return MESSAGES[(code as AuthErrorCode) || "UNKNOWN"] ?? MESSAGES.UNKNOWN;
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
  const error = new Error(message || getAuthErrorMessage(code)) as AuthApiError;
  error.code = ((code as AuthErrorCode) || "UNKNOWN") as AuthErrorCode;
  error.status = status;
  return error;
}

export function getErrorCode(error: unknown): AuthErrorCode {
  if (error && typeof error === "object" && "code" in error) {
    return String(error.code) as AuthErrorCode;
  }

  return "UNKNOWN";
}

export function getDisplayError(error: unknown): string {
  return getAuthErrorMessage(getErrorCode(error));
}

export function shouldShowDevelopmentOtp(isDev: boolean, otp?: string): boolean {
  return isDev && Boolean(otp);
}
