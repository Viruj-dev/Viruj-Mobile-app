import { apiClient } from "../../../lib/api-client";
import { authStorage } from "../services/auth-storage.service";
import { getOrCreateInstallationId } from "../services/device.service";
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

export async function logout() {
  const refreshToken = await authStorage.getRefreshToken();
  if (!refreshToken) return;
  return apiClient.request<void>("/api/mobile/auth/logout", {
    method: "POST",
    body: { refreshToken, deviceId: await getOrCreateInstallationId() },
  });
}
