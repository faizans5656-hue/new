import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

const title = "How Lumora works — create and share a digital surprise";
const description =
  "Choose an occasion, personalise a template with photos, words and music, then share an interactive link by WhatsApp or QR code.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  ["Choose the occasion", "Birthday, love, anniversary, apology, friendship — or start blank."],
  ["Pick a template", "Each design is a full interactive experience, not a static image."],
  ["Personalise", "Recipient name, your message, colours, fonts and button text."],
  ["Add memories", "Upload photos, build a timeline, drop in a short video."],
  ["Add music", "Pick a soundtrack. It respects browser autoplay rules and has a volume control."],
  ["Preview", "See exactly what they will see, on phone and desktop."],
  ["Publish & share", "Get a link like lumora.app/s/emma-birthday, plus WhatsApp and QR sharing."],
];

function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl sm:text-5xl">How it works</h1>
        <p className="mt-3 text-muted-foreground">
          Seven small steps. Most people finish in under two minutes.
        </p>
        <ol className="mt-10 space-y-6">
          {steps.map(([t, b], i) => (
            <li key={t} className="surface-card flex gap-4 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="font-sans text-base font-semibold">{t}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{b}</p>
              </div>
            </li>
          ))}
        </ol>
        <Button asChild className="mt-10 h-12 w-full rounded-full sm:w-auto sm:px-8">
          <Link to="/create">Create a Surprise</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
