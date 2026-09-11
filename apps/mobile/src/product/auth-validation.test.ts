import { expect, test } from "bun:test";
import { validateAuth } from "./auth-validation";
test("auth forms validate signup consent and confirmation without restricting existing login passwords", () => {
  const values = {name: "Test Patient", email: "patient@example.test", password: "test-password", confirmation: "test-password", accepted: true};
  expect(validateAuth("signup", values)).toBe("");
  expect(validateAuth("signup", {...values, accepted: false})).toContain("privacy");
  expect(validateAuth("signup", {...values, confirmation: "different"})).toContain("match");
  expect(validateAuth("signup", {...values, password: "short"})).toContain("8");
  expect(validateAuth("login", {...values, password: "legacy"})).toBe("");
  expect(validateAuth("reset", {...values, email: "invalid"})).toContain("email");
  expect(validateAuth("reset", {...values, password: ""})).toBe("");
});
