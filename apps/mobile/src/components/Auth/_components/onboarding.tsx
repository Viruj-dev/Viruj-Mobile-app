import { View, Text, Image, Pressable } from "react-native";
import { useState } from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    title: "YOUR PERSONAL HEALTH COMPANION",
    description:
      "Access doctors, clinics, pathlabs, and emergency services all in one place.",
    image: require("../../../../assets/auth/onboarding-1.png"),
  },
  {
    title: "CONNECT WITH EXPERTS",
    description:
      "Book online consultations with top doctors and get prescriptions easily.",
    image: require("../../../../assets/auth/onboarding-2.jpg"),
  },
  {
    title: "MEET VIRUJ AI",
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

  const gesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50) nextSlide();
    if (e.translationX > 50) prevSlide();
  });

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center">
      <View className="h-full w-full bg-white">
        <Pressable
          onPress={onComplete}
          className="absolute right-6 top-12 z-10"
        >
          <Text className="text-xs font-bold text-gray-400">SKIP</Text>
        </Pressable>

        {currentSlide > 0 ? (
          <Pressable onPress={prevSlide} className="absolute left-6 top-12 z-10">
            <Ionicons name="arrow-back" size={24} color="gray" />
          </Pressable>
        ) : null}

        <GestureDetector gesture={gesture}>
          <Animated.View
            key={currentSlide}
            entering={FadeInRight}
            exiting={FadeOutLeft}
            className="flex-1"
          >
            <View className="h-[60%] bg-gray-200">
              <Image
                source={slides[currentSlide].image}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 items-center justify-between px-8 py-6">
              <View className="items-center">
                <Text className="mb-3 text-center text-xl uppercase text-gray-700">
                  {slides[currentSlide].title}
                </Text>

                <Text className="text-center text-sm text-gray-500">
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
                        ? "h-3 w-3 bg-[#6D0F14]"
                        : "h-2 w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        </GestureDetector>

        <View className="px-8 pb-10">
          <Pressable
            onPress={nextSlide}
            className="items-center rounded-xl bg-[#6D0F14] py-4"
          >
            <Text className="tracking-widest text-white">
              {currentSlide === slides.length - 1 ? "GET STARTED" : "CONTINUE"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
