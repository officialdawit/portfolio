import { STACK } from "../data/projects";

export function StackTicker() {
  return (
    <section aria-label="Stack" className="border-b border-line-soft">
      <div className="rail grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <div className="flex items-center border-b border-line-soft px-5 py-4 sm:border-b-0 sm:border-r sm:px-8">
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-fg">
            Built with
          </span>
        </div>

        <div className="relative overflow-hidden py-3">
          <div className="flex w-max animate-ticker [animation-play-state:running] hover:[animation-play-state:paused]">
            {[0, 1].map((pass) => (
              <ul key={pass} aria-hidden={pass === 1} className="flex shrink-0">
                {STACK.map((tech) => (
                  <li
                    key={tech}
                    className="label whitespace-nowrap px-5 sm:px-6"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg via-bg/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
