import { useCallback, useState } from "react";
import { FlatList, ListRenderItem, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../../_components/AppTabBar";
import ConcernGrid from "./concern-grid";
import EmptyDesignCard from "./empty-design-card";
import { EmptyCard, makeEmptyCards } from "./home-data";
import HomeHeader from "./home-header";
import OffersSection from "./offers-section";
import PriorityCard from "./priority-card";
import SectionHeader from "./section-header";
import WelcomeCard from "./welcome-card";

function HomeContent() {
  return (
    <>
      <HomeHeader />
      <WelcomeCard />
      <ConcernGrid />
      <PriorityCard />
      <OffersSection />
      <SectionHeader
        title="More for you"
        subtitle="Empty cards ready for future modules"
      />
    </>
  );
}

export default function HomeScreenContent({
  onTabPress,
}: {
  onTabPress?: (tab: AppTab) => void;
}) {
  const [cards, setCards] = useState(() => makeEmptyCards(0, 8));
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (loading) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCards((current) => [
        ...current,
        ...makeEmptyCards(current.length, 6),
      ]);
      setLoading(false);
    }, 250);
  }, [loading]);

  const renderCard: ListRenderItem<EmptyCard> = ({ item }) => (
    <EmptyDesignCard card={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBFF]">
      <FlatList
        ListFooterComponent={
          loading ? (
            <Text className="mb-5 text-center text-[13px] font-bold text-[#667796]">
              Adding more cards...
            </Text>
          ) : null
        }
        ListHeaderComponent={<HomeContent />}
        contentContainerStyle={{ paddingBottom: 132, paddingHorizontal: 22 }}
        data={cards}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.65}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
      />

      <AppTabBar activeTab="Home" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}
