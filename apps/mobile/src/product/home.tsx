import { Pressable, Text, View } from "react-native";
import { type Appointment } from "./api";
import { useSession } from "./session";
import { Body, Card, colors, Glyph, Heading, Row, Screen, s, useResource, ResourceState } from "./ui";
export type Destination = { name: string; id?: string; kind?: string };
export type Navigate = (destination: Destination) => void;
export function Home({ navigate }: { navigate: Navigate }) {
  const { session } = useSession();
  const visits = useResource<{ appointments: Appointment[] }>("/appointments");
  const upcoming = visits.data?.appointments.find(a => !["cancelled", "completed", "rejected", "no_show"].includes(a.status));
  return <Screen title={`Hello, ${session?.user.name.split(" ")[0] || "there"}`} subtitle="VIRUJ HEALTH" right={<Pressable style={s.iconButton} accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => navigate({ name: "notifications" })}><Glyph name="notifications-outline" color={colors.ink} /></Pressable>}>
    <Pressable accessibilityRole="button" accessibilityLabel="Search doctors and hospitals" onPress={() => navigate({ name: "care", kind: "doctors" })} style={[s.input, { flexDirection: "row", alignItems: "center", gap: 12 }]}><Glyph name="search-outline" /><Body>Find your care</Body></Pressable>
    <View style={{ backgroundColor: colors.deep, borderRadius: 28, padding: 24, gap: 22 }}><View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={{ color: "#BCE9D9", fontSize: 12, letterSpacing: 1.5 }}>CARE, MADE SIMPLE</Text><Glyph name="medical-outline" color="#BCE9D9" size={32} /></View><Text style={{ color: "white", fontSize: 32, lineHeight: 38, fontWeight: "600", letterSpacing: -1 }}>Find the right\ndoctor for you.</Text><Pressable accessibilityRole="button" onPress={() => navigate({ name: "care", kind: "doctors" })} style={{ flexDirection: "row", gap: 10, alignItems: "center", minHeight: 48 }}><Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>Explore doctors</Text><Glyph name="arrow-forward" color="white" size={20} /></Pressable></View>
    <Heading>Find care</Heading><Card><Row title="Doctors" detail="Browse specialties" icon="medkit-outline" onPress={() => navigate({ name: "care", kind: "doctors" })} /><Row title="Hospitals" detail="Find a hospital" icon="business-outline" onPress={() => navigate({ name: "care", kind: "hospitals" })} /><Row title="Labs" detail="Explore diagnostic centres" icon="flask-outline" onPress={() => navigate({ name: "care", kind: "pathlabs" })} /></Card>
    <Heading>Your appointments</Heading><ResourceState {...visits} />{!visits.loading && !visits.error && <Card>{upcoming ? <><Heading>{upcoming.doctorName}</Heading><Body>{new Date(upcoming.appointmentDate).toLocaleDateString()} · {upcoming.appointmentTime}</Body><Body>{upcoming.status.replaceAll("_", " ")}</Body></> : <Body>No upcoming appointments.</Body>}<Row title="My health" icon="heart-outline" onPress={() => navigate({ name: "health" })} /></Card>}
  </Screen>;
}
