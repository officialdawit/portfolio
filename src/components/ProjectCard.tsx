import {
  ArrowUpRight, CalendarClock, Check, CreditCard, Gauge, Store, Ticket, Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "../data/projects";
import { DETAILS } from "../data/details";

const KIND_ICON: Record<string, LucideIcon> = {
  reputrack: CreditCard,
  lineup: Ticket,
  vigil: Gauge,
  "ph-performance": Trophy,
  gebeta: Store,
  meskot: CalendarClock,
};

const STATUS_TEXT: Record<Project["status"], string> = {
  live: "Live",
  "in build": "In build",
  private: "Private",
};

export function ProjectCard({ project }: { project: Project }) {
  const { index, kind, name, headline, summary, stack, url, status } = project;
  const outcomes = DETAILS[project.slug]?.outcome ?? [];
  const Icon = KIND_ICON[project.slug] ?? Check;

  return (
    <article className="group/card flex flex-col border-b border-line-soft px-4 py-8 transition-colors duration-200 hover:bg-raised/40 sm:px-6 sm:py-10 lg:[&:nth-child(odd)]:border-r">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-raised text-fg transition-colors duration-200 group-hover/card:border-strong group-hover/card:bg-fg group-hover/card:text-bg"
        >
          <Icon size={15} strokeWidth={1.5} />
        </span>
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

      {/* plain-language outcomes — the code lives on the project page, not here */}
      {outcomes.length > 0 ? (
        <ul className="mt-7 border border-line bg-card">
          {outcomes.map((line) => (
            <li
              key={line}
              className="flex items-start gap-3 border-b border-line-soft px-4 py-3 last:border-b-0"
            >
              <Check
                size={13}
                strokeWidth={1.75}
                aria-hidden
                className="mt-0.5 shrink-0 text-fg"
              />
              <span className="text-[14px] leading-relaxed text-muted">{line}</span>
            </li>
          ))}
        </ul>
      ) : null}

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
