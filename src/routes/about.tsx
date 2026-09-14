import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Users, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Lumora — Premium Digital Gifting Platform" },
      {
        name: "description",
        content:
          "Lumora was built to make digital gifts feel as meaningful as physical ones — personal, emotional, and memorable.",
      },
      { property: "og:title", content: "About Lumora" },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Heart,
    title: "Emotion first",
    body: "Every decision we make starts with one question: will this make the recipient feel something real?",
  },
  {
    icon: Sparkles,
    title: "Premium by default",
    body: "We don't make templates — we make experiences. Every design is crafted to feel special.",
  },
  {
    icon: Users,
    title: "Built for everyone",
    body: "Whether it's a partner, a friend, or a parent — Lumora works for every relationship.",
  },
  {
    icon: Zap,
    title: "Two minutes, maximum impact",
    body: "We obsess over simplicity so you can focus on the person, not the tools.",
  },
];

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="glow-hero mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl sm:text-6xl leading-tight">
            We believe gifts should
            <br />
            <em className="text-primary not-italic">feel like gifts.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Lumora was born out of a simple frustration: sending a birthday message on WhatsApp
            felt hollow. We knew technology could do better — so we built it.
          </p>
        </section>

        <section className="bg-card py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl sm:text-4xl">Our values</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div key={v.title} className="surface-card p-6">
                  <v.icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-sans text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Someone is waiting to feel remembered.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start creating with Lumora — it takes less than two minutes.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 rounded-full px-8">
            <Link to="/create">Create a Surprise</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
