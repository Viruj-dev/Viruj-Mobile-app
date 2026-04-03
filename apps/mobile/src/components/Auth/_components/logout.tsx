import { Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import posthog from "posthog-react-native"; // if using RN version

export default function Logout() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      // reset analytics if using posthog RN
      // posthog.reset();

      // navigation reset (replace with your navigator)
      console.log("Logged out");
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
      className="px-4 py-3 bg-red-900 rounded-lg flex-row items-center justify-center"
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Ionicons name="log-out-outline" size={20} color="white" />
      )}
    </Pressable>
  );
}
