import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { IconName } from "./home-data";

export default function PriorityCard() {
  return (
    <View
      className="mb-6 flex-row items-center overflow-hidden rounded-[22px] border border-[#D9E9FA] bg-[#EAF4FF] p-4"
      style={{
        elevation: 3,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className="absolute -left-[30px] -top-[28px] h-[150px] w-[150px] rounded-full bg-white opacity-30" />
      <View className="mr-4 h-[92px] w-[92px] items-center justify-center rounded-[24px] bg-white">
        <Ionicons name="pulse" size={42} color="#FF5571" />
        <View className="absolute -bottom-2 -right-2 h-11 w-11 items-center justify-center rounded-full bg-[#19A7C7]">
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </View>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[20px] font-extrabold leading-[25px] tracking-normal text-[#001B49]">
          Your Health, Our Priority
        </Text>
        <Text className="mt-2 text-[14px] font-semibold leading-5 text-[#24405F]">
          Track your health, manage appointments and get personalized care.
        </Text>

        <View className="mt-4 flex-row justify-between">
          {[
            ["analytics-outline", "Track Health", "#10B981"],
            ["person-badge-outline", "Expert Doctors", "#3B82F6"],
            ["shield-outline", "Secure & Private", "#8B5CF6"],
          ].map(([icon, label, color]) => (
            <View key={icon} className="max-w-[56px] items-center">
              <View
                className="h-[38px] w-[38px] items-center justify-center rounded-full"
                style={{ backgroundColor: `${color}14` }}
              >
                <Ionicons name={icon as IconName} size={19} color={color} />
              </View>
              <Text
                numberOfLines={1}
                className="mt-[6px] text-center text-[9px] font-bold text-[#001B49]"
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
