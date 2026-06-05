import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View className="min-w-0 flex-1 pr-4">
        <Text className="text-[22px]  leading-[27px] tracking-normal text-[#001B49]">
          {title}
        </Text>
        <Text className="mt-1 text-[14px] font-medium leading-5 text-[#536682]">
          {subtitle}
        </Text>
      </View>
      <Pressable className="h-[40px] flex-row items-center gap-[5px] rounded-full border border-[#E4EAF2] bg-white px-[15px]">
        <Text className="text-[13px] font-extrabold text-[#001B49]">
          View All
        </Text>
        <Ionicons name="chevron-forward" size={17} color="#001B49" />
      </Pressable>
    </View>
  );
}
