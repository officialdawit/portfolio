type Bar = { label: string; value: number };

/** Horizontal bars. Values are absolute; the widest sets the scale. */
export function BarChart({ data, unit = "" }: { data: Bar[]; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex flex-col">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-4 border-b border-line-soft px-4 py-3 last:border-b-0 sm:px-6">
          <span className="label w-28 shrink-0 truncate">{d.label}</span>
          <span className="relative h-3 min-w-0 flex-1 border border-line-soft">
            <span
              className="absolute inset-y-0 left-0 bg-fg/80 transition-[width] duration-500 ease-out"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </span>
          <span className="label label-fg w-16 shrink-0 text-right">
            {d.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Two-part split, rendered as one segmented bar rather than a pie. */
export function SplitBar({
  label,
  done,
  total,
  doneText,
  restText,
}: {
  label: string;
  done: number;
  total: number;
  doneText: string;
  restText: string;
}) {
  const pct = total === 0 ? 0 : (done / total) * 100;

  return (
    <div className="flex flex-col gap-3 px-4 py-5 sm:px-6">
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-medium leading-none tracking-[-0.02em]">{done}</span>
        <span className="label text-dim">/ {total}</span>
        <span className="label ml-auto">{label}</span>
      </div>
      <div className="flex h-3 w-full border border-line-soft">
        <span className="bg-fg/80 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-4">
        <span className="label inline-flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 bg-fg" />
          {doneText} {done}
        </span>
        <span className="label inline-flex items-center gap-2 text-dim">
          <span aria-hidden className="h-1.5 w-1.5 border border-strong" />
          {restText} {total - done}
        </span>
      </div>
    </div>
  );
}

/** Step line over time. One point per bucket, labels beneath. */
export function StepChart({ data }: { data: Bar[] }) {
  if (data.length === 0) {
    return <p className="label px-4 py-8 text-center text-dim sm:px-6">No dated content yet</p>;
  }

  const W = 720;
  const H = 74; // ~9.7:1 renders near 130px tall at full rail width, circles stay round
  const PAD = 8;
  const max = Math.max(1, ...data.map((d) => d.value));
  const x = (i: number) =>
    data.length === 1 ? W / 2 : PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - v / max) * (H - PAD * 2);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");

  return (
    <div className="px-4 py-5 sm:px-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Posts published per month"
      >
        {[0, 0.5, 1].map((f) => (
          <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)} stroke="rgba(255,255,255,0.06)" />
        ))}
        <path d={path} fill="none" stroke="#fafaf9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={d.label} cx={x(i)} cy={y(d.value)} r="3" fill="#000" stroke="#fafaf9" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-3 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="label text-dim">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
