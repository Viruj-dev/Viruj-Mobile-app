import { useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text as NativeText, TextInput, View, type TextProps, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type CareItem, webOrigin } from "./api";
import { SearchResults } from "./care";
import { useSession } from "./session";
import { Glyph, ResourceState, useResource } from "./ui";

export type Destination = { name: string; id?: string; kind?: string; query?: string };
export type Navigate = (destination: Destination) => void;
function Text(props: TextProps) { return <NativeText {...props} style={[{ fontFamily: "Merienda" }, props.style]} />; }
const concerns = [
  ["Surgery", "bandage", "#FEF2F2", "#FECACA", "#991B1B"],
  ["Cardiac Sciences", "heart-pulse", "#FFF1F2", "#FECDD3", "#9F1239"],
  ["Neurosciences", "brain", "#FDF2F8", "#FBCFE8", "#9D174D"],
  ["Orthopaedics", "bone", "#FEE2E2", "#FCA5A5", "#7F1D1D"],
  ["Internal Medicine", "stethoscope", "#EFF6FF", "#BFDBFE", "#1E40AF"],
  ["Women & Child Health", "human-female", "#FAF5FF", "#E9D5FF", "#6B21A8"],
  ["Oncology", "pill", "#FFF7ED", "#FED7AA", "#9A3412"],
  ["Diagnostics & Imaging", "eye-outline", "#F0FDFA", "#99F6E4", "#115E59"],
  ["Urology & Nephrology", "hand-heart-outline", "#ECFEFF", "#A5F3FC", "#155E75"],
  ["ENT", "stethoscope", "#EEF2FF", "#C7D2FE", "#3730A3"],
  ["Dermatology", "bandage", "#F5F3FF", "#DDD6FE", "#5B21B6"],
  ["Psychiatry", "head-cog-outline", "#FFFBEB", "#FDE68A", "#92400E"],
  ["Dental Sciences", "tooth-outline", "#F7FEE7", "#D9F99D", "#3F6212"],
  ["Emergency & Critical Care", "ambulance", "#FEF2F2", "#FECACA", "#991B1B"],
] as const;
const services = [
  { label: "Doctors", kind: "doctors", image: require("../../assets/web/doctor.png"), bg: "#F5F9FF", border: "#DBEAFE" },
  { label: "Hospitals", kind: "hospitals", image: require("../../assets/web/hospital.png"), bg: "#FFF8F8", border: "#FEE2E2" },
  { label: "Pathlabs", kind: "pathlabs", image: require("../../assets/web/pathlab.png"), bg: "#F3FCF7", border: "#D1FAE5" },
  { label: "Clinics", kind: "", image: require("../../assets/web/clinics.png"), bg: "#FFFAF5", border: "#FFEDD5" },
  { label: "Radiology", kind: "", image: require("../../assets/web/radiology.png"), bg: "#FCF8FF", border: "#F3E8FF" },
];
const banners = [require("../../assets/web/banner-1.png"), require("../../assets/web/banner-2.png"), require("../../assets/web/banner-3.png")];
const headerGradient = "linear-gradient(135deg, #7C1117 0%, #62090F 50%, #271513 100%)";
const gradient: ViewStyle = Platform.OS === "web" ? { backgroundImage: headerGradient } as ViewStyle : { experimental_backgroundImage: headerGradient };

