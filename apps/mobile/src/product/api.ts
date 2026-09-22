import { apiClient, setAccessToken, setAuthFailureHandler } from "../lib/api-client";
import { authStorage } from "../features/auth/services/auth-storage.service";
import { previewEnabled, previewRequest, stopPreview } from "./preview";
import { devAuthBypass } from "./dev-session";
export type Session = { user: { id: string; name: string; email: string; image?: string | null; role?: string; onboardingCompleted?: boolean }; session: { expiresAt: string } };
export type Profile = Session["user"] & { phoneNumber?: string | null; age?: number | null; gender?: string | null; bloodGroup?: string | null; height?: string | null; weight?: string | null; address?: string | null; recentAppointments?: string | null; medicalHistory?: string | null };
export type Practice = { id: string; tenantId: string; clinicId: string; locationId?: string; hospitalId?: number; name: string; address?: string; bookingEnabled: boolean; modes: string[] };
export type CareItem = { practices?: Practice[]; bookingAvailable?: boolean; services?: { id: string; name: string; description?: string }[]; photos?: { url: string; caption?: string }[]; id: string | number; name: string; specialty?: string; qualifications?: string; experience?: string; imageUrl?: string; image_url?: string; consultationFees?: number; consultation_fees?: number; state?: string; pincode?: string; departments?: string; departmentName?: string; totalReviews?: number; reviewCount?: number; isOpen?: boolean; emergencyServices?: boolean; ambulanceService?: boolean; parkingAvailable?: boolean; facilities?: string | string[]; hospital_id?: string | number; email?: string; hospitalName?: string; hospital_name?: string; city?: string; address?: string; description?: string; phone?: string; website?: string; rating?: string | number; availability?: string; startingPrice?: number; area?: string };
export type Appointment = { source?: "erp" | "legacy"; version?: number; rejectionReason?: string; cancellationReason?: string; id: string; doctorId?: number; doctorName: string; doctorSpecialty?: string; departmentName?: string; hospitalAddress?: string; hospitalName: string; appointmentDate: string; appointmentTime: string; appointmentMode: string; status: string; reason?: string };
export type Post = { id: string; content: string; type: string; imageUrl?: string; mediaUrls?: string[]; mediaTypes?: ("image" | "video")[]; tags?: string[]; documentUrls?: string[]; createdAt: string; isLiked?: boolean; isBookmarked?: boolean; likeCount?: number; commentCount?: number; author: { id: string; name: string; role?: string; image?: string } | null };
export type InboxItem = { id: string; title: string; content: string; isRead: boolean; link?: string; createdAt: string };
export type Message = { sender: "user" | "ai"; text: string; image?: string };
export type ChatSession = { id: string; title: string; preview: string; messages: Message[] };
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }

// Public website links/assets only; API traffic always goes to viruj-backend.
export const webOrigin = "https://app.virujhealth.com";
export function validateOrigin(origin: string, development: boolean) {
  const url = new URL(origin);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || (!development && url.protocol !== "https:") || !["https:", "http:"].includes(url.protocol)) throw new Error("Invalid API origin");
  return url.origin;
}
export const api = {
  setUnauthorized(handler: () => void) { setAuthFailureHandler(handler); },
  async hasSession() { return previewEnabled || Boolean(await authStorage.getRefreshToken()); },
  async clear() { if (previewEnabled) stopPreview(); else { setAccessToken(null); await authStorage.clearAuthStorage(); } },
  async request<T>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal; public?: boolean; binary?: boolean } = {}): Promise<T> {
    if (previewEnabled) return await previewRequest(path, options) as T;
    try {
      return await apiClient.request<T>(`/api/mobile${path}`, { ...options, auth: !options.public && !devAuthBypass, unwrap: false });
    } catch (error) {
      const failure = error as { message?: string; status?: number };
      throw new ApiError(failure.message || "Could not complete this request.", failure.status ?? 0);
    }
  },
};
