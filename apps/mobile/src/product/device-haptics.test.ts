import { expect, mock, test } from "bun:test";

let pulses = 0;
mock.module("react-native", () => ({ Platform: { OS: "android" } }));
mock.module("expo-haptics", () => ({ selectionAsync: async () => { pulses++; } }));
const { tapFeedbackHandlers } = await import("./device-haptics");
const event = (x: number, y: number) => ({ nativeEvent: { pageX: x, pageY: y, touches: [{}] } } as Parameters<typeof tapFeedbackHandlers.onTouchStart>[0]);

test("a light pulse follows a tap, never a scrolling gesture", () => {
  tapFeedbackHandlers.onTouchStart(event(20, 20));
  tapFeedbackHandlers.onTouchMove(event(20, 60));
  tapFeedbackHandlers.onTouchEnd(event(20, 60));
  expect(pulses).toBe(0);

  tapFeedbackHandlers.onTouchStart(event(20, 20));
  tapFeedbackHandlers.onTouchEnd(event(21, 20));
  expect(pulses).toBe(1);
});
