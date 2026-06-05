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
