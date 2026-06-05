import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { quickActions } from "./home-data";

export default function WelcomeCard() {
  return (
    <View className="mb-7 overflow-hidden rounded-[24px] bg-[#0E9996] px-[18px] pb-[16px] pt-[18px]">
      <View className="absolute -right-[76px] -top-[84px] h-[220px] w-[220px] rounded-full bg-[#43D8C1] opacity-40" />
      <View className="absolute -bottom-[100px] -left-[74px] h-[230px] w-[230px] rounded-full bg-[#047C9D] opacity-35" />

      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-[14px] font-semibold text-[#E9FFFB]">
            Welcome back,
          </Text>
          <Text className="mt-1 text-[27px] font-extrabold leading-[32px] tracking-normal text-white">
            Abhishek Negi  {"\uD83D\uDC4B"}
          </Text>
          <Text className="mt-1 text-[14px] font-semibold text-[#F0FFFC]">
            Here's your health overview
          </Text>
        </View>

        <View className="h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full bg-[#D6FAED]">
          <View className="h-[28px] w-[28px] rounded-full bg-[#123D78]" />
          <View className="mt-[3px] h-[34px] w-[48px] rounded-t-[24px] bg-[#3157B8]" />
          <View className="absolute top-[25px] h-[12px] w-[24px] rounded-b-full bg-[#F4B18F]" />
        </View>
      </View>

      <Pressable className="mt-5 h-[50px] flex-row items-center gap-[10px] rounded-full bg-white px-[16px]">
        <Ionicons name="search-outline" size={22} color="#7B8AA6" />
        <Text
          numberOfLines={1}
          className="flex-1 text-[14px] font-semibold text-[#6B7A99]"
        >
          Search doctors, hospitals, departments...
        </Text>
        <Ionicons name="mic-outline" size={23} color="#7B8AA6" />
      </Pressable>

      <View className="mt-5 flex-row justify-between">
        {quickActions.map((action) => (
          <Pressable key={action.label} className="w-[23%] items-center">
            <View className="mb-2 h-[38px] w-[38px] items-center justify-center rounded-full bg-[#FFFFFF22]">
              <Ionicons name={action.icon} size={21} color="#FFFFFF" />
            </View>
            <Text className="text-center text-[11px] font-extrabold leading-[14px] text-white">
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
