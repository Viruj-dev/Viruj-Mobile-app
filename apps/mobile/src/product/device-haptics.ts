import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { hapticsEnabled } from "./device-preferences";

let lastTouch = 0;
export function touchFeedback() {
  if (Platform.OS === "web" || !hapticsEnabled || Date.now() - lastTouch < 80) return;
  lastTouch = Date.now();
  void Haptics.selectionAsync().catch(() => {});
}
