import type { ReactNode } from "react";

/** Page gutters carry the hatch; the rail carries the content. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="hatch pointer-events-none fixed inset-y-0 left-0 z-0 w-[max(0px,calc((100vw-1280px)/2))]"
      />
      <div
        aria-hidden
        className="hatch pointer-events-none fixed inset-y-0 right-0 z-0 w-[max(0px,calc((100vw-1280px)/2))]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
