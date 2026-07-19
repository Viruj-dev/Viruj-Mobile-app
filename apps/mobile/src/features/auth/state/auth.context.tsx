import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import * as authApi from "../api/auth.api";
import type { AuthSession, OtpChallenge } from "../api/auth.types";
import {
  setAccessToken,
  setAuthFailureHandler,
  setSessionRefreshedHandler,
} from "../../../lib/api-client";
import { validateApiBaseUrl } from "../../../lib/env";
import { authStorage } from "../services/auth-storage.service";
import { getDeviceInfo, getOrCreateInstallationId } from "../services/device.service";
import { getErrorCode } from "../utils/auth-errors";
import { normalizeIndianPhoneNumber } from "../utils/phone-number";
import { authReducer, initialAuthState, type AuthState } from "./auth.reducer";

type AuthContextValue = AuthState & {
  bootstrapSession: () => Promise<void>;
  requestOtp: (phoneNumber: string) => Promise<OtpChallenge>;
  verifyOtp: (otp: string) => Promise<AuthSession>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const applySessionState = useCallback(async (session: AuthSession) => {
    await authStorage.setRefreshToken(session.refreshToken);
    setAccessToken(session.accessToken);
    dispatch({ type: "AUTHENTICATED", session });
  }, []);

  const bootstrapSession = useCallback(async () => {
    dispatch({ type: "BOOTSTRAP" });

    try {
      validateApiBaseUrl();
      await getOrCreateInstallationId();

      const refreshToken = await authStorage.getRefreshToken();
      if (!refreshToken) {
        dispatch({ type: "UNAUTHENTICATED" });
        return;
      }

      const refreshed = await authApi.refreshToken();
      await applySessionState(refreshed);

      const session = await authApi.getSession();
      dispatch({
        type: "SESSION_STATE",
        user: session.user,
        requiresOnboarding: session.requiresOnboarding,
      });
    } catch (error) {
      await authStorage.clearAuthStorage();
      setAccessToken(null);
      dispatch({ type: "UNAUTHENTICATED", errorCode: getErrorCode(error) });
    }
  }, [applySessionState]);

  useEffect(() => {
    setAuthFailureHandler(() => {
      dispatch({ type: "LOGGED_OUT", errorCode: "AUTH_UNAUTHORIZED" });
    });
    setSessionRefreshedHandler((session) => {
      dispatch({ type: "AUTHENTICATED", session });
    });

    void bootstrapSession();

    return () => {
      setAuthFailureHandler(null);
      setSessionRefreshedHandler(null);
    };
  }, [bootstrapSession]);

  const requestOtp = useCallback(async (phoneNumber: string) => {
    const normalized = normalizeIndianPhoneNumber(phoneNumber);
    const challenge = await authApi.requestOtp(normalized);
    dispatch({
      type: "OTP_REQUESTED",
      challenge: { ...challenge, phoneNumber: normalized },
    });
    return challenge;
  }, []);

  const verifyOtp = useCallback(
    async (otp: string) => {
      if (!state.challenge) {
        throw new Error("OTP_CHALLENGE_NOT_FOUND");
      }

      const session = await authApi.verifyOtp({
        challengeId: state.challenge.challengeId,
        phoneNumber: state.challenge.phoneNumber,
        otp,
        device: await getDeviceInfo(),
      });
      await applySessionState(session);
      return session;
    },
    [applySessionState, state.challenge]
  );

  const refreshSession = useCallback(async () => {
    const session = await authApi.refreshToken();
    await applySessionState(session);
  }, [applySessionState]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Local logout must still happen when the server session is gone.
    } finally {
      await authStorage.clearRefreshToken();
      setAccessToken(null);
      dispatch({ type: "LOGGED_OUT" });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      bootstrapSession,
      requestOtp,
      verifyOtp,
      refreshSession,
      logout,
    }),
    [bootstrapSession, logout, refreshSession, requestOtp, state, verifyOtp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
