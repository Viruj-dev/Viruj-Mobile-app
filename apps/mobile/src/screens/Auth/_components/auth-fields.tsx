import type { ReactNode } from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { palette } from "./auth-palette";

export function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: ReactNode;
}) {
  return (
    <View className="mb-[18px]">
      <Text className="mb-2 text-sm font-extrabold text-[#001B49]">
        {label}
      </Text>
      {input}
      {error ? (
        <Text className="text-[#DC2626] text-[12px] mt-1.5">{error}</Text>
      ) : null}
    </View>
  );
}

export function AuthInput({
  right,
  left,
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  right?: ReactNode;
  left?: ReactNode;
  error?: boolean;
}) {
  return (
    <View
      className={`relative rounded-[18px] border bg-white ${
        error ? "border-red-300" : "border-[#E5ECF4]"
      }`}
      style={{
        elevation: 2,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      }}
    >
      {left ? (
        <View className="absolute top-0 left-0 bottom-0 justify-center pl-3.5">
          {left}
        </View>
      ) : null}
      <TextInput
        placeholderTextColor={palette.softMuted}
        className={`min-h-[58px] px-4 text-[15px] font-semibold text-[#001B49] ${
          right ? "pr-14" : ""
        } ${left ? "pl-12" : ""}`}
        {...props}
      />
      {right ? (
        <View className="absolute top-0 right-0 bottom-0 justify-center pr-3.5">
          {right}
        </View>
      ) : null}
    </View>
  );
}

export function ToggleTextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text className="text-[12px] font-extrabold text-[#059669]">{label}</Text>
    </Pressable>
  );
}

export function RememberSwitch({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: "#D1D5DB", true: palette.brand }}
      />
      <Text className="text-[12px] font-semibold text-[#536682]">{label}</Text>
    </View>
  );
}
