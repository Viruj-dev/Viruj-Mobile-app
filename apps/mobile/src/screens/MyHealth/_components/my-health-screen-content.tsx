import { FlatList, ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../../_components/AppTabBar";
import AppointmentCard from "./appointment-card";
import HealthSummaryCard from "./health-summary-card";
import {
  Appointment,
  appointments,
  medications,
  reports,
} from "./my-health-data";
import RecordsGrid from "./records-grid";
import ScreenHeader from "./screen-header";
import SectionHeader from "./section-header";
import SimpleListSection from "./simple-list-section";
import TopBar from "./top-bar";
import VitalsStrip from "./vitals-strip";

function MyHealthContent() {
  return (
    <>
      <ScreenHeader />
      <HealthSummaryCard />
      <SectionHeader title="Appointments" action="Book new" />
    </>
  );
}

export default function MyHealthScreenContent({
  onTabPress,
}: {
  onTabPress?: (tab: AppTab) => void;
}) {
  const renderAppointment: ListRenderItem<Appointment> = ({ item }) => (
    <AppointmentCard item={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBFF]">
      <TopBar />
      <FlatList
        ListHeaderComponent={<MyHealthContent />}
        ListFooterComponent={
          <>
            <RecordsGrid />
            <VitalsStrip />
            <SimpleListSection
              title="Medications"
              rows={medications}
              icon="medkit-outline"
              color="#0E9996"
            />
            <SimpleListSection
              title="Reports & documents"
              rows={reports}
              icon="document-attach-outline"
              color="#4B8FEA"
            />
          </>
        }
        contentContainerStyle={{ paddingBottom: 132, paddingHorizontal: 22 }}
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        showsVerticalScrollIndicator={false}
      />

      <AppTabBar activeTab="My Health" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}
