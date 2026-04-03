import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormData) => {
    console.log(values);
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Welcome Back
        </Text>
        <Text className="text-gray-500 text-center">Sign in to continue</Text>
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Email</Text>
        <TextInput
          placeholder="you@example.com"
          onChangeText={(text) => setValue("email", text)}
          className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50"
          keyboardType="email-address"
        />
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Password</Text>
        <View className="relative">
          <TextInput
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setValue("password", text)}
            className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 pr-10"
          />

          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </Pressable>
        </View>

        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* Remember Me */}
      <View className="flex-row justify-between items-center mb-6">
        <Pressable
          onPress={() => setRememberMe(!rememberMe)}
          className="flex-row items-center"
        >
          <View
            className={`w-4 h-4 border mr-2 ${
              rememberMe ? "bg-blue-600" : "border-gray-400"
            }`}
          />
          <Text className="text-gray-500 text-sm">Remember me</Text>
        </Pressable>

        <Pressable>
          <Text className="text-blue-600 text-sm">Forgot password?</Text>
        </Pressable>
      </View>

      {/* Submit */}
      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="bg-blue-600 py-3 rounded-lg items-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-medium">Sign in</Text>
        )}
      </Pressable>

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-3 text-gray-400">or continue with</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      {/* Social Buttons */}
      <View className="flex-row gap-3">
        <Pressable className="flex-1 border border-gray-200 py-3 rounded-lg items-center">
          <Text>Google</Text>
        </Pressable>

        <Pressable className="flex-1 border border-gray-200 py-3 rounded-lg items-center">
          <Text>Facebook</Text>
        </Pressable>
      </View>

      {/* Signup */}
      <View className="mt-8 items-center">
        <Text className="text-gray-600">
          Don't have an account?{" "}
          <Text className="text-blue-600 font-medium">Sign up</Text>
        </Text>
      </View>
    </View>
  );
}
