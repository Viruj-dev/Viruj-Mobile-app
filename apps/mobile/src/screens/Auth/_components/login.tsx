import { useState } from "react";
import { Pressable, View } from "react-native";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import {
  AuthHeader,
  AuthInput,
  AuthScreen,
  Divider,
  Field,
  FooterLink,
  PrimaryButton,
  RememberSwitch,
  SocialButton,
  ToggleTextButton,
} from "./auth-ui";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

interface LoginScreenProps {
  onSignupPress?: () => void;
  onForgotPasswordPress?: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginScreen({
  onSignupPress,
  onForgotPasswordPress,
  onLoginSuccess,
}: LoginScreenProps) {
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const setField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async () => {
    const parsed = formSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FormErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in nextErrors)) {
          nextErrors[field as keyof FormValues] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log({ ...parsed.data, rememberMe });
      onLoginSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Welcome back"
        subtitle="Access appointments, records, prescriptions, and care updates securely."
        icon={<Ionicons name="lock-closed-outline" size={32} color="#0E9996" />}
      />

      <Field
        label="Email"
        error={errors.email}
        input={
          <AuthInput
            placeholder="you@example.com"
            value={values.email}
            onChangeText={(text) => setField("email", text)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            left={<Ionicons name="mail-outline" size={18} color="#7B8AA6" />}
          />
        }
      />

      <Field
        label="Password"
        error={errors.password}
        input={
          <AuthInput
            placeholder="********"
            value={values.password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setField("password", text)}
            textContentType="password"
            autoComplete="password"
            left={
              <Ionicons name="key-outline" size={18} color="#7B8AA6" />
            }
            right={
              <Pressable
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#7B8AA6"
                />
              </Pressable>
            }
          />
        }
      />

      <View className="mb-6 flex-row items-center justify-between">
        <RememberSwitch
          value={rememberMe}
          onValueChange={setRememberMe}
          label="Remember me"
        />
        <ToggleTextButton
          label="Forgot password?"
          onPress={onForgotPasswordPress ?? (() => {})}
        />
      </View>

      <PrimaryButton
        label="Sign in"
        onPress={onSubmit}
        loading={isSubmitting}
      />

      <Divider label="or continue with" />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <SocialButton label="Google" onPress={() => {}} mode="google" />
        </View>
        <View className="flex-1">
          <SocialButton label="Facebook" onPress={() => {}} mode="facebook" />
        </View>
      </View>

      <FooterLink
        prompt="Don't have an account?"
        actionLabel="Sign up"
        onPress={onSignupPress ?? (() => {})}
      />
    </AuthScreen>
  );
}
