import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { File } from "expo-file-system";
import { Body, Button, Card, Empty, ErrorText, Glyph, Heading, ResourceState, Screen, useResource, useBack } from "./ui";
type Report = { id: string; disease: string; summary: string; symptoms?: string; precautions?: string; createdAt: string };
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
export function Reports({ back }: { back(): void }) {
  const reports = useResource<{ data: Report[] }>("/reports"); const [selected, setSelected] = useState<Report>(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  useBack(Boolean(selected), () => setSelected(undefined));
  async function share(report: Report) {
    if (busy) return; setBusy(true); setError("");
    const html = `<html><head><meta charset="utf-8"/><style>body{font-family:sans-serif;padding:40px;color:#2b1c1c}h1{color:#7f1d1d}p{line-height:1.6}</style></head><body><h1>Viruj Health</h1><p>AI-generated information — not a diagnosis or clinician prescription.</p><h2>${escape(report.disease)}</h2><p>${escape(report.summary)}</p><p>${escape(new Date(report.createdAt).toLocaleDateString())}</p></body></html>`;
    try {
      if (Platform.OS === "web") { await Print.printAsync({ html }); return; }
      if (!(await Sharing.isAvailableAsync())) throw new Error("Sharing is unavailable on this device.");
      const result = await Print.printToFileAsync({ html });
      try { await Sharing.shareAsync(result.uri, { mimeType: "application/pdf", dialogTitle: "Share report" }); }
      finally { const file = new File(result.uri); if (file.exists) file.delete(); }
    } catch (e) { setError(e instanceof Error ? e.message : "Could not export."); } finally { setBusy(false); }
  }
  return <Screen title={selected ? "Report details" : "AI reports"} back={selected ? () => setSelected(undefined) : back}><Body>AI-generated information. Review with a clinician.</Body><ResourceState {...reports} /><ErrorText message={error} />{reports.data?.data.length === 0 && <Empty title="No reports yet" />}{(selected ? [selected] : reports.data?.data)?.map(report => <Card key={report.id}><Heading>{report.disease}</Heading><Body>{report.summary}</Body><Body>{new Date(report.createdAt).toLocaleDateString()}</Body>{selected ? <><Heading>Symptoms discussed</Heading><Body>{report.symptoms || "Not recorded"}</Body><Heading>Precautions</Heading><Body>{report.precautions || "Review this report with your clinician."}</Body></> : <Button title="View report" secondary onPress={() => setSelected(report)} />}<Button title="Export PDF" secondary disabled={busy} onPress={() => void share(report)} /></Card>)}</Screen>;
}

export type MedicalReport = { disease: string; summary: string; symptoms: string[]; causes: string[]; treatments: string[]; precautions: string[]; prescription?: { name: string; dosage: string; frequency: string; duration: string }[] };
export function MedicalReportCard({ report }: { report: MedicalReport }) { const [busy, setBusy] = useState(false); const [error, setError] = useState(""); async function download() { if (busy) return; setBusy(true); const html = `<html><body style="font-family:sans-serif;padding:40px"><h1>${escape(report.disease)} Report</h1><p>AI-generated educational information. Not a clinician-authored prescription.</p><p>${escape(report.summary)}</p>${["symptoms", "causes", "treatments", "precautions"].map(key => `<h2>${escape(key)}</h2><ul>${(report[key as "symptoms"] || []).map(value => `<li>${escape(value)}</li>`).join("")}</ul>`).join("")}<p>Please consult a healthcare professional for medical advice.</p></body></html>`; try { if (Platform.OS === "web") await Print.printAsync({ html }); else { const file = await Print.printToFileAsync({ html }); try { await Sharing.shareAsync(file.uri, { mimeType: "application/pdf" }); } finally { new File(file.uri).delete(); } } } catch(e) { setError(e instanceof Error ? e.message : "Could not export PDF."); } finally { setBusy(false); } } return <View><Pressable accessibilityRole="button" accessibilityLabel={`Download ${report.disease} Report`} disabled={busy} onPress={() => void download()} style={{ padding: 16, borderWidth: 1, borderColor: "#E4E4E7", borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 16 }}><View style={{ padding: 12, backgroundColor: "#FEF2F2", borderRadius: 12 }}><Glyph name="document-text-outline" /></View><View style={{ flex: 1 }}><Heading style={{ fontSize: 14 }}>{report.disease} Report</Heading><Body style={{ fontSize: 12 }}>Click to download PDF report</Body></View><Glyph name="download-outline" size={20} color="#A1A1AA" /></Pressable><ErrorText message={error} /></View>; }
