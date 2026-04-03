import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { useState } from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

interface Props {
  onComplete: () => void;
}

export default function OnboardingCarousel({ onComplete }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "YOUR PERSONAL HEALTH COMPANION",
      description:
        "Access Doctors, Clinics, Pathlabs, And Emergency Services—All In One Place.",
      image: require("../../../../assets/auth/onboarding-1.png"),
    },
    {
      title: "CONNECT WITH EXPERTS",
      description:
        "Book Online Consultations With Top Doctors and get prescriptions easily.",
      image: require("../../../../assets/auth/onboarding-2.jpg"),
    },
    {
      title: "MEET VIRUJ AI",
      description: "Describe symptoms and get smart health insights instantly.",
      image: require("../../../../assets/auth/onboarding-3.jpg"),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const gesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50) nextSlide();
    if (e.translationX > 50) prevSlide();
  });

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center">
      <View className="w-full h-full bg-white">
        {/* Skip */}
        <Pressable
          onPress={onComplete}
          className="absolute top-12 right-6 z-10"
        >
          <Text className="text-gray-400 text-xs font-bold">SKIP</Text>
        </Pressable>

        {/* Back */}
        {currentSlide > 0 && (
          <Pressable
            onPress={prevSlide}
            className="absolute top-12 left-6 z-10"
          >
            <Ionicons name="arrow-back" size={24} color="gray" />
          </Pressable>
        )}

        {/* Content */}
        <GestureDetector gesture={gesture}>
          <Animated.View
            key={currentSlide}
            entering={FadeInRight}
            exiting={FadeOutLeft}
            className="flex-1"
          >
            {/* Image */}
            <View className="h-[60%] bg-gray-200">
              <Image
                source={slides[currentSlide].image}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Text */}
            <View className="flex-1 px-8 py-6 items-center justify-between">
              <View className="items-center">
                <Text className="text-xl text-gray-700 text-center mb-3 uppercase">
                  {slides[currentSlide].title}
                </Text>

                <Text className="text-gray-500 text-sm text-center">
                  {slides[currentSlide].description}
                </Text>
              </View>

              {/* Dots */}
              <View className="flex-row gap-2 mt-6">
                {slides.map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setCurrentSlide(index)}
                    className={`rounded-full ${
                      index === currentSlide
                        ? "w-3 h-3 bg-[#6D0F14]"
                        : "w-2 h-2 bg-gray-300"
                    }`}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        </GestureDetector>

        {/* CTA */}
        <View className="px-8 pb-10">
          <Pressable
            onPress={nextSlide}
            className="bg-[#6D0F14] py-4 rounded-xl items-center"
          >
            <Text className="text-white tracking-widest">
              {currentSlide === slides.length - 1 ? "GET STARTED" : "CONTINUE"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
