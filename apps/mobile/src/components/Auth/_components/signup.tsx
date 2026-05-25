import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import {
  AuthScreen,
  AuthHeader,
  Field,
  AuthInput,
  PrimaryButton,
  Divider,
  SocialButton,
  FooterLink,
} from "../auth-ui";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    acceptPrivacy: z.boolean().refine((value) => value, {
      message: "Please accept the privacy policy to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

interface SignupScreenProps {
  onLoginPress?: () => void;
  onSignupSuccess?: () => void;
}

export default function SignupScreen({
  onLoginPress,
  onSignupSuccess,
}: SignupScreenProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setField = <T extends keyof FormValues>(field: T, value: FormValues[T]) => {
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
      console.log(parsed.data);
      onSignupSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Create Account"
        subtitle="Join us today"
        icon={
          <Ionicons name="person-add-outline" size={32} color="#6D0F14" />
        }
      />

      <Field
        label="Full Name"
        error={errors.name}
        input={
          <AuthInput
            placeholder="John Doe"
            value={values.name}
            onChangeText={(text) => setField("name", text)}
          />
        }
      />

      <Field
        label="Email"
        error={errors.email}
        input={
          <AuthInput
            placeholder="you@example.com"
            value={values.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setField("email", text)}
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
            right={
              <Pressable
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            }
          />
        }
      />

      <Field
        label="Confirm Password"
        error={errors.confirmPassword}
        input={
          <AuthInput
            placeholder="********"
            value={values.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={(text) => setField("confirmPassword", text)}
            right={
              <Pressable
                onPress={() => setShowConfirmPassword((value) => !value)}
                hitSlop={8}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            }
          />
        }
      />

      <Pressable
        onPress={() => setField("acceptPrivacy", !values.acceptPrivacy)}
        className="mb-2 flex-row items-start"
      >
        <View
          className={`mt-0.5 mr-3 h-5 w-5 rounded border items-center justify-center ${
            values.acceptPrivacy
              ? "border-[#6D0F14] bg-[#6D0F14]"
              : "border-gray-400"
          }`}
        >
          {values.acceptPrivacy ? (
            <Ionicons name="checkmark" size={14} color="white" />
          ) : null}
        </View>
        <View className="flex-1 flex-row">
          <Ionicons name="document-text-outline" size={16} color="#6B7280" />
          <Text className="ml-2 text-sm leading-5 text-gray-500">
            I agree to the privacy policy and terms of use.
          </Text>
        </View>
      </Pressable>

      {errors.acceptPrivacy ? (
        <Text className="mb-4 text-[12px] text-[#DC2626]">
          {errors.acceptPrivacy}
        </Text>
      ) : (
        <View className="mb-4" />
      )}

      <PrimaryButton
        label="Create Account"
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
        prompt="Already have an account?"
        actionLabel="Sign in"
        onPress={onLoginPress ?? (() => {})}
      />
    </AuthScreen>
  );
}