export function Home({ navigate }: { navigate: Navigate }) {
  const { session } = useSession();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [banner, setBanner] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const doctors = useResource<{ data: CareItem[] }>("/doctors?limit=4");
  const hospitals = useResource<{ data: CareItem[] }>("/hospitals?limit=4");
  useEffect(() => { if (!autoplay) return; const timer = setInterval(() => setBanner(i => (i + 1) % banners.length), 4000); return () => clearInterval(timer); }, [autoplay]);
  function changeBanner(step: number) { setAutoplay(false); setBanner(i => (i + step + banners.length) % banners.length); }
  return <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: "#7C1117" }}>
    <ScrollView style={{ backgroundColor: "#F8FAFC" }} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={[h.header, gradient]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
          <View style={{ gap: 4, flex: 1 }}><Text style={h.welcome}>Welcome Back</Text><Text style={h.name}>{session?.user.name || "User"}</Text><Text style={h.overview}>Here's your health overview</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => navigate({ name: "notifications" })} style={h.bell}><Glyph name="notifications-outline" color="white" size={20} /></Pressable>
        </View>
        <View style={h.search}><Glyph name="search-outline" color="#9CA3AF" size={20} /><TextInput accessibilityLabel="Search doctors, hospitals, departments" placeholder="Search doctors, hospitals, departments..." value={search} onChangeText={setSearch} style={{ flex: 1, minWidth: 0, minHeight: 44, fontFamily: "Merienda", fontSize: 13 }} /></View>{search.trim().length >= 2 && <View style={{ backgroundColor: "white", borderRadius: 16, padding: 12 }}><SearchResults query={search.trim()} navigate={d => { setSearch(""); navigate(d); }} /></View>}
      </View>
      <View style={h.content}>
        <View style={{ gap: 16, paddingVertical: 8 }}>
          <Text style={h.pill}>Select Your Health Concern</Text>
          <View style={h.grid}>{concerns.slice(0, expanded ? concerns.length : 8).map(([name, , bg, circle], index) => <Pressable key={name} accessibilityRole="button" accessibilityLabel={name} onPress={() => navigate({ name: "care", kind: "doctors", query: name })} style={[h.concern, { backgroundColor: bg }]}><View style={[h.circle, { backgroundColor: circle }]}><View style={{ width: 40, height: 40, overflow: "hidden" }}><Image source={require("../../assets/web/concern-icons.png")} style={{ position: "absolute", width: 560, height: 40, left: -40 * index }} /></View></View><Text style={h.concernLabel}>{name}</Text></Pressable>)}</View>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded(!expanded)} style={h.more}><View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Glyph name={expanded ? "remove" : "add"} size={20} color="#374151" /><Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>{expanded ? "Fewer Departments" : "More Departments (6)"}</Text></View><Glyph name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#4B5563" /></Pressable>
        </View>
        <View style={{ gap: 8 }}><Text style={h.pill}>Discounts & Offers</Text><View style={[h.banner, { height: 140 }]}><Image source={banners[banner]} accessibilityLabel={`Hospital offer ${banner + 1}`} style={{ width: "100%", height: "100%" }} resizeMode="contain" /><Pressable accessibilityRole="button" accessibilityLabel="Previous offer" onPress={() => changeBanner(-1)} style={[h.arrow, { left: 8 }]}><Glyph name="chevron-back" color="#374151" /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Next offer" onPress={() => changeBanner(1)} style={[h.arrow, { right: 8 }]}><Glyph name="chevron-forward" color="#374151" /></Pressable></View></View>
        <View style={{ gap: 24 }}><Text style={h.pill}>HEALTHCARE SERVICES</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingHorizontal: 8, paddingBottom: 24 }}>{services.map(service => <Pressable key={service.label} accessibilityRole="button" disabled={!service.kind} onPress={() => navigate({ name: "care", kind: service.kind })} style={{ alignItems: "center", gap: 16 }}><View style={[h.service, { backgroundColor: service.bg, borderColor: service.border }]}><Image source={service.image} style={{ width: "100%", height: "100%", opacity: service.kind ? 1 : 0.5 }} resizeMode="contain" /></View>{!service.kind && <Text style={h.soon}>SOON</Text>}<Text style={{ fontSize: 14, color: service.kind ? "#1F2937" : "#9CA3AF" }}>{service.label}</Text></Pressable>)}</ScrollView></View>
        <View style={{ gap: 16 }}><SectionTitle title="Top Doctors" detail="Consult with our best specialists" onPress={() => navigate({ name: "care", kind: "doctors" })} /><ResourceState {...doctors} />{doctors.data?.data.slice(0, 4).map(item => <FeaturedCard key={item.id} item={item} kind="doctors" navigate={navigate} />)}</View>
        <View style={{ gap: 16 }}><SectionTitle title="Nearby Hospitals" detail="Quality healthcare facilities near you" onPress={() => navigate({ name: "care", kind: "hospitals" })} /><ResourceState {...hospitals} />{hospitals.data?.data.slice(0, 4).map(item => <FeaturedCard key={item.id} item={item} kind="hospitals" navigate={navigate} />)}</View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
