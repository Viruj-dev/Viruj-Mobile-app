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

