import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WelcomeScreen from "./src/screens/Auth/welcome-screen";
import OnboardingCarousel from "./src/screens/Auth/onboarding-screen";
import LoginScreen from "./src/screens/Auth/login-screen";
import SignupScreen from "./src/screens/Auth/signup-screen";
import ForgotPasswordScreen from "./src/screens/Auth/forgot-password-screen";
import OtpVerificationScreen from "./src/screens/Auth/otp-verification-screen";
import HomeScreen from "./src/screens/home/home-screen";
import MyHealthScreen from "./src/screens/MyHealth/my-health-screen";
import CommunityScreen from "./src/screens/community/community-screen";
import ProfileScreen from "./src/screens/profile/profile-screen";
import { AppTab } from "./src/screens/_components/AppTabBar";

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
  const [activeTab, setActiveTab] = useState<AppTab>("Home");
  const [verificationTarget, setVerificationTarget] = useState(
    "+91 98765 43210"
  );

  const openAppTab = (tab: AppTab) => {
    if (
      tab === "Home" ||
      tab === "My Health" ||
      tab === "Community" ||
      tab === "Profile"
    ) {
      setActiveTab(tab);
    }
  };

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
        onLoginSuccess={() => {
          setActiveTab("Home");
          setStep("app");
        }}
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
        onVerified={() => {
          setActiveTab("Home");
          setStep("app");
        }}
      />
    );
  }

  if (activeTab === "My Health") {
    return <MyHealthScreen onTabPress={openAppTab} />;
  }

  if (activeTab === "Community") {
    return <CommunityScreen onTabPress={openAppTab} />;
  }

  if (activeTab === "Profile") {
    return <ProfileScreen onTabPress={openAppTab} />;
  }

  return <HomeScreen onTabPress={openAppTab} />;
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
