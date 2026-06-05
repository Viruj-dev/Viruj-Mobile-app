import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { IconName } from "./my-health-data";
import SectionHeader from "./section-header";

export default function SimpleListSection({
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
