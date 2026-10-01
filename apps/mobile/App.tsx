import { ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "./src/product/session";
import { PatientApp } from "./src/product/app";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { hapticsEnabled } from "./src/product/device-preferences";

import "./global.css";
let lastTouch = 0;
function touchFeedback() {
  if (Platform.OS === "web" || !hapticsEnabled || Date.now() - lastTouch < 80) return;
  lastTouch = Date.now();
  void Haptics.selectionAsync().catch(() => {});
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Merienda: require("./assets/fonts/Merienda.ttf") });
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color="#991B1B" /></View>;
  return (
    <View style={{ flex: 1 }} onTouchStart={touchFeedback}>
      <SafeAreaProvider>
        <PaperProvider>
          <SessionProvider>
            <PatientApp />
          </SessionProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </View>
  );
}
