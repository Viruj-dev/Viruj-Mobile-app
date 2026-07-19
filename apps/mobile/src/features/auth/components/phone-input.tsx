import { Text, View } from "react-native";
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
      maxLength={11}
      textContentType="telephoneNumber"
      autoComplete="tel"
      placeholder="98765 43210"
      error={error}
      left={
        <View className="rounded-full bg-[#E9FBF8] px-2.5 py-1">
          <Text className="text-[12px] font-extrabold text-[#047C9D]">+91</Text>
        </View>
      }
    />
  );
}
