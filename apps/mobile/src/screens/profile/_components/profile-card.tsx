import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { avatar, bodyStats } from "./profile-data";

export default function ProfileCard() {
  return (
    <View
      className="mb-8 overflow-hidden rounded-[20px] bg-[#07847F] px-[24px] pb-[24px] pt-[26px]"
      style={{
        elevation: 10,
        shadowColor: "#003D3A",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      }}
    >
      <View className="absolute -right-[80px] -top-[70px] h-[220px] w-[220px] rounded-full bg-[#0E9996] opacity-35" />

      <View className="flex-row items-center">
        <View className="h-[82px] w-[82px] items-center justify-center rounded-full border-[5px] border-[#E7F7F5] bg-white">
          <Image
            source={{ uri: avatar }}
            className="h-[70px] w-[70px] rounded-full"
            resizeMode="cover"
          />
        </View>

        <View className="ml-[18px] min-w-0 flex-1">
          <View className="flex-row items-center">
            <Text className="min-w-0 flex-1 text-[21px] font-extrabold leading-[26px] text-white">
              Abhishek Negi
            </Text>
            <Ionicons name="ribbon-outline" size={20} color="#FFE500" />
          </View>
          <Text className="mt-1 text-[13px] font-medium text-[#D7F4F1]">
            abhisheknegi@gmail.com
          </Text>

          <View className="mt-[9px] h-[25px] w-[128px] flex-row items-center justify-center rounded-full bg-[#9BFF87]">
            <Ionicons name="star-outline" size={13} color="#063D22" />
            <Text className="ml-2 text-[11px] font-extrabold text-[#063D22]">
              PRO MEMBER
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-[28px] flex-row justify-between">
        {bodyStats.map(([label, value, unit]) => (
          <View
            key={label}
            className="h-[72px] w-[31%] items-center justify-center rounded-[13px] border border-[#5AB8B3] bg-white/10"
          >
            <Text className="text-[11px] font-medium text-[#D7F4F1]">
              {label}
            </Text>
            <View className="mt-1 flex-row items-end">
              <Text className="text-[17px] font-extrabold text-white">
                {value}
              </Text>
              {unit ? (
                <Text className="mb-[1px] ml-1 text-[10px] font-semibold text-white">
                  {unit}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
