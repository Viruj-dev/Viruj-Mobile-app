import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-[22px] font-extrabold leading-[27px] tracking-normal text-[#001B49]">
        {title}
      </Text>
      {action ? (
        <Pressable className="h-[40px] flex-row items-center gap-[5px] rounded-full border border-[#E4EAF2] bg-white px-[15px]">
          <Text className="text-[13px] font-extrabold text-[#001B49]">
            {action}
          </Text>
          <Ionicons name="chevron-forward" size={17} color="#001B49" />
        </Pressable>
      ) : null}
    </View>
  );
}
