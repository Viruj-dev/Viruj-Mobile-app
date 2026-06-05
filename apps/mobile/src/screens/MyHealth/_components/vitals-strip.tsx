import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { vitals } from "./my-health-data";
import SectionHeader from "./section-header";

export default function VitalsStrip() {
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
