import { Image, Pressable, Text, View } from "react-native";
import { initialPosts } from "./community-data";

export default function EditorialCard() {
  return (
    <View className="border-y border-[#EEF0F2] bg-[#F7F8F9] px-[18px] py-[24px]">
      <View className="mb-[14px] flex-row items-center justify-between">
        <Text className="text-[16px] font-medium text-[#111111]">
          Viruj Editorial
        </Text>
        <Pressable>
          <Text className="text-[15px] font-medium text-[#006C69]">
            Read Journal
          </Text>
        </Pressable>
      </View>

      <Pressable className="min-h-[102px] flex-row rounded-[9px] border border-[#DDE1E5] bg-[#F7F8F9] p-[14px]">
        <Image
          source={{ uri: initialPosts[1].image }}
          className="h-[72px] w-[72px] rounded-[6px]"
          resizeMode="cover"
        />
        <View className="ml-[14px] min-w-0 flex-1">
          <Text className="text-[9px] font-extrabold uppercase tracking-[1px] text-[#006C69]">
            New Research
          </Text>
          <Text className="mt-[6px] text-[15px] font-medium leading-[19px] text-[#111111]">
            The future of AI in early cancer detection.
          </Text>
          <Text className="mt-[3px] text-[11px] font-medium text-[#6D747A]">
            5 min read - Dr. Rohan Mehta
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
