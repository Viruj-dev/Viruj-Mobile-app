import type { AuthStatus } from "../features/auth/api/auth.types";

export type RootRoute = "splash" | "auth" | "onboarding" | "app";

export function selectRootRoute(status: AuthStatus): RootRoute {
  if (status === "bootstrapping") {
    return "splash";
  }

  if (status === "requiresOnboarding") {
    return "onboarding";
  }

  return status === "authenticated" ? "app" : "auth";
}