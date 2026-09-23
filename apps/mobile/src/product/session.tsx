import { startPreview, previewSession, previewEnabled } from "./preview";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AppState } from "react-native";
import { api, type Session } from "./api";
import * as authApi from "../features/auth/api/auth.api";
import { authStorage } from "../features/auth/services/auth-storage.service";
import { getDeviceInfo } from "../features/auth/services/device.service";
import { signInWithProvider, signOutFromProviders } from "../features/auth/services/social-signin.service";
import { getAccessToken, setAccessToken } from "../lib/api-client";
import { devAuthBypass, devSession } from "./dev-session";

type AuthState = { preview(): void; session: Session | null; loading: boolean; error: string; restore(): Promise<void>; signIn(provider: "google" | "facebook"): Promise<void>; logout(): Promise<void> };
const Context = createContext<AuthState | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const signingIn = useRef(false);
  const generation = useRef(0);
  const restore = useCallback(async () => {
    const version = generation.current;
    setError("");
    try {
      if (devAuthBypass) { setSession(devSession); return; }
      if (previewEnabled) { setSession(previewSession); return; }
      if (!(await api.hasSession())) { setSession(null); return; }
      if (!getAccessToken()) await authApi.refreshToken();
      const value = await authApi.getSession();
      if (version === generation.current) setSession(value as Session);
    } catch (e) {
      if (version !== generation.current) return;
      if ([401, 403].includes((e as { status?: number }).status ?? 0)) { await api.clear(); setSession(null); }
      else setError(e instanceof Error ? e.message : "Could not restore session.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    api.setUnauthorized(() => { generation.current++; setSession(null); });
    void restore();
    const listener = AppState.addEventListener("change", (state) => { if (state === "active") void restore(); });
    return () => { listener.remove(); api.setUnauthorized(() => {}); };
  }, [restore]);
  async function signIn(provider: "google" | "facebook") {
    if (signingIn.current) return;
    signingIn.current = true;
    try { await finishLogin(provider, await signInWithProvider(provider)); }
    finally { signingIn.current = false; }
  }
  async function finishLogin(provider: "google" | "facebook", providerToken: string) {
    const version = generation.current;
    const result = await authApi.createProviderSession(provider, providerToken, await getDeviceInfo());
    if (version !== generation.current) return;
    await authStorage.setRefreshToken(result.refreshToken);
    if (version !== generation.current) { await authStorage.clearAuthStorage(); return; }
    setAccessToken(result.accessToken);
    const value = await authApi.getSession();
    if (version === generation.current) setSession(value as Session);
  }
  async function logout() {
    generation.current++;
    try { if (!previewEnabled && !devAuthBypass) await authApi.logout(); }
    finally { await api.clear(); await signOutFromProviders().catch(() => {}); setSession(null); setError(""); }
  }
  return <Context.Provider value={{ preview: () => { startPreview(); setError(""); setSession(previewSession); }, session, loading, error, restore, signIn, logout }}>{children}</Context.Provider>;
}
export function useSession() { const context = useContext(Context); if (!context) throw new Error("SessionProvider missing"); return context; }
