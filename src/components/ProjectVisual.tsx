import type { LucideIcon } from "lucide-react";

type Props = {
  name: string;
  kind: string;
  image?: string;
  Icon: LucideIcon;
};

/**
 * Real screenshot when one exists. Otherwise a deliberate graphic built from
 * the site's own palette — never a mocked-up fake of a product that isn't shown.
 */
export function ProjectVisual({ name, kind, image, Icon }: Props) {
  if (image) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] border border-line bg-card">
        <img
          src={image}
          alt={`${name} — ${kind}`}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover/card:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[var(--radius)] border border-line bg-card"
    >
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,242,239,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(244,242,239,.05) 1px,transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="relative flex flex-col items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] border border-line bg-raised text-accent">
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <span className="label text-dim">{kind}</span>
      </div>
    </div>
  );
}
