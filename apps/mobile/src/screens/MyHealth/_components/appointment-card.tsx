import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Appointment } from "./my-health-data";

export default function AppointmentCard({ item }: { item: Appointment }) {
  const upcoming = item.status === "Upcoming";

  return (
    <Pressable
      className="mb-4 overflow-hidden rounded-[22px] border border-[#E5ECF4] bg-white p-4"
      style={{
        elevation: 4,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View
        className="absolute -right-[42px] -top-[46px] h-[126px] w-[126px] rounded-full opacity-25"
        style={{ backgroundColor: item.accent }}
      />

      <View className="flex-row items-start gap-3">
        <View
          className="h-[54px] w-[54px] items-center justify-center rounded-[18px]"
          style={{ backgroundColor: item.bg }}
        >
          <Ionicons name={item.icon} size={26} color={item.accent} />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="min-w-0 flex-1 text-[18px] font-extrabold leading-[23px] tracking-normal text-[#001B49]">
              {item.doctor}
            </Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: upcoming ? "#E9FBF8" : "#F0F7FF" }}
            >
              <Text
                className="text-[10px] font-extrabold"
                style={{ color: upcoming ? "#059669" : "#4B8FEA" }}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <Text className="mt-1 text-[13px] font-semibold text-[#536682]">
            {item.department}
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-2">
            {[item.date, item.time, item.mode].map((detail) => (
              <View
                key={detail}
                className="rounded-full border border-[#E5ECF4] bg-[#F8FBFF] px-3 py-2"
              >
                <Text className="text-[11px] font-extrabold text-[#24405F]">
                  {detail}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
