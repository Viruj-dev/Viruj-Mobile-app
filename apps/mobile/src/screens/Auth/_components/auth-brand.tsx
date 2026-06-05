import { Image, Text, View } from "react-native";

export function VirujWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <View className="flex-row items-end self-start">
      <Text
        className={`font-extrabold leading-none tracking-normal text-[#001B49] ${
          compact ? "text-[32px]" : "text-[40px]"
        }`}
      >
        viruj
      </Text>
      <View
        className={`rotate-[-35deg] rounded-full bg-[#39C69A] ${
          compact
            ? "-ml-[2px] mb-[25px] h-[8px] w-[6px]"
            : "-ml-[2px] mb-[30px] h-[9px] w-[7px]"
        }`}
      />
      <View
        className={`rotate-[35deg] rounded-full bg-[#39C69A] ${
          compact
            ? "mb-[31px] ml-[1px] h-[7px] w-[5px]"
            : "mb-[38px] ml-[1px] h-[8px] w-[6px]"
        }`}
      />
    </View>
  );
}

export function LogoMark({ size = 120 }: { size?: number }) {
  return (
    <Image
      source={require("../../../../assets/auth/virujlogo.png")}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
