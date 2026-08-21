import { STACK } from "../data/projects";
import { Marquee } from "./ui/marquee";

export function StackTicker() {
  return (
    <section aria-label="Stack" className="border-b border-line-soft">
      <div className="rail grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <div className="flex items-center border-b border-line-soft py-4 pr-6 sm:border-b-0 sm:border-r">
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-fg">
            Built with
          </span>
        </div>

        <div className="relative overflow-hidden py-3">
          <Marquee pauseOnHover speed="slow" className="[--gap:2.5rem]">
            {STACK.map((tech) => (
              <span key={tech} className="label whitespace-nowrap">
                {tech}
              </span>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg via-bg/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
