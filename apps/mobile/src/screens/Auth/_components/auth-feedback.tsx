import type { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export function Divider({ label }: { label: string }) {
  return (
    <View className="my-8 flex-row items-center gap-4">
      <View className="h-px flex-1 bg-[#E1DBD3]" />
      <Text className="text-[13px] font-medium text-[#8C867F]">{label}</Text>
      <View className="h-px flex-1 bg-[#E1DBD3]" />
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
    <View className="mt-8 flex-row flex-wrap items-center justify-center">
      <Text className="text-sm font-medium text-[#5F5A55]">{prompt} </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="text-sm font-black text-[#13945F]">{actionLabel}</Text>
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
      className={`mb-[18px] rounded-[18px] border px-4 py-3 ${
        tone === "success"
          ? "border-[#CBEEDB] bg-[#F0FBF5]"
          : "border-[#F3C5C0] bg-[#FFF4F2]"
      }`}
    >
      {title ? (
        <Text className="mb-1 text-[14px] font-black text-[#111111]">{title}</Text>
      ) : null}
      <Text
        className={`text-[13px] font-medium leading-5 ${
          tone === "success" ? "text-[#0E754A]" : "text-[#9F1F18]"
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
      <View className="flex-1 justify-center bg-black/40 px-6 py-8">
        {children}
      </View>
    </Modal>
  );
}
