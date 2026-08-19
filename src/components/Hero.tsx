import { ArrowUpRight } from "lucide-react";
import { HeroCanvas } from "./HeroCanvas";


export function Hero() {
  return (
    <section id="top" className="border-b border-line-soft">
      <div className="rail grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="label label-fg">00</span>
            <span aria-hidden className="label text-dim">
              /
            </span>
            <span className="label">Addis Ababa, Ethiopia</span>
            <span aria-hidden className="h-1.5 w-1.5 bg-fg" />
            <span className="label">Available for work</span>
          </div>

          <h1 className="mt-8 max-w-3xl text-[34px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[52px]">
            I design and ship production SaaS end to end.
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
            Full-stack product engineer. Schema through to the pixel — typed
            APIs, Postgres, Stripe billing, and interfaces that hold up on a
            phone in Addis and a laptop in New York. Six shipped products, one
            of them serving ten thousand people.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="label label-fg flex items-center border border-line px-4 py-3 transition-colors duration-150 hover:border-strong hover:bg-raised"
            >
              See the work
            </a>
            <a
              href="mailto:officialdawitworku@gmail.com"
              className="label group flex items-center gap-1.5 border border-transparent px-4 py-3 transition-colors duration-150 hover:text-fg"
            >
              officialdawitworku@gmail.com
              <ArrowUpRight
                size={12}
                strokeWidth={1.75}
                aria-hidden
                className="transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px"
              />
            </a>
          </div>

        </div>

        <aside className="relative min-h-[220px] border-t border-line-soft lg:border-l lg:border-t-0">
          <div className="absolute inset-0">
            <HeroCanvas />
          </div>
        </aside>
      </div>
    </section>
  );
}
