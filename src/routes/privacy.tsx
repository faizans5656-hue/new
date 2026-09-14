import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Lumora" },
      { name: "description", content: "How Lumora collects, uses, and protects your information." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2026</p>
        <div className="prose prose-sm mt-10 max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="font-display text-2xl">What we collect</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              When you create a surprise, we store the content you provide — recipient name, message, photos, and music preferences — temporarily to generate your shareable link. We also collect basic usage data to improve the product.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl">How we use your data</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Your creation data is used solely to display the recipient experience. We do not sell your personal information to third parties. Analytics data (views, opens) is aggregated and used only to show you stats about your own creations.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Recipients</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Recipients who open your surprise link do not need to create an account. We do not collect personal data about them beyond basic visit analytics (page views, time spent).
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Payments</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Payments are processed by Razorpay. Lumora never stores card details. Your payment information is subject to Razorpay's privacy policy.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Contact</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              For privacy-related requests, contact us at <a href="mailto:privacy@lumora.app" className="text-primary hover:underline">privacy@lumora.app</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
