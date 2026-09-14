import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { OCCASIONS_LIST } from "@/lib/occasion-config";

const title = "Lumora — Make someone smile in just a few clicks ❤️";
const description =
  "Create a cute, funny or romantic interactive surprise and send it to someone special. Love, birthdays, proposals, friendships and more.";

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
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #FFF5F8 0%, #FFE8EC 40%, #FFF0E8 100%)",
          }}
        >
          {/* Floating emoji bg */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {["❤️","💍","🎂","🫶","✨","💘","🌹","🥺"].map((e, i) => (
              <span
                key={i}
                className="absolute text-3xl sm:text-4xl opacity-20 float-soft"
                style={{
                  left: `${8 + i * 12}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: `${5 + (i % 3)}s`,
                }}
              >
                {e}
              </span>
            ))}
          </div>

          <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-24 pt-20 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-pink-600 backdrop-blur-sm">
              <Sparkles className="size-3" /> Free • No account needed • Share in seconds
            </span>
            <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Make someone{" "}
              <em className="not-italic text-primary">smile</em>
              <br />
              in just a few clicks ❤️
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Create a cute, funny or romantic interactive surprise and send it to someone special. They get an experience — not just a message.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-full px-8 text-base">
                <Link to="/create">
                  Create a Surprise <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full border-pink-200 bg-white/80 px-8 text-base hover:bg-white"
              >
                <Link to="/s/sarah-love-demo00">
                  See an example ✨
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="font-display text-3xl sm:text-4xl">
                Ready in under{" "}
                <em className="not-italic text-primary">2 minutes</em>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pick a vibe, type their name, and send. That's it.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "1", icon: "🎯", title: "Pick an occasion", body: "Love, birthday, proposal, friendship — pick your vibe." },
                { step: "2", icon: "✏️", title: "Personalize it", body: "Enter their name, pick a question, write a message." },
                { step: "3", icon: "✨", title: "Preview & publish", body: "See exactly what they'll experience before sharing." },
                { step: "4", icon: "📲", title: "Share the link", body: "WhatsApp, copy link, or QR code — one tap to share." },
              ].map((s) => (
                <div key={s.step} className="surface-card flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-xl">
                    {s.icon}
                  </div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Occasions grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="font-display text-3xl sm:text-4xl">
                What are you{" "}
                <em className="not-italic text-primary">making this for?</em>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Each occasion is a completely different, beautiful experience.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {OCCASIONS_LIST.map((occ) => (
                <Link
                  key={occ.id}
                  to="/create"
                  search={{ occasion: occ.id }}
                  className="group surface-card flex flex-col items-center gap-2 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">{occ.emoji}</span>
                  <span className="text-sm font-semibold text-foreground">{occ.label}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{occ.tagline}</span>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="h-12 rounded-full px-8">
                <Link to="/create">Create a Surprise ❤️</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* The "what they see" section */}
        <section
          className="py-16 sm:py-20"
          style={{ background: "linear-gradient(145deg, #FFE8EC 0%, #FFD6DF 100%)" }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl">
                  The{" "}
                  <em className="not-italic text-primary">YES/NO</em>{" "}
                  experience they'll love
                </h2>
                <p className="mt-4 text-muted-foreground">
                  The recipient sees your question with two buttons. When they try to press <strong>NO</strong>, the button hilariously runs away. The <strong>YES</strong> button stays right there, front and center.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "NO button moves to a random safe position",
                    "Changes its message each time (up to 8 variations)",
                    "YES button always stays accessible",
                    "Ends in a beautiful celebration screen",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Heart className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7">
                  <Link to="/s/sarah-love-demo00">Try the demo ✨</Link>
                </Button>
              </div>
              {/* Mock phone illustration */}
              <div className="flex justify-center">
                <div className="relative w-52 rounded-[2rem] border-[5px] border-gray-900 bg-gray-900 shadow-[0_24px_56px_rgba(0,0,0,0.25)]">
                  <div className="absolute top-1.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-gray-900" />
                  <div className="overflow-hidden rounded-[1.6rem]">
                    <div
                      className="flex min-h-[380px] flex-col items-center justify-center gap-3 px-4 py-10 text-center"
                      style={{ background: "linear-gradient(145deg,#FFE8EC,#FFD6DF)" }}
                    >
                      <div className="text-3xl">❤️</div>
                      <p className="text-xs text-muted-foreground">Here's something for you 💕</p>
                      <p className="font-display text-sm leading-snug">
                        Sarah,{" "}
                        <span className="text-primary">will you forever be mine?</span>
                      </p>
                      <button className="mt-3 h-10 w-32 rounded-2xl bg-primary text-xs font-bold text-white shadow">
                        Yes 💖
                      </button>
                      <button className="rounded-xl border border-border bg-white/90 px-4 py-2 text-xs font-semibold">
                        No 🙈
                      </button>
                      <p className="text-[10px] text-muted-foreground opacity-60">"No" seems a bit shy 🙈</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center font-display text-3xl sm:text-4xl">
              Everything you need,{" "}
              <em className="not-italic text-primary">nothing you don't</em>
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "🎯", title: "11 occasions", body: "Love, proposal, birthday, friendship, apology, crush, and more." },
                { icon: "📸", title: "Photo memories", body: "Add up to 5 photos. They appear in a beautiful swipeable gallery after YES." },
                { icon: "🎵", title: "Background music", body: "Optional romantic background music that starts only after they tap Open." },
                { icon: "🔗", title: "One-click sharing", body: "WhatsApp, copy link, or QR code. No app, no download needed." },
                { icon: "🆓", title: "Completely free", body: "No payments, no premium plans, no locked features. Ever." },
                { icon: "📱", title: "Mobile-first", body: "Works beautifully on every phone screen, from 320px to 430px." },
              ].map((f) => (
                <div key={f.title} className="surface-card flex gap-4 p-5">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-20 text-center"
          style={{ background: "linear-gradient(145deg, #FFE8EC 0%, #FFD0DA 100%)" }}
        >
          <div className="mx-auto max-w-xl px-4">
            <span className="text-5xl">💕</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Someone is waiting to feel remembered.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Create your surprise in under 2 minutes. They'll never forget it.
            </p>
            <Button asChild size="lg" className="mt-8 h-14 rounded-full px-10 text-lg">
              <Link to="/create">
                Create a Surprise ❤️
              </Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">Free forever • No account required</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
