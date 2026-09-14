import { previewEnabled, previewRequest, stopPreview } from "./preview";
export type Session = { user: { id: string; name: string; email: string; image?: string | null; role?: string; onboardingCompleted?: boolean }; session: { expiresAt: string } };
export type Profile = Session["user"] & { phoneNumber?: string | null; age?: number | null; gender?: string | null; bloodGroup?: string | null; height?: string | null; weight?: string | null; address?: string | null; recentAppointments?: string | null; medicalHistory?: string | null };
export type CareItem = { id: string | number; name: string; specialty?: string; qualifications?: string; experience?: string; imageUrl?: string; image_url?: string; consultationFees?: number; consultation_fees?: number; state?: string; pincode?: string; departments?: string; departmentName?: string; totalReviews?: number; reviewCount?: number; isOpen?: boolean; emergencyServices?: boolean; ambulanceService?: boolean; parkingAvailable?: boolean; facilities?: string | string[]; hospital_id?: string | number; email?: string; hospitalName?: string; hospital_name?: string; city?: string; address?: string; description?: string; phone?: string; website?: string; rating?: string | number; availability?: string; startingPrice?: number; area?: string };
export type Appointment = { id: string; doctorId?: number; doctorName: string; doctorSpecialty?: string; departmentName?: string; hospitalAddress?: string; hospitalName: string; appointmentDate: string; appointmentTime: string; appointmentMode: string; status: string; reason?: string };
export type Post = { id: string; content: string; type: string; imageUrl?: string; mediaUrls?: string[]; mediaTypes?: ("image" | "video")[]; tags?: string[]; documentUrls?: string[]; createdAt: string; isLiked?: boolean; isBookmarked?: boolean; likeCount?: number; commentCount?: number; author: { id: string; name: string; role?: string; image?: string } | null };
export type InboxItem = { id: string; title: string; content: string; isRead: boolean; link?: string; createdAt: string };
export type Message = { sender: "user" | "ai"; text: string; image?: string };
export type ChatSession = { id: string; title: string; preview: string; messages: Message[] };
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }

export const webOrigin = (process.env.EXPO_PUBLIC_WEB_API_URL || "https://app.virujhealth.com").replace(/\/$/, "");
export function validateOrigin(origin: string, development: boolean) {
  const url = new URL(origin);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || (!development && url.protocol !== "https:") || !["https:", "http:"].includes(url.protocol)) throw new Error("Invalid API origin");
  return url.origin;
}
type Store = { get(): Promise<string | null>; set(value: string): Promise<void>; clear(): Promise<void> };
let memoryToken: string | null = null;
const tokenKey = "viruj.web.session";
const store: Store = {
  async get() { return typeof document !== "undefined" ? memoryToken : (await import("expo-secure-store")).getItemAsync(tokenKey); },
  async set(value) { if (typeof document !== "undefined") memoryToken = value; else await (await import("expo-secure-store")).setItemAsync(tokenKey, value); },
  async clear() { memoryToken = null; if (typeof document === "undefined") await (await import("expo-secure-store")).deleteItemAsync(tokenKey); },
};
export function createWebApi(origin: string, storage: Store, fetcher: (input: string, init?: RequestInit) => Promise<Response> = fetch) {
  let unauthorized = () => {};
  let generation = 0;
  return {
    setUnauthorized(handler: () => void) { unauthorized = handler; },
    async clear() { generation++; await storage.clear(); },
    async hasSession() { return Boolean(await storage.get()); },
    async request<T>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal; public?: boolean; binary?: boolean } = {}): Promise<T> {
      if (!path.startsWith("/") || path.startsWith("//") || path.includes("..")) throw new Error("Invalid API path");
      const version = generation;
      const token = options.public ? null : await storage.get();
      const headers = new Headers({ Accept: "application/json" });
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const multipart = typeof FormData !== "undefined" && options.body instanceof FormData;
      if (options.body && !multipart) headers.set("Content-Type", "application/json");
      const controller = new AbortController();
      const abort = () => controller.abort();
      options.signal?.addEventListener("abort", abort, { once: true });
      if (options.signal?.aborted) controller.abort();
      const timer = setTimeout(abort, path.includes("/ai/") ? 90_000 : 20_000);
      try {
        const response = await fetcher(`${origin}/api/mobile${path}`, { method: options.method || "GET", headers, credentials: "omit", signal: controller.signal, body: options.body ? multipart ? options.body as FormData : JSON.stringify(options.body) : undefined });
        const data = options.binary && response.ok ? await response.arrayBuffer() : await response.json().catch(() => null);
        if (!response.ok) {
          if (response.status === 401 && token && version === generation) { generation++; await storage.clear(); unauthorized(); }
          const message = typeof data?.error === "string" ? data.error : data?.error?.message || data?.message;
          throw new ApiError(message || (response.status === 401 ? "Please sign in again." : "Could not complete this request."), response.status);
        }
        if (version !== generation) throw new ApiError("Session changed. Please try again.", 401);
        const renewed = response.headers.get("set-auth-token");
        if (renewed) await storage.set(renewed);
        if (path === "/auth/sign-in/email" || path === "/auth/sign-up/email" || path === "/auth/phone-number/verify") {
          if (!renewed) throw new ApiError("Mobile sign-in is not enabled on this server yet.", 503);
        }
        return data as T;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (controller.signal.aborted) throw new ApiError("Request timed out. Check your connection.", 0);
        throw new ApiError("Cannot connect. Check your internet and try again.", 0);
      } finally { clearTimeout(timer); options.signal?.removeEventListener("abort", abort); }
    },
  };
}
const liveApi = createWebApi(validateOrigin(webOrigin, typeof __DEV__ !== "undefined" && __DEV__), store);

export const api = { ...liveApi, async hasSession() { return previewEnabled || liveApi.hasSession(); }, async clear() { if (previewEnabled) stopPreview(); else await liveApi.clear(); }, async request<T>(path: string, options: Parameters<typeof liveApi.request>[1] = {}): Promise<T> { return previewEnabled ? await previewRequest(path, options) as T : liveApi.request<T>(path, options); } };
