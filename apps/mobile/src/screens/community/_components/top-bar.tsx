import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function TopBar({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <View className="h-[64px] flex-row items-center justify-between border-b border-[#F1F3F5] bg-white px-[18px]">
      <View className="flex-row items-center gap-5">
        <Pressable
          onPress={onMenuPress}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="menu" size={28} color="#005B5A" />
        </Pressable>
        <Text className="text-[22px] font-extrabold tracking-normal text-[#005B5A]">
          Viruj
        </Text>
      </View>

      <View className="flex-row items-center gap-5">
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="search-outline" size={24} color="#005B5A" />
        </Pressable>
        <Pressable className="h-10 w-10 items-center justify-center">
          <Ionicons name="notifications-outline" size={23} color="#005B5A" />
        </Pressable>
      </View>
    </View>
  );
}
