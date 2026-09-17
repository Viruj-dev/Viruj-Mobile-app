import { apiClient } from "../../../lib/api-client";
import { authStorage } from "../services/auth-storage.service";
import { getOrCreateInstallationId } from "../services/device.service";
import * as msg91 from "../services/msg91-widget.service";
import type {
  AuthSession,
  AuthSessionState,
  DeviceInfo,
  OtpChallenge,
} from "./auth.types";

export async function requestOtp(phoneNumber: string): Promise<OtpChallenge> {
  const result = await msg91.sendOtp(phoneNumber);
  return { challengeId: result.requestId, expiresInSeconds: 300, retryAfterSeconds: 30 };
}

export async function verifyOtp({ challengeId, phoneNumber, otp, device }: { challengeId: string; phoneNumber: string; otp: string; device: DeviceInfo }) {
  return createWidgetSession({ phoneNumber, accessToken: await msg91.verifyOtp(challengeId, otp), device });
}

export function createWidgetSession({
  phoneNumber,
  accessToken,
  device,
}: {
  phoneNumber: string;
  accessToken: string;
  device: DeviceInfo;
}) {
  return apiClient.request<AuthSession>("/api/mobile/auth/widget-session", {
    method: "POST",
    body: { phoneNumber, accessToken, device },
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
