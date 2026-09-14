// ─── Occasion Configuration System ──────────────────────────────────────────
// Centralized config — adding a new occasion = adding one entry here.

export type OccasionId =
  | "love"
  | "proposal"
  | "anniversary"
  | "birthday"
  | "friendship"
  | "apology"
  | "crush"
  | "valentine"
  | "just-because"
  | "thank-you"
  | "asking-out";

export interface OccasionTheme {
  bg: string;          // Full CSS background
  card: string;        // Card background
  primary: string;     // Primary button color
  primaryText: string; // Text on primary button
  accent: string;      // Accent for italics/highlights
  particle: string;    // Particle color
  textColor?: string;  // Text color (if background is dark)
}

export interface OccasionConfig {
  id: OccasionId;
  emoji: string;
  label: string;
  tagline: string;
  theme: OccasionTheme;
  particleType: "hearts" | "stars" | "confetti" | "sparkles" | "petals";
  questions: string[];
  defaultQuestion: string;
  yesText: string;
  noText: string;
  noMessages: string[];
  celebrationMessage: string;
  celebrationSubtext: string;
  celebrationEmoji: string;
  finalMessagePlaceholder: string;
  suggestedFinalMessage: string;
}

export const OCCASION_CONFIGS: Record<OccasionId, OccasionConfig> = {
  love: {
    id: "love",
    emoji: "❤️",
    label: "Love",
    tagline: "Ask the question you've been waiting to ask.",
    theme: {
      bg: "linear-gradient(145deg, #FFE8EC 0%, #FFD6DF 50%, #FFCDD7 100%)",
      card: "rgba(255,255,255,0.85)",
      primary: "#FF2D6B",
      primaryText: "#fff",
      accent: "#FF2D6B",
      particle: "#FF2D6B",
    },
    particleType: "hearts",
    questions: [
      "Will you be my girlfriend? ❤️",
      "Will you forever be mine?",
      "Will you go on a date with me? 🥰",
      "Do you like me too? 👀",
      "Will you stay with me forever?",
      "Can I call you mine? ❤️",
      "Write your own...",
    ],
    defaultQuestion: "Will you forever be mine?",
    yesText: "Yes 💖",
    noText: "No 🙈",
    noMessages: [
      "Haha, nice try! 😜",
      "Are you sure? 👀",
      "Think again... 🥺",
      "That button is getting shy!",
      "Really? 😭",
      "You can't escape this one 😂",
      "The button keeps moving... 🏃",
      "Maybe try YES? 😇",
    ],
    celebrationMessage: "YAYYY! You said YES! 💕",
    celebrationSubtext: "Knew you would say yes 😌",
    celebrationEmoji: "💕",
    finalMessagePlaceholder: "Write something from the heart...",
    suggestedFinalMessage:
      "I've been wanting to ask you this for a while. You mean the world to me and I hope this little surprise made you smile. ❤️",
  },

  proposal: {
    id: "proposal",
    emoji: "💍",
    label: "Proposal",
    tagline: "Make the big question unforgettable.",
    theme: {
      bg: "linear-gradient(145deg, #FFF8E7 0%, #FDEFD3 50%, #FDE8C8 100%)",
      card: "rgba(255,255,255,0.9)",
      primary: "#C0392B",
      primaryText: "#fff",
      accent: "#C0392B",
      particle: "#E74C3C",
    },
    particleType: "sparkles",
    questions: [
      "Will you marry me? 💍",
      "Will you be my forever? ❤️",
      "Ready to spend forever with me?",
      "Will you say YES to forever?",
      "Will you be mine forever and always?",
      "Write your own...",
    ],
    defaultQuestion: "Will you marry me? 💍",
    yesText: "YES! 💍",
    noText: "No 😅",
    noMessages: [
      "Are you sure? This is forever! 😅",
      "The button won't let you say no! 💍",
      "Think again... I'm worth it 😏",
      "Please? 🥺💍",
      "The ring is waiting... 💍",
      "Forever is a long time, but so is no 😭",
    ],
    celebrationMessage: "SHE SAID YES! 💍🎉",
    celebrationSubtext: "We're getting married! 💕",
    celebrationEmoji: "💍",
    finalMessagePlaceholder: "Write something beautiful...",
    suggestedFinalMessage:
      "From the moment I met you, I knew. I want to spend every moment of my life with you. Will you make me the happiest person alive? 💍❤️",
  },

  anniversary: {
    id: "anniversary",
    emoji: "💑",
    label: "Anniversary",
    tagline: "Celebrate another year of us.",
    theme: {
      bg: "linear-gradient(145deg, #FFF5F5 0%, #FFE4E8 50%, #FFDDE2 100%)",
      card: "rgba(255,255,255,0.88)",
      primary: "#8B1A4A",
      primaryText: "#fff",
      accent: "#C86B85",
      particle: "#C86B85",
    },
    particleType: "petals",
    questions: [
      "Will you continue this beautiful journey with me? ❤️",
      "Ready for another year of us?",
      "Will you be mine for another year?",
      "Do you still choose me? 🥹",
      "Will you keep writing our story with me?",
      "Write your own...",
    ],
    defaultQuestion: "Do you still choose me? 🥹",
    yesText: "Always ❤️",
    noText: "Not today 😅",
    noMessages: [
      "After all this time? 🥺",
      "Come on, you know you want to! 😌",
      "We've been through so much... 💕",
      "The button is shy 🙈",
      "Try the other one 😏",
      "Another year of yes! 🥹",
    ],
    celebrationMessage: "Another chapter begins! ❤️",
    celebrationSubtext: "Here's to forever and always 🥂",
    celebrationEmoji: "💑",
    finalMessagePlaceholder: "Write something special about your journey...",
    suggestedFinalMessage:
      "Every day with you feels like the best day of my life. Here's to another year of adventures, laughs, and love. You're my favorite person. ❤️",
  },

  birthday: {
    id: "birthday",
    emoji: "🎂",
    label: "Birthday",
    tagline: "Turn their birthday into a little adventure.",
    theme: {
      bg: "linear-gradient(145deg, #1A0533 0%, #2D0A5B 50%, #3D0F7A 100%)",
      card: "rgba(255,255,255,0.12)",
      primary: "#FF4FCB",
      primaryText: "#fff",
      accent: "#FFD700",
      particle: "#FFD700",
      textColor: "#FFFFFF",
    },
    particleType: "confetti",
    questions: [
      "Are you ready for your birthday surprise? 🎂",
      "Ready to see what I made for you? 🎁",
      "Do you promise to have an amazing birthday? 🎉",
      "Are you having the best birthday ever?",
      "Write your own...",
    ],
    defaultQuestion: "Ready to see what I made for you? 🎁",
    yesText: "YES! 🎉",
    noText: "Maybe later 😅",
    noMessages: [
      "It's your birthday, come on! 🎂",
      "Don't be shy, it's a surprise! 🎁",
      "The confetti is waiting! 🎉",
      "Your cake is getting cold 🍰",
      "Fine... the button moved 😅",
      "It's literally your birthday! 🎂",
    ],
    celebrationMessage: "HAPPY BIRTHDAY! 🎉🎂",
    celebrationSubtext: "Hope this made you smile 🥳",
    celebrationEmoji: "🎊",
    finalMessagePlaceholder: "Write a birthday message...",
    suggestedFinalMessage:
      "Happy Birthday! I hope today is as amazing as you are. You deserve all the happiness in the world. Make a wish! 🎂🎉",
  },

  friendship: {
    id: "friendship",
    emoji: "👫",
    label: "Friendship",
    tagline: "Celebrate your best chaos together.",
    theme: {
      bg: "linear-gradient(145deg, #EEF2FF 0%, #E0E7FF 50%, #D5DBFF 100%)",
      card: "rgba(255,255,255,0.9)",
      primary: "#6366F1",
      primaryText: "#fff",
      accent: "#8B5CF6",
      particle: "#8B5CF6",
    },
    particleType: "stars",
    questions: [
      "Will you be my bestie forever? 🥹",
      "Are we stuck with each other forever? 😂",
      "Best friends for life?",
      "Partners in crime forever? 😏",
      "Will you be my day one always?",
      "Write your own...",
    ],
    defaultQuestion: "Will you be my bestie forever? 🥹",
    yesText: "Obviously! 😂❤️",
    noText: "Think again 😭",
    noMessages: [
      "Think again!! 😂",
      "You literally don't have a choice 😤",
      "We're already besties, just click yes 😌",
      "The button ran away 🏃‍♀️",
      "Stop trying to escape our friendship 😭",
      "I'll find you! 😂",
    ],
    celebrationMessage: "Besties forever! 🫶",
    celebrationSubtext: "You're stuck with me now 😂❤️",
    celebrationEmoji: "🫶",
    finalMessagePlaceholder: "Write something funny and sweet...",
    suggestedFinalMessage:
      "Not everyone gets a best friend as amazing as you. Thanks for being my person through all the chaos and memories. Love you to bits! 🫶",
  },

  apology: {
    id: "apology",
    emoji: "🥺",
    label: "Apology",
    tagline: "Soft words, honest heart.",
    theme: {
      bg: "linear-gradient(145deg, #F5F0FF 0%, #EDE9FE 50%, #E8E0FE 100%)",
      card: "rgba(255,255,255,0.9)",
      primary: "#7C3AED",
      primaryText: "#fff",
      accent: "#8B5CF6",
      particle: "#A78BFA",
    },
    particleType: "hearts",
    questions: [
      "Will you forgive me? 🥺",
      "Can we be okay again?",
      "Can I make it up to you?",
      "Will you let me fix this? 💜",
      "Am I forgiven? 🥹",
      "Write your own...",
    ],
    defaultQuestion: "Will you forgive me? 🥺",
    yesText: "Yes ❤️",
    noText: "Not yet 😭",
    noMessages: [
      "I know I messed up 🥺",
      "Please? I'm really sorry 💜",
      "Give me a chance... 🥹",
      "The button is as stubborn as me 😅",
      "I'll keep trying 🥺",
      "I promise I'll make it up to you 💜",
    ],
    celebrationMessage: "YAYYY! 🥹❤️",
    celebrationSubtext: "I promise I'll make it up to you 💜",
    celebrationEmoji: "🥹",
    finalMessagePlaceholder: "Write your apology from the heart...",
    suggestedFinalMessage:
      "I'm truly sorry for what happened. You matter so much to me and I never want to hurt you. Thank you for giving me another chance. 🥺💜",
  },

  crush: {
    id: "crush",
    emoji: "💘",
    label: "Crush",
    tagline: "Tell your crush how you feel.",
    theme: {
      bg: "linear-gradient(145deg, #FFF0F5 0%, #FFE4EE 50%, #FFDAE8 100%)",
      card: "rgba(255,255,255,0.88)",
      primary: "#E91E63",
      primaryText: "#fff",
      accent: "#E91E63",
      particle: "#F48FB1",
    },
    particleType: "hearts",
    questions: [
      "Do you like me too? 👀",
      "Want to hang out sometime? 😊",
      "Can I get your number? 😅",
      "Do you ever think about me? 🥺",
      "Would you go on a date with me?",
      "Write your own...",
    ],
    defaultQuestion: "Do you like me too? 👀",
    yesText: "Yes!! 🥰",
    noText: "No 😅",
    noMessages: [
      "Really? You sure? 👀",
      "I saw you smile! 😌",
      "The button is too shy too 😅",
      "Give it a chance... 🥹",
      "I won't give up! 😤",
      "The answer is obviously yes 😏",
    ],
    celebrationMessage: "EEK! YES!! 💘",
    celebrationSubtext: "I knew it! 🥰",
    celebrationEmoji: "💘",
    finalMessagePlaceholder: "Tell your crush something sweet...",
    suggestedFinalMessage:
      "I've been wanting to say this for a while. You make me smile every single day and I really like you. 💘",
  },

  valentine: {
    id: "valentine",
    emoji: "🌹",
    label: "Valentine's Day",
    tagline: "Make this Valentine's Day unforgettable.",
    theme: {
      bg: "linear-gradient(145deg, #FFE8EC 0%, #FFD0DA 50%, #FFC5D0 100%)",
      card: "rgba(255,255,255,0.88)",
      primary: "#D61F69",
      primaryText: "#fff",
      accent: "#E91E8C",
      particle: "#F472B6",
    },
    particleType: "hearts",
    questions: [
      "Will you be my Valentine? 🌹",
      "Be mine this Valentine's Day? 💝",
      "Will you spend Valentine's with me?",
      "Can I be your Valentine? 🥰",
      "Write your own...",
    ],
    defaultQuestion: "Will you be my Valentine? 🌹",
    yesText: "Yes! 💝",
    noText: "No 🙈",
    noMessages: [
      "It's Valentine's Day, come on! 💝",
      "The roses are waiting 🌹",
      "The button is as rosy as the occasion 😅",
      "Be my Valentine? 🥺",
      "Try again! 💝",
      "You make my heart flutter 🌹",
    ],
    celebrationMessage: "Happy Valentine's Day! 💝",
    celebrationSubtext: "You're my favourite 🌹",
    celebrationEmoji: "💝",
    finalMessagePlaceholder: "Write a Valentine's message...",
    suggestedFinalMessage:
      "Happy Valentine's Day! Every day with you is a gift, but today I wanted to make sure you know how much you mean to me. 🌹💝",
  },

  "just-because": {
    id: "just-because",
    emoji: "✨",
    label: "Just Because",
    tagline: "Sometimes love doesn't need a reason.",
    theme: {
      bg: "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 50%, #D1FAE5 100%)",
      card: "rgba(255,255,255,0.88)",
      primary: "#10B981",
      primaryText: "#fff",
      accent: "#059669",
      particle: "#34D399",
    },
    particleType: "stars",
    questions: [
      "Are you having a good day? ✨",
      "Do you know how special you are?",
      "Will you smile for me? 😊",
      "Are you my favorite person?",
      "Write your own...",
    ],
    defaultQuestion: "Do you know how special you are?",
    yesText: "Aww, yes! ✨",
    noText: "Maybe not 😅",
    noMessages: [
      "You absolutely are! ✨",
      "Trust me on this one! 😊",
      "The button disagrees too 😄",
      "You're SO special! ✨",
      "Yes you are! 💚",
    ],
    celebrationMessage: "That's what I thought! ✨",
    celebrationSubtext: "Never forget how amazing you are 💚",
    celebrationEmoji: "✨",
    finalMessagePlaceholder: "Write something sweet...",
    suggestedFinalMessage:
      "I made this for no particular reason other than to remind you that you're amazing and I'm lucky to have you in my life. ✨",
  },

  "thank-you": {
    id: "thank-you",
    emoji: "🙏",
    label: "Thank You",
    tagline: "Gratitude that actually lands.",
    theme: {
      bg: "linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 30%)",
      card: "rgba(255,255,255,0.9)",
      primary: "#D97706",
      primaryText: "#fff",
      accent: "#F59E0B",
      particle: "#FCD34D",
    },
    particleType: "sparkles",
    questions: [
      "Are you the most amazing person I know?",
      "Did you know I'm grateful for you? 🙏",
      "Will you accept my thanks? 🌟",
      "Do you know how much you mean to me?",
      "Write your own...",
    ],
    defaultQuestion: "Did you know I'm grateful for you? 🙏",
    yesText: "Of course! 🌟",
    noText: "Not sure 😅",
    noMessages: [
      "Well, you should! 🙏",
      "Let me remind you then! 🌟",
      "The button is grateful too 😄",
      "You really should know! ✨",
      "I mean it! 🙏",
    ],
    celebrationMessage: "Thank you SO much! 🌟",
    celebrationSubtext: "You are truly appreciated 🙏",
    celebrationEmoji: "🌟",
    finalMessagePlaceholder: "Write your thank you message...",
    suggestedFinalMessage:
      "Words don't do justice to how grateful I am for you. Thank you for everything you do and for being exactly who you are. 🙏🌟",
  },

  "asking-out": {
    id: "asking-out",
    emoji: "☕",
    label: "Asking Out",
    tagline: "Shoot your shot in the cutest way possible.",
    theme: {
      bg: "linear-gradient(145deg, #FFF7ED 0%, #FED7AA 50%, #FDBA74 30%)",
      card: "rgba(255,255,255,0.9)",
      primary: "#EA580C",
      primaryText: "#fff",
      accent: "#F97316",
      particle: "#FB923C",
    },
    particleType: "stars",
    questions: [
      "Would you go on a date with me? ☕",
      "Can I take you out sometime?",
      "Coffee date? ☕",
      "Dinner this weekend? 🍽️",
      "Will you give me a chance? 🥺",
      "Write your own...",
    ],
    defaultQuestion: "Would you go on a date with me? ☕",
    yesText: "Yes! ☕",
    noText: "No thanks 😅",
    noMessages: [
      "Are you sure? It'll be fun! ☕",
      "I promise I'm not that bad 😅",
      "The button is running away like my nerves 😂",
      "Just one date? 🥺",
      "I'll pick a great place! ☕",
      "Your loss 😏 (jk please say yes)",
    ],
    celebrationMessage: "IT'S A DATE!! ☕🎉",
    celebrationSubtext: "Can't wait! 😊",
    celebrationEmoji: "☕",
    finalMessagePlaceholder: "Tell them how excited you are...",
    suggestedFinalMessage:
      "I've been wanting to ask you this for a while. I think we'd have an amazing time together and I'd love to get to know you better. ☕",
  },
};

export const OCCASIONS_LIST = Object.values(OCCASION_CONFIGS);

export function getOccasionConfig(id: OccasionId | string): OccasionConfig {
  return OCCASION_CONFIGS[id as OccasionId] ?? OCCASION_CONFIGS["love"]!;
}
