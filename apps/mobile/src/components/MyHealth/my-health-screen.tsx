import { Ionicons } from "@expo/vector-icons";
import { FlatList, ListRenderItem, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../AppTabBar";

type IconName = keyof typeof Ionicons.glyphMap;

type Appointment = {
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

type HealthRecord = {
  id: string;
  title: string;
  value: string;
  meta: string;
  icon: IconName;
  color: string;
  bg: string;
};

const appointments: Appointment[] = [
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

const healthRecords: HealthRecord[] = [
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

const vitals = [
  ["Heart Rate", "78", "bpm", "#EF476F", "pulse"],
  ["Blood Pressure", "118/76", "mmHg", "#0E9996", "fitness"],
  ["Glucose", "94", "mg/dL", "#F59E0B", "analytics"],
] as const;

const medications = [
  ["Vitamin D3", "After breakfast", "Daily"],
  ["Metformin 500", "After dinner", "30 days"],
  ["Omega-3", "With lunch", "Alternate days"],
] as const;

const reports = [
  ["CBC Report", "Uploaded 2 days ago", "Normal"],
  ["Lipid Profile", "Uploaded 6 days ago", "Review"],
  ["ECG Summary", "Uploaded 28 May", "Normal"],
] as const;

function TopBar() {
  return (
    <View className="h-[64px] flex-row items-center justify-between border-b border-[#F1F3F5] bg-white px-[18px]">
      <View className="flex-row items-center gap-5">
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="menu" size={28} color="#005B5A" />
        </Pressable>
        <Text className="text-[22px] font-extrabold tracking-normal text-[#005B5A]">
          Viruj
        </Text>
      </View>

      <View className="flex-row items-center gap-5">
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="search-outline" size={24} color="#005B5A" />
        </Pressable>
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="notifications-outline" size={23} color="#005B5A" />
        </Pressable>
      </View>
    </View>
  );
}

function Header() {
  return (
    <View className="mb-5 pt-5">
      <Text className="text-[13px] font-extrabold uppercase tracking-normal text-[#059669]">
        My Health
      </Text>
      <Text className="mt-1 text-[31px] font-extrabold leading-[36px] tracking-normal text-[#001B49]">
        Your care timeline
      </Text>
      <Text className="mt-1 text-[14px] font-semibold leading-5 text-[#536682]">
        Appointments, records, reports, vitals and medication in one place.
      </Text>
    </View>
  );
}

function HealthSummaryCard() {
  return (
    <View className="mb-7 overflow-hidden rounded-[24px] bg-[#0E9996] p-[18px]">
      <View className="absolute -right-[72px] -top-[82px] h-[220px] w-[220px] rounded-full bg-[#43D8C1] opacity-40" />
      <View className="absolute -bottom-[92px] -left-[80px] h-[230px] w-[230px] rounded-full bg-[#047C9D] opacity-35" />

      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 pr-4">
          <Text className="text-[14px] font-semibold text-[#E9FFFB]">
            Health profile
          </Text>
          <Text className="mt-1 text-[27px] font-extrabold leading-[32px] tracking-normal text-white">
            Abhishek Negi
          </Text>
          <Text className="mt-1 text-[14px] font-semibold text-[#F0FFFC]">
            Last updated today at 10:24 AM
          </Text>
        </View>

        <View className="h-[70px] w-[70px] items-center justify-center rounded-[24px] bg-white">
          <Ionicons name="medical" size={36} color="#0E9996" />
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        {[
          ["Appointments", "3"],
          ["Reports", "12"],
          ["Alerts", "1"],
        ].map(([label, value]) => (
          <View
            key={label}
            className="min-h-[70px] flex-1 rounded-[18px] bg-white/20 px-3 py-3"
          >
            <Text className="text-[22px] font-extrabold leading-[26px] text-white">
              {value}
            </Text>
            <Text className="mt-1 text-[11px] font-bold text-[#E9FFFB]">
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-[22px] font-extrabold leading-[27px] tracking-normal text-[#001B49]">
        {title}
      </Text>
      {action ? (
        <Pressable className="h-[40px] flex-row items-center gap-[5px] rounded-full border border-[#E4EAF2] bg-white px-[15px]">
          <Text className="text-[13px] font-extrabold text-[#001B49]">
            {action}
          </Text>
          <Ionicons name="chevron-forward" size={17} color="#001B49" />
        </Pressable>
      ) : null}
    </View>
  );
}

function AppointmentCard({ item }: { item: Appointment }) {
  const upcoming = item.status === "Upcoming";

  return (
    <Pressable
      className="mb-4 overflow-hidden rounded-[22px] border border-[#E5ECF4] bg-white p-4"
      style={{
        elevation: 4,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View
        className="absolute -right-[42px] -top-[46px] h-[126px] w-[126px] rounded-full opacity-25"
        style={{ backgroundColor: item.accent }}
      />

      <View className="flex-row items-start gap-3">
        <View
          className="h-[54px] w-[54px] items-center justify-center rounded-[18px]"
          style={{ backgroundColor: item.bg }}
        >
          <Ionicons name={item.icon} size={26} color={item.accent} />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="min-w-0 flex-1 text-[18px] font-extrabold leading-[23px] tracking-normal text-[#001B49]">
              {item.doctor}
            </Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: upcoming ? "#E9FBF8" : "#F0F7FF" }}
            >
              <Text
                className="text-[10px] font-extrabold"
                style={{ color: upcoming ? "#059669" : "#4B8FEA" }}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <Text className="mt-1 text-[13px] font-semibold text-[#536682]">
            {item.department}
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-2">
            {[item.date, item.time, item.mode].map((detail) => (
              <View
                key={detail}
                className="rounded-full border border-[#E5ECF4] bg-[#F8FBFF] px-3 py-2"
              >
                <Text className="text-[11px] font-extrabold text-[#24405F]">
                  {detail}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function RecordsGrid() {
  return (
    <View className="mb-6">
      <SectionHeader title="Health records" action="Manage" />
      <View className="flex-row flex-wrap justify-between">
        {healthRecords.map((record) => (
          <Pressable
            key={record.id}
            className="mb-3 min-h-[124px] w-[48%] rounded-[20px] border border-[#E5ECF4] bg-white p-4"
            style={{
              elevation: 3,
              shadowColor: "#123D78",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.07,
              shadowRadius: 14,
            }}
          >
            <View
              className="mb-3 h-[42px] w-[42px] items-center justify-center rounded-full"
              style={{ backgroundColor: record.bg }}
            >
              <Ionicons name={record.icon} size={22} color={record.color} />
            </View>
            <Text className="text-[12px] font-bold text-[#536682]">
              {record.title}
            </Text>
            <Text className="mt-1 text-[19px] font-extrabold leading-[23px] text-[#001B49]">
              {record.value}
            </Text>
            <Text className="mt-1 text-[11px] font-semibold text-[#7B8AA6]">
              {record.meta}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function VitalsStrip() {
  return (
    <View className="mb-7">
      <SectionHeader title="Latest vitals" />
      <View className="flex-row gap-3">
        {vitals.map(([label, value, unit, color, icon]) => (
          <View
            key={label}
            className="min-h-[128px] flex-1 rounded-[20px] border border-[#E5ECF4] bg-white p-3"
          >
            <View
              className="mb-3 h-[38px] w-[38px] items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}18` }}
            >
              <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text className="text-[11px] font-bold leading-[14px] text-[#536682]">
              {label}
            </Text>
            <Text className="mt-1 text-[18px] font-extrabold text-[#001B49]">
              {value}
            </Text>
            <Text className="text-[10px] font-semibold text-[#7B8AA6]">
              {unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SimpleListSection({
  title,
  rows,
  icon,
  color,
}: {
  title: string;
  rows: readonly (readonly [string, string, string])[];
  icon: IconName;
  color: string;
}) {
  return (
    <View className="mb-7">
      <SectionHeader title={title} action="View all" />
      <View className="overflow-hidden rounded-[22px] border border-[#E5ECF4] bg-white">
        {rows.map(([name, detail, status], index) => (
          <Pressable
            key={name}
            className={`min-h-[76px] flex-row items-center gap-3 px-4 py-3 ${
              index > 0 ? "border-t border-[#EEF2F7]" : ""
            }`}
          >
            <View
              className="h-[44px] w-[44px] items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}16` }}
            >
              <Ionicons name={icon} size={21} color={color} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[15px] font-extrabold text-[#001B49]">
                {name}
              </Text>
              <Text className="mt-1 text-[12px] font-semibold text-[#536682]">
                {detail}
              </Text>
            </View>
            <Text className="text-[11px] font-extrabold text-[#059669]">
              {status}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MyHealthContent() {
  return (
    <>
      <Header />
      <HealthSummaryCard />

      <SectionHeader title="Appointments" action="Book new" />
    </>
  );
}

export default function MyHealthScreen({
  onTabPress,
}: {
  onTabPress?: (tab: AppTab) => void;
}) {
  const renderAppointment: ListRenderItem<Appointment> = ({ item }) => (
    <AppointmentCard item={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBFF]">
      <TopBar />
      <FlatList
        ListHeaderComponent={<MyHealthContent />}
        ListFooterComponent={
          <>
            <RecordsGrid />
            <VitalsStrip />
            <SimpleListSection
              title="Medications"
              rows={medications}
              icon="medkit-outline"
              color="#0E9996"
            />
            <SimpleListSection
              title="Reports & documents"
              rows={reports}
              icon="document-attach-outline"
              color="#4B8FEA"
            />
          </>
        }
        contentContainerStyle={{ paddingBottom: 132, paddingHorizontal: 22 }}
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        showsVerticalScrollIndicator={false}
      />

      <AppTabBar activeTab="My Health" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}
