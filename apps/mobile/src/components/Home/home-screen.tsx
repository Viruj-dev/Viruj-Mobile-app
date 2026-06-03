import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTabBar, { AppTab } from "../AppTabBar";

type IconName = keyof typeof Ionicons.glyphMap;

type EmptyCard = {
  id: string;
  variant: number;
  bg: string;
  accent: string;
};

const quickActions: Array<{ label: string; icon: IconName }> = [
  { label: "Book\nAppointment", icon: "calendar-outline" },
  { label: "Consult\nOnline", icon: "chatbox-ellipses-outline" },
  { label: "Upload\nReports", icon: "document-text-outline" },
  { label: "Health\nRecords", icon: "medkit-outline" },
];

const concerns: Array<{
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
}> = [
  {
    title: "Cardiac\nSciences",
    subtitle: "Heart & Vascular\nCare",
    icon: "\u2764\uFE0F",
    color: "#EF476F",
    bg: "#FFF0F4",
  },
  {
    title: "Neurosciences",
    subtitle: "Brain, Spine &\nNerve Care",
    icon: "\uD83E\uDDE0",
    color: "#EF5D7A",
    bg: "#FFF0F4",
  },
  {
    title: "Orthopaedics",
    subtitle: "Bone, Joint &\nMuscle Care",
    icon: "\uD83E\uDDB4",
    color: "#4B8FEA",
    bg: "#EFF6FF",
  },
  {
    title: "Internal\nMedicine",
    subtitle: "General & Chronic\nCare",
    icon: "\uD83E\uDE7A",
    color: "#0E9996",
    bg: "#E9FBF8",
  },
  {
    title: "Women &\nChild Care",
    subtitle: "Women's Health\n& Pediatrics",
    icon: "\uD83D\uDC69\u200D\uD83C\uDF7C",
    color: "#D946A3",
    bg: "#FDF2F8",
  },
  {
    title: "Oncology",
    subtitle: "Cancer Care &\nSupport",
    icon: "\uD83C\uDF97\uFE0F",
    color: "#F59E0B",
    bg: "#FFF7E6",
  },
  {
    title: "Diagnostics\n& Imaging",
    subtitle: "Tests, Scans &\nImaging",
    icon: "\uD83D\uDC41\uFE0F",
    color: "#0E9996",
    bg: "#E9FBF8",
  },
  {
    title: "Surgery",
    subtitle: "Advanced\nSurgical Care",
    icon: "\uD83E\uDE79",
    color: "#8B5CF6",
    bg: "#F4F0FF",
  },
];

const emptyCardThemes = [
  ["#F0F7FF", "#66A9EA"],
  ["#EEF9F3", "#10B981"],
  ["#FFF7E8", "#F59E0B"],
  ["#F4F0FF", "#8B5CF6"],
  ["#FFF0F4", "#EF476F"],
];

const makeEmptyCards = (start: number, count: number): EmptyCard[] =>
  Array.from({ length: count }, (_, index) => {
    const number = start + index;
    const [bg, accent] = emptyCardThemes[number % emptyCardThemes.length];

    return {
      id: `empty-home-card-${number}`,
      variant: number % 4,
      bg,
      accent,
    };
  });

