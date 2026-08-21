import { ArrowUpRight, CheckCircle2, Boxes } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Code } from "../components/Code";
import { PageHead } from "../components/PageHead";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { DETAILS } from "../data/details";
import { PROJECTS } from "../data/projects";
import { NotFound } from "./NotFound";
import { useMeta } from "../lib/useMeta";

export function WorkDetail() {
  const { slug = "" } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  const detail = DETAILS[slug];

  useMeta({
    title: project ? `${project.name} — ${project.kind}` : "Work",
    description: project?.summary.slice(0, 180) ?? "A shipped product.",
    path: `/work/${slug}`,
  });

  if (!project) return <NotFound />;

  const others = PROJECTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHead
        index={project.index}
        eyebrow={project.kind}
        title={project.headline}
        standfirst={project.summary}
        Icon={Boxes}
        back={{ to: "/work", text: "All work" }}
        meta={[
          { k: "Role", v: detail?.role ?? "Solo \u2014 design, build, deploy" },
          { k: "Timeline", v: detail?.timeline ?? "Shipped" },
          { k: "Status", v: project.status === "live" ? "Live" : "In build" },
        ]}
      />

      {detail ? (
        <>
      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="01" title="The problem" />
          <div className="px-4 py-8 sm:px-6">
            <p className="max-w-2xl text-[17px] leading-relaxed text-muted">{detail.problem}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="02" title="Decisions that mattered" />
          {detail.decisions.map((d, i) => (
            <Reveal key={d.title} delay={i * 60}>
              <article className="border-b border-line-soft px-4 py-7 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="label label-fg">02.{i + 1}</span>
                  <span aria-hidden className="label text-dim">/</span>
                  <h3 className="label label-fg">{d.title}</h3>
                </div>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{d.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="03" title="In the codebase" />
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b border-line-soft p-4 sm:p-6 lg:border-b-0 lg:border-r">
              <Code {...project.sample} />
            </div>
            <div className="p-4 sm:p-6">
              <Code {...detail.extra} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="04" title="Outcome" />
          <ul className="px-4 py-6 sm:px-6">
            {detail.outcome.map((o) => (
              <li key={o} className="flex items-start gap-3 border-b border-line-soft py-3.5 last:border-b-0">
                <CheckCircle2 size={14} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-fg" />
                <span className="text-[15px] leading-relaxed text-muted">{o}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 border-t border-line-soft px-4 py-6 sm:px-6">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label label-fg inline-flex items-center gap-1.5 border border-line px-4 py-3 transition-colors duration-150 hover:border-strong hover:bg-raised"
              >
                Visit {project.name}
                <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden />
              </a>
            ) : null}
            <a
              href="mailto:officialdawitworku@gmail.com"
              className="label inline-flex items-center gap-1.5 border border-line px-4 py-3 transition-colors duration-150 hover:border-strong hover:text-fg"
            >
              Ask me about this build
            </a>
          </div>
        </div>
      </section>

        </>
      ) : (
        <section className="border-b border-line-soft">
          <div className="rail py-14 sm:py-20">
            <p className="max-w-xl text-[17px] leading-relaxed text-muted">
              A longer write-up of this one is still to come. In the meantime it
              is live, so the quickest way to judge it is to open it.
            </p>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-[var(--radius)] bg-fg px-5 py-3 text-[15px] font-medium text-bg transition-opacity duration-150 hover:opacity-88"
              >
                Open {project.name}
                <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
              </a>
            ) : null}
          </div>
        </section>
      )}

      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="05" title="More work" />
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/work/${o.slug}`}
                className="group border-b border-r border-line-soft px-4 py-6 transition-colors duration-150 hover:bg-raised sm:px-6"
              >
                <span className="label label-fg">{o.index}</span>
                <p className="mt-3 text-[17px] font-medium tracking-[-0.01em]">{o.name}</p>
                <p className="label mt-2">{o.kind}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
