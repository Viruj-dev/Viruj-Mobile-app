import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="pt-1">
      <View className="mb-5 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center">
          <View className="w-[118px] flex-row items-end">
            <Text className="text-[36px] font-extrabold leading-[40px] tracking-normal text-[#001B49]">
              viruj
            </Text>
            <View className="-ml-[2px] mb-[28px] h-[9px] w-[7px] rotate-[-35deg] rounded-full bg-[#39C69A]" />
            <View className="mb-[35px] ml-[1px] h-[8px] w-[6px] rotate-[35deg] rounded-full bg-[#39C69A]" />
          </View>

          <View className="ml-[10px] mr-[12px] h-[26px] w-px bg-[#CCD6E2]" />
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-[14px] font-semibold text-[#667796]"
          >
            Care that understands you
          </Text>
        </View>

        <Pressable className="h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-[#E7EDF4] bg-white">
          <Ionicons name="notifications-outline" size={25} color="#001B49" />
          <View className="absolute right-[9px] top-2 h-[14px] w-[14px] rounded-full border-2 border-white bg-[#FF335C]" />
        </Pressable>
      </View>
    </View>
  );
}
