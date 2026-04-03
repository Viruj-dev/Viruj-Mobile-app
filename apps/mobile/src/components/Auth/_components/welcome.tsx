import { View, Text, Image, Pressable } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <Pressable
      onPress={onNext}
      className="flex-1 bg-white items-center justify-center"
    >
      <Animated.View entering={ZoomIn.duration(800)} className="items-center">
        {/* Logo */}
        <View className="items-center">
          <Image
            source={require("../../../../assets/auth/virujlogo.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />

          <Animated.Text
            entering={FadeInDown.delay(300).duration(500)}
            className="text-3xl tracking-widest text-gray-600 mt-2"
          >
            VIRUJ HEALTH
          </Animated.Text>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(500)}
          className="text-gray-500 text-sm mt-2"
        >
          Your personal health companion
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.delay(300).duration(500)}
          className="text-gray-400 text-sm mt-5"
        >
          Tap to continue
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
