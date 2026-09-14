export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <defs>
          <linearGradient id="lumora-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.404 0.132 8.5)" />
            <stop offset="100%" stopColor="oklch(0.70 0.11 20)" />
          </linearGradient>
        </defs>
        <path
          d="M16 3c3.6 4.6 7 7.2 7 11.9C23 20.6 20 25 16 29c-4-4-7-8.4-7-14.1C9 10.2 12.4 7.6 16 3Z"
          fill="url(#lumora-mark)"
        />
        <circle cx="16" cy="15" r="3.2" fill="oklch(0.985 0.009 25)" />
      </svg>
      <span
        className={`font-display text-xl tracking-tight ${light ? "text-background" : "text-foreground"}`}
      >
        Lumora
      </span>
    </span>
  );
}
