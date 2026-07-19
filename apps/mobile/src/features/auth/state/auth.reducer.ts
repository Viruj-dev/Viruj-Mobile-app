import type {
  AuthSession,
  AuthStatus,
  OtpChallenge,
  SafeMobileUser,
} from "../api/auth.types";

export type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
  user: SafeMobileUser | null;
  challenge: (OtpChallenge & { phoneNumber: string }) | null;
  errorCode?: string;
};

export const initialAuthState: AuthState = {
  status: "bootstrapping",
  accessToken: null,
  user: null,
  challenge: null,
};

type AuthAction =
  | { type: "BOOTSTRAP" }
  | { type: "UNAUTHENTICATED"; errorCode?: string }
  | { type: "OTP_REQUESTED"; challenge: OtpChallenge & { phoneNumber: string } }
  | { type: "AUTHENTICATED"; session: AuthSession }
  | { type: "SESSION_STATE"; user: SafeMobileUser; requiresOnboarding: boolean }
  | { type: "LOGGED_OUT"; errorCode?: string };

function statusFromOnboarding(requiresOnboarding: boolean): AuthStatus {
  return requiresOnboarding ? "requiresOnboarding" : "authenticated";
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "BOOTSTRAP":
      return { ...state, status: "bootstrapping", errorCode: undefined };
    case "UNAUTHENTICATED":
    case "LOGGED_OUT":
      return {
        status: "unauthenticated",
        accessToken: null,
        user: null,
        challenge: null,
        errorCode: action.errorCode,
      };
    case "OTP_REQUESTED":
      return {
        ...state,
        status: "unauthenticated",
        challenge: action.challenge,
        errorCode: undefined,
      };
    case "AUTHENTICATED":
      return {
        status: statusFromOnboarding(action.session.requiresOnboarding),
        accessToken: action.session.accessToken,
        user: action.session.user,
        challenge: null,
      };
    case "SESSION_STATE":
      return {
        ...state,
        status: statusFromOnboarding(action.requiresOnboarding),
        user: action.user,
      };
    default:
      return state;
  }
}
