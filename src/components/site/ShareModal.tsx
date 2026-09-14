import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, QrCode, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, downloadQR, generateQRDataURL, whatsappShareURL } from "@/lib/share";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  slug: string;
  recipientName?: string;
}

export function ShareModal({ open, onClose, slug, recipientName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/s/${slug}` : `/s/${slug}`;

  useEffect(() => {
    if (open) {
      setQrUrl(generateQRDataURL(shareUrl, 256));
    }
  }, [open, shareUrl]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    window.open(whatsappShareURL(shareUrl, recipientName), "_blank", "noopener");
  };

  const handleQRDownload = () => {
    downloadQR(shareUrl, `lumora-${slug}.png`);
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Share your surprise"
    >
      <div className="surface-card w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-display">🎉 Your surprise is ready!</p>
            <p className="mt-0.5 text-sm text-muted-foreground">Share the link with them now.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-muted hover:bg-secondary"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Link box */}
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3">
          <p className="flex-1 truncate font-mono text-xs text-foreground">{shareUrl}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            aria-label="Copy link"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Share buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            onClick={handleWhatsApp}
            className="h-12 rounded-xl bg-[#25D366] text-white hover:bg-[#20b858] flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="h-12 rounded-xl flex items-center gap-2"
          >
            <Share2 className="size-4" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        {/* QR Code */}
        {qrUrl && (
          <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <QrCode className="size-3.5" /> Scan to open your surprise ❤️
            </p>
            <img
              src={qrUrl}
              alt="QR code to open your surprise"
              className="size-40 rounded-xl"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQRDownload}
              className="h-8 rounded-full text-xs"
            >
              <Download className="mr-1 size-3" /> Download QR
            </Button>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Recipients don't need an account — they just open the link ✨
        </p>
      </div>
    </div>
  );
}
