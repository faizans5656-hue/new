import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { categories, templates } from "@/lib/catalog";

const title = "Explore example digital surprises — Lumora";
const description =
  "See sample interactive experiences: birthday reveals, anniversary timelines, scratch-card love notes and more.";

export const Route = createFileRoute("/explore")({
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
  component: Explore,
});

function Explore() {
  const demos = templates.filter((_, i) => i % 7 === 0).slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl sm:text-5xl">Explore experiences</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Demo experiences built with Lumora. Open one the way a recipient would.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((t) => (
            <Link
              key={t.slug}
              to="/s/$slug"
              params={{ slug: `demo-${t.slug}` }}
              className="surface-card overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div
                className="flex aspect-[16/10] items-end p-5"
                style={{ background: t.hue }}
                aria-hidden="true"
              >
                <p className="font-display text-2xl text-white">{t.name}</p>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <span className="mt-3 inline-block text-sm font-medium text-primary">
                  Open experience →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl">Browse by occasion</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/templates"
              search={{ occasion: c.id }}
              className="flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium"
            >
              {c.emoji} {c.title}
            </Link>
          ))}
        </div>

        <Button asChild className="mt-12 h-12 rounded-full px-8">
          <Link to="/create">Create your own</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
