import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../AppTabBar";

type IconName = keyof typeof Ionicons.glyphMap;

const avatar =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80";

const bodyStats = [
  ["WEIGHT", "74", "kg"],
  ["HEIGHT", "178", "cm"],
  ["BLOOD", "B+", ""],
] as const;

const recordCards: Array<[string, string, IconName, string, string]> = [
  ["Lab Reports", "12 Files uploaded", "file-tray-full-outline", "#0E7775", "#E7F7F5"],
  ["Prescriptions", "4 Active", "clipboard-outline", "#5366A8", "#F0F1F7"],
];

const settings: Array<[string, IconName]> = [
  ["Personal Information", "person-outline"],
  ["App Preferences", "settings-outline"],
  ["Payment Methods", "cash-outline"],
];

const support: Array<[string, IconName]> = [
  ["Help Center", "help-circle-outline"],
  ["Send Feedback", "chatbox-outline"],
];

function TopBar() {
  return (
    <View className="h-[70px] flex-row items-center justify-between border-b border-[#ECEFF1] bg-[#F8F9FA] px-6">
      <Text className="text-[24px] font-extrabold tracking-normal text-[#006C69]">
        Viruj
      </Text>

      <Pressable className="h-[44px] w-[44px] items-center justify-center rounded-full bg-[#F1F3F4]">
        <Ionicons name="notifications-outline" size={24} color="#162124" />
        <View className="absolute right-[10px] top-[5px] h-[5px] w-[5px] rounded-full bg-[#C40000]" />
      </Pressable>
    </View>
  );
}

function ProfileCard() {
  return (
    <View
      className="mb-8 overflow-hidden rounded-[20px] bg-[#07847F] px-[24px] pb-[24px] pt-[26px]"
      style={{
        elevation: 10,
        shadowColor: "#003D3A",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      }}
    >
      <View className="absolute -right-[80px] -top-[70px] h-[220px] w-[220px] rounded-full bg-[#0E9996] opacity-35" />

      <View className="flex-row items-center">
        <View className="h-[82px] w-[82px] items-center justify-center rounded-full border-[5px] border-[#E7F7F5] bg-white">
          <Image
            source={{ uri: avatar }}
            className="h-[70px] w-[70px] rounded-full"
            resizeMode="cover"
          />
        </View>

        <View className="ml-[18px] min-w-0 flex-1">
          <View className="flex-row items-center">
            <Text className="min-w-0 flex-1 text-[21px] font-extrabold leading-[26px] text-white">
              Abhishek Negi
            </Text>
            <Ionicons name="ribbon-outline" size={20} color="#FFE500" />
          </View>
          <Text className="mt-1 text-[13px] font-medium text-[#D7F4F1]">
            abhisheknegi@gmail.com
          </Text>

          <View className="mt-[9px] h-[25px] w-[128px] flex-row items-center justify-center rounded-full bg-[#9BFF87]">
            <Ionicons name="star-outline" size={13} color="#063D22" />
            <Text className="ml-2 text-[11px] font-extrabold text-[#063D22]">
              PRO MEMBER
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-[28px] flex-row justify-between">
        {bodyStats.map(([label, value, unit]) => (
          <View
            key={label}
            className="h-[72px] w-[31%] items-center justify-center rounded-[13px] border border-[#5AB8B3] bg-white/10"
          >
            <Text className="text-[11px] font-medium text-[#D7F4F1]">
              {label}
            </Text>
            <View className="mt-1 flex-row items-end">
              <Text className="text-[17px] font-extrabold text-white">
                {value}
              </Text>
              {unit ? (
                <Text className="mb-[1px] ml-1 text-[10px] font-semibold text-white">
                  {unit}
                </Text>
              ) : null}
            </View>
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
    <View className="mb-[22px] flex-row items-center justify-between">
      <Text className="text-[18px] font-semibold text-[#111111]">{title}</Text>
      {action ? (
        <Pressable>
          <Text className="text-[13px] font-medium text-[#006C69]">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function HealthRecords() {
  return (
    <View className="mb-[32px]">
      <SectionHeader title="My Health Records" action="View All" />
      <View className="flex-row justify-between">
        {recordCards.map(([title, subtitle, icon, color, bg]) => (
          <Pressable
            key={title}
            className="h-[136px] w-[48%] justify-end rounded-[18px] border border-[#E3E7EA] bg-white px-[18px] pb-[18px]"
            style={{
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            <View
              className="mb-[14px] h-[43px] w-[43px] items-center justify-center rounded-full"
              style={{ backgroundColor: bg }}
            >
              <Ionicons name={icon} size={23} color={color} />
            </View>
            <Text className="text-[17px] font-semibold text-[#111111]">
              {title}
            </Text>
            <Text className="mt-[6px] text-[12px] font-medium text-[#4D5459]">
              {subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MenuGroup({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, IconName]>;
}) {
  return (
    <View className="mb-[30px]">
      <Text className="mb-[14px] ml-[5px] text-[13px] font-medium uppercase tracking-[3px] text-[#172224]">
        {title}
      </Text>

      <View
        className="overflow-hidden rounded-[18px] border border-[#E3E7EA] bg-white"
        style={{
          elevation: 2,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        }}
      >
        {rows.map(([label, icon], index) => (
          <Pressable
            key={label}
            className={`h-[72px] flex-row items-center px-[18px] ${
              index > 0 ? "border-t border-[#EEF0F2]" : ""
            }`}
          >
            <View className="h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#ECEEEF]">
              <Ionicons name={icon} size={21} color="#162124" />
            </View>
            <Text className="ml-[16px] flex-1 text-[17px] font-normal text-[#111111]">
              {label}
            </Text>
            <Ionicons name="chevron-forward" size={21} color="#B8C5C5" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View className="items-center pb-[26px]">
      <Pressable className="mb-[40px] h-[58px] w-full flex-row items-center justify-center rounded-[16px] bg-[#FFD3D0]">
        <Ionicons name="log-out-outline" size={22} color="#A60000" />
        <Text className="ml-[12px] text-[17px] font-semibold text-[#A60000]">
          Logout
        </Text>
      </Pressable>

      <Text className="text-[12px] font-medium text-[#8B9499]">
        Viruj Version 2.4.1 (Build 890)
      </Text>
      <Text className="mt-[9px] text-[13px] font-medium uppercase tracking-[3px] text-[#C0CCCC]">
        Proudly made for health
      </Text>
    </View>
  );
}

export default function ProfileScreen({
  onTabPress,
}: {
  onTabPress?: (tab: AppTab) => void;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <TopBar />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 25,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard />
        <HealthRecords />
        <MenuGroup title="Account Settings" rows={settings} />
        <MenuGroup title="Support" rows={support} />
        <Footer />
      </ScrollView>

      <AppTabBar activeTab="Profile" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}
