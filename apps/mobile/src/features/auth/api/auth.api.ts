import { apiClient } from "../../../lib/api-client";
import { authStorage } from "../services/auth-storage.service";
import { getOrCreateInstallationId } from "../services/device.service";
import type {
  AuthSession,
  AuthSessionState,
  DeviceInfo,
} from "./auth.types";

export function createProviderSession(provider: "google" | "facebook", token: string, device: DeviceInfo) {
  return apiClient.request<AuthSession>("/api/mobile/auth/provider-session", {
    method: "POST",
    body: { provider, token, device },
  });
}

export function emailSignup(name: string, email: string, password: string, device: DeviceInfo) {
  return apiClient.request<AuthSession>("/api/mobile/auth/email-signup", { method: "POST", body: { name, email, password, acceptPrivacy: true, device } });
}

export function emailLogin(email: string, password: string, device: DeviceInfo) {
  return apiClient.request<AuthSession>("/api/mobile/auth/email-login", { method: "POST", body: { email, password, device } });
}

export function sendPhoneOtp(phoneNumber: string) {
  return apiClient.request<void>("/api/mobile/auth/phone-otp/send", { method: "POST", body: { phoneNumber } });
}

export function verifyPhoneOtp(phoneNumber: string, code: string, device: DeviceInfo) {
  return apiClient.request<AuthSession>("/api/mobile/auth/phone-otp/verify", { method: "POST", body: { phoneNumber, code, device } });
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
