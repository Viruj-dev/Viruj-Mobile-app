import { useState } from "react";
import { api, type InboxItem } from "./api";
import { Body, Button, Card, Empty, ErrorText, Heading, ResourceState, Screen, useResource } from "./ui";
export function Inbox({ back }: { back(): void }) {
  const inbox = useResource<{ data: InboxItem[] }>("/notifications"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function update(body: unknown, method = "PATCH") { if (busy) return; setBusy(true); setError(""); try { await api.request("/notifications", { method, body }); inbox.reload(); } catch (e) { setError(e instanceof Error ? e.message : "Could not update."); } finally { setBusy(false); } }
  return <Screen title="Notifications" back={back}><ResourceState {...inbox} /><ErrorText message={error} />{inbox.data?.data.some(item => !item.isRead) && <Button title="Mark all read" secondary disabled={busy} onPress={() => void update({ all: true })} />}{inbox.data?.data.length === 0 && <Empty icon="notifications-outline" title="You’re all caught up" />}{inbox.data?.data.map(item => <Card key={item.id}><Heading>{item.title || "Update"}</Heading><Body>{item.content}</Body><Body>{new Date(item.createdAt).toLocaleDateString()}</Body>{!item.isRead && <Button title="Mark read" secondary disabled={busy} onPress={() => void update({ id: item.id })} />}<Button title="Remove" secondary disabled={busy} onPress={() => void update({ id: item.id }, "DELETE")} /></Card>)}</Screen>;
}
