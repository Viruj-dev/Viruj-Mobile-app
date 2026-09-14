// ponytail: preview data lives only in memory; replace with the real services during backend integration.
import type { Appointment, CareItem, ChatSession, InboxItem, Post, Profile, Session } from "./api";

export let previewEnabled = false;
export const previewUser: Profile = { id: "ui-preview", name: "Asha Sharma", email: "asha@example.test", phoneNumber: "+919876543210", age: 30, gender: "female", bloodGroup: "O+", height: "165", weight: "60", address: "Noida", medicalHistory: "No history added", onboardingCompleted: true };
export const previewSession: Session = { user: previewUser, session: { expiresAt: "2099-01-01" } };
const initialProfile = { ...previewUser };
const doctors: CareItem[] = [
  { id: 1, name: "Dr. Meera Sethi", specialty: "Cardiac Sciences", qualifications: "MBBS, MD", experience: "12 years", consultationFees: 700, consultation_fees: 700, hospital_id: 1, hospitalName: "Demo Care Centre", hospital_name: "Demo Care Centre", city: "Noida", rating: 4.8, availability: "Mon – Sat · 9 AM – 6 PM", description: "Sample specialist profile for exploring the appointment experience." },
  { id: 2, name: "Dr. Rohan Gupta", specialty: "Orthopaedics", qualifications: "MBBS, MS", experience: "9 years", consultationFees: 600, consultation_fees: 600, hospital_id: 1, hospitalName: "Demo Care Centre", hospital_name: "Demo Care Centre", city: "Noida", rating: 4.7 },
  { id: 3, name: "Dr. Kavya Suri", specialty: "Women & Child Health", qualifications: "MBBS, DGO", experience: "10 years", consultationFees: 800, consultation_fees: 800, hospital_id: 2, hospitalName: "Demo Family Hospital", hospital_name: "Demo Family Hospital", city: "Delhi", rating: 4.9 },
];
const hospitals: CareItem[] = [{ id: 1, name: "Demo Care Centre", city: "Noida", address: "Sector 62, Noida", description: "A sample multispecialty hospital. Explore departments and choose a specialist.", rating: 4.8, availability: "Open 24 hours" }, { id: 2, name: "Demo Family Hospital", city: "Delhi", address: "New Delhi", description: "Sample family healthcare facility.", rating: 4.7 }];
const labs: CareItem[] = [{ id: 1, name: "Demo Diagnostics", city: "Noida", area: "Sector 62", address: "Sector 62, Noida", startingPrice: 299, rating: 4.8, description: "Sample lab profile for browsing tests and packages." }];
export const departmentNames = ["Surgery", "Cardiac Sciences", "Neurosciences", "Orthopaedics", "Internal Medicine", "Women & Child Health", "Oncology", "Diagnostics & Imaging", "Urology & Nephrology", "ENT", "Dermatology", "Psychiatry", "Dental Sciences", "Emergency & Critical Care"];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const today = new Date().toISOString();
let appointments: Appointment[] = [];
let posts: Post[] = [];
let notifications: InboxItem[] = [];
let sessions: ChatSession[] = [];
let comments: Record<string, { id: string; content: string; author: { name: string }; replies: unknown[] }[]> = {};
const liked = new Set<string>(); const bookmarked = new Set<string>();
export function startPreview() {
  previewEnabled = true; for (const key of Object.keys(previewUser)) delete (previewUser as Record<string, unknown>)[key]; Object.assign(previewUser, initialProfile); liked.clear(); bookmarked.clear(); comments = {}; sessions = [];
  appointments = [{ id: "preview-appointment", doctorId: 1, doctorName: doctors[0]!.name, hospitalName: hospitals[0]!.name, appointmentDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), appointmentTime: "10:30 AM", appointmentMode: "in-person", status: "pending_approval", reason: "Routine consultation" }, { id: "preview-past", doctorId: 2, doctorName: doctors[1]!.name, hospitalName: hospitals[0]!.name, appointmentDate: "2026-08-20", appointmentTime: "04:00 PM", appointmentMode: "in-person", status: "completed", reason: "Follow-up consultation" }];
  posts = [{ id: "welcome", content: "Welcome to the Viruj community. Share your experiences, connect with others, and discover health awareness updates.", type: "update", author: { id: "demo-author", name: "Viruj Community" }, createdAt: today, likeCount: 12, commentCount: 0 }, { id: "my-post", content: "Taking a little time for myself today. What helps you stay consistent with your routine?", type: "update", author: { id: previewUser.id, name: previewUser.name }, createdAt: today, likeCount: 3, commentCount: 0 }];
  notifications = [{ id: "booking", title: "Appointment request received", content: "Your sample consultation is awaiting approval. View the request in My Health.", createdAt: today, isRead: false, link: "/my-health" }, { id: "welcome", title: "Welcome to Viruj", content: "Complete your health profile to keep your details in one place.", createdAt: today, isRead: false, link: "/profile/edit" }];
}
export function stopPreview() { previewEnabled = false; }
export async function previewRequest(path: string, options: { method?: string; body?: unknown } = {}): Promise<unknown> {
  const url = new URL(path, "https://preview.invalid"); const p = url.pathname; const method = options.method || "GET";
  const body = (options.body || {}) as Record<string, any>;
  if (p === "/auth/get-session") return previewSession;
  if (p === "/auth/sign-out") return {};
  if (p.startsWith("/users/")) { if (method === "PATCH") Object.assign(previewUser, body); return { ...previewUser }; }
  if (p === "/departments" || /^\/hospitals\/[^/]+\/departments$/.test(p)) return { data: departmentNames.map(name => ({ id: slug(name), name, value: slug(name) })) };
  if (p === "/search") { const q = (url.searchParams.get("q") || "").toLowerCase(); return { results: [...doctors.map(d => ({ ...d, type: "doctor" })), ...hospitals.map(h => ({ ...h, type: "hospital" })), ...departmentNames.map(name => ({ id: slug(name), name, type: "department" }))].filter(i => i.name.toLowerCase().includes(q)) }; }
  if (/^\/hospitals\/[^/]+\/doctors$/.test(p)) return { data: doctors.filter(d => String(d.hospital_id) === p.split("/")[2]) };
  if (/^\/departments\/[^/]+\/doctors$/.test(p)) return { data: doctors.filter(d => slug(d.specialty || "") === p.split("/")[2]) };
  for (const [kind, data] of [["doctors", doctors], ["hospitals", hospitals], ["pathlabs", labs]] as const) {
    if (p === `/${kind}`) { const q = (url.searchParams.get("search") || "").toLowerCase(); return { data: data.filter(d => `${d.name} ${d.specialty || ""} ${d.city}`.toLowerCase().includes(q)), pagination: { totalPages: 1 } }; }
    if (p.startsWith(`/${kind}/`)) return { data: data.find(d => String(d.id) === p.split("/")[2]) || null };
  }
  if (p === "/appointments") { if (method === "POST" && !appointments.some(a => a.id === body.requestId)) { const doctor = doctors.find(d => d.id === body.doctorId)!; appointments.unshift({ id: body.requestId, doctorId: body.doctorId, doctorName: doctor.name, hospitalName: doctor.hospitalName!, appointmentDate: body.selectedDate, appointmentTime: body.selectedTimeSlot, appointmentMode: body.appointmentType, status: "pending_approval", reason: body.additionalComments }); } return { appointments: [...appointments] }; }
  if (p === "/notifications") { if (method === "DELETE") notifications = notifications.filter(n => n.id !== body.id); if (method === "PATCH") notifications = notifications.map(n => body.all || n.id === body.id ? { ...n, isRead: true } : n); return { data: [...notifications] }; }
  if (p === "/reports") return { data: [{ id: "sample-report", disease: "Sample conversation summary", summary: "This is a preview of an AI-generated report. No medical assessment has been performed.", symptoms: "Not assessed in preview", precautions: "Discuss health concerns with your clinician.", createdAt: today }] };
  if (p === "/community/feed") return { data: [...posts] };
  if (p === "/community/posts" && method === "POST") { posts.unshift({ id: String(Date.now()), content: body.content, type: body.type, imageUrl: body.imageUrl, author: { id: previewUser.id, name: previewUser.name, image: previewUser.image || undefined }, createdAt: new Date().toISOString(), likeCount: 0, commentCount: 0 }); return {}; }
  const match = p.match(/^\/community\/posts\/([^/]+)(.*)$/);
  if (match) {
    const id = match[1]!; const action = match[2]; const post = posts.find(p => p.id === id);
    if (action === "/comments") return { data: comments[id] || [] };
    if (method === "DELETE") { posts = posts.filter(p => p.id !== id); return {}; }
    if (method === "PUT" || method === "PATCH") { if (post) Object.assign(post, body); return {}; }
    if (action === "/bookmark") { bookmarked.has(id) ? bookmarked.delete(id) : bookmarked.add(id); return { bookmarked: bookmarked.has(id) }; }
    if (action === "/engagement" && body.action === "like") { liked.has(id) ? liked.delete(id) : liked.add(id); if (post) post.likeCount = (post.likeCount || 0) + (liked.has(id) ? 1 : -1); return { liked: liked.has(id) }; }
    if (action === "/engagement" && body.action === "comment") { (comments[id] ||= []).push({ id: String(Date.now()), content: body.content, author: previewUser, replies: [] }); if (post) post.commentCount = (post.commentCount || 0) + 1; return {}; }
    if (action === "/report") return {};
  }
  const replyMatch = p.match(/^\/community\/comments\/([^/]+)\/reply$/);
  if (replyMatch) { for (const list of Object.values(comments)) { const comment = list.find(c => c.id === replyMatch[1]); if (comment) { comment.replies.push({ id: String(Date.now()), content: body.content, author: { name: previewUser.name } }); return {}; } } throw new Error("Comment not found."); }
  if (p === "/ai/chat") return { response: "This is a UI preview response. Your message would appear here with guidance from Viruj AI once the backend is connected. No medical assessment was performed.", sessionId: body.sessionId || String(Date.now()), suggestedTitle: body.message.slice(0, 35) };
  if (p === "/ai/sessions") { if (method === "POST") { sessions = sessions.filter(s => s.id !== body.sessionId); sessions.unshift({ id: body.sessionId, title: body.title, preview: body.preview, messages: body.messages }); } if (method === "DELETE") sessions = sessions.filter(s => s.id !== url.searchParams.get("sessionId")); return { sessions: [...sessions] }; }
  if (p === "/feedback" || p === "/account-deletion") return {};
  throw new Error("This action is not connected in UI preview.");
}
