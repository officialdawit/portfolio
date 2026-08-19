import { useEffect, useState } from "react";

/** Hairline read-progress bar pinned under the nav. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max <= 0 ? 0 : Math.min(100, (window.scrollY / max) * 100));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-[var(--nav-h)] z-40 h-px bg-transparent"
    >
      <div
        className="h-full bg-fg/70 transition-[width] duration-75 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
