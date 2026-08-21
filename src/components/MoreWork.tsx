import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { MORE_WORK } from "../data/more";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** Volume of finished, reachable work. Every tile opens the real thing. */
export function MoreWork() {
  return (
    <section aria-labelledby="more" className="border-b border-line-soft">
      <div className="rail py-14 sm:py-20">
        <SectionHead id="more" title="Also shipped" Icon={LayoutGrid} />

        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
          Fifteen more things that are live right now. Every one opens in a
          click — no screenshots of things you can't check.
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {MORE_WORK.map((w, i) => (
            <li key={w.url}>
              <Reveal delay={(i % 5) * 40}>
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/tile block overflow-hidden rounded-[var(--radius)] border border-line bg-card transition-colors duration-150 hover:border-strong"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-raised">
                    <img
                      src={w.shot}
                      alt={`${w.name} — screenshot`}
                      width={1400}
                      height={875}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover/tile:scale-[1.04]"
                    />
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2.5">
                    <span className="truncate text-[13px] font-medium text-fg">{w.name}</span>
                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.75}
                      aria-hidden
                      className="ml-auto shrink-0 text-dim transition-all duration-150 group-hover/tile:translate-x-px group-hover/tile:-translate-y-px group-hover/tile:text-accent"
                    />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
