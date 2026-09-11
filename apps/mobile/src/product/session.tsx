import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AppState } from "react-native";
import { api, ApiError, type Session } from "./api";

type AuthState = { session: Session | null; loading: boolean; error: string; restore(): Promise<void>; requestOtp(phoneNumber: string): Promise<string | undefined>; verifyOtp(phoneNumber: string, code: string): Promise<void>; logout(): Promise<void> };
const Context = createContext<AuthState | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const restore = useCallback(async () => {
    setError("");
    try {
      if (!(await api.hasSession())) { setSession(null); return; }
      const value = await api.request<Session | null>("/auth/get-session");
      if (!value?.user) { await api.clear(); setSession(null); } else setSession(value);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setSession(null);
      else setError(e instanceof Error ? e.message : "Could not restore session.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    api.setUnauthorized(() => setSession(null));
    void restore();
    const listener = AppState.addEventListener("change", (state) => { if (state === "active") void restore(); });
    return () => { listener.remove(); api.setUnauthorized(() => {}); };
  }, [restore]);
  async function requestOtp(phoneNumber: string) {
    const result = await api.request<{ developmentOtp?: string }>("/auth/phone-number/send-otp", { method: "POST", public: true, body: { phoneNumber } });
    return result.developmentOtp;
  }
  async function verifyOtp(phoneNumber: string, code: string) {
    await api.request("/auth/phone-number/verify", { method: "POST", public: true, body: { phoneNumber, code } });
    const value = await api.request<Session | null>("/auth/get-session");
    if (!value?.user) throw new Error("Could not load your account. Please try again.");
    setSession(value);
  }
  async function logout() {
    try { await api.request("/auth/sign-out", { method: "POST", body: {} }); }
    finally { await api.clear(); setSession(null); setError(""); }
  }
  return <Context.Provider value={{ session, loading, error, restore, requestOtp, verifyOtp, logout }}>{children}</Context.Provider>;
}
export function useSession() { const context = useContext(Context); if (!context) throw new Error("SessionProvider missing"); return context; }