function SectionTitle({ title, detail, onPress }: { title: string; detail: string; onPress(): void }) {
  return <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}><View style={{ flex: 1, gap: 4 }}><Text accessibilityRole="header" style={{ fontSize: 20, color: "#DC2626" }}>{title}</Text><Text style={{ fontSize: 12, color: "#6B7280" }}>{detail}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`View all ${title}`} onPress={onPress} style={{ flexDirection: "row", alignItems: "center", minHeight: 44 }}><Text style={{ fontSize: 14, fontWeight: "600", color: "#DC2626" }}>View all</Text><Glyph name="chevron-forward" size={16} color="#DC2626" /></Pressable></View>;
}
function FeaturedCard({ item, kind, navigate }: { item: CareItem; kind: string; navigate: Navigate }) {
  const [failed, setFailed] = useState(false);
  const photo = item.image_url || item.imageUrl;
  const doctor = kind === "doctors";
  return <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name}`} onPress={() => navigate({ name: "detail", kind, id: String(item.id) })} style={h.card}><View style={{ width: doctor ? 80 : 112, height: doctor ? 80 : 96, borderRadius: doctor ? 40 : 6, overflow: "hidden", backgroundColor: doctor ? "#DBEAFE" : "#FEE2E2", alignItems: "center", justifyContent: "center" }}>{photo && !failed ? <Image source={{ uri: photo.startsWith("/") ? `${webOrigin}${photo}` : photo }} onError={() => setFailed(true)} style={{ width: "100%", height: "100%" }} /> : <Glyph name={doctor ? "person-outline" : "business-outline"} size={40} color={doctor ? "#60A5FA" : "#F87171"} />}</View><View style={{ flex: 1, gap: 6 }}><Text numberOfLines={1} style={{ fontSize: doctor ? 18 : 16, fontWeight: "700", color: "#111827" }}>{item.name}</Text>{item.specialty && <Text style={{ fontSize: 14, color: "#2563EB" }}>{item.specialty}</Text>}{item.qualifications && <Text style={h.detail}>{item.qualifications}</Text>}{item.hospital_name && <Text style={h.badge}>{item.hospital_name}</Text>}{item.city && <Text style={h.detail}>{item.city}</Text>}{item.consultation_fees != null && <Text style={h.detail}>Fee: ₹{item.consultation_fees}</Text>}{item.availability && <Text style={h.detail}>{item.availability}</Text>}{item.rating != null && <Text style={{ fontSize: 12, color: "#B45309" }}>★ {item.rating}</Text>}</View></Pressable>;
}
const h = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingVertical: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, backgroundColor: "#62090F" },
  welcome: { fontSize: 30, color: "white", letterSpacing: -0.7 }, name: { fontSize: 18, fontWeight: "500", color: "#FFFFFFE6" }, overview: { fontSize: 14, color: "#FFFFFFB3" },
  bell: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#FFFFFF33", alignItems: "center", justifyContent: "center" },
  search: { minHeight: 44, borderRadius: 30, backgroundColor: "white", flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12 },
  content: { paddingHorizontal: 8, paddingVertical: 8, gap: 24 },
  pill: { alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, backgroundColor: "#FFF1F2", borderWidth: 1, borderColor: "#FECACA66", color: "#DC2626", fontSize: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 }, concern: { width: "22.5%", flexGrow: 1, borderRadius: 16, paddingHorizontal: 4, paddingVertical: 12, alignItems: "center", gap: 8, borderWidth: 1, borderColor: "#FFFFFF80", boxShadow: "0 3px 6px rgba(0,0,0,0.10)" },
  circle: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" }, concernLabel: { minHeight: 32, fontSize: 12, lineHeight: 16, fontWeight: "600", textAlign: "center", color: "#1F2937" },
  more: { minHeight: 48, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  banner: { overflow: "hidden", borderRadius: 24, backgroundColor: "#F3F4F6" }, arrow: { position: "absolute", top: "33%", width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFFDD", alignItems: "center", justifyContent: "center" },
  service: { width: 128, height: 128, padding: 24, borderRadius: 35, borderWidth: 2 }, soon: { position: "absolute", top: 0, right: -4, backgroundColor: "#111827", color: "white", fontSize: 10, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 },
  card: { padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "white", flexDirection: "row", gap: 16 }, detail: { fontSize: 12, color: "#6B7280" }, badge: { alignSelf: "flex-start", backgroundColor: "#DCFCE7", color: "#166534", fontSize: 12, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
});
