import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "./src/product/session";
import { PatientApp } from "./src/product/app";

import "./global.css";

export default function App() {
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
