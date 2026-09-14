// Reusable floating particle animation for the recipient experience
export function FloatingParticles({
  type,
  color,
  count = 12,
}: {
  type: string;
  color: string;
  count?: number;
}) {
  const items =
    type === "hearts"
      ? ["❤️", "💕", "🩷", "💗"]
      : type === "stars"
        ? ["⭐", "✨", "🌟", "💫"]
        : type === "confetti"
          ? ["🎊", "🎉", "✨", "🎈"]
          : type === "sparkles"
            ? ["✨", "💫", "⭐", "🌟"]
            : ["🌸", "🌺", "🌷", "💮"];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute text-sm opacity-40 float-soft"
          style={{
            left: `${5 + (i * 17) % 90}%`,
            top: `${10 + (i * 23) % 75}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }}
        >
          {items[i % items.length]}
        </span>
      ))}
    </div>
  );
}
