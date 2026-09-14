import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ImageIcon, Upload, X } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { ShareModal } from "@/components/site/ShareModal";
import { FloatingParticles } from "@/components/experience/FloatingParticles";
import {
  clearDraft,
  createExperience,
  getDraft,
  saveDraft,
  type ExperienceDraft,
} from "@/lib/experience-store";
import {
  getOccasionConfig,
  OCCASIONS_LIST,
  type OccasionId,
} from "@/lib/occasion-config";
import { MUSIC_TRACKS } from "@/lib/creation-store";

type WizardStep = "occasion" | "name" | "question" | "customize" | "preview" | "share";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Surprise — Lumora" },
      { name: "description", content: "Create a cute, fun or romantic interactive surprise in minutes." },
    ],
  }),
  component: CreateWizard,
});

function CreateWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("occasion");
  const [draft, setDraft] = useState<ExperienceDraft>(getDraft);
  const [shareSlug, setShareSlug] = useState<string | null>(null);

  const updateDraft = (patch: Partial<ExperienceDraft>) => {
    const updated = { ...draft, ...patch };
    setDraft(updated);
    saveDraft(patch);
  };

  const config = draft.occasion ? getOccasionConfig(draft.occasion) : null;

  const goNext = (next: WizardStep) => setStep(next);
  const goBack = () => {
    const steps: WizardStep[] = ["occasion", "name", "question", "customize", "preview", "share"];
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]!);
    else navigate({ to: "/" });
  };

  const handlePublish = () => {
    if (!draft.occasion || !draft.recipientName || !draft.question) return;
    const cfg = getOccasionConfig(draft.occasion);
    const exp = createExperience({
      occasion: draft.occasion,
      recipientName: draft.recipientName.trim(),
      senderName: draft.senderName?.trim() ?? "",
      question: draft.question,
      yesText: draft.yesText ?? cfg.yesText,
      noText: draft.noText ?? cfg.noText,
      message: draft.message ?? cfg.suggestedFinalMessage,
      photos: draft.photos ?? [],
      musicTrack: draft.musicTrack ?? "",
    });
    clearDraft();
    setShareSlug(exp.slug);
    setStep("share");
  };

  const bgStyle = config
    ? { background: config.theme.bg }
    : { background: "linear-gradient(145deg, #FFE8EC 0%, #FFD6DF 100%)" };

  return (
    <div className="min-h-[100dvh] transition-all duration-700" style={bgStyle}>
      {/* Header */}
      <header className="safe-top flex h-14 items-center justify-between px-4">
        {step !== "occasion" ? (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2 text-sm font-medium backdrop-blur-sm"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        ) : (
          <a href="/" className="flex items-center gap-2">
            <Logo />
          </a>
        )}
        <div className="flex items-center gap-2">
          {step !== "occasion" && step !== "share" && (
            <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              {step === "name" ? "1 / 4" : step === "question" ? "2 / 4" : step === "customize" ? "3 / 4" : "4 / 4"}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pb-8">
        {step === "occasion" && (
          <OccasionStep onSelect={(occ) => { updateDraft({ occasion: occ }); goNext("name"); }} />
        )}
        {step === "name" && config && (
          <NameStep
            config={config}
            recipientName={draft.recipientName ?? ""}
            senderName={draft.senderName ?? ""}
            onUpdate={(r, s) => updateDraft({ recipientName: r, senderName: s })}
            onNext={() => goNext("question")}
          />
        )}
        {step === "question" && config && (
          <QuestionStep
            config={config}
            recipientName={draft.recipientName ?? ""}
            selected={draft.question ?? ""}
            onSelect={(q) => { updateDraft({ question: q }); goNext("customize"); }}
          />
        )}
        {step === "customize" && config && (
          <CustomizeStep
            config={config}
            draft={draft}
            onUpdate={updateDraft}
            onNext={() => goNext("preview")}
          />
        )}
        {step === "preview" && config && (
          <PreviewStep
            config={config}
            draft={draft}
            onPublish={handlePublish}
          />
        )}
        {step === "share" && shareSlug && (
          <ShareStep
            slug={shareSlug}
            recipientName={draft.recipientName}
          />
        )}
      </main>
    </div>
  );
}

// ─── Step 1: Occasion ─────────────────────────────────────────────────────────

function OccasionStep({ onSelect }: { onSelect: (id: OccasionId) => void }) {
  return (
    <div className="rise-in pt-2">
      <h1 className="font-display text-3xl text-foreground">
        What are you making{" "}
        <em className="not-italic" style={{ color: "#FF2D6B" }}>this for?</em>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a vibe and we'll create the experience for you ✨
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {OCCASIONS_LIST.map((occ) => (
          <button
            key={occ.id}
            type="button"
            onClick={() => onSelect(occ.id)}
            className="group surface-card flex flex-col items-center gap-2 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] active:scale-95"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">{occ.emoji}</span>
            <span className="font-semibold text-sm text-foreground">{occ.label}</span>
            <span className="text-xs text-muted-foreground leading-tight">{occ.tagline}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Name ─────────────────────────────────────────────────────────────

function NameStep({
  config,
  recipientName,
  senderName,
  onUpdate,
  onNext,
}: {
  config: ReturnType<typeof getOccasionConfig>;
  recipientName: string;
  senderName: string;
  onUpdate: (r: string, s: string) => void;
  onNext: () => void;
}) {
  const [r, setR] = useState(recipientName);
  const [s, setS] = useState(senderName);

  return (
    <div className="rise-in mx-auto max-w-sm pt-8">
      <div className="surface-card p-7">
        <h1 className="text-center font-display text-2xl text-foreground">
          Who is this{" "}
          <em className="not-italic" style={{ color: config.theme.accent }}>
            little surprise
          </em>{" "}
          for? ❤️
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter the name of the person you're making this for.
        </p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Their name *
            </span>
            <input
              autoFocus
              value={r}
              onChange={(e) => setR(e.target.value)}
              placeholder="Enter their name"
              maxLength={30}
              className="mt-2 h-13 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none focus-visible:border-primary"
              style={{ borderColor: r ? config.theme.primary : undefined }}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your name (optional)
            </span>
            <input
              value={s}
              onChange={(e) => setS(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              className="mt-2 h-13 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none focus-visible:border-primary"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={!r.trim()}
          onClick={() => { onUpdate(r.trim(), s.trim()); onNext(); }}
          className="mt-6 h-13 w-full rounded-2xl text-base font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
          style={{ background: config.theme.primary, color: config.theme.primaryText }}
        >
          Continue ✨
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Question ─────────────────────────────────────────────────────────

function QuestionStep({
  config,
  recipientName,
  selected,
  onSelect,
}: {
  config: ReturnType<typeof getOccasionConfig>;
  recipientName: string;
  selected: string;
  onSelect: (q: string) => void;
}) {
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [localSelected, setLocalSelected] = useState(selected);

  const predefined = config.questions.filter((q) => q !== "Write your own...");

  return (
    <div className="rise-in mx-auto max-w-sm pt-8">
      <div className="surface-card p-6">
        <h1 className="text-center font-display text-2xl text-foreground">
          Pick a{" "}
          <em className="not-italic" style={{ color: config.theme.accent }}>
            question
          </em>
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          What do you want to ask {recipientName || "them"}? 👀
        </p>
        <div className="mt-5 space-y-2">
          {predefined.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => { setLocalSelected(q); setShowCustom(false); }}
              className="w-full rounded-xl border p-3.5 text-left text-sm font-medium transition-all"
              style={
                localSelected === q && !showCustom
                  ? { borderColor: config.theme.primary, backgroundColor: `${config.theme.primary}15`, color: config.theme.primary }
                  : { borderColor: "var(--color-border)", color: "var(--color-foreground)" }
              }
            >
              {q}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setShowCustom(true); setLocalSelected(""); }}
            className="w-full rounded-xl border p-3.5 text-left text-sm font-medium transition-all"
            style={
              showCustom
                ? { borderColor: config.theme.primary, backgroundColor: `${config.theme.primary}15` }
                : { borderColor: "var(--color-border)" }
            }
          >
            ✏️ Write your own...
          </button>
          {showCustom && (
            <div className="rise-in">
              <textarea
                autoFocus
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Will you be mine forever? ❤️"
                maxLength={150}
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
              />
              <span className="block text-right text-xs text-muted-foreground">{custom.length}/150</span>
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={!localSelected && (!showCustom || !custom.trim())}
          onClick={() => onSelect(showCustom ? custom.trim() : localSelected)}
          className="mt-5 h-13 w-full rounded-2xl text-base font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
          style={{ background: config.theme.primary, color: config.theme.primaryText }}
        >
          See Preview ✨
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Customize ────────────────────────────────────────────────────────

function CustomizeStep({
  config,
  draft,
  onUpdate,
  onNext,
}: {
  config: ReturnType<typeof getOccasionConfig>;
  draft: ExperienceDraft;
  onUpdate: (p: Partial<ExperienceDraft>) => void;
  onNext: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>(draft.photos ?? []);
  const [musicTrack, setMusicTrack] = useState(draft.musicTrack ?? "");
  const [message, setMessage] = useState(draft.message ?? config.suggestedFinalMessage);
  const [yesText, setYesText] = useState(draft.yesText ?? config.yesText);
  const [noText, setNoText] = useState(draft.noText ?? config.noText);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map(
        (f) =>
          new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result as string);
            reader.readAsDataURL(f);
          }),
      );
    Promise.all(readers).then((results) =>
      setPhotos((prev) => [...prev, ...results].slice(0, 5)),
    );
  };

  const save = () => {
    onUpdate({ photos, musicTrack, message, yesText, noText });
    onNext();
  };

  return (
    <div className="rise-in mx-auto max-w-sm pt-6">
      <h1 className="font-display text-2xl text-center">
        Make it{" "}
        <em className="not-italic" style={{ color: config.theme.accent }}>
          yours
        </em>{" "}
        ✨
      </h1>
      <p className="mt-1 text-sm text-center text-muted-foreground">All fields are optional!</p>

      <div className="mt-5 space-y-4">
        {/* YES / NO text */}
        <div className="surface-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Button text</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">YES button</span>
              <input
                value={yesText}
                onChange={(e) => setYesText(e.target.value)}
                maxLength={20}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">NO button</span>
              <input
                value={noText}
                onChange={(e) => setNoText(e.target.value)}
                maxLength={20}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-primary"
              />
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              📸 Memories ({photos.length}/5)
            </p>
            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs font-medium"
                style={{ color: config.theme.primary }}
              >
                + Add photo
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addPhotos(e.target.files)}
          />
          {photos.length === 0 ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-5"
            >
              <ImageIcon className="size-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Add up to 5 photos (optional)
              </span>
            </button>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {photos.map((src, i) => (
                <div key={i} className="group relative aspect-square">
                  <img src={src} className="h-full w-full rounded-lg object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border"
                >
                  <Upload className="size-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Music */}
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            🎵 Background music (optional)
          </p>
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => setMusicTrack("")}
              className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${!musicTrack ? "border-primary/50 bg-primary/5" : "border-border"}`}
            >
              🔇 No music
            </button>
            {MUSIC_TRACKS.slice(0, 3).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMusicTrack(musicTrack === t.id ? "" : t.id)}
                className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${musicTrack === t.id ? "border-primary/50 bg-primary/5" : "border-border"}`}
              >
                {t.emoji} {t.label} · <span className="text-muted-foreground">{t.mood}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Final message */}
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            💬 Final message
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder={config.finalMessagePlaceholder}
            className="mt-3 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
          />
          <span className="block text-right text-xs text-muted-foreground">{message.length}/500</span>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-5 h-13 w-full rounded-2xl text-base font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{ background: config.theme.primary, color: config.theme.primaryText }}
      >
        See what they'll see ✨
      </button>
    </div>
  );
}

// ─── Step 5: Preview ──────────────────────────────────────────────────────────

function PreviewStep({
  config,
  draft,
  onPublish,
}: {
  config: ReturnType<typeof getOccasionConfig>;
  draft: ExperienceDraft;
  onPublish: () => void;
}) {
  return (
    <div className="rise-in">
      <h2 className="pt-4 text-center font-display text-2xl">
        Here's what{" "}
        <em className="not-italic" style={{ color: config.theme.accent }}>
          {draft.recipientName}
        </em>{" "}
        will see ✨
      </h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Try clicking YES and NO to see the full experience.
      </p>

      {/* Phone mockup */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-[280px] sm:w-[320px] rounded-[2.5rem] border-[6px] border-gray-900 bg-gray-900 shadow-[0_32px_64px_rgba(0,0,0,0.3)]">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 z-10 -translate-x-1/2 h-6 w-24 rounded-full bg-gray-900" />
          <div className="overflow-hidden rounded-[2rem] bg-background">
            <InteractivePreview config={config} draft={draft} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-xs">
        <button
          type="button"
          onClick={onPublish}
          className="h-14 w-full rounded-2xl text-base font-bold tracking-wide transition-all hover:opacity-90 active:scale-95"
          style={{ background: config.theme.primary, color: config.theme.primaryText }}
        >
          Create the magic ✨
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          You'll get a shareable link — no account needed.
        </p>
      </div>
    </div>
  );
}

// ─── Embedded interactive preview (same engine as /s/$slug) ───────────────────

type PreviewState = "question" | "celebration" | "done";

function InteractivePreview({
  config,
  draft,
}: {
  config: ReturnType<typeof getOccasionConfig>;
  draft: ExperienceDraft;
}) {
  const [state, setState] = useState<PreviewState>("question");
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [noMsg, setNoMsg] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  const question = draft.question ?? config.defaultQuestion;
  const yesText = draft.yesText ?? config.yesText;
  const noText = draft.noText ?? config.noText;
  const name = draft.recipientName ?? "you";

  const moveNo = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const btnW = 90, btnH = 40, margin = 12;
    const maxX = rect.width - btnW - margin;
    const maxY = rect.height - btnH - margin;

    // Yes button approximate center (it's centered, ~120px wide, ~48px tall)
    const yesLeft = (rect.width - 140) / 2;
    const yesTop = rect.height * 0.62;

    let nx: number, ny: number, tries = 0;
    do {
      nx = margin + Math.random() * (maxX - margin);
      ny = margin + Math.random() * (maxY - margin);
      tries++;
    } while (
      tries < 20 &&
      nx < yesLeft + 160 && nx + btnW > yesLeft - 20 &&
      ny < yesTop + 60 && ny + btnH > yesTop - 20
    );

    setNoPos({ x: nx, y: ny });
    const msgs = config.noMessages;
    setNoMsg(msgs[noCount % msgs.length]!);
    setNoCount((c) => c + 1);
  }, [noCount, config]);

  if (state === "celebration") {
    return (
      <div
        className="flex min-h-[500px] flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: config.theme.bg }}
      >
        <div className="text-5xl animate-bounce">{config.celebrationEmoji}</div>
        <p className="font-display text-xl text-foreground">{config.celebrationMessage.replace("[NAME]", name)}</p>
        <p className="text-sm text-muted-foreground">{config.celebrationSubtext}</p>
        <button
          type="button"
          onClick={() => { setState("question"); setNoCount(0); setNoPos(null); setNoMsg(null); }}
          className="mt-2 rounded-full border border-border px-4 py-2 text-xs font-medium"
        >
          ↺ Replay
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden p-6 text-center"
      style={{ background: config.theme.bg }}
    >
      {/* Particles */}
      <FloatingParticles type={config.particleType} color={config.theme.particle} count={8} />

      {/* Illustration */}
      <div className="text-4xl mb-2">{config.emoji}</div>

      {/* Question */}
      <p className="font-display text-lg leading-snug text-foreground max-w-[200px]">
        {name}, {question}
      </p>

      {/* No message hint */}
      {noMsg && (
        <p className="mt-2 text-xs italic text-muted-foreground animate-in fade-in">
          "{noMsg}"
        </p>
      )}

      {/* YES button */}
      <button
        ref={yesBtnRef}
        type="button"
        onClick={() => setState("celebration")}
        className="relative z-10 mt-5 h-12 min-w-[140px] rounded-2xl text-base font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: config.theme.primary, color: config.theme.primaryText }}
      >
        {yesText}
      </button>

      {/* NO button */}
      <button
        type="button"
        onClick={moveNo}
        className="absolute z-20 rounded-xl border border-border bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm transition-all duration-300"
        style={
          noPos
            ? { left: noPos.x, top: noPos.y, position: "absolute" }
            : { marginTop: "12px", position: "relative", marginLeft: "auto" }
        }
      >
        {noText}
      </button>

      {!noPos && (
        <p className="mt-2 text-xs text-muted-foreground opacity-60">
          "No" seems a bit shy
        </p>
      )}
    </div>
  );
}

// ─── Step 6: Share ────────────────────────────────────────────────────────────

function ShareStep({ slug, recipientName }: { slug: string; recipientName?: string }) {
  const [shareOpen, setShareOpen] = useState(true);

  return (
    <div className="rise-in flex flex-col items-center gap-6 pt-16 text-center">
      <div className="text-6xl animate-bounce">🎉</div>
      <h1 className="font-display text-3xl">Your surprise is ready!</h1>
      <p className="text-muted-foreground">
        Share the link with {recipientName ?? "them"} and watch the magic happen ✨
      </p>
      <div className="surface-card w-full max-w-sm p-4 text-left">
        <p className="text-xs text-muted-foreground">Your link</p>
        <p className="mt-1 font-mono text-sm font-semibold break-all">
          {typeof window !== "undefined" ? window.location.origin : ""}/s/{slug}
        </p>
      </div>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        slug={slug}
        recipientName={recipientName}
      />
      <button
        type="button"
        onClick={() => setShareOpen(true)}
        className="h-12 w-full max-w-sm rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90"
      >
        Share again 📤
      </button>
      <a href="/create" className="text-sm text-muted-foreground underline">
        Create another surprise
      </a>
    </div>
  );
}

// FloatingParticles is exported from @/components/experience/FloatingParticles
export { FloatingParticles };
