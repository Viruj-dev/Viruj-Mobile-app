import { useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView, { type WebViewMessageEvent } from "react-native-webview";
import { api } from "./api";
import { useDevicePreferences, type SavedLocation } from "./device-preferences";
import { validSavedLocation } from "./device-location";
import { Body, Button, ErrorText, Glyph, colors } from "./ui";

const tileUrl = process.env.EXPO_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const mapHtml = (latitude: number, longitude: number) => `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><style>html,body,#map{height:100%;margin:0} .leaflet-control-attribution{font-size:10px!important}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onerror="window.ReactNativeWebView.postMessage('map-error')"></script><script>if(window.L){var map=L.map('map',{zoomControl:false}).setView([${latitude},${longitude}],${latitude === 20.5937 ? 5 : 14});L.tileLayer(${JSON.stringify(tileUrl)},{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);map.on('moveend',function(){var p=map.getCenter();window.ReactNativeWebView.postMessage(JSON.stringify({latitude:p.lat,longitude:p.lng}))})}else{window.ReactNativeWebView.postMessage('map-error')}</script></body></html>`;

export function ManualLocation({ back }: { back?(): void }) {
  const { preferences, save } = useDevicePreferences();
  const map = useRef<WebView>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Omit<SavedLocation, "radiusKm">[]>([]);
  const [selected, setSelected] = useState<SavedLocation | undefined>(preferences.location);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [mapError, setMapError] = useState(false);
  const start = preferences.location ?? { latitude: 20.5937, longitude: 78.9629 };

  async function search() {
    if (query.trim().length < 3 || busy) return;
    setBusy(true); setError(""); setResults([]);
    try {
      const response = await api.request<{ data: Omit<SavedLocation, "radiusKm">[] }>(`/location/search?q=${encodeURIComponent(query.trim())}`);
      setResults(response.data.filter(place => validSavedLocation({ ...place, radiusKm: 50 })));
      if (!response.data.length) setError("No matching place found. Try an area, city or postal code.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Address search is unavailable."); }
    finally { setBusy(false); }
  }
  async function choose(place: SavedLocation) {
    if (!validSavedLocation(place)) return;
    setBusy(true); setError("");
    try { await save(current => ({ ...current, location: place })); back?.(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save location."); }
    finally { setBusy(false); }
  }
  function mapMoved(event: WebViewMessageEvent) {
    if (event.nativeEvent.data === "map-error") { setMapError(true); return; }
    try {
      const place = JSON.parse(event.nativeEvent.data) as { latitude: number; longitude: number };
      const next = { ...place, label: `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`, radiusKm: 50 };
      if (validSavedLocation(next)) setSelected(next);
    } catch { /* Ignore malformed map messages. */ }
  }
  return <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: colors.bg }}>
    <View style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 12, backgroundColor: "#62090F" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>{back && <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={back} style={{ minWidth: 44, minHeight: 44, justifyContent: "center" }}><Glyph name="arrow-back" color="white" size={24} /></Pressable>}<Text style={{ color: "white", fontFamily: "Merienda", fontSize: 19, flex: 1 }}>Choose your location</Text></View>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 16, paddingHorizontal: 14 }}><Glyph name="search" color="#697386" size={20} /><TextInput accessibilityLabel="Search area, city or postal code" placeholder="Search area, city or postal code" value={query} onChangeText={value => { setQuery(value); setResults([]); }} onSubmitEditing={() => void search()} returnKeyType="search" style={{ flex: 1, minHeight: 52, fontSize: 15, color: colors.ink, paddingHorizontal: 10 }} /><Pressable accessibilityRole="button" accessibilityLabel="Find location" disabled={busy || query.trim().length < 3} onPress={() => void search()} style={{ minHeight: 44, justifyContent: "center", opacity: query.trim().length < 3 ? 0.4 : 1 }}><Glyph name="arrow-forward" color={colors.deep} size={22} /></Pressable></View>
    </View>
    {results.length > 0 && <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 188, backgroundColor: "white" }}>{results.map(place => <Pressable key={`${place.latitude}/${place.longitude}`} accessibilityRole="button" accessibilityLabel={`Use ${place.label}`} onPress={() => void choose({ ...place, radiusKm: 50 })} style={{ minHeight: 54, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: "row", alignItems: "center", gap: 10 }}><Glyph name="location-outline" color={colors.deep} size={18} /><Body style={{ flex: 1 }} numberOfLines={2}>{place.label}</Body></Pressable>)}</ScrollView>}
    <View style={{ flex: 1, backgroundColor: "#E9ECE8" }}>
      {Platform.OS !== "web" && !mapError ? <WebView ref={map} originWhitelist={["*"]} source={{ html: mapHtml(start.latitude, start.longitude), baseUrl: "https://virujhealth.com" }} userAgent="VirujHealth/1.0 (https://virujhealth.com)" onMessage={mapMoved} onError={() => setMapError(true)} startInLoadingState renderLoading={() => <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />} style={{ flex: 1 }} /> : <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}><Body style={{ textAlign: "center" }}>Map unavailable. Search an area above to set your location.</Body></View>}
      {Platform.OS !== "web" && !mapError && <View pointerEvents="none" style={{ position: "absolute", top: "50%", left: "50%", marginLeft: -22, marginTop: -42, alignItems: "center" }}><Glyph name="location" color={colors.deep} size={44} /></View>}
    </View>
    <View style={{ padding: 20, gap: 10, backgroundColor: "white" }}><Body>{selected ? selected.label : "Move the map pin or search for your area."}</Body><Body style={{ fontSize: 12 }}>Showing care within 50 km of this location</Body><ErrorText message={error} /><Button title="Use this location" disabled={!selected || busy} busy={busy} onPress={() => selected && void choose(selected)} /></View>
  </SafeAreaView>;
}
