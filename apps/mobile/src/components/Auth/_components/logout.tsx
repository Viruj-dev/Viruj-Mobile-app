import { Pressable, ActivityIndicator, Text } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import posthog from "posthog-react-native"; // if using RN version

interface LogoutProps {
  onLogout?: () => void;
}

export default function Logout({ onLogout }: LogoutProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      // reset analytics if using posthog RN
      // posthog.reset();

      // navigation reset (replace with your navigator)
      console.log("Logged out");
      onLogout?.();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Logout failed:", error.message);
      } else {
        console.error("Logout failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleLogout}
      className="min-h-[54px] rounded-2xl bg-[#6D0F14] flex-row items-center justify-center"
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="ml-2 text-sm font-semibold text-white">
            Sign out
          </Text>
        </>
      )}
    </Pressable>
  );
}
