import { useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  AuthBackButton,
  AuthHeader,
  AuthScreen,
  PrimaryButton,
  StatusNotice,
  ToggleTextButton,
} from "./auth-ui";

const CODE_LENGTH = 6;

interface OtpVerificationScreenProps {
  target: string;
  onBack: () => void;
  onVerified: () => void;
}

export default function OtpVerificationScreen({
  target,
  onBack,
  onVerified,
}: OtpVerificationScreenProps) {
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const digits = useMemo(
    () =>
      Array.from({ length: CODE_LENGTH }, (_, index) => code[index] ?? ""),
    [code]
  );

  const onSubmit = async () => {
    if (code.length !== CODE_LENGTH) {
      setError("Enter the 6-digit verification code");
      return;
    }

    try {
      setIsSubmitting(true);
      onVerified();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthBackButton onPress={onBack} />
      <AuthHeader
        align="left"
        title="Verify code"
        subtitle={`Enter the 6-digit code sent to ${target}.`}
        icon={<Ionicons name="phone-portrait-outline" size={34} color="#0E9996" />}
      />

      {resendCount > 0 ? (
        <StatusNotice
          tone="success"
          title="Code resent"
          message="A fresh verification code has been sent."
        />
      ) : null}

      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="mb-3 flex-row justify-between"
      >
        {digits.map((digit, index) => (
          <View
            key={index}
            className={`h-14 w-12 items-center justify-center rounded-2xl border ${
              digit
                ? "border-[#0E9996] bg-[#E9FBF8]"
                : "border-[#E5ECF4] bg-white"
            }`}
          >
            <Text className="text-xl font-extrabold text-[#001B49]">{digit}</Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(text) => {
          setCode(text.replace(/\D/g, "").slice(0, CODE_LENGTH));
          setError(undefined);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={CODE_LENGTH}
        className="absolute h-0 w-0 opacity-0"
      />

      {error ? (
        <Text className="mb-5 text-[12px] text-[#DC2626]">{error}</Text>
      ) : (
        <View className="mb-5" />
      )}

      <PrimaryButton
        label="Verify and continue"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={code.length !== CODE_LENGTH}
      />

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-sm font-semibold text-[#536682]">
          Did not receive it?{" "}
        </Text>
        <ToggleTextButton
          label="Resend"
          onPress={() => setResendCount((value) => value + 1)}
        />
      </View>
    </AuthScreen>
  );
}
