import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../../_components/AppTabBar";

const rows = [
  ["Personal information", "person-outline"],
  ["Health information", "heart-outline"],
  ["Emergency contact", "call-outline"],
] as const;

function ProfileRow({ label, icon }: { label: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable className="h-[62px] flex-row items-center border-b border-[#EEE8E0] px-5 last:border-b-0">
      <Ionicons name={icon} size={21} color="#111111" />
      <Text className="ml-4 flex-1 text-[14px] font-semibold text-[#111111]">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#111111" />
    </Pressable>
  );
}

export default function ProfileScreenContent({
  onTabPress,
  onLogout,
}: {
  onTabPress?: (tab: AppTab) => void;
  onLogout?: () => void;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#FBF8F2]">
      <View className="pointer-events-none absolute -left-24 top-16 h-px w-[520px] rotate-[61deg] bg-[#DDD6CD]" />
      <View className="pointer-events-none absolute -right-28 top-0 h-px w-[520px] rotate-[-62deg] bg-[#E4DDD4]" />

      <View className="h-[70px] flex-row items-center justify-between px-6">
        <View className="h-11 w-11" />
        <Text className="text-[18px] font-semibold text-[#111111]">Profile</Text>
        <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <Ionicons name="settings-outline" size={23} color="#111111" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 128,
          paddingHorizontal: 24,
          paddingTop: 18,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View className="relative mb-4 h-[112px] w-[112px] items-center justify-center rounded-full border border-[#DED8D0] bg-[#E9E6E1]">
            <Text className="text-[38px] font-semibold text-[#2B2B2B]">AS</Text>
            <Pressable className="absolute bottom-1 right-1 h-9 w-9 items-center justify-center rounded-full bg-[#18A66B]">
              <Ionicons name="pencil" size={17} color="white" />
            </Pressable>
          </View>
          <Text className="text-[24px] font-semibold text-[#111111]">Ananya Sharma</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Text className="text-[14px] font-medium text-[#5F5A55]">+91 98765 43210</Text>
            <View className="h-5 w-5 items-center justify-center rounded-full bg-[#18A66B]">
              <Ionicons name="checkmark" size={13} color="white" />
            </View>
          </View>
        </View>

        <View className="mt-8 overflow-hidden rounded-[18px] border border-[#E1DBD3] bg-white">
          {rows.map(([label, icon]) => (
            <ProfileRow key={label} label={label} icon={icon} />
          ))}
        </View>

        <View className="mt-4 rounded-[18px] border border-[#E1DBD3] bg-white p-5">
          <Text className="mb-3 text-[15px] font-semibold text-[#111111]">Profile 80% complete</Text>
          <View className="mb-5 h-[6px] overflow-hidden rounded-full bg-[#E1DBD3]">
            <View className="h-full w-4/5 rounded-full bg-[#18A66B]" />
          </View>
          <SecondaryProfileButton label="Complete profile" onPress={() => {}} />
        </View>

        <Pressable
          className="mt-5 min-h-[58px] flex-row items-center rounded-[18px] bg-[#171717] px-5"
          style={{
            elevation: 7,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
            shadowRadius: 18,
          }}
        >
          <Ionicons name="id-card-outline" size={24} color="white" />
          <Text className="ml-4 flex-1 text-[16px] font-semibold text-white">View health ID</Text>
          <Ionicons name="chevron-forward" size={22} color="white" />
        </Pressable>

        <Pressable
          onPress={onLogout}
          className="mt-4 min-h-[52px] items-center justify-center rounded-[16px] border border-[#F3C5C0] bg-[#FFF4F2]"
        >
          <Text className="text-[14px] font-bold text-[#B42318]">Logout</Text>
        </Pressable>
      </ScrollView>

      <AppTabBar activeTab="Profile" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

function SecondaryProfileButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[50px] items-center justify-center rounded-full border border-[#2F2B27] bg-white"
    >
      <Text className="text-[14px] font-semibold text-[#111111]">{label}</Text>
    </Pressable>
  );
}