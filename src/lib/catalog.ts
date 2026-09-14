export type Occasion =
  | "birthday"
  | "love"
  | "anniversary"
  | "love-letter"
  | "apology"
  | "friendship"
  | "wedding"
  | "celebration"
  | "thank-you"
  | "custom";

export type TemplateStyle = "elegant" | "playful" | "minimal" | "cinematic" | "retro";

export interface Template {
  slug: string;
  name: string;
  occasion: Occasion;
  description: string;
  style: TemplateStyle;
  premium: boolean;
  hue: string;
  blocks: string[];
}

export const categories: {
  id: Occasion;
  emoji: string;
  title: string;
  description: string;
}[] = [
  { id: "love", emoji: "❤️", title: "Love", description: "Say it in a way they will re-open." },
  { id: "birthday", emoji: "🎂", title: "Birthday", description: "Confetti, photos and a wish." },
  {
    id: "anniversary",
    emoji: "💍",
    title: "Anniversary",
    description: "A timeline of your years.",
  },
  { id: "love-letter", emoji: "💌", title: "Love Letter", description: "Slow, handwritten warmth." },
  { id: "apology", emoji: "🥹", title: "Apology", description: "Soft words, honest tone." },
  { id: "friendship", emoji: "👫", title: "Friendship", description: "Inside jokes, made pretty." },
  { id: "wedding", emoji: "💐", title: "Wedding", description: "Elegant wishes for the day." },
  { id: "celebration", emoji: "🎉", title: "Celebration", description: "Any win worth marking." },
  { id: "thank-you", emoji: "🙏", title: "Thank You", description: "Gratitude that lands." },
  { id: "custom", emoji: "✨", title: "Custom", description: "Start from a blank canvas." },
];

export const occasionLabel = (id: Occasion) =>
  categories.find((c) => c.id === id)?.title ?? "Custom";

const hues = [
  "linear-gradient(140deg, oklch(0.40 0.13 8) 0%, oklch(0.66 0.10 5) 100%)",
  "linear-gradient(140deg, oklch(0.30 0.05 20) 0%, oklch(0.62 0.11 60) 100%)",
  "linear-gradient(140deg, oklch(0.45 0.10 340) 0%, oklch(0.80 0.06 20) 100%)",
  "linear-gradient(140deg, oklch(0.35 0.08 260) 0%, oklch(0.68 0.09 5) 100%)",
  "linear-gradient(140deg, oklch(0.42 0.09 150) 0%, oklch(0.78 0.07 80) 100%)",
  "linear-gradient(140deg, oklch(0.24 0.02 20) 0%, oklch(0.55 0.12 15) 100%)",
];

const baseBlocks = ["Welcome screen", "Personal message", "Photo gallery", "Final message"];

function make(
  occasion: Occasion,
  names: string[],
  style: TemplateStyle,
  extraBlocks: string[],
  premiumFrom = 3,
): Template[] {
  return names.map((name, i) => ({
    slug: `${occasion}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    occasion,
    style,
    premium: i >= premiumFrom,
    hue: hues[(i + occasion.length) % hues.length]!,
    description: `${name} — a ${style} ${occasionLabel(occasion).toLowerCase()} experience with photos, music and interactive moments.`,
    blocks: [...baseBlocks, ...extraBlocks],
  }));
}

export const templates: Template[] = [
  ...make(
    "birthday",
    [
      "Golden Hour",
      "Confetti Rush",
      "Candlelight",
      "Polaroid Party",
      "Midnight Wish",
      "Balloon Drop",
      "Sweet Sixteen",
      "Retro Cassette",
      "Cake & Sparks",
      "Surprise Box",
    ],
    "playful",
    ["Countdown", "Confetti", "Gift reveal"],
  ),
  ...make(
    "love",
    [
      "Slow Burn",
      "Only You",
      "Moonlight",
      "Paper Hearts",
      "Every Little Thing",
      "Scratch & Reveal",
      "Ink and Rain",
      "Two Cities",
      "Night Drive",
      "Forever Draft",
    ],
    "cinematic",
    ["Scratch card", "Love letter", "Music"],
  ),
  ...make(
    "anniversary",
    [
      "Our Timeline",
      "Chapter Two",
      "Same Stars",
      "Vintage Film",
      "Gold Thread",
      "The Long Way",
      "Handwritten Years",
      "Still Us",
    ],
    "elegant",
    ["Memory timeline", "Video", "Countdown"],
  ),
  ...make(
    "friendship",
    ["Best Chaos", "Inside Joke", "Roadtrip Reel", "Day Ones", "Group Chat"],
    "playful",
    ["Quiz", "Photo gallery", "Confetti"],
  ),
  ...make(
    "apology",
    ["Soft Words", "Paper Crane", "Second Chance", "Quiet Sorry", "Peace Offering"],
    "minimal",
    ["Personal message", "Music"],
    2,
  ),
  ...make(
    "wedding",
    ["Ivory Vows", "Garden Light", "Two Families", "Champagne", "First Dance"],
    "elegant",
    ["Video", "Memory timeline", "Countdown"],
    2,
  ),
];

export const styles: TemplateStyle[] = ["elegant", "playful", "minimal", "cinematic", "retro"];

export function templateBySlug(slug: string) {
  return templates.find((t) => t.slug === slug);
}
