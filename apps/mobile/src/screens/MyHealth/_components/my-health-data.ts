import { Ionicons } from "@expo/vector-icons";

export type IconName = keyof typeof Ionicons.glyphMap;

export type Appointment = {
  id: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  mode: string;
  status: "Upcoming" | "Completed" | "Follow-up";
  accent: string;
  bg: string;
  icon: IconName;
};

export type HealthRecord = {
  id: string;
  title: string;
  value: string;
  meta: string;
  icon: IconName;
  color: string;
  bg: string;
};

export const appointments: Appointment[] = [
  {
    id: "appt-1",
    doctor: "Dr. Meera Kapoor",
    department: "Internal Medicine",
    date: "Today",
    time: "04:30 PM",
    mode: "Video consultation",
    status: "Upcoming",
    accent: "#0E9996",
    bg: "#E9FBF8",
    icon: "videocam-outline",
  },
  {
    id: "appt-2",
    doctor: "Dr. Rohan Sethi",
    department: "Cardiac Sciences",
    date: "28 May 2026",
    time: "11:15 AM",
    mode: "Hospital visit",
    status: "Completed",
    accent: "#EF476F",
    bg: "#FFF0F4",
    icon: "heart-outline",
  },
  {
    id: "appt-3",
    doctor: "Dr. Naina Bose",
    department: "Diagnostics & Imaging",
    date: "12 May 2026",
    time: "09:00 AM",
    mode: "Lab appointment",
    status: "Follow-up",
    accent: "#4B8FEA",
    bg: "#EFF6FF",
    icon: "document-text-outline",
  },
];

export const healthRecords: HealthRecord[] = [
  {
    id: "record-1",
    title: "Blood Group",
    value: "B+",
    meta: "Verified profile",
    icon: "water-outline",
    color: "#EF476F",
    bg: "#FFF0F4",
  },
  {
    id: "record-2",
    title: "Allergies",
    value: "Penicillin",
    meta: "1 active alert",
    icon: "warning-outline",
    color: "#F59E0B",
    bg: "#FFF7E6",
  },
  {
    id: "record-3",
    title: "Insurance",
    value: "Active",
    meta: "Policy ends Dec 2026",
    icon: "shield-checkmark-outline",
    color: "#10B981",
    bg: "#EEF9F3",
  },
  {
    id: "record-4",
    title: "Reports",
    value: "12 files",
    meta: "2 new this month",
    icon: "folder-open-outline",
    color: "#4B8FEA",
    bg: "#EFF6FF",
  },
];

export const vitals = [
  ["Heart Rate", "78", "bpm", "#EF476F", "pulse"],
  ["Blood Pressure", "118/76", "mmHg", "#0E9996", "fitness"],
  ["Glucose", "94", "mg/dL", "#F59E0B", "analytics"],
] as const;

export const medications = [
  ["Vitamin D3", "After breakfast", "Daily"],
  ["Metformin 500", "After dinner", "30 days"],
  ["Omega-3", "With lunch", "Alternate days"],
] as const;

export const reports = [
  ["CBC Report", "Uploaded 2 days ago", "Normal"],
  ["Lipid Profile", "Uploaded 6 days ago", "Review"],
  ["ECG Summary", "Uploaded 28 May", "Normal"],
] as const;
