import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function TopBar() {
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
