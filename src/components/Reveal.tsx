import type { ReactNode } from "react";
import { useReveal } from "../lib/useReveal";

type Props = { children: ReactNode; delay?: number; className?: string };

export function Reveal({ children, delay = 0, className = "" }: Props) {
  const { ref, shown } = useReveal<HTMLDivElement>(delay);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
