import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { recordCards } from "./profile-data";
import SectionHeader from "./section-header";

export default function HealthRecords() {
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
