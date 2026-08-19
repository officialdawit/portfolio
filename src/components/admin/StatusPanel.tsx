import { Activity } from "lucide-react";

export type Check = { name: string; ok: boolean; detail: string; ms: number };

export function StatusPanel({
  checks,
  runtime,
}: {
  checks: Check[];
  runtime: { node: string; region: string; env: string };
}) {
  const allOk = checks.every((c) => c.ok);
  const slowest = Math.max(0, ...checks.map((c) => c.ms));

  return (
    <div className="border border-line bg-card">
      <div className="flex items-center gap-2.5 border-b border-line px-3 py-2">
        <Activity size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
        <span className="label label-fg">System status</span>
        <span className="label ml-auto inline-flex items-center gap-1.5">
          <span aria-hidden className={allOk ? "h-1.5 w-1.5 bg-fg" : "h-1.5 w-1.5 border border-strong"} />
          {allOk ? "All systems normal" : "Degraded"}
        </span>
      </div>

      <ul className="divide-y divide-line-soft">
        {checks.map((c) => (
          <li key={c.name} className="flex items-center gap-3 px-3 py-2.5">
            <span aria-hidden className={c.ok ? "h-1.5 w-1.5 shrink-0 bg-fg" : "h-1.5 w-1.5 shrink-0 border border-strong"} />
            <span className="label label-fg">{c.name}</span>
            <span className="label ml-auto text-dim">{c.detail}</span>
            <span className="label w-14 shrink-0 text-right">{c.ms}ms</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-3 py-2">
        <span className="label text-dim">node {runtime.node}</span>
        <span className="label text-dim">region {runtime.region}</span>
        <span className="label text-dim">env {runtime.env}</span>
        <span className="label ml-auto text-dim">slowest {slowest}ms</span>
      </div>
    </div>
  );
}
