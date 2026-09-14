import { Link } from "@tanstack/react-router";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { occasionLabel, type Template } from "@/lib/catalog";

export function TemplateCard({ template }: { template: Template }) {
  const [fav, setFav] = useState(false);

  return (
    <article className="surface-card group relative overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <Link
        to="/templates/$slug"
        params={{ slug: template.slug }}
        className="block"
        aria-label={`Preview ${template.name}`}
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={{ background: template.hue }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <p className="font-display text-2xl leading-tight text-white/95">{template.name}</p>
            <p className="mt-1 text-xs tracking-wide text-white/70 uppercase">
              {occasionLabel(template.occasion)} · {template.style}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-0 bg-black/30 opacity-0 transition-all duration-300 group-hover:h-full group-hover:opacity-100" />
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {template.premium ? <Sparkles className="size-3.5" /> : null}
          {template.premium ? "Premium" : "Free"}
        </span>
        <button
          type="button"
          onClick={() => setFav((v) => !v)}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${template.name} from favourites` : `Save ${template.name}`}
          className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart className={`size-4 ${fav ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
    </article>
  );
}
