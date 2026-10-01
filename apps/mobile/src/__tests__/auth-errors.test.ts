import { expect, test } from "bun:test";
import { createAuthApiError, getSignInErrorMessage } from "../features/auth/utils/auth-errors";

test("sign-in distinguishes a missing route, service outage, rejected token and network failure", () => {
  expect(getSignInErrorMessage(createAuthApiError({ status: 404 }))).toBe("Sign-in is unavailable on this server. Please contact support.");
  expect(getSignInErrorMessage(createAuthApiError({ status: 500 }))).toBe("Sign-in service is unavailable. Please try again later.");
  expect(getSignInErrorMessage(createAuthApiError({ code: "provider_token_invalid", status: 401 }))).toBe("Google could not verify your sign-in. Please select your account again.");
  expect(getSignInErrorMessage(createAuthApiError({ code: "NETWORK_ERROR" }))).toBe("Connection lost. Check your internet and try again.");
  expect(getSignInErrorMessage(createAuthApiError({ code: "invalid_credentials", status: 401 }))).toBe("Email or password is incorrect.");
});
