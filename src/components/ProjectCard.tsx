import { ArrowUpRight } from "lucide-react";
import type { Project } from "../data/projects";
import { Code } from "./Code";

const STATUS_TEXT: Record<Project["status"], string> = {
  live: "Live",
  "in build": "In build",
  private: "Private",
};

export function ProjectCard({ project }: { project: Project }) {
  const { index, kind, name, headline, summary, stack, url, status, sample } =
    project;

  return (
    <article className="flex flex-col border-b border-line-soft px-4 py-8 sm:px-6 sm:py-10 lg:[&:nth-child(odd)]:border-r">
      <div className="flex items-center gap-3">
        <span className="label label-fg">{index}</span>
        <span aria-hidden className="label text-dim">
          /
        </span>
        <span className="label">{kind}</span>
        <span className="label ml-auto inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className={
              status === "live"
                ? "h-1.5 w-1.5 bg-fg"
                : "h-1.5 w-1.5 border border-strong"
            }
          />
          {STATUS_TEXT[status]}
        </span>
      </div>

      <h3 className="mt-5 text-[21px] font-medium leading-snug tracking-[-0.01em]">
        {name}
        <span className="text-dim"> — </span>
        <span className="text-muted">{headline}</span>
      </h3>

      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
        {summary}
      </p>

      {/* the technical proof — this is what carries the card */}
      <div className="mt-7">
        <Code
          caption={sample.caption}
          meta={sample.meta}
          lang={sample.lang}
          code={sample.code}
        />
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
        {stack.map((tech) => (
          <li key={tech} className="label">
            {tech}
          </li>
        ))}
      </ul>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="label label-fg group mt-6 inline-flex w-fit items-center gap-1.5 border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
        >
          Visit {name}
          <ArrowUpRight
            size={12}
            strokeWidth={1.75}
            aria-hidden
            className="transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px"
          />
        </a>
      ) : (
        <span className="label mt-6 inline-flex w-fit border border-line-soft px-3 py-2 text-dim">
          Walkthrough on request
        </span>
      )}
    </article>
  );
}
