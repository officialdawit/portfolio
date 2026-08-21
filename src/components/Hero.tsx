import { ArrowUpRight } from "lucide-react";
import { HeroCanvas } from "./HeroCanvas";


export function Hero() {
  return (
    <section id="top" className="border-b border-line-soft">
      <div className="rail grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="px-4 py-16 sm:px-6 sm:py-24">

          <h1 className="sheen max-w-3xl text-[40px] font-semibold leading-[1.03] tracking-[-0.035em] sm:text-[64px]">
            I build apps and web products, start to finish.
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
            Mobile developer, web developer and system architect. I take a
            product from the first sketch to the thing people use every day —
            iOS apps, web platforms and the systems behind them. Six shipped
            products, one of them serving ten thousand people.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="flex items-center rounded-[var(--radius)] bg-fg px-5 py-3 text-[14px] font-medium text-bg transition-opacity duration-150 hover:opacity-88"
            >
              See the work
            </a>
            <a
              href="mailto:officialdawitworku@gmail.com"
              className="group flex items-center gap-2 rounded-[var(--radius)] border border-line px-5 py-3 text-[14px] text-muted transition-colors duration-150 hover:border-strong hover:text-fg"
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
