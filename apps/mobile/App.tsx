import { ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "./src/product/session";
import { PatientApp } from "./src/product/app";

import "./global.css";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Merienda: require("./assets/fonts/Merienda.ttf") });
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color="#991B1B" /></View>;
  return (
    <View style={{ flex: 1 }}>
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
