import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { concerns } from "./home-data";
import SectionHeader from "./section-header";

export default function ConcernGrid() {
  const { width } = useWindowDimensions();
  const horizontalPadding = 44;
  const gap = 10;
  const cardWidth = (width - horizontalPadding - gap * 3) / 4;

  return (
    <View className="mb-7">
      <SectionHeader
        title="How can we help you today?"
        subtitle="Choose a health concern to get started"
      />

      <View className="flex-row flex-wrap justify-between">
        {concerns.map((concern) => (
          <Pressable
            key={concern.title}
            className="mb-4 h-[126px] items-center justify-start rounded-[15px] border border-[#E5ECF4] bg-white px-[6px] pb-[8px] pt-[13px]"
            style={{
              width: cardWidth,
              elevation: 4,
              shadowColor: "#123D78",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 14,
            }}
          >
            <View
              className=" h-[42px] w-[42px] items-center justify-center"
              style={{
                shadowColor: concern.color,
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: 0.3,
                shadowRadius: 9,
              }}
            >
              <Text className="text-[33px] leading-[39px]">
                {concern.icon}
              </Text>
            </View>
            <Text className="min-h-[34px] text-center text-[11px] font-extrabold leading-[13px] tracking-normal text-[#001B49]">
              {concern.title}
            </Text>
            <Text className="mt-[5px] min-h-[43px] text-center text-[9px] font-medium leading-[11px] text-[#536682]">
              {concern.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
