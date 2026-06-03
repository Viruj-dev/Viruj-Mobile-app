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
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
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
  onSignupSuccess?: (phone: string) => void;
}

export default function SignupScreen({
  onLoginPress,
  onSignupSuccess,
}: SignupScreenProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
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
      onSignupSuccess?.(`+91 ${parsed.data.phone}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Create account"
        subtitle="Set up a secure Viruj Health profile for appointments and medical records."
        icon={
          <Ionicons name="person-add-outline" size={32} color="#0E9996" />
        }
      />

      <Field
        label="Full Name"
        error={errors.name}
        input={
          <AuthInput
            placeholder="Full legal name"
            value={values.name}
            onChangeText={(text) => setField("name", text)}
            textContentType="name"
            autoComplete="name"
            left={
              <Ionicons name="person-outline" size={18} color="#7B8AA6" />
            }
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
            textContentType="emailAddress"
            autoComplete="email"
            left={<Ionicons name="mail-outline" size={18} color="#7B8AA6" />}
          />
        }
      />

      <Field
        label="Mobile number"
        error={errors.phone}
        input={
          <AuthInput
            placeholder="9876543210"
            value={values.phone}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) =>
              setField("phone", text.replace(/\D/g, "").slice(0, 10))
            }
            textContentType="telephoneNumber"
            autoComplete="tel"
            left={<Ionicons name="call-outline" size={18} color="#7B8AA6" />}
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
            textContentType="newPassword"
            autoComplete="new-password"
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

      <Field
        label="Confirm Password"
        error={errors.confirmPassword}
        input={
          <AuthInput
            placeholder="********"
            value={values.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={(text) => setField("confirmPassword", text)}
            textContentType="newPassword"
            autoComplete="new-password"
            left={
              <Ionicons name="shield-checkmark-outline" size={18} color="#7B8AA6" />
            }
            right={
              <Pressable
                onPress={() => setShowConfirmPassword((value) => !value)}
                hitSlop={8}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#7B8AA6"
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
              ? "border-[#0E9996] bg-[#0E9996]"
              : "border-[#7B8AA6]"
          }`}
        >
          {values.acceptPrivacy ? (
            <Ionicons name="checkmark" size={14} color="white" />
          ) : null}
        </View>
        <View className="flex-1 flex-row">
          <Ionicons name="document-text-outline" size={16} color="#536682" />
          <Text className="ml-2 text-sm font-medium leading-5 text-[#536682]">
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
