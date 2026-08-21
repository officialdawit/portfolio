import { Lightbulb } from "lucide-react";
import { SectionHead } from "./SectionHead";

const PRINCIPLES = [
  {
    title: "Ship, then refine",
    body: "A product nobody uses teaches you nothing. I get the smallest honest version in front of real users, then let their behaviour decide what gets built next.",
  },
  {
    title: "The whole state, not the happy path",
    body: "Loading, empty, error, denied, offline. A screen that only works when the request succeeds is a screen that is half finished, and users find the other half first.",
  },
  {
    title: "Boring where it counts",
    body: "Parameterised queries, ownership checks on every route, migrations that roll back. Clever code is what somebody decodes at 3am — usually me.",
  },
  {
    title: "Built for where it runs",
    body: "Ethiopian users are on mid-range Android phones and metered data. That constraint shapes bundle size, image strategy, and offline behaviour from day one, not at the end.",
  },
];

export function Approach() {
  return (
    <section aria-labelledby="approach" className="border-b border-line-soft">
      <div className="rail py-14 sm:py-20">
        <SectionHead id="approach" title="How I work" Icon={Lightbulb} />
        <div className="grid grid-cols-1 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <article
              key={p.title}
              className="border-b border-r border-line-soft px-4 py-8 sm:px-6"
            >
              <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-fg">
                {p.title}
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
