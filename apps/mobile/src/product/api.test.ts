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
