import { useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { type CareItem } from "./api";
import { type Navigate } from "./home";
import { Body, Button, Card, colors, Empty, ErrorText, Field, Heading, ResourceState, Screen, s, useResource } from "./ui";
export function Care({ kind, department, navigate, back }: { kind: string; department?: string; navigate: Navigate; back(): void }) {
  const [search, setSearch] = useState(""); const [query, setQuery] = useState(""); const [page, setPage] = useState(1);
  const path = department ? `/departments/${department.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}/doctors` : `/${kind}?page=${page}&limit=12&search=${encodeURIComponent(query)}`;
  const result = useResource<{ data: CareItem[]; pagination?: { totalPages: number } }>(path);
  const items = (result.data?.data || []).filter(item => (!department && kind !== "pathlabs") || `${item.name} ${item.specialty} ${item.city} ${item.area}`.toLowerCase().includes(query.toLowerCase()));
  return <Screen title={department || (kind === "pathlabs" ? "Labs" : kind === "hospitals" ? "Hospitals" : "Doctors")} back={back}>
    <Field label="Search" value={search} onChangeText={setSearch} placeholder="Name, specialty or place" returnKeyType="search" onSubmitEditing={() => { setPage(1); setQuery(search.trim()); }} /><Button title="Search" secondary onPress={() => { setPage(1); setQuery(search.trim()); }} /><ResourceState {...result} />
    {!result.loading && !result.error && items.length === 0 && <Empty title="No results" detail="Try a different search." />}
    {items.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`View ${item.name}`} onPress={() => navigate({ name: "detail", id: String(item.id), kind })}><Card><View style={{ flexDirection: "row", gap: 15 }}>{(item.imageUrl || item.image_url) && <Image source={{ uri: item.imageUrl || item.image_url }} style={{ width: 68, height: 76, borderRadius: 15 }} />}<View style={{ flex: 1, gap: 5 }}><Heading>{item.name}</Heading><Body>{item.specialty || item.city || item.area}</Body><Body>{item.hospital_name || item.address}</Body></View></View>{(item.consultation_fees != null || item.startingPrice != null) && <Text style={{ color: colors.deep, fontWeight: "600" }}>₹{item.consultation_fees ?? item.startingPrice}</Text>}</Card></Pressable>)}
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>{page > 1 && <Button title="Previous" secondary onPress={() => setPage(p => p - 1)} />}{(result.data?.pagination?.totalPages || 1) > page && <Button title="Next page" secondary onPress={() => setPage(p => p + 1)} />}</View>
  </Screen>;
}
export function CareDetail({ kind, id, navigate, back }: { kind: string; id: string; navigate: Navigate; back(): void }) {
  const result = useResource<{ data: CareItem }>(`/${kind}/${encodeURIComponent(id)}`);
  const [error, setError] = useState("");
  const item = result.data?.data;
  return <Screen title="Details" back={back}><ResourceState {...result} />{item && <>{(item.imageUrl || item.image_url) && <Image source={{ uri: item.imageUrl || item.image_url }} style={{ width: "100%", height: 220, borderRadius: 24 }} />}<Heading>{item.name}</Heading><Body>{item.specialty || item.city || item.area}</Body><Card>{[item.qualifications, item.experience, item.hospitalName, item.address, item.description].filter(Boolean).map((text, index) => <Body key={index}>{text}</Body>)}{item.consultationFees != null && <Text style={s.rowTitle}>Consultation ₹{item.consultationFees}</Text>}{item.availability && <Body>{item.availability}</Body>}</Card><ErrorText message={error} />{kind === "doctors" && <Button title="Request appointment" onPress={() => navigate({ name: "booking", id })} />}{item.phone && <Button title="Call" secondary onPress={() => void Linking.openURL(`tel:${item.phone!.replace(/[^+\d]/g, "")}`).catch(() => setError("Could not open the phone app."))} />}{kind === "hospitals" && <Button title="View doctors" secondary onPress={() => navigate({ name: "hospital-doctors", id })} />}</>}</Screen>;
}
