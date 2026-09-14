import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { TemplateCard } from "@/components/site/TemplateCard";
import { Button } from "@/components/ui/button";
import { occasionLabel, templateBySlug, templates } from "@/lib/catalog";

export const Route = createFileRoute("/templates/$slug")({
  loader: ({ params }) => {
    const template = templateBySlug(params.slug);
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Template not found — Lumora" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.template;
    const title = `${t.name} — ${occasionLabel(t.occasion)} digital card template | Lumora`;
    return {
      meta: [
        { title },
        { name: "description", content: t.description },
        { property: "og:title", content: title },
        { property: "og:description", content: t.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => <Fallback title="This template didn't load" />,
  notFoundComponent: () => <Fallback title="We couldn't find that template" />,
  component: TemplateDetail,
});

function Fallback({ title }: { title: string }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          It may have been renamed. Browse the full collection instead.
        </p>
        <Button asChild className="mt-8 h-12 rounded-full px-7">
          <Link to="/templates">All templates</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}

function TemplateDetail() {
  const { template } = Route.useLoaderData();
  const related = templates
    .filter((t) => t.occasion === template.occasion && t.slug !== template.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div
            className="surface-card flex aspect-[4/5] flex-col items-center justify-center gap-4 p-8 text-center lg:aspect-[4/3]"
            style={{ background: template.hue }}
          >
            <span className="text-xs tracking-[0.2em] text-white/70 uppercase">Live preview</span>
            <p className="font-display text-4xl leading-tight text-white">{template.name}</p>
            <span className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-primary">
              Tap to open ❤️
            </span>
          </div>

          <div>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              {occasionLabel(template.occasion)}
            </p>
            <h1 className="mt-2 font-display text-4xl">{template.name}</h1>
            <p className="mt-4 text-muted-foreground">{template.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                {template.premium ? <Sparkles className="size-4" /> : null}
                {template.premium ? "Premium · ₹199" : "Free"}
              </span>
              <span className="text-sm text-muted-foreground capitalize">
                {template.style} style
              </span>
            </div>

            <h2 className="mt-8 font-sans text-sm font-semibold tracking-wide uppercase">
              What&apos;s included
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {template.blocks.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 shrink-0 text-primary" aria-hidden="true" /> {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 hidden gap-3 sm:flex">
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link to="/create" search={{ template: template.slug }}>
                  Use this template
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
                <Link to="/s/$slug" params={{ slug: "demo-emma-birthday" }}>
                  Open example
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl">More {occasionLabel(template.occasion)} designs</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((t) => (
                <TemplateCard key={t.slug} template={t} />
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 pt-3 backdrop-blur-xl sm:hidden">
        <Button asChild className="h-12 w-full rounded-full text-base">
          <Link to="/create" search={{ template: template.slug }}>
            Use this template
          </Link>
        </Button>
      </div>

      <SiteFooter />
      <div className="h-20 sm:hidden" />
    </div>
  );
}
