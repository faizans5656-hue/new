import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

const title = "Pricing — Lumora digital surprises";
const description =
  "Start free. Upgrade to Premium for ₹199 per experience, or go Pro at ₹499 a month for unlimited creations and analytics.";

export const Route = createFileRoute("/pricing")({
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
  component: Pricing,
});

const plans = [
  {
    name: "Free",
    price: "₹0",
    note: "Always free",
    features: [
      "Basic templates",
      "Up to 5 photos",
      "Standard animations",
      "Shareable link",
      "Subtle Lumora credit",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹199",
    note: "per experience",
    features: [
      "All premium templates",
      "Unlimited photos",
      "Background music",
      "Advanced animations & effects",
      "Scratch card, gift reveal, quiz",
      "QR code download",
      "No watermark",
    ],
    cta: "Create a premium surprise",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹499",
    note: "per month",
    features: [
      "Unlimited experiences",
      "Everything in Premium",
      "Creation analytics",
      "Custom themes",
      "Priority support",
    ],
    cta: "Go Pro",
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl sm:text-5xl">Simple, honest pricing</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Pay per surprise, or subscribe if you make them often. Recipients never pay and never need
          an account.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`surface-card flex flex-col p-6 ${p.highlight ? "ring-2 ring-primary" : ""}`}
            >
              {p.highlight && (
                <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most loved
                </span>
              )}
              <h2 className="font-sans text-lg font-semibold">{p.name}</h2>
              <p className="mt-3 font-display text-4xl">{p.price}</p>
              <p className="text-sm text-muted-foreground">{p.note}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.highlight ? "default" : "outline"}
                className="mt-8 h-12 rounded-full"
              >
                <Link to="/create">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Payments in India via UPI, cards, net banking and wallets. Card details are never stored by
          Lumora.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
