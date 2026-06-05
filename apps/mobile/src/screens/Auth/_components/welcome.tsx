import { View, Text, Image, Pressable } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { VirujWordmark } from "./auth-ui";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <Pressable
      onPress={onNext}
      className="flex-1 items-center justify-center bg-[#F8FBFF] px-8"
    >
      <View className="absolute -right-[88px] -top-[84px] h-[240px] w-[240px] rounded-full bg-[#D6FAED]" />
      <View className="absolute -bottom-[96px] -left-[92px] h-[260px] w-[260px] rounded-full bg-[#EAF4FF]" />

      <Animated.View
        entering={ZoomIn.duration(800)}
        className="w-full items-center overflow-hidden rounded-[28px] border border-[#E5ECF4] bg-white px-8 py-10"
        style={{
          elevation: 8,
          shadowColor: "#123D78",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
        }}
      >
        <View className="items-center">
          <Image
            source={require("../../../../assets/auth/virujlogo.png")}
            className="h-36 w-36"
            resizeMode="contain"
          />

          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="mt-2"
          >
            <VirujWordmark />
          </Animated.View>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(500)}
          className="mt-4 text-center text-[15px] font-semibold leading-6 text-[#536682]"
        >
          Care that understands you
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.delay(300).duration(500)}
          className="mt-8 rounded-full bg-[#E9FBF8] px-5 py-3 text-sm font-extrabold text-[#059669]"
        >
          Tap to continue
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
