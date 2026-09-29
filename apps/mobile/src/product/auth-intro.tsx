import { useRef, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Glyph, useBack } from "./ui";
const slides = [
  { title: "YOUR PERSONAL HEALTH COMPANION", description: "Access Doctors, Clinics, Pathlabs, And Emergency Services—All In One Place. Experience Seamless Healthcare At Your Fingertips.", image: require("../../assets/auth/onboarding-1.png"), curve: require("../../assets/auth/curve-0.png") },
  { title: "CONNECT WITH EXPERTS", description: "Book Online Consultations With Top Doctors. Get Professional Advice, Prescriptions, And Follow-Ups—All Without Stepping Out.", image: require("../../assets/auth/onboarding-2.jpg"), curve: require("../../assets/auth/curve-1.png") },
  { title: "MEET VIRUJ AI, YOUR SMART HEALTH ASSISTANT", description: "Describe Your Symptoms, Get Quick Health Insights, And Personalized Recommendations. Viruj AI Is Here To Guide You.", image: require("../../assets/auth/onboarding-3.jpg"), curve: require("../../assets/auth/curve-2.png") },
];
export function AuthIntro({ complete }: { complete(): void }) {
  const [welcome, setWelcome] = useState(true);
  const [index, setIndex] = useState(0);
  const touchX = useRef(0);
  const { height } = useWindowDimensions();
  useBack(!welcome, () => index ? setIndex(index - 1) : setWelcome(true));
  const next = () => index === 2 ? complete() : setIndex(index + 1);
  const gradient = "linear-gradient(135deg, #FEF2F2, #FEE2E2)";
  const background: ViewStyle = Platform.OS === "web" ? { backgroundImage: gradient } as ViewStyle : { experimental_backgroundImage: gradient };
  if (welcome) return <SafeAreaView style={[styles.screen, { backgroundColor: "#FEF2F2" }, background]}><Pressable accessibilityRole="button" accessibilityLabel="Tap to continue" onPress={() => setWelcome(false)} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Image source={require("../../assets/auth/virujlogo.png")} style={{ width: 192, height: 192 }} resizeMode="contain" /><Text style={[styles.text, { fontSize: 30, letterSpacing: 3 }]}>VIRUJ HEALTH</Text><Text style={[styles.text, { fontSize: 14, marginTop: 4 }]}>Your personal health companion</Text><Text style={[styles.text, { fontSize: 14, marginTop: 20, opacity: 0.5 }]}>Tap to continue</Text></Pressable></SafeAreaView>;
  const slide = slides[index];
  return <SafeAreaView style={styles.screen}><View style={{ flex: 1, width: "100%", maxWidth: 448, alignSelf: "center" }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} onTouchStart={event => { touchX.current = event.nativeEvent.pageX; }} onTouchEnd={event => { const distance = event.nativeEvent.pageX - touchX.current; if (distance < -50) next(); else if (distance > 50 && index) setIndex(index - 1); }}>
      <View style={{ height: Math.max(280, (height - 130) * 0.65), backgroundColor: "#F0F0F0", overflow: "hidden" }}><Image source={slide.image} style={{ position: "absolute", width: "100%", height: "100%" }} resizeMode="cover" /><Image source={slide.curve} style={{ width: "100%", height: "100%" }} resizeMode="stretch" /></View>
      <View style={{ paddingHorizontal: 40, paddingTop: 24, alignItems: "center" }}><Text style={[styles.text, { fontSize: 28, lineHeight: 34, letterSpacing: -1, marginBottom: 16 }]}>{slide.title}</Text><Text style={[styles.text, { fontSize: 14, lineHeight: 23 }]}>{slide.description}</Text><View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>{slides.map((_, i) => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Slide ${i + 1}`} accessibilityState={{ selected: i === index }} onPress={() => setIndex(i)} style={{ width: 32, height: 44, alignItems: "center", justifyContent: "center" }}><View style={{ width: i === index ? 12 : 8, height: i === index ? 12 : 8, borderRadius: 6, backgroundColor: i === index ? "#E53935" : "#D1D5DB" }} /></Pressable>)}</View></View>
    </ScrollView>
    <Pressable accessibilityRole="button" onPress={complete} style={{ position: "absolute", top: 16, right: 24, minHeight: 44, justifyContent: "center" }}><Text style={[styles.text, { fontSize: 12, letterSpacing: 2, color: "#9CA3AF" }]}>SKIP</Text></Pressable>
    {index > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Previous slide" onPress={() => setIndex(index - 1)} style={{ position: "absolute", top: 16, left: 24, padding: 10 }}><Glyph name="arrow-back" color="#9CA3AF" /></Pressable>}
    <View style={{ paddingHorizontal: 40, paddingBottom: 32, paddingTop: 12 }}><Pressable accessibilityRole="button" onPress={next} style={{ backgroundColor: "#7F1D1D", borderRadius: 16, paddingVertical: 20, alignItems: "center" }}><Text style={[styles.text, { color: "white", fontSize: 14, letterSpacing: 2.8 }]}>{index === 2 ? "GET STARTED" : "CONTINUE"}</Text></Pressable></View>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "white" }, text: { fontFamily: "Merienda", textAlign: "center", color: "#6B7280" } });
