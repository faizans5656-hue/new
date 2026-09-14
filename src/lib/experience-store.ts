// ─── Experience Data Model ───────────────────────────────────────────────────
// Simple store for the interactive YES/NO surprise experiences.

import type { OccasionId } from "./occasion-config";

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
  photos: string[]; // base64 data URLs
  musicTrack: string;
  createdAt: string;
  viewCount: number;
  yesCount: number;
}

const STORAGE_KEY = "lumora_experiences";

function load(): Experience[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Experience[]) : [];
  } catch {
    return [];
  }
}

function save(list: Experience[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllExperiences(): Experience[] {
  return load().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getExperienceBySlug(slug: string): Experience | undefined {
  return load().find((e) => e.slug === slug);
}

export function createExperience(data: Omit<Experience, "id" | "slug" | "createdAt" | "viewCount" | "yesCount">): Experience {
  const id = crypto.randomUUID();
  const slug = generateSlug(data.recipientName, data.occasion);
  const now = new Date().toISOString();
  const exp: Experience = {
    ...data,
    id,
    slug,
    createdAt: now,
    viewCount: 0,
    yesCount: 0,
  };
  const all = load();
  all.push(exp);
  save(all);
  return exp;
}

export function recordView(slug: string) {
  const all = load();
  const idx = all.findIndex((e) => e.slug === slug);
  if (idx !== -1) {
    all[idx]!.viewCount++;
    save(all);
  }
}

export function recordYes(slug: string) {
  const all = load();
  const idx = all.findIndex((e) => e.slug === slug);
  if (idx !== -1) {
    all[idx]!.yesCount++;
    save(all);
  }
}

export function deleteExperience(id: string) {
  save(load().filter((e) => e.id !== id));
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

// ─── Demo seed ────────────────────────────────────────────────────────────────

export function seedDemoExperience() {
  const all = load();
  if (all.some((e) => e.slug === "sarah-love-demo00")) return;
  const now = new Date().toISOString();
  const demo: Experience = {
    id: crypto.randomUUID(),
    slug: "sarah-love-demo00",
    occasion: "love",
    recipientName: "Sarah",
    senderName: "Alex",
    question: "Will you forever be mine?",
    yesText: "Yes 💖",
    noText: "No 🙈",
    message:
      "I've been wanting to ask you this for a while. You mean the world to me and I hope this little surprise made you smile. ❤️",
    photos: [],
    musicTrack: "",
    createdAt: now,
    viewCount: 47,
    yesCount: 1,
  };
  all.push(demo);
  save(all);
}
