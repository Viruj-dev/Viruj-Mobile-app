import { test, expect } from "bun:test";
import { api } from "./api";
import { startPreview, stopPreview, previewEnabled } from "./preview";
import { validBookingDate } from "./booking-validation";

test("preview click flows stay local, update state, and reset on exit", async () => {
  const fetcher = globalThis.fetch; globalThis.fetch = (() => { throw new Error("UI preview must never use the network"); }) as unknown as typeof fetch;
  try {
    startPreview();
    const doctors = await api.request<{ data: { id: number }[] }>("/doctors");
    expect(doctors.data.length).toBeGreaterThan(0);
    for (const path of ["/hospitals", "/hospitals/1", "/hospitals/1/departments", "/hospitals/1/doctors", "/pathlabs", "/pathlabs/1", "/departments", "/reports"]) expect(await api.request(path)).toBeTruthy();
    expect((await api.request<{ data: unknown[] }>("/doctors?search=does-not-exist")).data).toHaveLength(0);
    const request = { requestId: "new-request", doctorId: 1, selectedDate: "2099-01-01", selectedTimeSlot: "10:30 AM", appointmentType: "in-person" };
    await api.request("/appointments", { method: "POST", body: request }); await api.request("/appointments", { method: "POST", body: request });
    expect((await api.request<{ appointments: { id: string }[] }>("/appointments")).appointments.filter(a => a.id === request.requestId)).toHaveLength(1);
    await api.request("/community/posts", { method: "POST", body: { content: "Preview post", type: "update" } });
    const posts = await api.request<{ data: { id: string; content: string }[] }>("/community/feed"); const post = posts.data[0]!;
    expect(post.content).toBe("Preview post");
    await api.request(`/community/posts/${post.id}`, { method: "PUT", body: { content: "Edited post" } });
    await api.request(`/community/posts/${post.id}/engagement`, { method: "POST", body: { action: "comment", content: "First comment" } });
    const comments = await api.request<{ data: { id: string; replies: unknown[] }[] }>(`/community/posts/${post.id}/comments`);
    await api.request(`/community/comments/${comments.data[0]!.id}/reply`, { method: "POST", body: { content: "A reply" } });
    expect(comments.data[0]!.replies).toHaveLength(1);
    expect(await api.request<{ bookmarked: boolean }>(`/community/posts/${post.id}/bookmark`, { method: "POST" })).toEqual({ bookmarked: true });
    expect(await api.request<{ bookmarked: boolean }>(`/community/posts/${post.id}/bookmark`, { method: "POST" })).toEqual({ bookmarked: false });
    await api.request("/notifications", { method: "PATCH", body: { all: true } });
    expect((await api.request<{ data: { isRead: boolean }[] }>("/notifications")).data.every(n => n.isRead)).toBe(true);
    await expect(api.request("/not-implemented")).rejects.toThrow("not connected");
    await api.clear(); expect(previewEnabled).toBe(false); startPreview();
    expect((await api.request<{ appointments: unknown[] }>("/appointments")).appointments).toHaveLength(2);
  } finally { stopPreview(); globalThis.fetch = fetcher; }
});
test("booking accepts real calendar dates and rejects impossible or past dates", () => {
  expect(validBookingDate("2099-01-01")).toBe(true);
  for (const date of ["2099-02-29", "2099-04-31", "2099-13-01", "2000-01-01", "tomorrow"]) expect(validBookingDate(date)).toBe(false);
});
