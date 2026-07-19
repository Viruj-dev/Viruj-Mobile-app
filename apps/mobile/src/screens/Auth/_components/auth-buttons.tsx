import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { palette } from "./auth-palette";

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
      className={`mt-2 min-h-[58px] items-center justify-center rounded-full bg-[#171717] active:bg-[#2A2A2A] ${
        disabled || loading ? "opacity-55" : ""
      } ${className || ""}`}
      style={{
        elevation: 8,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text className="text-[15px] font-bold text-white">{label}</Text>
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
      className={`min-h-[56px] items-center justify-center rounded-full border border-[#DDD8D0] bg-white active:bg-[#F7F2EA] ${
        className || ""
      }`}
    >
      <Text className="text-[15px] font-bold text-[#111111]">{label}</Text>
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
  mode: "google" | "facebook" | "apple";
  loading?: boolean;
  disabled?: boolean;
}) {
  const iconLabel = mode === "google" ? "G" : mode === "apple" ? "Apple" : "f";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`min-h-[54px] flex-row items-center justify-center gap-3 rounded-full border border-[#DDD8D0] bg-white active:bg-[#F7F2EA] ${
        disabled || loading ? "opacity-60" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={palette.brand} size="small" />
      ) : (
        <>
          <View
            className={`h-6 min-w-6 items-center justify-center rounded-full ${
              mode === "facebook" ? "bg-[#1877F2] px-1" : "bg-white px-1"
            }`}
          >
            <Text
              className={`text-[13px] font-black ${
                mode === "facebook" ? "text-white" : "text-[#111111]"
              }`}
            >
              {iconLabel}
            </Text>
          </View>
          <Text className="text-[14px] font-semibold text-[#111111]">{label}</Text>
        </>
      )}
    </Pressable>
  );
}
