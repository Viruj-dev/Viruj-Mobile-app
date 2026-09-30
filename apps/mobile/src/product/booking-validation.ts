import type { Appointment, Practice } from "./api";
import type { Destination } from "./home";

export function bookingDate(value: Date) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(value); }
export function bookingTime(value: string) { return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
export function validBookingDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00+05:30`);
  return Number.isFinite(date.getTime()) && bookingDate(date) === value && value >= bookingDate(new Date());
}
export function requestedSchedule(date: string, time: string) {
  if (!validBookingDate(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const startsAt = `${date}T${time}:00+05:30`;
  if (new Date(startsAt).getTime() <= Date.now()) return null;
  return { startsAt, endsAt: new Date(new Date(startsAt).getTime() + 30 * 60000).toISOString() };
}
export function bookingPractices(practices: Practice[], providerId?: string, practiceId?: string) { return practices.filter(p => (!providerId || String(p.hospitalId) === providerId) && (!practiceId || p.id === practiceId)); }
export function appointmentDay(item: Appointment) {
  const value = item.startsAt || item.appointmentDate;
  return value.includes("T") ? new Intl.DateTimeFormat("en-CA", { timeZone: item.timezone || "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value)) : value;
}
export function upcomingAppointment(item: Appointment) { return ["approved", "pending_approval", "rescheduled"].includes(item.status) && appointmentDay(item) >= bookingDate(new Date()); }
export function validComplaintPhoto(value: string) {
  const match = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[1]!.length % 4 !== 0) return false;
  const data = match[1]!;
  return data.length / 4 * 3 - (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0) <= 2 * 1024 * 1024;
}
export function notificationDestination(link: string): Destination {
  const url = new URL(link, "https://app.virujhealth.com");
  const appointmentId = /^\/appointments\/([^/]+)$/.exec(url.pathname)?.[1] || (url.pathname === "/my-health" ? url.searchParams.get("appointmentId") : null);
  if (appointmentId) return { name: "appointment", id: decodeURIComponent(appointmentId) };
  return { name: url.pathname === "/my-health" ? "health" : url.pathname === "/profile/edit" ? "edit-profile" : url.pathname === "/community" ? "community" : "profile" };
}
