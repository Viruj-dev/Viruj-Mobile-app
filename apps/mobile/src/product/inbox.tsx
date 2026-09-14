import { useState } from "react";
import { type Navigate } from "./home";
import { Choices } from "./care";
import { api, type InboxItem } from "./api";
import { Body, Button, Card, Empty, ErrorText, Heading, ResourceState, Screen, useResource, useBack } from "./ui";
export function Inbox({ back, navigate }: { back(): void; navigate: Navigate }) {
  const inbox = useResource<{ data: InboxItem[] }>("/notifications"); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [filter, setFilter] = useState("All"); const [selected, setSelected] = useState<InboxItem>();
  useBack(Boolean(selected), () => setSelected(undefined));
  async function update(body: unknown, method = "PATCH") { if (busy) return; setBusy(true); setError(""); try { await api.request("/notifications", { method, body }); inbox.reload(); if (method === "DELETE") setSelected(undefined); } catch (e) { setError(e instanceof Error ? e.message : "Could not update."); } finally { setBusy(false); } }
  const items = (inbox.data?.data || []).filter(item => filter === "All" || !item.isRead);
  const destination = selected?.link === "/my-health" ? "health" : selected?.link === "/profile/edit" ? "edit-profile" : selected?.link === "/community" ? "community" : undefined;
  return <Screen title={selected ? "Notification" : "Notifications"} back={selected ? () => setSelected(undefined) : back}><ErrorText message={error} />{selected ? <><Card><Heading>{selected.title}</Heading><Body>{selected.content}</Body><Body>{new Date(selected.createdAt).toLocaleDateString()}</Body></Card>{destination && <Button title="View update" onPress={() => navigate({ name: destination })} />}<Button title="Remove notification" secondary disabled={busy} onPress={() => void update({ id: selected.id }, "DELETE")} /></> : <><Choices options={["All", "Unread"]} value={filter} onChange={setFilter} /><ResourceState {...inbox} />{inbox.data?.data.some(item => !item.isRead) && <Button title="Mark all read" secondary disabled={busy} onPress={() => void update({ all: true })} />}{!inbox.loading && !inbox.error && items.length === 0 && <Empty icon="notifications-outline" title="You’re all caught up" detail="Your care updates will appear here." />}{items.map(item => <Card key={item.id}><Body>{item.isRead ? "Read" : "● New"} · {new Date(item.createdAt).toLocaleDateString()}</Body><Heading>{item.title || "Update"}</Heading><Body>{item.content}</Body><Button title="Open notification" secondary onPress={() => { setSelected(item); if (!item.isRead) void update({ id: item.id }); }} /></Card>)}</>}</Screen>;
}
