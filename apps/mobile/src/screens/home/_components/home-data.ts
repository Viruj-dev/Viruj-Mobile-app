import { Ionicons } from "@expo/vector-icons";

export type IconName = keyof typeof Ionicons.glyphMap;

export type EmptyCard = {
  id: string;
  variant: number;
  bg: string;
  accent: string;
};

export const quickActions: Array<{ label: string; icon: IconName }> = [
  { label: "Book\nAppointment", icon: "calendar-outline" },
  { label: "Consult\nOnline", icon: "chatbox-ellipses-outline" },
  { label: "Upload\nReports", icon: "document-text-outline" },
  { label: "Health\nRecords", icon: "medkit-outline" },
];

export const concerns: Array<{
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
}> = [
  {
    title: "Cardiac\nSciences",
    subtitle: "Heart & Vascular\nCare",
    icon: "\u2764\uFE0F",
    color: "#EF476F",
    bg: "#FFF0F4",
  },
  {
    title: "Neurosciences",
    subtitle: "Brain, Spine &\nNerve Care",
    icon: "\uD83E\uDDE0",
    color: "#EF5D7A",
    bg: "#FFF0F4",
  },
  {
    title: "Orthopaedics",
    subtitle: "Bone, Joint &\nMuscle Care",
    icon: "\uD83E\uDDB4",
    color: "#4B8FEA",
    bg: "#EFF6FF",
  },
  {
    title: "Internal\nMedicine",
    subtitle: "General & Chronic\nCare",
    icon: "\uD83E\uDE7A",
    color: "#0E9996",
    bg: "#E9FBF8",
  },
  {
    title: "Women &\nChild Care",
    subtitle: "Women's Health\n& Pediatrics",
    icon: "\uD83D\uDC69\u200D\uD83C\uDF7C",
    color: "#D946A3",
    bg: "#FDF2F8",
  },
  {
    title: "Oncology",
    subtitle: "Cancer Care &\nSupport",
    icon: "\uD83C\uDF97\uFE0F",
    color: "#F59E0B",
    bg: "#FFF7E6",
  },
  {
    title: "Diagnostics\n& Imaging",
    subtitle: "Tests, Scans &\nImaging",
    icon: "\uD83D\uDC41\uFE0F",
    color: "#0E9996",
    bg: "#E9FBF8",
  },
  {
    title: "Surgery",
    subtitle: "Advanced\nSurgical Care",
    icon: "\uD83E\uDE79",
    color: "#8B5CF6",
    bg: "#F4F0FF",
  },
];

const emptyCardThemes = [
  ["#F0F7FF", "#66A9EA"],
  ["#EEF9F3", "#10B981"],
  ["#FFF7E8", "#F59E0B"],
  ["#F4F0FF", "#8B5CF6"],
  ["#FFF0F4", "#EF476F"],
];

export const makeEmptyCards = (start: number, count: number): EmptyCard[] =>
  Array.from({ length: count }, (_, index) => {
    const number = start + index;
    const [bg, accent] = emptyCardThemes[number % emptyCardThemes.length];

    return {
      id: `empty-home-card-${number}`,
      variant: number % 4,
      bg,
      accent,
    };
  });
