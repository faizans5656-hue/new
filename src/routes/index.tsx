import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Image, Music, QrCode, Share2, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { TemplateCard } from "@/components/site/TemplateCard";
import { Button } from "@/components/ui/button";
import { categories, templates } from "@/lib/catalog";

const title = "Lumora — Create a digital surprise they'll never forget";
const description =
  "Build interactive digital cards with your photos, words and music, then share them with one link. Birthdays, anniversaries, love letters and more.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = templates.filter((t) => t.premium).slice(0, 8);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="glow-hero relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
            <div className="rise-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" /> Interactive digital gifting
              </span>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
                Make someone feel <em className="text-primary not-italic">truly special.</em>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Create beautiful digital surprises, personalised with your photos, words, music and
                memories — and share them in seconds.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
                  <Link to="/create">
                    Create a Surprise <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full px-7 text-base"
                >
                  <Link to="/explore">Explore experiences</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Made for birthdays, love, anniversaries & every moment that matters.
              </p>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Start with the moment</h2>
              <p className="mt-2 text-muted-foreground">
                Pick an occasion — we&apos;ll suggest the right experience.
              </p>
            </div>
            <Link
              to="/templates"
              className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:block"
            >
              All templates
            </Link>
          </div>

          <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/templates"
                search={{ occasion: c.id }}
                className="surface-card w-[70%] shrink-0 snap-start p-5 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:w-auto"
              >
                <span className="text-2xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <h3 className="mt-3 font-sans text-base font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-card py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl sm:text-4xl">Three steps. Two minutes.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Image,
                  title: "Pick a template",
                  body: "Choose an occasion and a design that matches your person.",
                },
                {
                  icon: Music,
                  title: "Personalise it",
                  body: "Add photos, a message, a timeline of memories and a soundtrack.",
                },
                {
                  icon: Share2,
                  title: "Share the link",
                  body: "Send via WhatsApp or a QR code. They open it — no account needed.",
                },
              ].map((s, i) => (
                <div key={s.title} className="surface-card p-6">
                  <s.icon className="size-6 text-primary" aria-hidden="true" />
                  <p className="mt-4 text-xs tracking-widest text-muted-foreground uppercase">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-sans text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured templates */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl">Loved designs</h2>
          <p className="mt-2 text-muted-foreground">
            Every template is interactive — scratch cards, gift reveals, timelines and more.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7">
              <Link to="/templates">Browse all templates</Link>
            </Button>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glow-hero surface-card overflow-hidden px-6 py-14 text-center sm:px-12">
            <Heart className="mx-auto size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Someone is waiting to feel remembered.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              No design skills. No app to install for them. Just a link that feels like a gift.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link to="/create">Create a Surprise</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-7">
                <Link to="/s/$slug" params={{ slug: "demo-emma-birthday" }}>
                  See a live example
                </Link>
              </Button>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <QrCode className="size-4" /> Share by link, WhatsApp or QR code
            </p>
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 pt-3 backdrop-blur-xl md:hidden">
        <Button asChild className="h-12 w-full rounded-full text-base">
          <Link to="/create">Create a Surprise</Link>
        </Button>
      </div>

      <SiteFooter />
      <div className="h-20 md:hidden" />
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="float-soft relative w-[260px] rounded-[2.25rem] border border-border bg-ink p-3 shadow-[var(--shadow-lift)] sm:w-[300px]">
      <div className="overflow-hidden rounded-[1.75rem] bg-background">
        <div
          className="flex aspect-[9/17] flex-col items-center justify-center gap-4 p-6 text-center"
          style={{
            background: "linear-gradient(160deg, oklch(0.40 0.13 8) 0%, oklch(0.66 0.10 5) 100%)",
          }}
        >
          <span className="text-xs tracking-[0.2em] text-white/70 uppercase">For Emma</span>
          <p className="font-display text-3xl leading-tight text-white">
            Someone made something special for you
          </p>
          <span className="mt-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-primary">
            Tap to open ❤️
          </span>
        </div>
      </div>
    </div>
  );
}
