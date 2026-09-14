import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getExperienceBySlug, recordView, recordYes, seedDemoExperience, type Experience } from "@/lib/experience-store";
import { getOccasionConfig } from "@/lib/occasion-config";
import { MUSIC_TRACKS } from "@/lib/creation-store";
import { FloatingParticles } from "@/components/experience/FloatingParticles";


export const Route = createFileRoute("/s/$slug")({
  head: () => ({
    meta: [
      { title: "Someone made something special for you ❤️" },
      { name: "description", content: "Open your personalized interactive surprise!" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Someone made something special for you ❤️" },
      { property: "og:description", content: "Open your interactive surprise!" },
    ],
  }),
  component: RecipientPage,
});

type Phase =
  | "loading"
  | "reveal"
  | "question"
  | "celebration"
  | "photos"
  | "final"
  | "done";

function RecipientPage() {
  const { slug } = Route.useParams();
  const [experience, setExperience] = useState<Experience | null | "not-found">(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    seedDemoExperience();
    const t = setTimeout(() => {
      const exp = getExperienceBySlug(slug);
      setExperience(exp || "not-found");
      if (exp) {
        recordView(slug);
        setPhase("reveal");
      } else {
        setPhase("done"); // Break out of the loading phase so NotFoundScreen can render
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [slug]);

  const startMusic = useCallback((exp: Experience) => {
    if (!exp.musicTrack) return;
    const track = MUSIC_TRACKS.find((t) => t.id === exp.musicTrack);
    if (!track) return;
    try {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.volume = muted ? 0 : 0.28;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {}
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.28;
  }, [muted]);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const handleOpen = () => {
    if (experience && experience !== "not-found") {
      startMusic(experience);
    }
    setPhase("question");
  };

  const handleYes = () => {
    if (experience && experience !== "not-found") recordYes(slug);
    setPhase("celebration");
  };

  const handleNext = () => setPhase("final");

  if (phase === "loading") return <LoadingScreen />;

  if (!experience || experience === "not-found") {
    return <NotFoundScreen />;
  }

  const config = getOccasionConfig(experience.occasion);
  const hasMusicToggle = !!experience.musicTrack;

  return (
    <div
      className="min-h-[100dvh] overflow-hidden"
      style={{ background: config.theme.bg }}
    >
      {/* Music toggle */}
      {hasMusicToggle && phase !== "reveal" && phase !== "loading" && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="fixed top-4 right-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-md"
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      )}

      {phase === "reveal" && (
        <RevealScreen
          experience={experience}
          config={config}
          onOpen={handleOpen}
        />
      )}
      {phase === "question" && (
        <QuestionScreen
          experience={experience}
          config={config}
          onYes={handleYes}
        />
      )}
      {phase === "celebration" && (
        <CelebrationScreen experience={experience} config={config} onNext={handleNext} />
      )}
      {(phase === "final" || phase === "done") && (
        <FinalScreen experience={experience} config={config} />
      )}
    </div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-background">
      <div className="relative">
        <div className="size-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">❤️</div>
      </div>
      <div className="text-center">
        <p className="font-display text-2xl">Opening your surprise…</p>
        <p className="mt-1 text-sm text-muted-foreground">Just a moment ✨</p>
      </div>
    </div>
  );
}

// ─── Reveal Screen ─────────────────────────────────────────────────────────────

function RevealScreen({
  experience,
  config,
  onOpen,
}: {
  experience: Experience;
  config: ReturnType<typeof getOccasionConfig> | null | undefined;
  onOpen: () => void;
}) {
  if (!config) return <LoadingScreen />;
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <FloatingParticles type={config.particleType} color={config.theme.particle} count={14} />
      <div className="rise-in flex flex-col items-center gap-5">
        <div className="text-6xl">{config.emoji}</div>
        <div>
          <p className="font-display text-3xl sm:text-4xl leading-tight">
            Someone made something
            <br />
            <em className="not-italic" style={{ color: config.theme.accent }}>
              special
            </em>{" "}
            for you…
          </p>
          {experience.senderName && (
            <p className="mt-3 text-sm text-muted-foreground">
              from <span className="font-semibold">{experience.senderName}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 rounded-3xl px-10 py-4 text-lg font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: config.theme.primary, color: config.theme.primaryText }}
        >
          Open it ✨
        </button>
        <p className="text-xs text-muted-foreground opacity-70">
          Tap to see your surprise
        </p>
      </div>
    </div>
  );
}


// ─── Question Screen (the YES/NO game) ────────────────────────────────────────

function QuestionScreen({
  experience,
  config,
  onYes,
}: {
  experience: Experience;
  config: ReturnType<typeof getOccasionConfig>;
  onYes: () => void;
}) {
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [noMsg, setNoMsg] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  // Calculate YES button position relative to container
  const getYesRect = useCallback(() => {
    const container = containerRef.current;
    const yes = yesBtnRef.current;
    if (!container || !yes) return null;
    const cr = container.getBoundingClientRect();
    const yr = yes.getBoundingClientRect();
    return {
      left: yr.left - cr.left,
      top: yr.top - cr.top,
      width: yr.width,
      height: yr.height,
    };
  }, []);

  const moveNo = useCallback(() => {
    const container = containerRef.current;
    const noBtn = noButtonRef.current;
    if (!container || !noBtn || isMoving) return;

    setIsMoving(true);
    const cr = container.getBoundingClientRect();
    const noW = noBtn.offsetWidth || 100;
    const noH = noBtn.offsetHeight || 44;
    const margin = 16;
    const maxX = cr.width - noW - margin;
    const maxY = cr.height - noH - margin;

    const yesRect = getYesRect();

    // Try up to 30 times to find a non-overlapping position
    let nx = margin, ny = margin, tries = 0;
    const overlaps = (x: number, y: number) => {
      if (!yesRect) return false;
      return (
        x < yesRect.left + yesRect.width + 12 &&
        x + noW > yesRect.left - 12 &&
        y < yesRect.top + yesRect.height + 12 &&
        y + noH > yesRect.top - 12
      );
    };

    do {
      nx = margin + Math.random() * (maxX - margin);
      ny = margin + Math.random() * (maxY - margin);
      tries++;
    } while (overlaps(nx, ny) && tries < 30);

    setNoPos({ x: nx, y: ny });
    const msgs = config.noMessages;
    setNoMsg(msgs[noCount % msgs.length]!);
    setNoCount((c) => c + 1);

    setTimeout(() => setIsMoving(false), 400);
  }, [noCount, config, getYesRect, isMoving]);

  // Keyboard: prevent NO via Space/Enter if it's focused — move instead
  const handleNoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      moveNo();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-16 text-center"
    >
      <FloatingParticles type={config.particleType} color={config.theme.particle} count={12} />

      {/* Occasion emoji */}
      <div className="relative z-10 mb-3 text-5xl animate-bounce">{config.emoji}</div>

      {/* Small intro */}
      <p className="relative z-10 text-sm text-muted-foreground mb-1">
        Here's something for you, {experience.recipientName} ❤️
      </p>

      {/* Question */}
      <h1
        className="relative z-10 font-display text-2xl sm:text-3xl leading-tight max-w-[min(400px,90vw)]"
        style={{ color: "var(--color-foreground)" }}
      >
        {experience.recipientName},{" "}
        <span style={{ color: config.theme.accent }}>{experience.question}</span>
      </h1>

      {/* No message hint */}
      {noMsg && (
        <p className="relative z-10 mt-3 text-xs italic text-muted-foreground animate-in fade-in">
          "{noMsg}"
        </p>
      )}

      {/* YES button — always accessible, always centered */}
      <button
        ref={yesBtnRef}
        type="button"
        onClick={onYes}
        className="relative z-10 mt-8 h-14 min-w-[180px] rounded-3xl text-lg font-bold shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all hover:scale-105 hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)] active:scale-95"
        style={{ background: config.theme.primary, color: config.theme.primaryText }}
        aria-label={`YES: ${experience.yesText}`}
      >
        {experience.yesText}
      </button>

      {/* Hint below yes */}
      {!noMsg && (
        <p className="relative z-10 mt-2 text-xs text-muted-foreground opacity-60">
          "No" seems a bit shy 🙈
        </p>
      )}

      {/* NO button — absolutely positioned when moved, inline when not */}
      <button
        ref={noButtonRef}
        type="button"
        onClick={moveNo}
        onKeyDown={handleNoKeyDown}
        aria-label="No (but it will run away!)"
        className="z-20 rounded-2xl border border-border bg-white/90 px-5 py-3 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm select-none"
        style={
          noPos
            ? {
                position: "absolute",
                left: noPos.x,
                top: noPos.y,
                transition: "left 300ms cubic-bezier(0.34,1.56,0.64,1), top 300ms cubic-bezier(0.34,1.56,0.64,1)",
              }
            : {
                position: "relative",
                marginTop: "12px",
                transition: "none",
              }
        }
      >
        {experience.noText}
      </button>
    </div>
  );
}

// ─── Celebration Screen (Combined with Photos) ────────────────────────────────

function CelebrationScreen({
  experience,
  config,
  onNext,
}: {
  experience: Experience;
  config: ReturnType<typeof getOccasionConfig>;
  onNext: () => void;
}) {
  const [particles, setParticles] = useState<
    { x: number; y: number; color: string; rotate: number; size: number }[]
  >([]);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const colors = [config.theme.primary, config.theme.accent, "#FFD700", "#FF6B6B", "#fff"];
    setParticles(
      Array.from({ length: 50 }).map(() => ({
        x: Math.random() * 100,
        y: -20 + Math.random() * -30,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 10,
      })),
    );
  }, [config]);

  const swipeLeft = () => {
    if (current < experience.photos.length - 1) setCurrent((c) => c + 1);
  };
  const swipeRight = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-x-hidden px-4 pb-12 pt-12 text-center"
      style={{ background: config.theme.bg }}
    >
      {/* Confetti particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotate}deg)`,
              animation: `confettiFall ${1.5 + Math.random()}s ${i * 0.03}s ease-in forwards`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 rise-in flex w-full flex-col items-center gap-4">
        <div className="text-6xl animate-bounce">{config.celebrationEmoji}</div>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight px-2">
          {config.celebrationMessage.replace("[NAME]", experience.recipientName)}
        </h1>
        <p className="text-muted-foreground mb-2">{config.celebrationSubtext}</p>

        {experience.photos.length > 0 && (
          <div className="w-full max-w-sm flex flex-col items-center">
            <div
              className="relative w-full overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] bg-black/5"
              onTouchStart={(e) => setTouchStart(e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => {
                if (touchStart === null) return;
                const diff = touchStart - (e.changedTouches[0]?.clientX ?? 0);
                if (Math.abs(diff) > 40) diff > 0 ? swipeLeft() : swipeRight();
                setTouchStart(null);
              }}
            >
              <img
                src={experience.photos[current]}
                alt={`Memory ${current + 1}`}
                className="w-full object-contain max-h-[50vh]"
              />
              {/* Dot indicators */}
              {experience.photos.length > 1 && (
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                  {experience.photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all ${i === current ? "bg-white w-4 h-2" : "bg-white/50 w-2 h-2"}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {experience.photos.length > 1 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {current + 1} of {experience.photos.length} — Swipe for more
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="mt-6 h-12 rounded-2xl px-8 font-semibold transition-all hover:scale-105 hover:opacity-90 active:scale-95 shadow-lg"
          style={{ background: config.theme.primary, color: config.theme.primaryText }}
        >
          Continue ❤️
        </button>
      </div>
    </div>
  );
}



// ─── Final Message Screen ─────────────────────────────────────────────────────

function FinalScreen({
  experience,
  config,
}: {
  experience: Experience;
  config: ReturnType<typeof getOccasionConfig>;
}) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Someone made something special for you ❤️",
          url,
        });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 pb-16 pt-16 text-center"
      style={{ background: config.theme.bg }}
    >
      <FloatingParticles type={config.particleType} color={config.theme.particle} count={10} />

      <div className="relative z-10 rise-in flex flex-col items-center gap-5 max-w-sm">
        <div className="text-5xl">{config.emoji}</div>

        {/* Message card */}
        <div
          className="w-full rounded-3xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)" }}
        >
          <p className="font-display text-xl leading-relaxed text-foreground">
            {experience.message ||
              `Made this little surprise just for you, ${experience.recipientName}. I hope it made you smile. ❤️`}
          </p>
          {experience.senderName && (
            <p className="mt-5 text-sm text-muted-foreground">
              — with love, <span className="font-semibold text-foreground">{experience.senderName}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="h-12 w-full rounded-2xl font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: config.theme.primary, color: config.theme.primaryText }}
          >
            Share this 💕
          </button>
          <a
            href="/"
            className="h-12 w-full rounded-2xl border border-border bg-white/80 backdrop-blur-sm flex items-center justify-center text-sm font-medium text-foreground transition-all hover:bg-white"
          >
            Create your own surprise ❤️
          </a>
        </div>

        <p className="text-xs text-muted-foreground opacity-60">
          Made with ❤️ using{" "}
          <a href="/" className="font-semibold underline">
            Lumora
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Not Found Screen ─────────────────────────────────────────────────────────

function NotFoundScreen() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="text-5xl">💔</span>
      <h1 className="font-display text-3xl">Surprise not found</h1>
      <p className="text-muted-foreground max-w-xs">
        This link may have expired or been removed. Ask the sender for a new one.
      </p>
      <a
        href="/"
        className="h-12 rounded-full bg-primary px-8 flex items-center text-sm font-semibold text-primary-foreground"
      >
        Create your own surprise ❤️
      </a>
    </div>
  );
}
