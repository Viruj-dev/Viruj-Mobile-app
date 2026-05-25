import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WelcomeScreen from "./src/components/Auth/_components/welcome";
import OnboardingCarousel from "./src/components/Auth/_components/onboarding";
import LoginScreen from "./src/components/Auth/_components/login";
import SignupScreen from "./src/components/Auth/_components/signup";
import Logout from "./src/components/Auth/_components/logout";

import "./global.css";

type AuthStep = "welcome" | "onboarding" | "login" | "signup" | "app";

function AppContent() {
  const [step, setStep] = useState<AuthStep>("welcome");

  if (step === "welcome") {
    return <WelcomeScreen onNext={() => setStep("onboarding")} />;
  }

  if (step === "onboarding") {
    return <OnboardingCarousel onComplete={() => setStep("login")} />;
  }

  if (step === "login") {
    return (
      <LoginScreen
        onSignupPress={() => setStep("signup")}
        onLoginSuccess={() => setStep("app")}
      />
    );
  }

  if (step === "signup") {
    return (
      <SignupScreen
        onLoginPress={() => setStep("login")}
        onSignupSuccess={() => setStep("app")}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-white px-6 py-8">
        <View className="flex-1 items-center justify-center">
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Viruj Health is ready
          </Text>
          <Text className="mt-3 text-base text-gray-500 text-center">
            Authentication pages are now connected inside the mobile app.
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={() => setStep("login")}
            className="min-h-[52px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50"
          >
            <Text className="text-sm font-medium text-gray-700">
              Open auth flow
            </Text>
          </Pressable>

          <Logout onLogout={() => setStep("login")} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
