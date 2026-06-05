import { Ionicons } from "@expo/vector-icons";

export type IconName = keyof typeof Ionicons.glyphMap;

export const avatar =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80";

export const bodyStats = [
  ["WEIGHT", "74", "kg"],
  ["HEIGHT", "178", "cm"],
  ["BLOOD", "B+", ""],
] as const;

export const recordCards: Array<[string, string, IconName, string, string]> = [
  [
    "Lab Reports",
    "12 Files uploaded",
    "file-tray-full-outline",
    "#0E7775",
    "#E7F7F5",
  ],
  ["Prescriptions", "4 Active", "clipboard-outline", "#5366A8", "#F0F1F7"],
];

export const settings: Array<[string, IconName]> = [
  ["Personal Information", "person-outline"],
  ["App Preferences", "settings-outline"],
  ["Payment Methods", "cash-outline"],
];

export const support: Array<[string, IconName]> = [
  ["Help Center", "help-circle-outline"],
  ["Send Feedback", "chatbox-outline"],
];
