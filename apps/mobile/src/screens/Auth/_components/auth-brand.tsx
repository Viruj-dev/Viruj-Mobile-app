import { Image, Text, View } from "react-native";

export function VirujWordmark({ compact = false }: { compact?: boolean }) {
  const markSize = compact ? 38 : 46;

  return (
    <View className="flex-row items-center justify-center gap-3">
      <LogoMark size={markSize} />
      <View>
        <Text className="text-[17px] font-black leading-[19px] text-[#111111]">
          VIRUJ
        </Text>
        <Text className="text-[9px] font-bold leading-[11px] text-[#5F5A55]">
          HEALTH
        </Text>
      </View>
    </View>
  );
}

export function LogoMark({ size = 46 }: { size?: number }) {
  return (
    <Image
      source={require("../../../../assets/auth/virujlogo.png")}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
