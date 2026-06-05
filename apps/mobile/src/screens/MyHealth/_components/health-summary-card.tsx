import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function HealthSummaryCard() {
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
