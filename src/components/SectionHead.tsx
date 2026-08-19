import type { LucideIcon } from "lucide-react";

type Props = {
  index?: string;
  title: string;
  id?: string;
  Icon?: LucideIcon;
  action?: { text: string; href: string };
};

/** Editorial section heading — a title, not a numbered index. */
export function SectionHead({ title, id, Icon, action }: Props) {
  return (
    <div
      id={id}
      className="flex items-center gap-3 border-b border-line-soft py-5"
    >
      {Icon ? (
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-line bg-card text-accent"
        >
          <Icon size={14} strokeWidth={1.75} />
        </span>
      ) : null}
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h2>
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

export function MetaLabel({
  text,
  Icon,
}: {
  index?: string;
  text: string;
  Icon?: LucideIcon;
}) {
  return (
    <span className="flex items-center gap-2">
      {Icon ? <Icon size={13} strokeWidth={1.6} aria-hidden className="text-accent" /> : null}
      <span className="label">{text}</span>
    </span>
  );
}
