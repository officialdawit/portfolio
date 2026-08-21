import { Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../data/projects";
import { DETAILS } from "../data/details";
import { PageHead } from "../components/PageHead";
import { Reveal } from "../components/Reveal";
import { useMeta } from "../lib/useMeta";

export function WorkIndex() {
  useMeta({
    title: "Work",
    description:
      "Six shipped products — review management, event waitlists, uptime monitoring, youth sports, restaurant operations and scheduling.",
    path: "/work",
  });

  return (
    <>
      <PageHead
        index="W"
        eyebrow="Work"
        title="Six products, shipped and running."
        standfirst="Each one has a write-up: the problem, the decisions that mattered, and what it cost to get wrong."
        Icon={Boxes}
      />
      <section className="border-b border-line-soft">
        <div className="rail">
          {PROJECTS.map((p, i) => {
            const d = DETAILS[p.slug];
            return (
              <Reveal key={p.slug} delay={i * 50}>
                <Link
                  to={`/work/${p.slug}`}
                  className="group grid grid-cols-1 items-center gap-4 border-b border-line-soft px-4 py-6 transition-colors duration-150 hover:bg-raised sm:px-6 lg:grid-cols-[80px_1fr_180px_120px]"
                >
                  <span className="label label-fg">{p.index}</span>
                  <span className="flex flex-col gap-2">
                    <span className="text-[19px] font-medium tracking-[-0.01em]">{p.name}</span>
                    <span className="label">{p.headline}</span>
                  </span>
                  <span className="label hidden lg:block">{d?.year ?? ""}</span>
                  <span className="label label-fg inline-flex items-center gap-2 lg:justify-end">
                    Read
                    <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
