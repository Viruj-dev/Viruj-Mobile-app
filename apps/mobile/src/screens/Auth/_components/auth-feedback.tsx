import type { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

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
