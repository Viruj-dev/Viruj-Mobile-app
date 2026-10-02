import { Platform, type GestureResponderEvent } from "react-native";
import * as Haptics from "expo-haptics";

let lastTouch = 0;
let start: { x: number; y: number; at: number; moved: boolean } | undefined;
function touchFeedback() {
  if (Platform.OS === "web" || Date.now() - lastTouch < 80) return;
  lastTouch = Date.now();
  void Haptics.selectionAsync().catch(() => {});
}
export const tapFeedbackHandlers = {
  onTouchStart(event: GestureResponderEvent) {
    const { pageX, pageY, touches } = event.nativeEvent;
    start = touches.length === 1 ? { x: pageX, y: pageY, at: Date.now(), moved: false } : undefined;
  },
  onTouchMove(event: GestureResponderEvent) {
    if (start && Math.hypot(event.nativeEvent.pageX - start.x, event.nativeEvent.pageY - start.y) > 10) start.moved = true;
  },
  onTouchEnd(event: GestureResponderEvent) {
    if (!start) return;
    const tap = !start.moved && Math.hypot(event.nativeEvent.pageX - start.x, event.nativeEvent.pageY - start.y) <= 10 && Date.now() - start.at < 400;
    start = undefined;
    if (tap) touchFeedback();
  },
  onTouchCancel() { start = undefined; },
};
