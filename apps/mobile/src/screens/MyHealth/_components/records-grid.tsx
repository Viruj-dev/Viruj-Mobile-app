import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { healthRecords } from "./my-health-data";
import SectionHeader from "./section-header";

export default function RecordsGrid() {
  return (
    <View className="mb-6">
      <SectionHeader title="Health records" action="Manage" />
      <View className="flex-row flex-wrap justify-between">
        {healthRecords.map((record) => (
          <Pressable
            key={record.id}
            className="mb-3 min-h-[124px] w-[48%] rounded-[20px] border border-[#E5ECF4] bg-white p-4"
            style={{
              elevation: 3,
              shadowColor: "#123D78",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.07,
              shadowRadius: 14,
            }}
          >
            <View
              className="mb-3 h-[42px] w-[42px] items-center justify-center rounded-full"
              style={{ backgroundColor: record.bg }}
            >
              <Ionicons name={record.icon} size={22} color={record.color} />
            </View>
            <Text className="text-[12px] font-bold text-[#536682]">
              {record.title}
            </Text>
            <Text className="mt-1 text-[19px] font-extrabold leading-[23px] text-[#001B49]">
              {record.value}
            </Text>
            <Text className="mt-1 text-[11px] font-semibold text-[#7B8AA6]">
              {record.meta}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
