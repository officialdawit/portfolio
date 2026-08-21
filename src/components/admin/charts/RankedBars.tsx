import { useState } from "react";

export type Row = { label: string; value: number; visitors?: number };

/**
 * One series per panel, so no legend is needed — the panel title names it.
 * Bars carry a 4px rounded data-end and sit on a recessive track.
 */
export function RankedBars({ rows, unit = "views" }: { rows: Row[]; unit?: string }) {
  const [hover, setHover] = useState<string | null>(null);

  if (rows.length === 0) {
    return <p className="label px-4 py-10 text-center text-dim sm:px-6">No data yet</p>;
  }

  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((a, r) => a + r.value, 0);

  return (
    <ul className="flex flex-col">
      {rows.map((r) => {
        const pct = (r.value / max) * 100;
        const share = total > 0 ? Math.round((r.value / total) * 100) : 0;
        return (
          <li
            key={r.label}
            onMouseEnter={() => setHover(r.label)}
            onMouseLeave={() => setHover(null)}
            className="relative flex items-center gap-4 border-b border-line-soft px-4 py-3 last:border-b-0 sm:px-6"
          >
            <span className="w-40 shrink-0 truncate text-[13px] text-fg" title={r.label}>
              {r.label}
            </span>
            <span className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-raised">
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%`, background: "#c07a4e" }}
              />
            </span>
            <span className="w-16 shrink-0 text-right text-[13px] font-medium tabular-nums text-fg">
              {r.value}
            </span>
            <span className="hidden w-12 shrink-0 text-right text-[12px] tabular-nums text-dim sm:block">
              {share}%
            </span>
            {hover === r.label ? (
              <span className="pointer-events-none absolute right-6 top-full z-10 -translate-y-1 rounded-[var(--radius)] border border-line bg-card px-2.5 py-1.5 text-[12px] text-fg">
                {r.value} {unit}
                {typeof r.visitors === "number" ? ` · ${r.visitors} visitors` : ""}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
