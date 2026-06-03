import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export type AppTab = "Home" | "My Health" | "AI Assistant" | "Community" | "Profile";

type IconName = keyof typeof Ionicons.glyphMap;

const navItems: Array<{ label: AppTab; display: string; icon: IconName }> = [
  { label: "Home", display: "Home", icon: "home-outline" },
  { label: "My Health", display: "Health", icon: "pulse-outline" },
  { label: "AI Assistant", display: "AI Assist", icon: "sparkles" },
  { label: "Community", display: "Social", icon: "people-outline" },
  { label: "Profile", display: "Profile", icon: "person-outline" },
];

export default function AppTabBar({
  activeTab,
  onTabPress,
}: {
  activeTab: AppTab;
  onTabPress?: (tab: AppTab) => void;
}) {
  return (
    <View
      className="absolute bottom-[18px] left-[22px] right-[22px] z-50 h-[76px] flex-row items-center justify-around rounded-[28px] border border-[#ECF0F5] bg-white px-2"
      style={{
        elevation: 16,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 22,
      }}
    >
      {navItems.map((tab) => {
        const featured = tab.label === "AI Assistant";
        const active = tab.label === activeTab;

        return (
          <Pressable
            key={tab.label}
            onPress={() => onTabPress?.(tab.label)}
            className={`min-h-[68px] flex-1 items-center justify-center ${
              featured ? "-mt-[22px]" : ""
            }`}
          >
            <View
              className={`h-[38px] w-[38px] items-center justify-center rounded-full ${
                active ? "bg-[#E8F8F0]" : ""
              } ${
                featured
                  ? "h-[62px] w-[62px] rounded-full border-[5px] border-white bg-[#36B49B]"
                  : ""
              }`}
            >
              <Ionicons
                name={tab.icon}
                size={featured ? 28 : 23}
                color={featured ? "#FFFFFF" : active ? "#059669" : "#7C8AA5"}
              />
            </View>
            <Text
              numberOfLines={1}
              className={`mt-[3px] text-[11px] font-bold ${
                active ? "text-[#059669]" : "text-[#7C8AA5]"
              }`}
            >
              {tab.display}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
