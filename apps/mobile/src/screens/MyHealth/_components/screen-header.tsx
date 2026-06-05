import { Text, View } from "react-native";

export default function ScreenHeader() {
  return (
    <View className="mb-5 pt-5">
      <Text className="text-[13px] font-extrabold uppercase tracking-normal text-[#059669]">
        My Health
      </Text>
      <Text className="mt-1 text-[31px] font-extrabold leading-[36px] tracking-normal text-[#001B49]">
        Your care timeline
      </Text>
      <Text className="mt-1 text-[14px] font-semibold leading-5 text-[#536682]">
        Appointments, records, reports, vitals and medication in one place.
      </Text>
    </View>
  );
}
