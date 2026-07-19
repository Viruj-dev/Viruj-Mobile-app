import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function Footer({ onLogout }: { onLogout?: () => void }) {
  return (
    <View className="items-center pb-[26px]">
      <Pressable
        onPress={onLogout}
        className="mb-[40px] h-[58px] w-full flex-row items-center justify-center rounded-[16px] bg-[#FFD3D0]"
      >
        <Ionicons name="log-out-outline" size={22} color="#A60000" />
        <Text className="ml-[12px] text-[17px] font-semibold text-[#A60000]">
          Logout
        </Text>
      </Pressable>

      <Text className="text-[12px] font-medium text-[#8B9499]">
        Viruj Version 2.4.1 (Build 890)
      </Text>
      <Text className="mt-[9px] text-[13px] font-medium uppercase tracking-[3px] text-[#C0CCCC]">
        Proudly made for health
      </Text>
    </View>
  );
}
