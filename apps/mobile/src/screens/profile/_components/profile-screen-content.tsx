import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../../_components/AppTabBar";
import Footer from "./footer";
import HealthRecords from "./health-records";
import MenuGroup from "./menu-group";
import { settings, support } from "./profile-data";
import ProfileCard from "./profile-card";
import TopBar from "./top-bar";

export default function ProfileScreenContent({
  onTabPress,
  onLogout,
}: {
  onTabPress?: (tab: AppTab) => void;
  onLogout?: () => void;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <TopBar />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 25,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard />
        <HealthRecords />
        <MenuGroup title="Account Settings" rows={settings} />
        <MenuGroup title="Support" rows={support} />
        <Footer onLogout={onLogout} />
      </ScrollView>

      <AppTabBar activeTab="Profile" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}
