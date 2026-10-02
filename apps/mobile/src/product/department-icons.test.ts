import { expect, test } from "bun:test";
import { departmentIcon } from "./department-icons";

test("the first eight live departments have distinct specialty icons", () => {
  const names = ["Cardiac Anaesthesia & Critical Care", "Cardiac Sciences", "Cardiac Surgery", "Cardiology", "Clinical Dermatology", "Clinical Psychiatry", "Critical Care & Anaesthesia", "Dental Sciences"];
  expect(new Set(names.map(departmentIcon)).size).toBe(names.length);
  expect(departmentIcon("Unknown Department")).toBe("medical-outline");
});