function Header() {
  return (
    <View className="pt-1">
      <View className="mb-5 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center">
          <View className="w-[118px] flex-row items-end">
            <Text className="text-[36px] font-extrabold leading-[40px] tracking-normal text-[#001B49]">
              viruj
            </Text>
            <View className="-ml-[2px] mb-[28px] h-[9px] w-[7px] rotate-[-35deg] rounded-full bg-[#39C69A]" />
            <View className="mb-[35px] ml-[1px] h-[8px] w-[6px] rotate-[35deg] rounded-full bg-[#39C69A]" />
          </View>

          <View className="ml-[10px] mr-[12px] h-[26px] w-px bg-[#CCD6E2]" />
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-[14px] font-semibold text-[#667796]"
          >
            Care that understands you
          </Text>
        </View>

        <Pressable className="h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-[#E7EDF4] bg-white">
          <Ionicons name="notifications-outline" size={25} color="#001B49" />
          <View className="absolute right-[9px] top-2 h-[14px] w-[14px] rounded-full border-2 border-white bg-[#FF335C]" />
        </Pressable>
      </View>
    </View>
  );
}

function WelcomeCard() {
  return (
    <View className="mb-7 overflow-hidden rounded-[24px] bg-[#0E9996] px-[18px] pb-[16px] pt-[18px]">
      <View className="absolute -right-[76px] -top-[84px] h-[220px] w-[220px] rounded-full bg-[#43D8C1] opacity-40" />
      <View className="absolute -bottom-[100px] -left-[74px] h-[230px] w-[230px] rounded-full bg-[#047C9D] opacity-35" />

      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-[14px] font-semibold text-[#E9FFFB]">
            Welcome back,
          </Text>
          <Text className="mt-1 text-[27px] font-extrabold leading-[32px] tracking-normal text-white">
            Abhishek Negi  {"\uD83D\uDC4B"}
          </Text>
          <Text className="mt-1 text-[14px] font-semibold text-[#F0FFFC]">
            Here's your health overview
          </Text>
        </View>

        <View className="h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full bg-[#D6FAED]">
          <View className="h-[28px] w-[28px] rounded-full bg-[#123D78]" />
          <View className="mt-[3px] h-[34px] w-[48px] rounded-t-[24px] bg-[#3157B8]" />
          <View className="absolute top-[25px] h-[12px] w-[24px] rounded-b-full bg-[#F4B18F]" />
        </View>
      </View>

      <Pressable className="mt-5 h-[50px] flex-row items-center gap-[10px] rounded-full bg-white px-[16px]">
        <Ionicons name="search-outline" size={22} color="#7B8AA6" />
        <Text
          numberOfLines={1}
          className="flex-1 text-[14px] font-semibold text-[#6B7A99]"
        >
          Search doctors, hospitals, departments...
        </Text>
        <Ionicons name="mic-outline" size={23} color="#7B8AA6" />
      </Pressable>

      <View className="mt-5 flex-row justify-between">
        {quickActions.map((action) => (
          <Pressable key={action.label} className="w-[23%] items-center">
            <View className="mb-2 h-[38px] w-[38px] items-center justify-center rounded-full bg-[#FFFFFF22]">
              <Ionicons name={action.icon} size={21} color="#FFFFFF" />
            </View>
            <Text className="text-center text-[11px] font-extrabold leading-[14px] text-white">
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View className="min-w-0 flex-1 pr-4">
        <Text className="text-[22px]  leading-[27px] tracking-normal text-[#001B49]">
          {title}
        </Text>
        <Text className="mt-1 text-[14px] font-medium leading-5 text-[#536682]">
          {subtitle}
        </Text>
      </View>
      <Pressable className="h-[40px] flex-row items-center gap-[5px] rounded-full border border-[#E4EAF2] bg-white px-[15px]">
        <Text className="text-[13px] font-extrabold text-[#001B49]">
          View All
        </Text>
        <Ionicons name="chevron-forward" size={17} color="#001B49" />
      </Pressable>
    </View>
  );
}

function ConcernGrid() {
  const { width } = useWindowDimensions();
  const horizontalPadding = 44;
  const gap = 10;
  const cardWidth = (width - horizontalPadding - gap * 3) / 4;

  return (
    <View className="mb-7">
      <SectionHeader
        title="How can we help you today?"
        subtitle="Choose a health concern to get started"
      />

      <View className="flex-row flex-wrap justify-between">
        {concerns.map((concern) => (
          <Pressable
            key={concern.title}
            className="mb-4 h-[126px] items-center justify-start rounded-[15px] border border-[#E5ECF4] bg-white px-[6px] pb-[8px] pt-[13px]"
            style={{
              width: cardWidth,
              elevation: 4,
              shadowColor: "#123D78",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 14,
            }}
          >
            <View
              className=" h-[42px] w-[42px] items-center justify-center"
              style={{
                shadowColor: concern.color,
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: 0.3,
                shadowRadius: 9,
              }}
            >
              <Text className="text-[33px] leading-[39px]">
                {concern.icon}
              </Text>
            </View>
            <Text
              className="min-h-[34px] text-center text-[11px] font-extrabold leading-[13px] tracking-normal text-[#001B49]"
            >
              {concern.title}
            </Text>
            <Text
              className="mt-[5px] min-h-[43px] text-center text-[9px] font-medium leading-[11px] text-[#536682]"
            >
              {concern.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function PriorityCard() {
  return (
    <View
      className="mb-6 flex-row items-center overflow-hidden rounded-[22px] border border-[#D9E9FA] bg-[#EAF4FF] p-4"
      style={{
        elevation: 3,
        shadowColor: "#123D78",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className="absolute -left-[30px] -top-[28px] h-[150px] w-[150px] rounded-full bg-white opacity-30" />
      <View className="mr-4 h-[92px] w-[92px] items-center justify-center rounded-[24px] bg-white">
        <Ionicons name="pulse" size={42} color="#FF5571" />
        <View className="absolute -bottom-2 -right-2 h-11 w-11 items-center justify-center rounded-full bg-[#19A7C7]">
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </View>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[20px] font-extrabold leading-[25px] tracking-normal text-[#001B49]">
          Your Health, Our Priority
        </Text>
        <Text className="mt-2 text-[14px] font-semibold leading-5 text-[#24405F]">
          Track your health, manage appointments and get personalized care.
        </Text>

        <View className="mt-4 flex-row justify-between">
          {[
            ["analytics-outline", "Track Health", "#10B981"],
            ["person-badge-outline", "Expert Doctors", "#3B82F6"],
            ["shield-outline", "Secure & Private", "#8B5CF6"],
          ].map(([icon, label, color]) => (
            <View key={icon} className="max-w-[56px] items-center">
              <View
                className="h-[38px] w-[38px] items-center justify-center rounded-full"
                style={{ backgroundColor: `${color}14` }}
              >
                <Ionicons name={icon as IconName} size={19} color={color} />
              </View>
              <Text
                numberOfLines={1}
                className="mt-[6px] text-center text-[9px] font-bold text-[#001B49]"
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function OffersSection() {
  return (
    <View className="mb-5">
      <SectionHeader
        title="Exclusive for you"
        subtitle="Handpicked offers to help you stay healthy"
      />

      <View className="flex-row gap-3">
        <Pressable
          className="min-h-[136px] flex-[1.8] overflow-hidden rounded-[18px] border border-[#DCEAF7] bg-[#EDF7FF] p-4"
          style={{
            elevation: 3,
            shadowColor: "#123D78",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
          }}
        >
          <View className="self-start rounded-[7px] bg-[#10B981] px-[8px] py-[4px]">
            <Text className="text-[9px] font-extrabold text-white">
              Health Checkup
            </Text>
          </View>
          <Text className="mt-3 text-[18px] font-extrabold leading-[22px] tracking-normal text-[#001B49]">
            Full Body Checkup
          </Text>
          <Text className="mt-1 text-[15px] font-extrabold text-[#059669]">
            Up to 50% OFF
          </Text>
          <Text className="mt-2 max-w-[150px] text-[12px] font-medium leading-[16px] text-[#536682]">
            Complete health analysis for you and your family.
          </Text>

          <View className="absolute bottom-4 right-4 h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-white">
            <Ionicons name="people-outline" size={38} color="#66A9EA" />
          </View>
        </Pressable>

        <Pressable
          className="min-h-[136px] flex-1 rounded-[18px] border border-[#DDEFE6] bg-[#EEF9F3] p-4"
          style={{
            elevation: 3,
            shadowColor: "#123D78",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
          }}
        >
          <View className="mb-4 h-[38px] w-[38px] items-center justify-center rounded-full bg-[#D6FAED]">
            <Ionicons name="shield-checkmark-outline" size={22} color="#10B981" />
          </View>
          <Text className="text-[15px] font-extrabold leading-[19px] tracking-normal text-[#001B49]">
            Special Insurance Offers
          </Text>
          <View className="mt-3 flex-row items-center gap-1">
            <Text className="text-[12px] font-extrabold text-[#059669]">
              Explore Now
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#059669" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function EmptyDesignCard({ card }: { card: EmptyCard }) {
  const wide = card.variant === 0 || card.variant === 3;

  return (
    <Pressable
      className="mb-4 overflow-hidden rounded-[20px] border border-[#E3ECF5] p-4"
      style={{ backgroundColor: card.bg, minHeight: wide ? 148 : 126 }}
    >
      <View
        className="absolute -right-[34px] -top-[42px] h-[118px] w-[118px] rounded-full opacity-20"
        style={{ backgroundColor: card.accent }}
      />
      <View
        className="absolute -bottom-[48px] left-[34px] h-[120px] w-[120px] rounded-full opacity-10"
        style={{ backgroundColor: card.accent }}
      />

      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 pr-4">
          <View
            className="h-[20px] w-[92px] rounded-[7px]"
            style={{ backgroundColor: card.accent }}
          />
          <View className="mt-5 h-[18px] w-[82%] rounded-full bg-white" />
          <View className="mt-3 h-[12px] w-[62%] rounded-full bg-white/80" />
          <View className="mt-2 h-[12px] w-[44%] rounded-full bg-white/60" />
        </View>

        <View className="h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-white">
          <View
            className="h-[44px] w-[44px] rounded-full opacity-80"
            style={{ backgroundColor: `${card.accent}33` }}
          />
          <View
            className="absolute h-[26px] w-[26px] rounded-full"
            style={{ backgroundColor: card.accent }}
          />
        </View>
      </View>

      {wide ? (
        <View className="mt-5 flex-row gap-3">
          <View className="h-[34px] flex-1 rounded-full bg-white/75" />
          <View className="h-[34px] flex-1 rounded-full bg-white/55" />
          <View className="h-[34px] flex-1 rounded-full bg-white/45" />
        </View>
      ) : null}
    </Pressable>
  );
}

function HomeContent() {
  return (
    <>
      <Header />
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

export default function HomeScreen({
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
