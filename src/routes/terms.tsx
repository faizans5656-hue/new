import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Lumora" },
      { name: "description", content: "Lumora's terms of service and usage conditions." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>
        <div className="mt-10 space-y-8 text-foreground">
          {[
            [
              "1. Acceptance",
              "By using Lumora, you agree to these terms. If you don't agree, please don't use the service.",
            ],
            [
              "2. Your content",
              "You retain ownership of all photos, messages, and other content you upload. You grant Lumora a limited license to display your content to generate recipient experiences. You are responsible for ensuring you have rights to all uploaded material.",
            ],
            [
              "3. Acceptable use",
              "You may not use Lumora to create experiences that are abusive, harassing, illegal, or violate any third party's rights. We reserve the right to remove content that violates these terms.",
            ],
            [
              "4. Payments",
              "Premium features are available for a one-time fee per experience or a monthly subscription. All payments are processed securely via Razorpay. Refunds may be issued at our discretion within 7 days of purchase.",
            ],
            [
              "5. Service availability",
              "We strive for 99.9% uptime but cannot guarantee uninterrupted access. Lumora is not liable for losses caused by service interruptions.",
            ],
            [
              "6. Changes",
              "We may update these terms. We'll notify you of significant changes via email or in-app notice. Continued use constitutes acceptance.",
            ],
            [
              "7. Contact",
              "For terms-related queries: legal@lumora.app",
            ],
          ].map(([title, body]) => (
            <section key={title as string}>
              <h2 className="font-display text-2xl">{title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
