import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palette = {
  background: "#FFFFFF",
  surface: "#F8FAFC",
  surfaceAlt: "#F9FAFB",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  softMuted: "#9CA3AF",
  brand: "#6D0F14",
  brandPressed: "#571015",
  brandSoft: "#FEF2F2",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  success: "#16A34A",
  successSoft: "#F0FDF4",
  overlay: "rgba(0, 0, 0, 0.4)",
  facebook: "#1877F2",
  googleBorder: "#D1D5DB",
};

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
    <SafeAreaView className="flex-1 bg-white">
      {scroll ? (
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
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <View className="items-center mb-9">
      {icon ? (
        <View className="w-16 h-16 rounded-full items-center justify-center bg-[#FEF2F2] mb-6">
          {icon}
        </View>
      ) : null}
      <Text className="text-4xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-base text-gray-500 text-center px-4">
        {subtitle}
      </Text>
    </View>
  );
}

export function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: ReactNode;
}) {
  return (
    <View className="mb-[18px]">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      {input}
      {error ? (
        <Text className="text-[#DC2626] text-[12px] mt-1.5">{error}</Text>
      ) : null}
    </View>
  );
}

export function AuthInput({
  right,
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  right?: ReactNode;
  error?: boolean;
}) {
  return (
    <View
      className={`relative border rounded-2xl bg-gray-50 ${
        error ? "border-red-300" : "border-gray-200"
      }`}
    >
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={`min-h-[56px] px-4 text-[15px] text-gray-900 ${
          right ? "pr-14" : ""
        }`}
        {...props}
      />
      {right ? (
        <View className="absolute top-0 right-0 bottom-0 justify-center pr-3.5">
          {right}
        </View>
      ) : null}
    </View>
  );
}

export function ToggleTextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text className="text-[#6D0F14] text-[12px] font-semibold">{label}</Text>
    </Pressable>
  );
}

export function RememberSwitch({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: "#D1D5DB", true: "#6D0F14" }}
      />
      <Text className="text-gray-500 text-[12px]">{label}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  className,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`min-h-[56px] rounded-2xl items-center justify-center bg-[#6D0F14] active:bg-[#571015] mt-2 ${
        disabled || loading ? "opacity-60" : ""
      } ${className || ""}`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text className="text-white text-[15px] font-semibold">{label}</Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  className,
}: {
  label: string;
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[56px] rounded-2xl items-center justify-center border border-gray-200 bg-white active:bg-slate-50 ${
        className || ""
      }`}
    >
      <Text className="text-gray-800 text-[15px] font-medium">{label}</Text>
    </Pressable>
  );
}

export function SocialButton({
  label,
  onPress,
  mode,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  mode: "google" | "facebook";
  loading?: boolean;
  disabled?: boolean;
}) {
  const iconLabel = mode === "google" ? "G" : "f";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`min-h-[56px] rounded-2xl border border-gray-200 bg-white items-center justify-center flex-row gap-2.5 active:bg-slate-50 ${
        disabled || loading ? "opacity-60" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#6D0F14" size="small" />
      ) : (
        <>
          <View
            className={`w-6 h-6 rounded-full items-center justify-center ${
              mode === "google"
                ? "border border-gray-300 bg-white"
                : "bg-[#1877F2]"
            }`}
          >
            <Text
              className={`text-[14px] font-bold ${
                mode === "google" ? "text-gray-900" : "text-white"
              }`}
            >
              {iconLabel}
            </Text>
          </View>
          <Text className="text-[14px] text-gray-700">{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 my-8">
      <View className="flex-1 h-[1px] bg-gray-200" />
      <Text className="text-[13px] text-gray-400">{label}</Text>
      <View className="flex-1 h-[1px] bg-gray-200" />
    </View>
  );
}

export function FooterLink({
  prompt,
  actionLabel,
  onPress,
}: {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <View className="mt-8 flex-row items-center justify-center flex-wrap">
      <Text className="text-gray-500 text-sm">{prompt} </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="text-[#6D0F14] text-sm font-semibold">
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

export function StatusNotice({
  tone,
  title,
  message,
  action,
}: {
  tone: "success" | "danger";
  title?: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <View
      className={`rounded-2xl border p-4 mb-[18px] ${
        tone === "success"
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      {title ? (
        <Text className="text-gray-900 text-[15px] font-bold mb-1">
          {title}
        </Text>
      ) : null}
      <Text className="text-red-700 text-[13px]">{message}</Text>
      {action ? <View className="mt-3">{action}</View> : null}
    </View>
  );
}

export function AuthModal({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 justify-center px-6 py-8">
        {children}
      </View>
    </Modal>
  );
}

export function LogoMark({ size = 120 }: { size?: number }) {
  return (
    <Image
      source={require("../../../assets/auth/virujlogo.png")}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
