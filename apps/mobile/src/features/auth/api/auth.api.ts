import { apiClient } from "../../../lib/api-client";
import type {
  AuthPurpose,
  AuthSession,
  AuthSessionState,
  DeviceInfo,
  OtpChallenge,
} from "./auth.types";

export function requestOtp(phoneNumber: string, purpose: AuthPurpose = "LOGIN") {
  return apiClient.request<OtpChallenge>("/api/mobile/auth/request-otp", {
    method: "POST",
    body: { phoneNumber, purpose },
  });
}

export function verifyOtp({
  challengeId,
  phoneNumber,
  otp,
  device,
  purpose = "LOGIN",
}: {
  challengeId: string;
  phoneNumber: string;
  otp: string;
  device: DeviceInfo;
  purpose?: AuthPurpose;
}) {
  return apiClient.request<AuthSession>("/api/mobile/auth/verify-otp", {
    method: "POST",
    body: { challengeId, phoneNumber, otp, purpose, device },
  });
}

export function refreshToken() {
  return apiClient.refreshSession();
}

export function getSession() {
  return apiClient.request<AuthSessionState>("/api/mobile/auth/session", {
    method: "GET",
    auth: true,
  });
}

export function logout() {
  return apiClient.request<void>("/api/mobile/auth/logout", {
    method: "POST",
    auth: true,
  });
}
