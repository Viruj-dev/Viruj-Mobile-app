import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import OnboardingCarousel from "../screens/Auth/onboarding-screen";
import HomeScreen from "../screens/home/home-screen";
import MyHealthScreen from "../screens/MyHealth/my-health-screen";
import CommunityScreen from "../screens/community/community-screen";
import ProfileScreen from "../screens/profile/profile-screen";
import type { AppTab } from "../screens/_components/AppTabBar";
import { PhoneAuthScreen } from "../features/auth/screens/phone-auth.screen";
import { OtpVerificationScreen } from "../features/auth/screens/otp-verification.screen";
import { useAuth } from "../features/auth/state/auth.context";
import { selectRootRoute } from "./routes";

type AuthStep = "phone" | "otp";
function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FBFF] px-8">
      <ActivityIndicator color="#0E9996" />
      <Text className="mt-4 text-center text-[15px] font-semibold text-[#536682]">
        Restoring your secure session...
      </Text>
    </View>
  );
}

function AuthStack() {
  const [step, setStep] = useState<AuthStep>("phone");

  if (step === "otp") {
    return <OtpVerificationScreen onEditPhone={() => setStep("phone")} />;
  }

  return <PhoneAuthScreen onOtpRequested={() => setStep("otp")} />;
}

function AppTabs() {
  const [activeTab, setActiveTab] = useState<AppTab>("Home");
  const { logout } = useAuth();

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

  if (activeTab === "My Health") {
    return <MyHealthScreen onTabPress={openAppTab} />;
  }

  if (activeTab === "Community") {
    return <CommunityScreen onTabPress={openAppTab} />;
  }

  if (activeTab === "Profile") {
    return <ProfileScreen onTabPress={openAppTab} onLogout={() => void logout()} />;
  }

  return <HomeScreen onTabPress={openAppTab} onLogout={() => void logout()} />;
}

export function RootNavigator() {
  const auth = useAuth();
  const route = selectRootRoute(auth.status);

  if (route === "splash") {
    return <SplashScreen />;
  }

  if (route === "auth") {
    return <AuthStack />;
  }

  if (route === "onboarding") {
    return <OnboardingCarousel onComplete={() => void auth.refreshSession()} />;
  }

  return <AppTabs />;
}
