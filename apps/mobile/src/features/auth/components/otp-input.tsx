import { useEffect, useMemo, useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const CODE_LENGTH = 6;

export function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<TextInput>(null);
  const digits = useMemo(
    () => Array.from({ length: CODE_LENGTH }, (_, index) => value[index] ?? ""),
    [value]
  );

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="mb-4 flex-row justify-between gap-2"
        disabled={disabled}
      >
        {digits.map((digit, index) => (
          <View
            key={index}
            className={`h-14 flex-1 items-center justify-center rounded-[18px] border ${
              digit
                ? "border-[#18A66B] bg-white"
                : "border-[#DED8D0] bg-white"
            }`}
            style={{
              elevation: digit ? 2 : 0,
              shadowColor: "#18A66B",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: digit ? 0.09 : 0,
              shadowRadius: 14,
            }}
          >
            <Text className="text-xl font-bold text-[#111111]">{digit}</Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={value}
        editable={!disabled}
        onChangeText={(text) => onChange(text.replace(/\D/g, "").slice(0, CODE_LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={CODE_LENGTH}
        className="absolute h-0 w-0 opacity-0"
      />
    </>
  );
}
