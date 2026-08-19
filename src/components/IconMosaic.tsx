import type { LucideIcon } from "lucide-react";

type Cell = { Icon: LucideIcon; name: string } | null;

/**
 * Checkerboard of icon tiles with empty cells between them.
 * The gaps are the pattern — a fully packed grid reads as a table, not a mosaic.
 */
export function IconMosaic({ cells, cols = 5 }: { cells: Cell[]; cols?: number }) {
  return (
    <div
      className="grid w-full"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((cell, i) =>
        cell ? (
          <span
            key={`${cell.name}-${i}`}
            title={cell.name}
            className="group/tile flex aspect-square items-center justify-center border border-line bg-raised text-fg transition-colors duration-150 hover:bg-fg hover:text-bg"
          >
            <cell.Icon size={18} strokeWidth={1.5} aria-hidden />
            <span className="sr-only">{cell.name}</span>
          </span>
        ) : (
          <span
            key={`empty-${i}`}
            aria-hidden
            className="aspect-square border border-line-soft/40 bg-transparent"
          />
        ),
      )}
    </div>
  );
}
