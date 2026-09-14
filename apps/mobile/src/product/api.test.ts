import { expect, test } from "bun:test";
import { createWebApi, validateOrigin } from "./api";

function storage(initial: string | null = null) { let value = initial; return { get: async () => value, set: async (token: string) => { value = token; }, clear: async () => { value = null; } }; }
test("uses the mobile namespace and stores signed session renewal", async () => {
  const store = storage("old.signed");
  const client = createWebApi("https://example.test", store, (async (url, init) => {
    expect(url).toBe("https://example.test/api/mobile/auth/get-session");
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer old.signed");
    return Response.json({ user: { id: "a" } }, { headers: { "set-auth-token": "new.signed" } });
  }));
  await client.request("/auth/get-session"); expect(await store.get()).toBe("new.signed");
});
test("network errors preserve the session, unauthorized responses clear it", async () => {
  const store = storage("signed");
  const offline = createWebApi("https://example.test", store, (async () => { throw new Error("offline"); }));
  await expect(offline.request("/users/a")).rejects.toThrow("Cannot connect"); expect(await store.get()).toBe("signed");
  let expired = false;
  const client = createWebApi("https://example.test", store, (async () => Response.json({}, { status: 401 })));
  client.setUnauthorized(() => { expired = true; });
  await expect(client.request("/users/a")).rejects.toThrow(); expect(await store.get()).toBeNull(); expect(expired).toBe(true);
});
test("does not automatically retry writes and rejects unsafe origins", async () => {
  let attempts = 0;
  const client = createWebApi("https://example.test", storage(), (async () => { attempts++; return Response.json({}, { status: 503 }); }));
  await expect(client.request("/appointments", { method: "POST", body: {} })).rejects.toThrow(); expect(attempts).toBe(1);
  expect(() => validateOrigin("http://example.com", false)).toThrow();
  expect(() => validateOrigin("https://secret@example.com", false)).toThrow();
  expect(validateOrigin("http://localhost:3000", true)).toBe("http://localhost:3000");
});
test("stores a signed bearer session after OTP verification", async () => {
  const store = storage(null);
  const client = createWebApi("https://example.test", store, (async (url) => {
    expect(url).toBe("https://example.test/api/mobile/auth/phone-number/verify");
    return Response.json({ status: true }, { headers: { "set-auth-token": "otp.signed" } });
  }));
  await client.request("/auth/phone-number/verify", { method: "POST", public: true, body: { phoneNumber: "+919876543210", code: "123456" } });
  expect(await store.get()).toBe("otp.signed");
});

test("routes care to the shared backend while retaining web authentication", async () => {
  const calls: string[] = [];
  const client = createWebApi("https://web.test", storage("patient.signed"), async (url, init) => {
    calls.push(url); expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer patient.signed");
    return Response.json({});
  }, "https://backend.test");
  await client.request("/doctors/1"); await client.request("/appointments"); await client.request("/users/a");
  expect(calls).toEqual(["https://backend.test/api/patient/doctors/1", "https://backend.test/api/patient/appointments", "https://web.test/api/mobile/users/a"]);
});
