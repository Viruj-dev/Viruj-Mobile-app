import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import {
  AuthScreen,
  AuthHeader,
  Field,
  AuthInput,
  PrimaryButton,
  Divider,
  SocialButton,
  FooterLink,
} from "../auth";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    acceptPrivacy: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

interface SignupScreenProps {
  onLoginPress?: () => void;
  onSignupSuccess?: () => void;
}

export default function SignupScreen({
  onLoginPress,
  onSignupSuccess,
}: SignupScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptPrivacy: false,
    },
  });

  const onSubmit = async (values: FormData) => {
    console.log(values);
    onSignupSuccess?.();
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

      {/* Name */}
      <Field
        label="Full Name"
        error={errors.name?.message}
        input={
          <AuthInput
            placeholder="John Doe"
            onChangeText={(text) => setValue("name", text)}
          />
        }
      />

      {/* Email */}
      <Field
        label="Email"
        error={errors.email?.message}
        input={
          <AuthInput
            placeholder="you@example.com"
            keyboardType="email-address"
            onChangeText={(text) => setValue("email", text)}
          />
        }
      />

      {/* Password */}
      <Field
        label="Password"
        error={errors.password?.message}
        input={
          <AuthInput
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setValue("password", text)}
            right={
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            }
          />
        }
      />

      {/* Confirm Password */}
      <Field
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        input={
          <AuthInput
            placeholder="••••••••"
            secureTextEntry={!showConfirmPassword}
            onChangeText={(text) => setValue("confirmPassword", text)}
            right={
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            }
          />
        }
      />

      {/* Privacy */}
      <View className="flex-row items-center mb-6">
        <View
          className={`w-5 h-5 rounded border items-center justify-center mr-2 ${
            acceptPrivacy ? "bg-[#6D0F14] border-[#6D0F14]" : "border-gray-400"
          }`}
        >
          {acceptPrivacy && (
            <Ionicons name="checkmark" size={14} color="white" />
          )}
        </View>
        <View className="flex-1">
          <Ionicons
            name="document-text-outline"
            size={16}
            color="#6B7280"
            style={{ marginBottom: -2 }}
          />
        </View>
      </View>

      <PrimaryButton
        label="Create Account"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />

      <Divider label="or continue with" />

      {/* Social Buttons */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <SocialButton
            label="Google"
            onPress={() => {}}
            mode="google"
          />
        </View>
        <View className="flex-1">
          <SocialButton
            label="Facebook"
            onPress={() => {}}
            mode="facebook"
          />
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
