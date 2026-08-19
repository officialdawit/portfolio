import type { LucideIcon } from "lucide-react";

type Size = "sm" | "md" | "lg";

const BOX: Record<Size, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};
const GLYPH: Record<Size, number> = { sm: 14, md: 16, lg: 20 };

/**
 * Icons sit in a bordered cell so they read as structure, not decoration.
 * Never render a bare lucide glyph in muted colour — it disappears on this canvas.
 */
export function IconCell({
  Icon,
  size = "md",
  className = "",
}: {
  Icon: LucideIcon;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center border border-line bg-raised text-fg transition-colors duration-150 group-hover:border-strong group-hover:bg-fg group-hover:text-bg ${BOX[size]} ${className}`}
    >
      <Icon size={GLYPH[size]} strokeWidth={1.5} />
    </span>
  );
}
