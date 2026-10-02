import { useState } from "react";
import { Linking, Platform, Pressable, Switch, View } from "react-native";
import * as Location from "expo-location";
import { api } from "./api";
import { Body, Button, Card, ErrorText, Field, Glyph, Heading, Screen } from "./ui";
import { useDevicePreferences, type SavedLocation } from "./device-preferences";
import { nativePushSupported, registerPhoneNotifications } from "./device-notifications";

export function DeviceSettings({ back, locationOnly = false }: { back(): void; locationOnly?: boolean }) {
  const { preferences, save } = useDevicePreferences();
  const [address, setAddress] = useState("");
  const [results, setResults] = useState<Omit<SavedLocation, "radiusKm">[]>([]);
  const [selected, setSelected] = useState(preferences.location);
  const [radius, setRadius] = useState(preferences.location?.radiusKm ?? 10);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("");
  async function run(action: () => Promise<void>) { if (busy) return; setBusy(true); setError(""); setMessage(""); try { await action(); } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); } finally { setBusy(false); } }
  async function currentLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) throw new Error("Location access is off. Search and save an area below, or enable access in phone settings.");
    if (!await Location.hasServicesEnabledAsync()) throw new Error("Turn location on temporarily to save your current position, or search an area below.");
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    let label = "Saved current location";
    try {
      const places = await Location.reverseGeocodeAsync(position.coords);
      const place = places[0];
      const name = place && [place.name, place.district, place.city, place.region].filter(Boolean).join(", ");
      if (name) label = name;
    } catch { /* Coordinates remain usable if the address lookup is offline. */ }
    setSelected({ latitude: position.coords.latitude, longitude: position.coords.longitude, label, radiusKm: radius });
  }
  async function search() {
    const result = await api.request<{ data: Omit<SavedLocation, "radiusKm">[] }>(`/location/search?q=${encodeURIComponent(address.trim())}`);
    setResults(result.data);
    if (!result.data.length) setMessage("No matching area found. Add your city or postal code and try again.");
  }
  async function notifications() {
    const status = await registerPhoneNotifications(true);
    await save({ ...preferences, notificationsAsked: true });
    setMessage(status);
  }
  return <Screen title="Location & app preferences" back={locationOnly ? undefined : back}>
    <Card style={{ backgroundColor: "#FFF7F5", borderColor: "#F5D9D3", padding: 24, borderRadius: 24 }}><Glyph name="location-outline" size={36} /><Heading style={{ fontSize: 24 }}>Your neighbourhood. Your care.</Heading><Body>Choose where to find hospitals, clinics and doctors. Save your current location once, then you can turn location off.</Body></Card>
    <Button title="Use current location" icon="locate-outline" busy={busy} onPress={() => void run(currentLocation)} />
    <Card><Heading>Or choose an area</Heading><Body>Search your locality, city or postal code. Confirm a result to save its location.</Body><Field label="Area, city or postal code" placeholder="e.g. Indirapuram, Ghaziabad" value={address} onChangeText={value => { setAddress(value); setResults([]); setMessage(""); }} maxLength={200} /><Button title="Find address" secondary disabled={address.trim().length < 3 || busy} onPress={() => void run(search)} />{results.map(result => <Pressable key={`${result.latitude}/${result.longitude}`} accessibilityRole="button" accessibilityLabel={`Choose ${result.label}`} onPress={() => setSelected({ ...result, radiusKm: radius })} style={{ padding: 14, borderRadius: 12, backgroundColor: "#F8FAFC", minHeight: 48 }}><Body>{result.label}</Body></Pressable>)}<Pressable accessibilityRole="link" accessibilityLabel="OpenStreetMap contributors" onPress={() => void Linking.openURL("https://www.openstreetmap.org/copyright").catch(() => setError("Could not open attribution."))}><Body style={{ fontSize: 11 }}>Address search © OpenStreetMap contributors</Body></Pressable></Card>
    {selected && <Card><Heading>Selected location</Heading><Field label="Saved address or location label" value={selected.label} maxLength={300} onChangeText={label => setSelected({ ...selected, label })} /><Body style={{ fontSize: 12 }}>Search within</Body><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{[5, 10, 25, 50].map(km => <Button key={km} title={`${km} km`} secondary={radius !== km} disabled={busy} onPress={() => setRadius(km)} />)}</View><Button title="Save location" busy={busy} onPress={() => void run(async () => { await save({ ...preferences, location: { ...selected, radiusKm: radius } }); setMessage("Location saved. You can now turn GPS off."); back(); })} /></Card>}
    {!locationOnly && <Card><Glyph name="notifications-outline" /><Heading>Keep important updates close</Heading><Body>Allow phone alerts for appointments and other important updates, even when Viruj is closed.</Body><Button title="Enable phone notifications" secondary disabled={busy || !nativePushSupported} onPress={() => void run(notifications)} />{!nativePushSupported && <Body>Available in the installed native app.</Body>}{Platform.OS !== "web" && <Button title="Open phone settings" secondary onPress={() => void run(() => Linking.openSettings())} />}</Card>}
    {!locationOnly && <Card><View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}><View style={{ flex: 1 }}><Heading>Touch feedback</Heading><Body>Light vibration when you touch the app.</Body></View><Switch accessibilityLabel="Touch feedback" value={preferences.haptics !== false} disabled={busy} onValueChange={value => void run(async () => { await save({ ...preferences, haptics: value }); })} /></View></Card>}
    <ErrorText message={error} />{!!message && <Body>{message}</Body>}

  </Screen>;
}
