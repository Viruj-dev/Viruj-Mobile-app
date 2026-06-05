import type { ReactNode } from "react";
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
    <SafeAreaView className="flex-1 bg-[#F8FBFF]">
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
              paddingHorizontal: 20,
              paddingVertical: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {body}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View className="flex-1 justify-center px-5">{body}</View>
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
    <View className={`${align === "center" ? "items-center" : ""} mb-8`}>
      <View className={align === "center" ? "items-center" : ""}>
        <VirujWordmark compact={align !== "center"} />
      </View>
      {icon ? (
        <View className="mb-5 mt-5 h-16 w-16 items-center justify-center rounded-[22px] bg-[#E9FBF8]">
          {icon}
        </View>
      ) : null}
      <Text
        className={`mb-2 text-[33px] font-extrabold leading-[39px] tracking-normal text-[#001B49] ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {title}
      </Text>
      <Text
        className={`text-[15px] font-medium leading-6 text-[#536682] ${
          align === "center" ? "text-center px-4" : ""
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
      onPress={onPress}
      hitSlop={8}
      className="mb-7 flex-row items-center self-start rounded-full border border-[#E5ECF4] bg-white px-4 py-3"
    >
      <Text className="text-sm font-extrabold text-[#001B49]">{label}</Text>
    </Pressable>
  );
}
