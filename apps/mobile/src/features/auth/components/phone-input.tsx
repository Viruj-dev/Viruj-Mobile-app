import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthInput } from "../../../screens/Auth/_components/auth-ui";
import { formatIndianMobile, toIndianMobileDigits } from "../utils/phone-number";

export function PhoneInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}) {
  const mobile = toIndianMobileDigits(value);

  return (
    <AuthInput
      value={formatIndianMobile(mobile)}
      onChangeText={(text) => onChange(toIndianMobileDigits(text))}
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      placeholder="Enter mobile number"
      error={error}
      leftInset={116}
      left={
        <View className="h-full flex-row items-center">
          <View className="flex-row items-center gap-2 pr-4">
            <Text className="text-[15px] font-semibold text-[#111111]">+91</Text>
            <Ionicons name="chevron-down" size={15} color="#111111" />
          </View>
          <View className="h-7 w-px bg-[#DED8D0]" />
        </View>
      }
    />
  );
}
