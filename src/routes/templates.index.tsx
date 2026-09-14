import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { TemplateCard } from "@/components/site/TemplateCard";
import { categories, templates, type Occasion } from "@/lib/catalog";

const title = "Digital card templates for every occasion — Lumora";
const description =
  "Browse premium and free interactive digital card templates for birthdays, love, anniversaries, weddings, friendship and apologies.";

type Search = { occasion?: Occasion; q?: string; plan?: "free" | "premium" };

export const Route = createFileRoute("/templates/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    occasion: (search["occasion"] as Occasion) || undefined,
    q: (search["q"] as string) || undefined,
    plan: (search["plan"] as "free" | "premium") || undefined,
  }),
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
  component: TemplatesPage,
});

function TemplatesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return templates.filter((t) => {
      if (search.occasion && t.occasion !== search.occasion) return false;
      if (search.plan === "free" && t.premium) return false;
      if (search.plan === "premium" && !t.premium) return false;
      if (term && !`${t.name} ${t.description}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [q, search.occasion, search.plan]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl sm:text-5xl">Templates</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {templates.length} interactive designs. Preview any of them before you personalise.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">Search templates</span>
            <Search
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or mood…"
              className="h-12 w-full rounded-full border border-border bg-card pr-4 pl-11 text-base outline-none focus-visible:border-primary"
            />
          </label>

          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <Chip active={!search.occasion} to={{}} label="All" />
            {categories.map((c) => (
              <Chip
                key={c.id}
                active={search.occasion === c.id}
                to={{ occasion: c.id }}
                label={`${c.emoji} ${c.title}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {(["free", "premium"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() =>
                  navigate({
                    search: (prev) => ({ ...prev, plan: prev.plan === p ? undefined : p }),
                  })
                }
                className={`min-h-11 rounded-full border px-4 text-sm font-medium capitalize transition-colors ${
                  search.plan === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="surface-card mt-12 p-12 text-center">
            <h2 className="font-display text-2xl">No templates match that</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different occasion or clear your search.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {results.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Chip({ active, to, label }: { active: boolean; to: Search; label: string }) {
  return (
    <Link
      to="/templates"
      search={to}
      className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
