import type { ComponentProps, ReactNode } from "react";
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
      <Text className="mb-2 text-[13px] font-semibold text-[#5F5A55]">
        {label}
      </Text>
      {input}
      {error ? (
        <Text className="mt-2 text-[12px] font-semibold text-[#B42318]">{error}</Text>
      ) : null}
    </View>
  );
}

export function AuthInput({
  right,
  left,
  error,
  leftInset = 48,
  style,
  ...props
}: ComponentProps<typeof TextInput> & {
  right?: ReactNode;
  left?: ReactNode;
  error?: boolean;
  leftInset?: number;
}) {
  return (
    <View
      className={`relative rounded-[20px] border bg-white ${
        error ? "border-[#B42318]" : "border-[#DCD6CE]"
      }`}
      style={{
        elevation: 1,
        shadowColor: "#2A2118",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
      }}
    >
      {left ? (
        <View className="absolute bottom-0 left-0 top-0 justify-center pl-4">
          {left}
        </View>
      ) : null}
      <TextInput
        placeholderTextColor={palette.softMuted}
        className={`min-h-[58px] px-4 text-[15px] font-semibold text-[#111111] ${
          right ? "pr-14" : ""
        }`}
        style={[style, left ? { paddingLeft: leftInset } : null]}
        {...props}
      />
      {right ? (
        <View className="absolute bottom-0 right-0 top-0 justify-center pr-4">
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
      <Text className="text-[12px] font-black text-[#13945F]">{label}</Text>
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
        trackColor={{ false: "#D6D0C8", true: palette.brand }}
      />
      <Text className="text-[12px] font-semibold text-[#5F5A55]">{label}</Text>
    </View>
  );
}