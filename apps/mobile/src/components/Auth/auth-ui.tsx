import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palette = {
  background: "#F8FBFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F7FF",
  border: "#E5ECF4",
  text: "#001B49",
  muted: "#536682",
  softMuted: "#7B8AA6",
  brand: "#0E9996",
  brandPressed: "#047C9D",
  brandSoft: "#E9FBF8",
  green: "#39C69A",
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

export function VirujWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <View className="flex-row items-end self-start">
      <Text
        className={`font-extrabold leading-none tracking-normal text-[#001B49] ${
          compact ? "text-[32px]" : "text-[40px]"
        }`}
      >
        viruj
      </Text>
      <View
        className={`rotate-[-35deg] rounded-full bg-[#39C69A] ${
          compact
            ? "-ml-[2px] mb-[25px] h-[8px] w-[6px]"
            : "-ml-[2px] mb-[30px] h-[9px] w-[7px]"
        }`}
      />
      <View
        className={`rotate-[35deg] rounded-full bg-[#39C69A] ${
          compact
            ? "mb-[31px] ml-[1px] h-[7px] w-[5px]"
            : "mb-[38px] ml-[1px] h-[8px] w-[6px]"
        }`}
      />
    </View>
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
      <Text className="mb-2 text-sm font-extrabold text-[#001B49]">
        {label}
      </Text>
      {input}
      {error ? (
        <Text className="text-[#DC2626] text-[12px] mt-1.5">{error}</Text>
      ) : null}
    </View>
  );
}

export function AuthInput({
  right,
  left,
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  right?: ReactNode;
  left?: ReactNode;
  error?: boolean;
}) {
  return (
    <View
      className={`relative rounded-[18px] border bg-white ${
        error ? "border-red-300" : "border-[#E5ECF4]"
      }`}
      style={{
        elevation: 2,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      }}
    >
      {left ? (
        <View className="absolute top-0 left-0 bottom-0 justify-center pl-3.5">
          {left}
        </View>
      ) : null}
      <TextInput
        placeholderTextColor={palette.softMuted}
        className={`min-h-[58px] px-4 text-[15px] font-semibold text-[#001B49] ${
          right ? "pr-14" : ""
        } ${left ? "pl-12" : ""}`}
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
      <Text className="text-[12px] font-extrabold text-[#059669]">{label}</Text>
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
        trackColor={{ false: "#D1D5DB", true: palette.brand }}
      />
      <Text className="text-[12px] font-semibold text-[#536682]">{label}</Text>
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
      className={`mt-2 min-h-[58px] items-center justify-center rounded-full bg-[#0E9996] active:bg-[#047C9D] ${
        disabled || loading ? "opacity-60" : ""
      } ${className || ""}`}
      style={{
        elevation: 5,
        shadowColor: "#0E9996",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text className="text-[15px] font-extrabold text-white">{label}</Text>
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
      className={`min-h-[56px] items-center justify-center rounded-full border border-[#E5ECF4] bg-white active:bg-slate-50 ${
        className || ""
      }`}
    >
      <Text className="text-[15px] font-extrabold text-[#001B49]">{label}</Text>
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
      className={`min-h-[56px] flex-row items-center justify-center gap-2.5 rounded-full border border-[#E5ECF4] bg-white active:bg-slate-50 ${
        disabled || loading ? "opacity-60" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={palette.brand} size="small" />
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
                mode === "google" ? "text-[#001B49]" : "text-white"
              }`}
            >
              {iconLabel}
            </Text>
          </View>
          <Text className="text-[14px] font-bold text-[#24405F]">{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 my-8">
      <View className="h-[1px] flex-1 bg-[#E5ECF4]" />
      <Text className="text-[13px] font-semibold text-[#7B8AA6]">{label}</Text>
      <View className="h-[1px] flex-1 bg-[#E5ECF4]" />
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
      <Text className="text-sm font-semibold text-[#536682]">{prompt} </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="text-sm font-extrabold text-[#059669]">
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
          ? "bg-[#E9FBF8] border-[#BDEFE3]"
          : "bg-red-50 border-red-200"
      }`}
    >
      {title ? (
        <Text className="mb-1 text-[15px] font-extrabold text-[#001B49]">
          {title}
        </Text>
      ) : null}
      <Text
        className={`text-[13px] ${
          tone === "success" ? "text-[#047C9D]" : "text-red-700"
        }`}
      >
        {message}
      </Text>
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
