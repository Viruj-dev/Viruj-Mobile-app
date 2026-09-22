import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH - 44; // 22px padding on each side
const AUTO_SCROLL_INTERVAL = 4000;

// ─── Banner 1 · Max Lab ───────────────────────────────────────────────────────
function MaxLabBanner() {
  return (
    <View
      className="overflow-hidden rounded-[20px] bg-white"
      style={{
        width: CARD_WIDTH,
        minHeight: 130,
        borderWidth: 1,
        borderColor: "#E8EEF6",
        elevation: 4,
        shadowColor: "#1A3A6B",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      }}
    >
      {/* Red accent top-right corner */}
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 90,
          height: 90,
          borderBottomLeftRadius: 90,
          backgroundColor: "#CC0000",
          opacity: 0.08,
        }}
      />

      <View className="flex-1 flex-row">
        {/* Left content */}
        <View className="flex-1 p-4">
          {/* Logo row */}
          <View className="flex-row items-center gap-2">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-[#CC0000]">
              <Ionicons name="flask" size={14} color="#fff" />
            </View>
            <View>
              <Text className="text-[13px] font-extrabold text-[#CC0000]">
                MAX Lab
              </Text>
              <Text className="text-[8px] font-medium text-[#536682]">
                Trusted Diagnostics
              </Text>
            </View>
          </View>

          {/* Offer */}
          <Text className="mt-2 text-[26px] font-extrabold leading-[28px] text-[#CC0000]">
            40% OFF
          </Text>
          <Text className="text-[12px] font-extrabold text-[#001B49]">
            Wellwise Total Profile
          </Text>
          <Text className="text-[10px] font-medium text-[#536682]">
            84 Tests
          </Text>

          {/* Price */}
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-[11px] font-medium text-[#8FA3BF] line-through">
              ₹4,999
            </Text>
            <Text className="text-[16px] font-extrabold text-[#001B49]">
              ₹2,999
            </Text>
          </View>

          {/* Footer info */}
          <View className="mt-2 flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={9} color="#536682" />
              <Text className="text-[8px] font-medium text-[#536682]">
                Sector 75, Noida
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="home-outline" size={9} color="#536682" />
              <Text className="text-[8px] font-medium text-[#536682]">
                Home Sample
              </Text>
            </View>
          </View>
        </View>

        {/* Right – CTA + visual */}
        <View className="w-[120px] items-center justify-between py-4 pr-4">
          {/* Beaker visual */}
          <View className="h-[60px] w-[60px] items-center justify-center rounded-[16px] bg-[#EDF7FF]">
            <Ionicons name="flask" size={30} color="#66A9EA" />
          </View>

          {/* Book Now button */}
          <Pressable className="mt-2 flex-row items-center gap-1 rounded-full bg-[#CC0000] px-4 py-[8px]">
            <Text className="text-[11px] font-extrabold text-white">
              Book Now
            </Text>
            <Ionicons name="arrow-forward" size={11} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Banner 2 · Kailash Healthcare ───────────────────────────────────────────
function KailashBanner() {
  return (
    <View
      className="overflow-hidden rounded-[20px] bg-white"
      style={{
        width: CARD_WIDTH,
        minHeight: 130,
        borderWidth: 1,
        borderColor: "#F0E6E6",
        elevation: 4,
        shadowColor: "#7B0000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      }}
    >
      {/* Red wave bottom-right */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 110,
          height: 110,
          borderTopLeftRadius: 110,
          backgroundColor: "#CC0000",
          opacity: 0.08,
        }}
      />

      <View className="flex-row flex-1">
        {/* Left */}
        <View className="flex-1 p-4">
          {/* Provider */}
          <View className="flex-row items-center gap-1">
            <Text className="text-[11px] font-extrabold text-[#001B49]">
              Kailash Healthcare
            </Text>
            <View className="flex-row items-center gap-1 rounded-full bg-[#E8F4FF] px-[6px] py-[2px]">
              <Ionicons name="checkmark-circle" size={10} color="#3B82F6" />
              <Text className="text-[8px] font-bold text-[#3B82F6]">
                Verified
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="mt-1 text-[18px] font-extrabold leading-[21px] text-[#CC0000]">
            Heart 360°{"\n"}
            <Text className="text-[#001B49]">Health Check</Text>
          </Text>
          <Text className="mt-[2px] text-[10px] font-medium text-[#536682]">
            Special Offer • Till 1 Oct
          </Text>

          {/* Plans */}
          <View className="mt-2 flex-row gap-2">
            {["Essential", "Premium", "Exclusive"].map((plan) => (
              <View
                key={plan}
                className="rounded-full border border-[#CC0000] px-[7px] py-[3px]"
              >
                <Text className="text-[7px] font-extrabold text-[#CC0000]">
                  {plan}
                </Text>
              </View>
            ))}
          </View>

          {/* Location */}
          <View className="mt-2 flex-row items-center gap-1">
            <Ionicons name="location-outline" size={9} color="#536682" />
            <Text
              className="text-[8px] font-medium text-[#536682]"
              numberOfLines={1}
            >
              Noida • Greater Noida • Dehradun
            </Text>
          </View>

          {/* CTA */}
          <Pressable className="mt-3 flex-row items-center gap-1 self-start rounded-full bg-[#CC0000] px-4 py-[8px]">
            <Text className="text-[11px] font-extrabold text-white">
              View Offer
            </Text>
            <Ionicons name="chevron-forward" size={11} color="#fff" />
          </Pressable>
        </View>

        {/* Right – heart visual */}
        <View className="w-[100px] items-center justify-center gap-3 pr-3">
          {/* Heart icon */}
          <View className="h-[64px] w-[64px] items-center justify-center rounded-full bg-[#FFEEF0]">
            <Ionicons name="heart" size={34} color="#CC0000" />
          </View>

          {/* Benefits */}
          {[
            ["Early Detection", "analytics-outline"],
            ["Healthier Tomorrow", "sunny-outline"],
            ["For Your Family", "people-outline"],
          ].map(([label, icon]) => (
            <View key={label} className="flex-row items-center gap-1">
              <View className="h-5 w-5 items-center justify-center rounded-full bg-[#F8F0F0]">
                <Ionicons name={icon as any} size={10} color="#CC0000" />
              </View>
              <Text
                className="text-[7px] font-semibold text-[#001B49]"
                style={{ maxWidth: 60 }}
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

// ─── Banner 3 · SkinnSi ───────────────────────────────────────────────────────
function SkinnSiBanner() {
  return (
    <View
      className="overflow-hidden rounded-[20px] bg-white"
      style={{
        width: CARD_WIDTH,
        minHeight: 130,
        borderWidth: 1,
        borderColor: "#D9EDE9",
        elevation: 4,
        shadowColor: "#005A4E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      }}
    >
      {/* Teal blob top-right */}
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          borderBottomLeftRadius: 100,
          backgroundColor: "#007A6E",
          opacity: 0.07,
        }}
      />

      <View className="flex-row flex-1">
        {/* Left */}
        <View className="flex-1 p-4">
          {/* Logo */}
          <View className="flex-row items-center gap-2">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-[#007A6E]">
              <Ionicons name="leaf" size={14} color="#fff" />
            </View>
            <View>
              <Text className="text-[13px] font-extrabold text-[#007A6E]">
                SkinnSi
              </Text>
              <Text className="text-[8px] font-medium tracking-widest text-[#536682]">
                SCIENCE MEETS SKINCARE
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="mt-1 flex-row items-center gap-1">
            <Ionicons name="location-outline" size={9} color="#536682" />
            <Text className="text-[8px] font-medium text-[#536682]">
              Sector 75, Noida
            </Text>
          </View>

          {/* Offer */}
          <Text className="mt-2 text-[22px] font-extrabold leading-[24px] text-[#007A6E]">
            Flat 20% OFF
          </Text>
          <Text className="text-[11px] font-semibold text-[#001B49]">
            on All Dermatology Consultations
          </Text>

          {/* Services */}
          <Text className="mt-1 text-[9px] font-medium text-[#536682]">
            Acne  •  Hair Fall  •  Skin Care  •  Laser
          </Text>

          {/* CTA */}
          <Pressable
            className="mt-3 flex-row items-center gap-1 self-start rounded-full px-4 py-[8px]"
            style={{ backgroundColor: "#003F39" }}
          >
            <Text className="text-[11px] font-extrabold text-white">
              Book Appointment
            </Text>
            <Ionicons name="chevron-forward" size={11} color="#fff" />
          </Pressable>
        </View>

        {/* Right – clinic visual */}
        <View className="w-[100px] items-center justify-center gap-3 pr-3">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#EAF6F4]">
            <Ionicons name="storefront" size={36} color="#007A6E" />
          </View>

          {/* Tagline */}
          <View className="items-center">
            <Text className="text-[7px] font-bold italic text-[#007A6E]">
              Healthy Skin
            </Text>
            <Text className="text-[7px] font-bold italic text-[#007A6E]">
              Happier You
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Dot indicator ────────────────────────────────────────────────────────────
function DotIndicator({ count, active }: { count: number; active: number }) {
  return (
    <View className="mt-3 flex-row justify-center gap-[6px]">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 18 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === active ? "#CC0000" : "#D6E0EF",
          }}
        />
      ))}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const BANNERS = [<MaxLabBanner />, <KailashBanner />, <SkinnSiBanner />];

export default function AdBannerSection() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % BANNERS.length;
        scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
    startTimer();
  };

  return (
    <View className="mb-6">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
      >
        {BANNERS.map((banner, i) => (
          <View key={i} style={{ width: CARD_WIDTH }}>
            {banner}
          </View>
        ))}
      </ScrollView>

      <DotIndicator count={BANNERS.length} active={activeIndex} />
    </View>
  );
}
