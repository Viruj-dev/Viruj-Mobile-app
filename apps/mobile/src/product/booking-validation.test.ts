import { expect, test } from "bun:test";
import { appointmentDay, bookingDate, bookingPractices, notificationDestination, requestedSchedule, upcomingAppointment, validComplaintPhoto } from "./booking-validation";
import type { Appointment, Practice } from "./api";

test("provider context keeps the same doctor at Hospital X out of Hospital Y", () => {
  const practices = [{ id: "practice-x", hospitalId: 1, bookingEnabled: true }, { id: "practice-y", hospitalId: 2, bookingEnabled: true }] as Practice[];
  expect(bookingPractices(practices, "1").map(p => p.id)).toEqual(["practice-x"]);
  expect(bookingPractices(practices, undefined, "practice-y").map(p => p.id)).toEqual(["practice-y"]);
  expect(bookingPractices(practices, "1", "practice-y")).toEqual([]);
  expect(bookingPractices(practices, "3")).toEqual([]);
});
test("requested time is validated and sent in provider India timezone", () => {
  expect(requestedSchedule("2099-01-01", "18:00")).toEqual({ startsAt: "2099-01-01T18:00:00+05:30", endsAt: "2099-01-01T13:00:00.000Z" });
  for (const [date, time] of [["2099-02-29", "18:00"], ["2099-01-01", "25:00"], ["2099-01-01", "18:60"], ["2000-01-01", "18:00"]]) expect(requestedSchedule(date!, time!)).toBeNull();
  expect(bookingDate(new Date("2099-01-01T20:00:00Z"))).toBe("2099-01-02");
  expect(appointmentDay({ appointmentDate: "2099-01-01T20:00:00Z" } as Appointment)).toBe("2099-01-02");
});
test("history includes past pending/approved appointments and terminal states", () => {
  const item = { status: "pending_approval", appointmentDate: "2099-01-01" } as Appointment;
  expect(upcomingAppointment(item)).toBe(true);
  expect(upcomingAppointment({ ...item, status: "approved" })).toBe(true);
  expect(upcomingAppointment({ ...item, appointmentDate: "2000-01-01" })).toBe(false);
  for (const status of ["rejected", "cancelled", "completed", "no_show"]) expect(upcomingAppointment({ ...item, status })).toBe(false);
});
test("symptom photos use supported formats and bounded decoded size", () => {
  expect(validComplaintPhoto("data:image/png;base64,AQID")).toBe(true);
  expect(validComplaintPhoto("data:image/jpeg;base64,AQ==")).toBe(true);
  for (const photo of ["data:image/svg+xml;base64,AQID", "data:image/png;base64,A", "https://example.com/photo", "data:image/png;base64," + "AAAA".repeat(699051)]) expect(validComplaintPhoto(photo)).toBe(false);
});
test("appointment notifications open the specific appointment", () => {
  expect(notificationDestination("/appointments/appointment-x")).toEqual({ name: "appointment", id: "appointment-x" });
  expect(notificationDestination("/my-health?appointmentId=appointment-y")).toEqual({ name: "appointment", id: "appointment-y" });
  expect(notificationDestination("/my-health")).toEqual({ name: "health" });
});
