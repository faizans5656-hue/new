// ─── Experience Data Model ───────────────────────────────────────────────────
import type { OccasionId } from "./occasion-config";
import { supabase } from "./supabase";

export interface Experience {
  id: string;
  slug: string;
  occasion: OccasionId;
  recipientName: string;
  senderName: string;
  question: string;
  yesText: string;
  noText: string;
  message: string;
  photos: string[];
  musicTrack: string;
  createdAt: string;
  viewCount: number;
  yesCount: number;
}

// ─── Supabase Database Methods ────────────────────────────────────────────────

export async function getAllExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
  return data.map(mapDbToExperience);
}

export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .single();
    
  if (error || !data) return undefined;
  return mapDbToExperience(data);
}

export async function createExperience(
  data: Omit<Experience, "id" | "slug" | "createdAt" | "viewCount" | "yesCount">
): Promise<Experience> {
  const slug = generateSlug(data.recipientName, data.occasion);
  
  // 1. Upload photos to Supabase Storage if they are base64
  const uploadedPhotos = await Promise.all(
    data.photos.map((photo) => uploadBase64Photo(photo))
  );

  // 2. Insert into Supabase database
  const { data: inserted, error } = await supabase
    .from("experiences")
    .insert({
      slug,
      occasion: data.occasion,
      recipient_name: data.recipientName,
      sender_name: data.senderName,
      question: data.question,
      yes_text: data.yesText,
      no_text: data.noText,
      message: data.message,
      photos: uploadedPhotos,
      music_track: data.musicTrack,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating experience:", error);
    throw new Error(error.message);
  }

  return mapDbToExperience(inserted);
}

export async function recordView(slug: string) {
  // We use an RPC call for atomic increment if available, but for simplicity we can just select and update
  const exp = await getExperienceBySlug(slug);
  if (exp) {
    await supabase.from("experiences").update({ view_count: exp.viewCount + 1 }).eq("slug", slug);
  }
}

export async function recordYes(slug: string) {
  const exp = await getExperienceBySlug(slug);
  if (exp) {
    await supabase.from("experiences").update({ yes_count: exp.yesCount + 1 }).eq("slug", slug);
  }
}

export async function deleteExperience(id: string) {
  await supabase.from("experiences").delete().eq("id", id);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapDbToExperience(dbRow: any): Experience {
  return {
    id: dbRow.id,
    slug: dbRow.slug,
    occasion: dbRow.occasion,
    recipientName: dbRow.recipient_name,
    senderName: dbRow.sender_name,
    question: dbRow.question,
    yesText: dbRow.yes_text,
    noText: dbRow.no_text,
    message: dbRow.message,
    photos: dbRow.photos || [],
    musicTrack: dbRow.music_track || "",
    createdAt: dbRow.created_at,
    viewCount: dbRow.view_count || 0,
    yesCount: dbRow.yes_count || 0,
  };
}

function generateSlug(name: string, occasion: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 15);
  const random = Math.random().toString(36).slice(2, 8);
  return `${cleanName}-${occasion}-${random}`;
}

async function uploadBase64Photo(base64Data: string): Promise<string> {
  // If it's already a URL (e.g. from a previous upload), return it
  if (base64Data.startsWith('http')) return base64Data;
  
  // Extract content type and base64 string
  const match = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!match) return base64Data; // Fallback
  
  const contentType = match[1];
  const b64Data = match[2];
  
  try {
    const byteCharacters = atob(b64Data || "");
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: contentType || 'image/jpeg' });
    
    const ext = contentType?.split('/')[1] || 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('lumora_photos')
      .upload(filename, blob, { contentType: contentType || 'image/jpeg' });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('lumora_photos')
      .getPublicUrl(filename);
      
    return publicUrl;
  } catch (err) {
    console.error("Error uploading photo:", err);
    return base64Data; // Fallback to keeping it base64 if upload fails
  }
}

// ─── Draft store (localStorage wizard state) ─────────────────────────────────

const DRAFT_KEY = "lumora_draft";

export interface ExperienceDraft {
  occasion?: OccasionId;
  recipientName?: string;
  senderName?: string;
  question?: string;
  yesText?: string;
  noText?: string;
  message?: string;
  photos?: string[];
  musicTrack?: string;
}

export function getDraft(): ExperienceDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDraft(patch: Partial<ExperienceDraft>) {
  const current = getDraft();
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...current, ...patch }));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export async function seedDemoExperience() {
  const existing = await getExperienceBySlug("sarah-love-demo00");
  if (existing) return;
  
  await supabase.from("experiences").insert({
    slug: "sarah-love-demo00",
    occasion: "love",
    recipient_name: "Sarah",
    sender_name: "Alex",
    question: "Will you forever be mine?",
    yes_text: "Yes 💖",
    no_text: "No 🙈",
    message: "I've been wanting to ask you this for a while. You mean the world to me and I hope this little surprise made you smile. ❤️",
    photos: [],
    music_track: "",
  });
}
