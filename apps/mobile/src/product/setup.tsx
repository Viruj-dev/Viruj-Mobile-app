import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "./api";
import { Choices } from "./care";
import { useSession } from "./session";
import { Body, Button, Card, ErrorText, Field, Glyph, Heading } from "./ui";
import { SelectField } from "./web-controls";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function Setup({ back }: { back(): void }) {
  const { session, restore } = useSession();
  const [values, setValues] = useState<Record<string, string>>({});
  const [heightUnit, setHeightUnit] = useState("CM");
  const [weightUnit, setWeightUnit] = useState("KG");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const update = (key: string, value: string) => setValues(current => ({ ...current, [key]: value }));
  const field = (key: string, label: string, options: { numeric?: boolean; multiline?: boolean } = {}) => <Field key={key} label={label} value={values[key] || ""} onChangeText={value => update(key, value)} keyboardType={options.numeric ? "numeric" : "default"} multiline={options.multiline} style={{ borderRadius: 10 }} />;

  async function finish(skip: boolean) {
    if (busy || !session) return;
    const age = Number(values.age);
    const height = heightUnit === "CM" ? Number(values.height) : Number(values.feet) * 12 + Number(values.inches || 0);
    const weight = Number(values.weight);
    if (!skip && (!Number.isInteger(age) || age < 1 || age > 120 || !values.gender || !values.bloodGroup || (values.phoneNumber || "").replace(/\D/g, "").length < 10 || !values.address?.trim() || values.address.trim().length < 5 || !Number.isFinite(height) || height <= 0 || !Number.isFinite(weight) || weight <= 0)) {
      setNotice("Enter your age, gender, phone, address, height, weight, and blood group.");
      return;
    }
    setBusy(true); setNotice("");
    try {
      await api.request(`/users/${session.user.id}`, { method: "PATCH", body: skip ? { name: session.user.name, onboardingCompleted: true } : {
        name: session.user.name,
        age,
        gender: values.gender.toLowerCase(),
        phoneNumber: values.phoneNumber.trim(),
        address: values.address.trim(),
        height: heightUnit === "CM" ? `${values.height} cm` : `${values.feet}'${values.inches || "0"}\"`,
        weight: `${values.weight} ${weightUnit.toLowerCase()}`,
        bloodGroup: values.bloodGroup,
        medicalHistory: values.medicalHistory?.trim() || null,
        recentAppointments: values.recentAppointments?.trim() || null,
        onboardingCompleted: true,
      } });
      await restore();
      back();
    } catch (cause) { setNotice(cause instanceof Error ? cause.message : "Could not save your profile."); }
    finally { setBusy(false); }
  }

  return <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7F7" }}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}><Card style={{ padding: 24, borderRadius: 28, gap: 20, maxWidth: 700, width: "100%", alignSelf: "center" }}>
    <Button title="Skip for now" secondary busy={busy} onPress={() => void finish(true)} style={{ alignSelf: "flex-end", backgroundColor: "transparent" }} />
    <View style={{ alignItems: "center", gap: 10 }}><View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" }}><Glyph name="shield-checkmark-outline" size={32} color="#B91C1C" /></View><Heading style={{ fontSize: 28, textAlign: "center" }}>Complete Your Health Profile</Heading><Body style={{ textAlign: "center" }}>Welcome {session?.user.name || "to Viruj"}! Add your basic health information to get started.</Body><Body style={{ textAlign: "center", fontSize: 13 }}>You can skip this step and update your profile later.</Body></View>
    <Heading style={{ fontSize: 19 }}>Personal Information</Heading>
    {field("age", "Age *", { numeric: true })}
    <View style={{ gap: 8 }}><Text style={{ color: "#374151", fontWeight: "600" }}>Gender *</Text><Choices options={["Male", "Female", "Other"]} value={values.gender || ""} onChange={value => update("gender", value)} /></View>
    <Field label="Phone Number *" placeholder="+91 XXXXX XXXXX" value={values.phoneNumber || ""} onChangeText={value => update("phoneNumber", value)} keyboardType="phone-pad" style={{ borderRadius: 10 }} />
    <Body style={{ fontSize: 12 }}>You can verify this number later to book appointments.</Body>
    {field("address", "Address *", { multiline: true })}
    <Heading style={{ fontSize: 19 }}>Health Information</Heading>
    <View style={{ gap: 8 }}><Text style={{ color: "#374151", fontWeight: "600" }}>Height *</Text><Choices options={["CM", "FT/IN"]} value={heightUnit} onChange={setHeightUnit} /></View>
    {heightUnit === "CM" ? field("height", "Height (cm) *", { numeric: true }) : <View style={{ flexDirection: "row", gap: 12 }}><View style={{ flex: 1 }}>{field("feet", "Feet *", { numeric: true })}</View><View style={{ flex: 1 }}>{field("inches", "Inches", { numeric: true })}</View></View>}
    <View style={{ gap: 8 }}><Text style={{ color: "#374151", fontWeight: "600" }}>Weight *</Text><Choices options={["KG", "LBS"]} value={weightUnit} onChange={setWeightUnit} /></View>
    {field("weight", `Weight (${weightUnit.toLowerCase()}) *`, { numeric: true })}
    <SelectField label="Blood Group *" options={bloodGroups} value={values.bloodGroup || ""} onChange={value => update("bloodGroup", value)} />
    {field("medicalHistory", "Medical History (Optional)", { multiline: true })}
    {field("recentAppointments", "Recent Appointments (Optional)", { multiline: true })}
    <Card style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE", borderRadius: 12, gap: 6 }}><Heading style={{ color: "#1E40AF", fontSize: 16 }}>Confidential & Secure</Heading><Body>Your health profile helps our medical team provide personalized care.</Body></Card>
    <ErrorText message={notice} />
    <Button title="Complete Setup & Continue" busy={busy} onPress={() => void finish(false)} style={{ backgroundColor: "#DC2626", borderRadius: 14, minHeight: 56 }} />
  </Card></ScrollView></SafeAreaView>;
}
