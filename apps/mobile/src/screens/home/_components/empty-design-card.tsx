import { Pressable, View } from "react-native";
import { EmptyCard } from "./home-data";

export default function EmptyDesignCard({ card }: { card: EmptyCard }) {
  const wide = card.variant === 0 || card.variant === 3;

  return (
    <Pressable
      className="mb-4 overflow-hidden rounded-[20px] border border-[#E3ECF5] p-4"
      style={{ backgroundColor: card.bg, minHeight: wide ? 148 : 126 }}
    >
      <View
        className="absolute -right-[34px] -top-[42px] h-[118px] w-[118px] rounded-full opacity-20"
        style={{ backgroundColor: card.accent }}
      />
      <View
        className="absolute -bottom-[48px] left-[34px] h-[120px] w-[120px] rounded-full opacity-10"
        style={{ backgroundColor: card.accent }}
      />

      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 pr-4">
          <View
            className="h-[20px] w-[92px] rounded-[7px]"
            style={{ backgroundColor: card.accent }}
          />
          <View className="mt-5 h-[18px] w-[82%] rounded-full bg-white" />
          <View className="mt-3 h-[12px] w-[62%] rounded-full bg-white/80" />
          <View className="mt-2 h-[12px] w-[44%] rounded-full bg-white/60" />
        </View>

        <View className="h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-white">
          <View
            className="h-[44px] w-[44px] rounded-full opacity-80"
            style={{ backgroundColor: `${card.accent}33` }}
          />
          <View
            className="absolute h-[26px] w-[26px] rounded-full"
            style={{ backgroundColor: card.accent }}
          />
        </View>
      </View>

      {wide ? (
        <View className="mt-5 flex-row gap-3">
          <View className="h-[34px] flex-1 rounded-full bg-white/75" />
          <View className="h-[34px] flex-1 rounded-full bg-white/55" />
          <View className="h-[34px] flex-1 rounded-full bg-white/45" />
        </View>
      ) : null}
    </Pressable>
  );
}
