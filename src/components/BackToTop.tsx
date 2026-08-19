import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Appears once the reader is past the first screen. Desktop only — mobile has the dock. */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center border border-line bg-raised text-muted transition-all duration-200 hover:border-strong hover:bg-fg hover:text-bg sm:flex ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp size={15} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
