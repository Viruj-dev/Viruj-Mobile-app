import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { stories } from "./community-data";

export default function DailyTips({ onAddStory }: { onAddStory: () => void }) {
  return (
    <View className="bg-white pb-3 pt-4">
      <View className="mb-4 flex-row items-center justify-between px-[18px]">
        <Text className="text-[16px] font-semibold text-[#111111]">
          Daily Health Tips
        </Text>
        <Pressable>
          <Text className="text-[14px] font-medium text-[#006C69]">
            View All
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={stories}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={item.own ? onAddStory : undefined}
            className="mr-[19px] items-center"
          >
            <View className="h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-[#0C9C9A]">
              <View className="h-[54px] w-[54px] overflow-hidden rounded-full bg-[#E9F7F6]">
                <Image
                  source={{ uri: item.image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {item.own ? (
                  <View className="absolute inset-0 items-center justify-center bg-white/70">
                    <Ionicons name="add" size={28} color="#006C69" />
                  </View>
                ) : null}
              </View>
            </View>
            <Text
              numberOfLines={1}
              className="mt-[6px] w-[70px] text-center text-[11px] font-medium text-[#222222]"
            >
              {item.name}
            </Text>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
