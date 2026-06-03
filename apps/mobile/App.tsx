import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WelcomeScreen from "./src/components/Auth/_components/welcome";
import OnboardingCarousel from "./src/components/Auth/_components/onboarding";
import LoginScreen from "./src/components/Auth/_components/login";
import SignupScreen from "./src/components/Auth/_components/signup";
import ForgotPasswordScreen from "./src/components/Auth/_components/forgot-password";
import OtpVerificationScreen from "./src/components/Auth/_components/otp-verification";
import HomeScreen from "./src/components/Home/home-screen";

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

  return <HomeScreen />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <AppContent />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
