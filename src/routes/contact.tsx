import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Lumora — Get in Touch" },
      {
        name: "description",
        content: "Have a question or feedback? Reach out to the Lumora team.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/contact
    setSent(true);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl sm:text-5xl">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          Questions, feedback, or just want to say hi? We read every message.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:hello@lumora.app"
            className="surface-card flex items-center gap-4 p-5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <Mail className="size-6 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-sm">Email us</p>
              <p className="text-xs text-muted-foreground">hello@lumora.app</p>
            </div>
          </a>
          <a
            href="#"
            className="surface-card flex items-center gap-4 p-5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <MessageSquare className="size-6 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-sm">WhatsApp support</p>
              <p className="text-xs text-muted-foreground">Typically replies in 2 hours</p>
            </div>
          </a>
        </div>

        <div className="mt-10 surface-card p-6">
          {sent ? (
            <div className="py-8 text-center">
              <span className="text-4xl" aria-hidden="true">🎉</span>
              <h2 className="mt-4 font-display text-2xl">Message sent!</h2>
              <p className="mt-2 text-muted-foreground">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold">Your name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1.5 h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus-visible:border-primary"
                  placeholder="Alex"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Email address</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1.5 h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus-visible:border-primary"
                  placeholder="alex@email.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus-visible:border-primary"
                  placeholder="Tell us what you need…"
                />
              </label>
              <Button type="submit" size="lg" className="h-12 w-full rounded-full">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
