import { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import {
  AuthBackButton,
  AuthHeader,
  AuthInput,
  AuthScreen,
  Field,
  FooterLink,
  PrimaryButton,
  StatusNotice,
} from "../auth-ui";

const formSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email or mobile number")
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        /^[6-9]\d{9}$/.test(value.replace(/\D/g, "")),
      "Enter a valid email or 10-digit mobile number"
    ),
});

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  onResetRequested: (target: string) => void;
}

export default function ForgotPasswordScreen({
  onBackToLogin,
  onResetRequested,
}: ForgotPasswordScreenProps) {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(false);

  const onSubmit = async () => {
    const parsed = formSchema.safeParse({ identifier });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }

    try {
      setIsSubmitting(true);
      setNotice(true);
      onResetRequested(parsed.data.identifier.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthBackButton label="Back to login" onPress={onBackToLogin} />
      <AuthHeader
        align="left"
        title="Recover access"
        subtitle="Use the email or mobile number linked to your Viruj Health account."
        icon={<Ionicons name="refresh-circle-outline" size={34} color="#0E9996" />}
      />

      {notice ? (
        <StatusNotice
          tone="success"
          title="Code sent"
          message="We sent a verification code so you can continue securely."
        />
      ) : null}

      <Field
        label="Email or mobile number"
        error={error}
        input={
          <AuthInput
            placeholder="you@example.com or 9876543210"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              setError(undefined);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            left={
              <Ionicons name="at-circle-outline" size={19} color="#7B8AA6" />
            }
          />
        }
      />

      <PrimaryButton
        label="Send verification code"
        onPress={onSubmit}
        loading={isSubmitting}
      />

      <View className="mt-2">
        <FooterLink
          prompt="Remembered it?"
          actionLabel="Sign in"
          onPress={onBackToLogin}
        />
      </View>
    </AuthScreen>
  );
}
