import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/templates", label: "Templates" },
      { to: "/how-it-works", label: "How it works" },
      { to: "/pricing", label: "Pricing" },
      { to: "/explore", label: "Explore" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Make moments unforgettable. Personalised digital surprises, shareable with one link.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="font-sans text-sm font-semibold tracking-wide text-foreground uppercase">
              {g.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Lumora. Made with care in India.
        </p>
      </div>
    </footer>
  );
}
