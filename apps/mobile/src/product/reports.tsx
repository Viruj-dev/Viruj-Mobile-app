import { useState } from "react";
import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { File } from "expo-file-system";
import { Body, Button, Card, Empty, ErrorText, Heading, ResourceState, Screen, useResource, useBack } from "./ui";
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
