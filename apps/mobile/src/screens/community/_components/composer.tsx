import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

export default function Composer({
  value,
  onChangeText,
  onPost,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onPost: () => void;
}) {
  return (
    <View className="border-y border-[#EEF0F2] bg-white px-[18px] py-3">
      <View className="flex-row items-center gap-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Share something with the community..."
          placeholderTextColor="#777777"
          className="h-[42px] flex-1 rounded-full bg-[#F6F7F8] px-4 text-[13px] text-[#111111]"
        />
        <Pressable
          onPress={onPost}
          className="h-[42px] w-[42px] items-center justify-center rounded-full bg-[#00827D]"
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
