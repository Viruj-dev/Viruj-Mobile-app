import { useEffect, useRef, useState } from "react";
import { Image, Linking, Platform, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from "expo-audio";
import { File } from "expo-file-system";
import { VideoView, useVideoPlayer } from "expo-video";
import { api } from "./api";
import { Body, Button, ErrorText } from "./ui";

export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], base64: true, quality: 0.7, allowsEditing: true });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset?.base64 || asset.base64.length > 6_800_000) throw new Error("Choose an image under 5 MB.");
  return { uri: asset.uri, base64: asset.base64, dataUrl: `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}` };
}
export function VoiceInput({ onText, disabled, onRecording }: { onText(value: string): void; disabled?: boolean; onRecording?(): void }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [denied, setDenied] = useState(false);
  const [recording, setRecording] = useState(false);
  const recordingRef = useRef(false);
  const stopAtLimit = useRef<() => void>(() => {});
  useEffect(() => () => { if (recordingRef.current) void recorder.stop().catch(() => {}); void setAudioModeAsync({ allowsRecording: false }).catch(() => {}); }, [recorder]);
  useEffect(() => { if (!recording) return; const timer = setTimeout(() => stopAtLimit.current(), 60_000); return () => clearTimeout(timer); }, [recording]);
  async function toggle() {
    if (busy) return; setBusy(true); setError("");
    try {
      if (!recordingRef.current) {
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) { setDenied(true); setError("Microphone access is off. You can type instead."); return; }
        setDenied(false); onRecording?.(); await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        await recorder.prepareToRecordAsync(); recorder.record(); recordingRef.current = true; setRecording(true);
      } else {
        await recorder.stop(); recordingRef.current = false; setRecording(false); await setAudioModeAsync({ allowsRecording: false });
        const uri = recorder.uri; if (!uri) throw new Error("No recording found.");
        const form = new FormData();
        if (Platform.OS === "web") form.append("file", await (await fetch(uri)).blob(), "recording.webm");
        else form.append("file", { uri, name: "recording.m4a", type: "audio/mp4" } as unknown as Blob);
        try { const result = await api.request<{ text: string }>("/ai/transcribe", { method: "POST", body: form }); if (!result.text.trim()) throw new Error("I couldn’t hear any words. Please try again."); onText(result.text); }
        finally { if (Platform.OS !== "web") { const file = new File(uri); if (file.exists) file.delete(); } }
      }
    } catch (e) { recordingRef.current = false; setRecording(false); setError(e instanceof Error ? e.message : "Could not record."); } finally { setBusy(false); }
  }
  stopAtLimit.current = () => { void toggle(); };
  return <View style={{ gap: 6 }}><Button title={recording ? "Finish speaking" : "Tap to talk"} icon={recording ? "stop" : "mic-outline"} busy={busy} disabled={disabled} onPress={() => void toggle()} /><Body style={{ fontSize: 11, textAlign: "center" }}>Your recording is sent for transcription when you finish.</Body><ErrorText message={error} />{denied && <Button title="Open settings" secondary onPress={() => void Linking.openSettings()} />}</View>;
}

export type SelectedMedia = { uri: string; type: "image" | "video" };
export async function pickMedia(camera = false, maxMB = 10): Promise<SelectedMedia | null> { if (camera) { const permission = await ImagePicker.requestCameraPermissionsAsync(); if (!permission.granted) throw new Error("Camera access is required to take a photo."); } const options: ImagePicker.ImagePickerOptions = { mediaTypes: ["images", "videos"], quality: 0.7 }; const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options); if (result.canceled) return null; const asset = result.assets[0]; if (!asset || (asset.fileSize || 0) > maxMB * 1024 * 1024) throw new Error(`Choose media under ${maxMB} MB.`); return { uri: asset.uri, type: asset.type === "video" ? "video" : "image" }; }
export function MediaPreview({ media }: { media: SelectedMedia }) { return media.type === "video" ? <VideoPreview uri={media.uri} /> : <Image source={{ uri: media.uri }} style={{ width: "100%", height: 300, borderRadius: 12 }} resizeMode="contain" />; }
function VideoPreview({ uri }: { uri: string }) { const player = useVideoPlayer(uri); return <VideoView player={player} nativeControls style={{ width: "100%", height: 300, borderRadius: 12 }} contentFit="contain" />; }
