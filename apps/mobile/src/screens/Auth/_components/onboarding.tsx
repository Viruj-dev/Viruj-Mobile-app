import { View, Text, Image, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    title: "Your Personal Health Companion",
    description:
      "Access doctors, clinics, pathlabs, and emergency services all in one place.",
    image: require("../../../../assets/auth/onboarding-1.png"),
  },
  {
    title: "Connect With Experts",
    description:
      "Book online consultations with top doctors and get prescriptions easily.",
    image: require("../../../../assets/auth/onboarding-2.jpg"),
  },
  {
    title: "Meet Viruj AI",
    description: "Describe symptoms and get smart health insights instantly.",
    image: require("../../../../assets/auth/onboarding-3.jpg"),
  },
] as const;

export default function OnboardingCarousel({ onComplete }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((value) => value + 1);
      return;
    }

    onComplete();
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((value) => value - 1);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F8FBFF]">
      <View className="h-full w-full bg-[#F8FBFF]">
        <Pressable
          onPress={onComplete}
          className="absolute right-6 top-12 z-10 rounded-full border border-[#E5ECF4] bg-white px-4 py-3"
        >
          <Text className="text-xs font-extrabold text-[#536682]">Skip</Text>
        </Pressable>

        {currentSlide > 0 ? (
          <Pressable
            onPress={prevSlide}
            className="absolute left-6 top-12 z-10 h-11 w-11 items-center justify-center rounded-full border border-[#E5ECF4] bg-white"
          >
            <Ionicons name="arrow-back" size={22} color="#001B49" />
          </Pressable>
        ) : null}

        <View key={currentSlide} className="flex-1">
          <View className="h-[58%] overflow-hidden rounded-b-[32px] bg-[#EAF4FF]">
            <Image
              source={slides[currentSlide].image}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 left-0 right-0 h-28 bg-[#001B4918]" />
          </View>

          <View className="flex-1 items-center justify-between px-8 py-7">
            <View className="items-center">
              <Text className="mb-3 text-center text-[28px] font-extrabold leading-[34px] tracking-normal text-[#001B49]">
                {slides[currentSlide].title}
              </Text>

              <Text className="text-center text-[15px] font-medium leading-6 text-[#536682]">
                {slides[currentSlide].description}
              </Text>
            </View>

            <View className="mt-6 flex-row gap-2">
              {slides.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => setCurrentSlide(index)}
                  className={`rounded-full ${
                    index === currentSlide
                      ? "h-3 w-8 bg-[#0E9996]"
                      : "h-3 w-3 bg-[#CCD6E2]"
                  }`}
                />
              ))}
            </View>
          </View>
        </View>

        <View className="px-8 pb-10">
          <Pressable
            onPress={nextSlide}
            className="items-center rounded-full bg-[#0E9996] py-5"
            style={{
              elevation: 5,
              shadowColor: "#0E9996",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
            }}
          >
            <Text className="text-[15px] font-extrabold text-white">
              {currentSlide === slides.length - 1 ? "Get started" : "Continue"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}