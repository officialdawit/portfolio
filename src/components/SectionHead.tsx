import type { LucideIcon } from "lucide-react";

type Props = {
  index: string;
  title: string;
  id?: string;
  Icon?: LucideIcon;
  action?: { text: string; href: string };
};

export function SectionHead({ index, title, id, Icon, action }: Props) {
  return (
    <div
      id={id}
      className="flex items-center gap-3 border-b border-line-soft px-4 py-3 sm:px-6"
    >
      <span className="label label-fg">{index}</span>
      <span aria-hidden className="label text-dim">
        /
      </span>
      {Icon ? (
        <Icon size={13} strokeWidth={1.5} aria-hidden className="text-fg" />
      ) : null}
      <h2 className="label label-fg">{title}</h2>
      {action ? (
        <a
          href={action.href}
          className="label ml-auto transition-colors duration-150 hover:text-fg"
        >
          {action.text} →
        </a>
      ) : null}
    </div>
  );
}

/** Inline label with a leading icon — the `02.1 / ⛬ ROUTING` rhythm. */
export function MetaLabel({
  index,
  text,
  Icon,
}: {
  index: string;
  text: string;
  Icon?: LucideIcon;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="label label-fg">{index}</span>
      <span aria-hidden className="label text-dim">
        /
      </span>
      {Icon ? (
        <Icon size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
      ) : null}
      <span className="label">{text}</span>
    </span>
  );
}
