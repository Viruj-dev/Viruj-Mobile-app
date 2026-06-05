import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { IconName } from "./profile-data";

export default function MenuGroup({
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
