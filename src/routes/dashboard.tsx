import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  Copy,
  Edit3,
  ExternalLink,
  LayoutGrid,
  Plus,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ShareModal } from "@/components/site/ShareModal";
import {
  deleteCreation,
  duplicateCreation,
  getAllCreations,
  seedDemoIfEmpty,
  type Creation,
} from "@/lib/creation-store";

const title = "Dashboard — Lumora";
const description = "Manage your digital surprises and track their impact.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type FilterTab = "all" | "draft" | "published";

function Dashboard() {
  const navigate = useNavigate();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [shareTarget, setShareTarget] = useState<Creation | null>(null);

  const load = () => {
    seedDemoIfEmpty();
    setCreations(getAllCreations());
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = creations.filter((c) => filter === "all" || c.status === filter);

  const stats = {
    total: creations.length,
    published: creations.filter((c) => c.status === "published").length,
    drafts: creations.filter((c) => c.status === "draft").length,
    totalViews: creations.reduce((acc, c) => acc + c.views, 0),
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this creation? This cannot be undone.")) return;
    deleteCreation(id);
    load();
  };

  const handleDuplicate = (id: string) => {
    duplicateCreation(id);
    load();
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">
              {greeting} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">
              Ready to make someone smile?
            </p>
          </div>
          <Button asChild size="lg" className="h-12 rounded-full px-6">
            <Link to="/create">
              <Plus className="mr-1 size-4" /> Create New
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total creations", value: stats.total, icon: LayoutGrid },
            { label: "Published", value: stats.published, icon: Sparkles },
            { label: "Drafts", value: stats.drafts, icon: Edit3 },
            { label: "Total views", value: stats.totalViews, icon: BarChart2 },
          ].map((s) => (
            <div key={s.label} className="surface-card p-5">
              <s.icon className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-3 font-display text-3xl text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">
            {(["all", "published", "draft"] as FilterTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`min-h-9 rounded-full border px-4 text-sm font-medium capitalize transition-colors ${
                  filter === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{filtered.length} items</span>
        </div>

        {/* Creations grid */}
        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CreationCard
                key={c.id}
                creation={c}
                onShare={() => setShareTarget(c)}
                onDelete={() => handleDelete(c.id)}
                onDuplicate={() => handleDuplicate(c.id)}
              />
            ))}
          </div>
        )}
      </main>

      {shareTarget && (
        <ShareModal
          open={!!shareTarget}
          onClose={() => setShareTarget(null)}
          slug={shareTarget.slug}
          recipientName={shareTarget.recipientName || undefined}
        />
      )}
    </div>
  );
}

function CreationCard({
  creation,
  onShare,
  onDelete,
  onDuplicate,
}: {
  creation: Creation;
  onShare: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const isPublished = creation.status === "published";

  return (
    <div className="surface-card overflow-hidden">
      {/* Gradient preview */}
      <div
        className="flex aspect-[16/9] items-end p-4"
        style={{ background: creation.theme }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPublished
                ? "bg-white/90 text-primary"
                : "bg-black/30 text-white"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          {creation.recipientName && (
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs text-white">
              For {creation.recipientName}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-foreground line-clamp-1">{creation.title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground capitalize">
          {creation.occasion.replace(/-/g, " ")} ·{" "}
          {new Date(creation.updatedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        {isPublished && (
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span>{creation.views} views</span>
            <span>{creation.opens} opens</span>
            <span>{creation.completions} completed</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 rounded-full text-xs">
            <Link to="/create" search={{ template: creation.templateSlug }}>
              <Edit3 className="mr-1 size-3" /> Edit
            </Link>
          </Button>
          {isPublished && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={onShare}
              >
                <Share2 className="mr-1 size-3" /> Share
              </Button>
              <Button asChild variant="ghost" size="sm" className="h-8 rounded-full text-xs">
                <Link to="/s/$slug" params={{ slug: creation.slug }} target="_blank">
                  <ExternalLink className="mr-1 size-3" /> Preview
                </Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full text-xs"
            onClick={onDuplicate}
            title="Duplicate"
          >
            <Copy className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full text-xs text-destructive hover:text-destructive"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter }: { filter: FilterTab }) {
  return (
    <div className="surface-card mt-8 flex flex-col items-center gap-4 p-16 text-center">
      <span className="text-5xl" aria-hidden="true">
        ✨
      </span>
      <div>
        <h2 className="font-display text-2xl text-foreground">
          {filter === "all"
            ? "No surprises yet"
            : filter === "published"
              ? "Nothing published yet"
              : "No drafts"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {filter === "all"
            ? "Create your first digital surprise in minutes."
            : filter === "published"
              ? "Publish a surprise to see it here."
              : "Start creating and save as a draft."}
        </p>
      </div>
      <Button asChild className="h-11 rounded-full px-6">
        <Link to="/create">
          <Plus className="mr-1 size-4" /> Create Your First Surprise
        </Link>
      </Button>
    </div>
  );
}
