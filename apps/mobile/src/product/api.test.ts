import { expect, spyOn, test } from "bun:test";
import { api, validateOrigin } from "./api";
import { apiClient } from "../lib/api-client";

test("all product API requests use viruj-backend's mobile namespace", async () => {
  const request = spyOn(apiClient, "request").mockResolvedValue({ data: [] });
  try {
    for (const path of ["/doctors", "/appointments", "/users/patient", "/community/feed"]) {
      await api.request(path);
      expect(request).toHaveBeenLastCalledWith(`/api/mobile${path}`, { auth: true, unwrap: false });
    }
    await api.request("/doctors", { public: true });
    expect(request).toHaveBeenLastCalledWith("/api/mobile/doctors", { public: true, auth: false, unwrap: false });
  } finally { request.mockRestore(); }
});

test("product transport retains error status and multipart bodies", async () => {
  const request = spyOn(apiClient, "request").mockResolvedValue({});
  try {
    const body = new FormData(); body.append("file", "sample");
    await api.request("/upload", { method: "POST", body });
    expect(request.mock.calls[0]?.[1]?.body).toBe(body);
    request.mockRejectedValue(Object.assign(new Error("SMS could not be sent"), { status: 503 }));
    await expect(api.request("/test")).rejects.toMatchObject({ status: 503, message: "SMS could not be sent" });
  } finally { request.mockRestore(); }
  expect(() => validateOrigin("http://example.com", false)).toThrow();
  expect(() => validateOrigin("https://secret@example.com", false)).toThrow();
});
