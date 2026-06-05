import { Pressable, Text, View } from "react-native";

export default function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View className="mb-[22px] flex-row items-center justify-between">
      <Text className="text-[18px] font-semibold text-[#111111]">{title}</Text>
      {action ? (
        <Pressable>
          <Text className="text-[13px] font-medium text-[#006C69]">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
