import { Lightbulb } from "lucide-react";
import { SectionHead } from "./SectionHead";

const PRINCIPLES = [
  {
    index: "08.1",
    title: "Ship, then refine",
    body: "A product nobody uses teaches you nothing. I get the smallest honest version in front of real users, then let their behaviour decide what gets built next.",
  },
  {
    index: "08.2",
    title: "The whole state, not the happy path",
    body: "Loading, empty, error, denied, offline. A screen that only works when the request succeeds is a screen that is half finished, and users find the other half first.",
  },
  {
    index: "08.3",
    title: "Boring where it counts",
    body: "Parameterised queries, ownership checks on every route, migrations that roll back. Clever code is what somebody decodes at 3am — usually me.",
  },
  {
    index: "08.4",
    title: "Built for where it runs",
    body: "Ethiopian users are on mid-range Android phones and metered data. That constraint shapes bundle size, image strategy, and offline behaviour from day one, not at the end.",
  },
];

export function Approach() {
  return (
    <section aria-labelledby="approach" className="border-b border-line-soft">
      <div className="rail">
        <SectionHead id="approach" index="08" title="How I work" Icon={Lightbulb} />
        <div className="grid grid-cols-1 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <article
              key={p.index}
              className="border-b border-r border-line-soft px-4 py-8 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <span className="label label-fg">{p.index}</span>
                <span aria-hidden className="label text-dim">
                  /
                </span>
                <span className="label">{p.title}</span>
              </div>
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
