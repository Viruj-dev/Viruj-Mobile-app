import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WelcomeScreen from "./src/components/Auth/_components/welcome";
import OnboardingCarousel from "./src/components/Auth/_components/onboarding";
import LoginScreen from "./src/components/Auth/_components/login";
import SignupScreen from "./src/components/Auth/_components/signup";
import ForgotPasswordScreen from "./src/components/Auth/_components/forgot-password";
import OtpVerificationScreen from "./src/components/Auth/_components/otp-verification";
import Logout from "./src/components/Auth/_components/logout";

import "./global.css";

type AuthStep =
  | "welcome"
  | "onboarding"
  | "login"
  | "signup"
  | "forgot-password"
  | "verify"
  | "app";

function AppContent() {
  const [step, setStep] = useState<AuthStep>("welcome");
  const [verificationTarget, setVerificationTarget] = useState(
    "+91 98765 43210"
  );

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
        onForgotPasswordPress={() => setStep("forgot-password")}
        onLoginSuccess={() => setStep("app")}
      />
    );
  }

  if (step === "signup") {
    return (
      <SignupScreen
        onLoginPress={() => setStep("login")}
        onSignupSuccess={(phone) => {
          setVerificationTarget(phone);
          setStep("verify");
        }}
      />
    );
  }

  if (step === "forgot-password") {
    return (
      <ForgotPasswordScreen
        onBackToLogin={() => setStep("login")}
        onResetRequested={(target) => {
          setVerificationTarget(target);
          setStep("verify");
        }}
      />
    );
  }

  if (step === "verify") {
    return (
      <OtpVerificationScreen
        target={verificationTarget}
        onBack={() => setStep("signup")}
        onVerified={() => setStep("app")}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-[#F8FAFC] px-6 py-8">
        <View className="flex-1 justify-center">
          <View className="rounded-[28px] border border-emerald-100 bg-white p-6">
            <View className="mb-5 h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Ionicons name="shield-checkmark" size={28} color="#059669" />
            </View>
            <Text className="text-3xl font-bold text-gray-950">
              Viruj Health is ready
            </Text>
            <Text className="mt-3 text-base leading-6 text-gray-500">
              The required mobile authentication flow is connected with login,
              signup, forgot password, OTP verification, and logout states.
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={() => setStep("login")}
            className="min-h-[54px] flex-row items-center justify-center rounded-2xl border border-gray-200 bg-white"
          >
            <Ionicons name="lock-closed-outline" size={18} color="#374151" />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
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
