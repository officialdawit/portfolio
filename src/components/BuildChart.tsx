import { Activity } from "lucide-react";
import { useReveal } from "../lib/useReveal";
import { SectionHead } from "./SectionHead";

/** Measured gzip output of this project's own builds, in order, this session. */
const PASSES = [
  { label: "BASE PAGE", js: 66.2, css: 4.3 },
  { label: "CODE FIGURES", js: 69.8, css: 4.7 },
  { label: "PALETTE + GRIDS", js: 75.6, css: 5.2 },
  { label: "ROUTES + BLOG", js: 120.3, css: 5.6 },
  { label: "ADMIN + API", js: 126.0, css: 5.8 },
];

const MAX = 130;
const W = 720;
const H = 190;
const PAD = { l: 8, r: 8, t: 16, b: 8 };

const x = (i: number) =>
  PAD.l + (i / (PASSES.length - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - v / MAX) * (H - PAD.t - PAD.b);

const line = (key: "js" | "css") =>
  PASSES.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[key])}`).join(" ");

export function BuildChart() {
  const { ref, shown } = useReveal<HTMLDivElement>(80);

  return (
    <section aria-labelledby="build" className="border-b border-line-soft">
      <div className="rail py-14 sm:py-20">
        <SectionHead id="build" title="What this page costs" Icon={Activity} />

        <div className="px-4 py-8 sm:px-6">
          <p className="max-w-2xl text-[19px] font-medium leading-snug tracking-[-0.01em] sm:text-[22px]">
            Every feature on this page was measured as it landed.{" "}
            <span className="text-muted">
              Gzipped transfer size across five build passes, no estimates. The
            biggest jump is react-router — 43 kB for real routing.
            </span>
          </p>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <li className="label inline-flex items-center gap-2">
              <span aria-hidden className="h-px w-6 bg-fg" />
              JAVASCRIPT
            </li>
            <li className="label inline-flex items-center gap-2">
              <span aria-hidden className="h-px w-6 border-t border-dashed border-muted" />
              CSS
            </li>
            <li className="label ml-auto text-dim">KB, GZIPPED</li>
          </ul>
        </div>

        <div ref={ref} className="border-t border-line-soft px-4 py-6 sm:px-6">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Bundle size across five build passes: 66.2, 69.8, 75.6, 120.3 and 126.0 kB of JavaScript"
          >
            {[0, 32.5, 65, 97.5, 130].map((v) => (
              <line
                key={v}
                x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
            ))}
            {PASSES.map((_, i) => (
              <line
                key={i}
                x1={x(i)} x2={x(i)} y1={PAD.t} y2={H - PAD.b}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
            ))}

            <path
              d={line("css")} fill="none" stroke="#8c8c8c" strokeWidth="1.25"
              strokeDasharray="4 3"
              style={{
                strokeDashoffset: shown ? 0 : 900,
                strokeDasharray: shown ? "4 3" : "900",
                transition: "stroke-dashoffset 900ms ease-out, stroke-dasharray 0ms 900ms",
              }}
            />
            <path
              d={line("js")} fill="none" stroke="#fafaf9" strokeWidth="1.5"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: shown ? 0 : 1,
                transition: "stroke-dashoffset 900ms ease-out",
              }}
            />
            {PASSES.map((p, i) => (
              <circle
                key={p.label}
                cx={x(i)} cy={y(p.js)} r="3"
                fill="#000" stroke="#fafaf9" strokeWidth="1.25"
                style={{ opacity: shown ? 1 : 0, transition: `opacity 240ms ease-out ${500 + i * 90}ms` }}
              />
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 border-t border-line-soft lg:grid-cols-5">
          {PASSES.map((p) => (
            <div
              key={p.label}
              className="border-b border-r border-line-soft px-4 py-5 sm:px-6"
            >
              <p className="flex items-baseline gap-1.5">
                <span className="text-[22px] font-medium leading-none tracking-[-0.02em]">
                  {p.js}
                </span>
                <span className="label label-fg">kB js</span>
              </p>
              <p className="label mt-2 text-dim">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
