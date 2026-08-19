import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  standfirst?: string;
  Icon?: LucideIcon;
  back?: { to: string; text: string };
  meta?: Array<{ k: string; v: string }>;
};

export function PageHead({ index, eyebrow, title, standfirst, Icon, back, meta }: Props) {
  return (
    <section className="border-b border-line-soft">
      <div className="rail px-4 py-12 sm:px-6 sm:py-16">
        {back ? (
          <Link
            to={back.to}
            className="label mb-8 inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-fg"
          >
            <ChevronLeft size={12} strokeWidth={1.75} aria-hidden />
            {back.text}
          </Link>
        ) : null}

        <div className="flex items-center gap-2.5">
          <span className="label label-fg">{index}</span>
          <span aria-hidden className="label text-dim">/</span>
          {Icon ? <Icon size={12} strokeWidth={1.5} aria-hidden className="text-fg" /> : null}
          <span className="label">{eyebrow}</span>
        </div>

        <h1 className="mt-6 max-w-3xl text-[30px] font-medium leading-[1.12] tracking-[-0.02em] sm:text-[44px]">
          {title}
        </h1>

        {standfirst ? (
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">{standfirst}</p>
        ) : null}

        {meta ? (
          <dl className="mt-10 grid grid-cols-1 border-t border-line-soft sm:grid-cols-3">
            {meta.map((m, i) => (
              <div
                key={m.k}
                className={`border-b border-line-soft py-4 sm:border-b-0 sm:py-5 ${i < meta.length - 1 ? "sm:border-r sm:pr-5" : ""} ${i > 0 ? "sm:pl-5" : ""}`}
              >
                <dt className="label text-dim">{m.k}</dt>
                <dd className="label label-fg mt-2">{m.v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
