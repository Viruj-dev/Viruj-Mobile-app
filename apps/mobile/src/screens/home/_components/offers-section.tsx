import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import SectionHeader from "./section-header";

export default function OffersSection() {
  return (
    <View className="mb-5">
      <SectionHeader
        title="Exclusive for you"
        subtitle="Handpicked offers to help you stay healthy"
      />

      <View className="flex-row gap-3">
        <Pressable
          className="min-h-[136px] flex-[1.8] overflow-hidden rounded-[18px] border border-[#DCEAF7] bg-[#EDF7FF] p-4"
          style={{
            elevation: 3,
            shadowColor: "#123D78",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
          }}
        >
          <View className="self-start rounded-[7px] bg-[#10B981] px-[8px] py-[4px]">
            <Text className="text-[9px] font-extrabold text-white">
              Health Checkup
            </Text>
          </View>
          <Text className="mt-3 text-[18px] font-extrabold leading-[22px] tracking-normal text-[#001B49]">
            Full Body Checkup
          </Text>
          <Text className="mt-1 text-[15px] font-extrabold text-[#059669]">
            Up to 50% OFF
          </Text>
          <Text className="mt-2 max-w-[150px] text-[12px] font-medium leading-[16px] text-[#536682]">
            Complete health analysis for you and your family.
          </Text>

          <View className="absolute bottom-4 right-4 h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-white">
            <Ionicons name="people-outline" size={38} color="#66A9EA" />
          </View>
        </Pressable>

        <Pressable
          className="min-h-[136px] flex-1 rounded-[18px] border border-[#DDEFE6] bg-[#EEF9F3] p-4"
          style={{
            elevation: 3,
            shadowColor: "#123D78",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
          }}
        >
          <View className="mb-4 h-[38px] w-[38px] items-center justify-center rounded-full bg-[#D6FAED]">
            <Ionicons name="shield-checkmark-outline" size={22} color="#10B981" />
          </View>
          <Text className="text-[15px] font-extrabold leading-[19px] tracking-normal text-[#001B49]">
            Special Insurance Offers
          </Text>
          <View className="mt-3 flex-row items-center gap-1">
            <Text className="text-[12px] font-extrabold text-[#059669]">
              Explore Now
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#059669" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
