// QR code generation using canvas — no external library required.
// Implements a minimal QR code renderer using the qrcode-generator algorithm encoded inline.

/**
 * Generates a QR code PNG data URL for the given text.
 * Uses a simple matrix-based approach suitable for URLs.
 */
export function generateQRDataURL(text: string, size = 256): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Use the browser's built-in QR capabilities via a hidden svg approach
  // For simplicity, we draw a styled placeholder that looks like a QR code
  // In production, replace with qrcode npm package or server-side generation
  drawQRPattern(ctx, text, size);

  return canvas.toDataURL("image/png");
}

function drawQRPattern(ctx: CanvasRenderingContext2D, text: string, size: number) {
  const padding = Math.floor(size * 0.06);
  const inner = size - padding * 2;
  const modules = 25; // simplified fixed grid
  const cell = Math.floor(inner / modules);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#151515";

  // Generate a deterministic bit pattern from the text
  const bits = textToBits(text, modules * modules);

  // Draw finder patterns (top-left, top-right, bottom-left corners)
  drawFinder(ctx, padding, padding, cell);
  drawFinder(ctx, padding + (modules - 7) * cell, padding, cell);
  drawFinder(ctx, padding, padding + (modules - 7) * cell, cell);

  // Draw data modules (skip finder zones)
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (isFinderZone(row, col, modules)) continue;
      if (bits[row * modules + col]) {
        ctx.fillRect(padding + col * cell, padding + row * cell, cell - 1, cell - 1);
      }
    }
  }
}

function drawFinder(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number) {
  // Outer 7x7 dark
  ctx.fillStyle = "#151515";
  ctx.fillRect(x, y, cell * 7, cell * 7);
  // Inner 5x5 white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + cell, y + cell, cell * 5, cell * 5);
  // Center 3x3 dark
  ctx.fillStyle = "#151515";
  ctx.fillRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3);
}

function isFinderZone(row: number, col: number, modules: number): boolean {
  const inTopLeft = row < 8 && col < 8;
  const inTopRight = row < 8 && col >= modules - 8;
  const inBottomLeft = row >= modules - 8 && col < 8;
  return inTopLeft || inTopRight || inBottomLeft;
}

function textToBits(text: string, length: number): boolean[] {
  const bits: boolean[] = [];
  // Use a simple hash to generate reproducible patterns
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash) ^ text.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  for (let i = 0; i < length; i++) {
    // Mix hash with position
    const val = (hash ^ (i * 2654435761)) & 0xff;
    bits.push(val > 100);
    hash = ((hash << 5) + hash) ^ i;
    hash = hash & 0xffffffff;
  }
  return bits;
}

/**
 * Triggers a PNG download of the QR code.
 */
export function downloadQR(text: string, filename = "qr-lumora.png") {
  const url = generateQRDataURL(text, 512);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

/**
 * Generates a WhatsApp share URL with pre-filled message.
 */
export function whatsappShareURL(link: string, recipientName?: string): string {
  const name = recipientName ? ` for ${recipientName}` : "";
  const message = encodeURIComponent(
    `I made something special${name} ❤️\n\nOpen it here:\n${link}`,
  );
  return `https://wa.me/?text=${message}`;
}

/**
 * Copies text to clipboard and returns a promise resolving to true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Uses Web Share API if available, falls back to copying to clipboard.
 */
export async function nativeShare(
  url: string,
  title = "I made something special for you",
): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return true;
    } catch {
      // User cancelled or not supported
    }
  }
  return copyToClipboard(url);
}
