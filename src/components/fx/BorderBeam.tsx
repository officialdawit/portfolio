import type { ReactNode } from "react";

/**
 * A light travelling around the border. One rotating conic gradient clipped to
 * the frame by an inset backdrop — no library, no per-frame JS.
 *
 * Used once, on the single most important action. Repeat it and it stops
 * meaning anything.
 */
export function BorderBeam({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`beam relative inline-flex rounded-[var(--radius)] p-px ${className}`}>
      <span aria-hidden className="beam-ring" />
      <span className="relative z-10 inline-flex w-full rounded-[calc(var(--radius)-1px)]">
        {children}
      </span>
    </span>
  );
}
