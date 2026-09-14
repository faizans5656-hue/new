// ─── Creation Data Model ────────────────────────────────────────────────────

export type BlockType =
  | "welcome"
  | "message"
  | "photo-gallery"
  | "timeline"
  | "music"
  | "scratch-card"
  | "gift-box"
  | "countdown"
  | "quiz"
  | "confetti"
  | "final-message";

export type CreationStatus = "draft" | "published";

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  photo?: string; // base64
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // index
}

export interface Block {
  id: string;
  type: BlockType;
  position: number;
  // Shared
  title?: string;
  body?: string;
  // Photo gallery
  photos?: string[]; // base64 data URLs
  galleryStyle?: "grid" | "polaroid" | "carousel";
  // Timeline
  timeline?: TimelineItem[];
  // Music
  musicTrack?: string; // track id from MUSIC_TRACKS
  musicVolume?: number;
  // Scratch card
  scratchReveal?: string;
  // Gift box
  giftMessage?: string;
  // Countdown
  countdownDate?: string;
  countdownLabel?: string;
  // Quiz
  quizQuestions?: QuizQuestion[];
  quizEndMessage?: string;
}

export interface Creation {
  id: string;
  slug: string;
  title: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  templateSlug: string;
  status: CreationStatus;
  theme: string; // gradient CSS
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  // stats (mock)
  views: number;
  opens: number;
  completions: number;
}

// ─── Music Tracks ───────────────────────────────────────────────────────────

export interface MusicTrack {
  id: string;
  label: string;
  mood: string;
  url: string; // royalty-free URL
  emoji: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "soft-piano",
    label: "Soft Piano",
    mood: "Romantic",
    emoji: "🎹",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "acoustic",
    label: "Warm Acoustic",
    mood: "Emotional",
    emoji: "🎸",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "celebration",
    label: "Celebration",
    mood: "Birthday",
    emoji: "🎉",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    mood: "Chill",
    emoji: "🎬",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "instrumental",
    label: "Instrumental",
    mood: "Calm",
    emoji: "🎵",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];

// ─── Storage ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lumora_creations";

function load(): Creation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Creation[]) : [];
  } catch {
    return [];
  }
}

function save(creations: Creation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creations));
}

// ─── CRUD ───────────────────────────────────────────────────────────────────

export function getAllCreations(): Creation[] {
  return load().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getCreationById(id: string): Creation | undefined {
  return load().find((c) => c.id === id);
}

export function getCreationBySlug(slug: string): Creation | undefined {
  return load().find((c) => c.slug === slug);
}

export function createCreation(partial: Partial<Creation> = {}): Creation {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const creation: Creation = {
    id,
    slug: `surprise-${Math.random().toString(36).slice(2, 9)}`,
    title: "Untitled surprise",
    recipientName: "",
    senderName: "",
    occasion: "",
    templateSlug: "",
    status: "draft",
    theme: "linear-gradient(140deg, oklch(0.40 0.13 8) 0%, oklch(0.66 0.10 5) 100%)",
    blocks: defaultBlocks(),
    createdAt: now,
    updatedAt: now,
    views: 0,
    opens: 0,
    completions: 0,
    ...partial,
  };
  const all = load();
  all.push(creation);
  save(all);
  return creation;
}

export function updateCreation(id: string, patch: Partial<Creation>): Creation | undefined {
  const all = load();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const updated: Creation = {
    ...all[idx]!,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  save(all);
  return updated;
}

export function publishCreation(id: string): Creation | undefined {
  return updateCreation(id, {
    status: "published",
    publishedAt: new Date().toISOString(),
  });
}

export function deleteCreation(id: string): void {
  const all = load().filter((c) => c.id !== id);
  save(all);
}

export function duplicateCreation(id: string): Creation | undefined {
  const original = getCreationById(id);
  if (!original) return undefined;
  const now = new Date().toISOString();
  const copy: Creation = {
    ...original,
    id: crypto.randomUUID(),
    slug: `surprise-${Math.random().toString(36).slice(2, 9)}`,
    title: `${original.title} (copy)`,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
    views: 0,
    opens: 0,
    completions: 0,
  };
  const all = load();
  all.push(copy);
  save(all);
  return copy;
}

// ─── Default blocks ──────────────────────────────────────────────────────────

function makeId() {
  return crypto.randomUUID();
}

function defaultBlocks(): Block[] {
  return [
    { id: makeId(), type: "welcome", position: 0, title: "Someone made something special for you…", body: "Tap to open ❤️" },
    { id: makeId(), type: "message", position: 1, title: "A message for you", body: "" },
    { id: makeId(), type: "photo-gallery", position: 2, photos: [], galleryStyle: "grid" },
    { id: makeId(), type: "final-message", position: 3, body: "Made with ❤️" },
  ];
}

// ─── Demo data seed ──────────────────────────────────────────────────────────

export function seedDemoIfEmpty() {
  const all = load();
  if (all.some((c) => c.slug === "demo-emma-birthday")) return;

  const demoBlocks: Block[] = [
    {
      id: makeId(),
      type: "welcome",
      position: 0,
      title: "Someone made something special for you…",
      body: "Tap to open ❤️",
    },
    {
      id: makeId(),
      type: "message",
      position: 1,
      title: "Happy Birthday Emma! 🎂",
      body: "Every moment with you is a gift. Today especially — I hope your day is as bright and wonderful as you make every day feel for me. Wishing you all the joy in the world!",
    },
    {
      id: makeId(),
      type: "photo-gallery",
      position: 2,
      photos: [],
      galleryStyle: "polaroid",
    },
    {
      id: makeId(),
      type: "countdown",
      position: 3,
      countdownLabel: "Until the next adventure 🎈",
      countdownDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      id: makeId(),
      type: "scratch-card",
      position: 4,
      scratchReveal: "I LOVE YOU ❤️",
    },
    {
      id: makeId(),
      type: "final-message",
      position: 5,
      body: "You are my favourite person. Always. 🌸",
    },
  ];

  const now = new Date().toISOString();
  const demo: Creation = {
    id: crypto.randomUUID(),
    slug: "demo-emma-birthday",
    title: "Emma's Birthday Surprise",
    recipientName: "Emma",
    senderName: "Alex",
    occasion: "birthday",
    templateSlug: "birthday-golden-hour",
    status: "published",
    theme: "linear-gradient(160deg, oklch(0.40 0.13 8) 0%, oklch(0.66 0.10 5) 100%)",
    blocks: demoBlocks,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    views: 127,
    opens: 113,
    completions: 86,
  };

  all.push(demo);
  save(all);
}
