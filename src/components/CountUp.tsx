import { useEffect, useRef, useState } from "react";
import { useReveal } from "../lib/useReveal";

/** Counts to `value` once on first view. Static under reduced motion. */
export function CountUp({ value, duration = 900 }: { value: string; duration?: number }) {
  const { ref, shown } = useReveal<HTMLSpanElement>(0);
  const [display, setDisplay] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    if (!shown || done.current) return;
    done.current = true;

    const digits = value.replace(/[^\d]/g, "");
    if (!digits || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(digits);
    const suffix = value.slice(value.lastIndexOf(digits.at(-1) as string) + 1);
    const prefix = value.slice(0, value.indexOf(digits[0]));
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      const n = Math.round(target * eased);
      setDisplay(prefix + n.toLocaleString("en-US") + suffix);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    setDisplay(prefix + "0" + suffix);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shown, value, duration]);

  // proportional digits change width as they animate and shove the layout around
  return (
    <span ref={ref} className="[font-variant-numeric:tabular-nums]">
      {display}
    </span>
  );
}
