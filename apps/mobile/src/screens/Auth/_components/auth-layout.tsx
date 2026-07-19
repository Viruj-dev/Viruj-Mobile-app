import type { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VirujWordmark } from "./auth-brand";

export function AuthScreen({
  children,
  scroll = true,
  className,
}: {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
}) {
  const body = (
    <View className={`w-full max-w-[420px] self-center ${className || ""}`}>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBF8F2]">
      <View className="pointer-events-none absolute -left-24 top-16 h-px w-[520px] rotate-[61deg] bg-[#DDD6CD]" />
      <View className="pointer-events-none absolute -right-28 top-0 h-px w-[520px] rotate-[-62deg] bg-[#E4DDD4]" />
      <View className="pointer-events-none absolute -bottom-10 left-4 h-px w-[520px] rotate-[-18deg] bg-[#E9E2D9]" />
      {scroll ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingVertical: 30,
            }}
            showsVerticalScrollIndicator={false}
          >
            {body}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View className="flex-1 justify-center px-6">{body}</View>
      )}
    </SafeAreaView>
  );
}

export function AuthHeader({
  title,
  subtitle,
  icon,
  align = "center",
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <View className={`${align === "center" ? "items-center" : ""} mb-9`}>
      {align === "center" ? (
        <View className="mb-11 items-center">
          <VirujWordmark />
        </View>
      ) : null}
      {icon && align !== "center" ? (
        <View className="mb-7 h-14 w-14 items-center justify-center rounded-[20px] bg-white">
          {icon}
        </View>
      ) : null}
      <Text
        className={`mb-2 text-[30px] font-semibold leading-[36px] text-[#111111] ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {title}
      </Text>
      <Text
        className={`text-[14px] font-medium leading-6 text-[#5F5A55] ${
          align === "center" ? "px-3 text-center" : ""
        }`}
      >
        {subtitle}
      </Text>
    </View>
  );
}

export function AuthBackButton({
  label = "Back",
  onPress,
}: {
  label?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      className="mb-16 h-11 w-11 items-center justify-center rounded-full border border-[#ECE6DE] bg-white active:bg-[#F7F2EA]"
      style={{
        elevation: 1,
        shadowColor: "#2A2118",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      }}
    >
      <Ionicons name="chevron-back" size={22} color="#111111" />
    </Pressable>
  );
}
