import { BarChart3, Globe, Monitor, MousePointer, Route as RouteIcon, Table2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { RankedBars, type Row } from "../../components/admin/charts/RankedBars";
import { SERIES, TimeSeries, type Point } from "../../components/admin/charts/TimeSeries";
import { EmptyState, ErrorState, Loading } from "../../components/admin/States";
import { readError } from "../../lib/adminApi";

type Bucket = Record<string, unknown>;
type Data = {
  configured: boolean;
  reason?: string;
  range?: { since: string; until: string; days: number };
  totals?: { pageviews: number; visitors: number };
  previous?: { pageviews: number; visitors: number } | null;
  comparisonAvailable?: boolean;
  derived?: {
    activeDays: number;
    viewsPerVisitor: number;
    bestDay: { date: string; pageviews: number } | null;
  };
  daily?: Point[];
  paths?: Bucket[];
  countries?: Bucket[];
  referrers?: Bucket[];
  devices?: Bucket[];
  browsers?: Bucket[];
  systems?: Bucket[];
};

const RANGES = [7, 30, 90];

const toRows = (rows: Bucket[] | undefined, key: string, fallback = "direct"): Row[] =>
  (rows ?? []).map((r) => ({
    label: String(r[key] ?? "").trim() || fallback,
    value: Number(r.pageviews ?? 0),
    visitors: Number(r.visitors ?? 0),
  }));

function Delta({ now, before }: { now: number; before: number | null }) {
  if (before === null) {
    return <span className="text-[12px] text-dim">comparison unavailable on this plan</span>;
  }
  if (before === 0) return <span className="text-[12px] text-dim">no prior data</span>;
  const pct = Math.round(((now - before) / before) * 100);
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
      <Icon size={12} strokeWidth={1.75} aria-hidden />
      {up ? "+" : ""}
      {pct}% vs previous {before}
    </span>
  );
}

function Panel({
  title,
  Icon,
  rows,
}: {
  title: string;
  Icon: typeof Globe;
  rows: Row[];
}) {
  return (
    <section className="border-b border-line-soft">
      <div className="flex items-center gap-3 border-b border-line-soft px-4 py-4 sm:px-6">
        <Icon size={14} strokeWidth={1.6} aria-hidden style={{ color: "#c07a4e" }} />
        <span className="text-[14px] font-semibold text-fg">{title}</span>
        <span className="ml-auto text-[12px] text-dim">page views</span>
      </div>
      <RankedBars rows={rows} />
    </section>
  );
}

export function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [asTable, setAsTable] = useState(false);

  const load = async (range: number) => {
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/analytics?days=${range}`, { credentials: "same-origin" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(readError(String(body.error ?? "request_failed")));
      setData(body as Data);
    } catch {
      setError(readError("network_unreachable"));
    }
  };

  useEffect(() => {
    void load(days);
  }, [days]);

  const t = data?.totals ?? { pageviews: 0, visitors: 0 };
  const p = data?.previous ?? null;
  const d = data?.derived;

  return (
    <AdminChrome
      index="ADMIN"
      title="Analytics"
      action={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAsTable((v) => !v)}
            className="label inline-flex items-center gap-2 rounded-[var(--radius)] border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:text-fg"
          >
            <Table2 size={11} strokeWidth={1.6} aria-hidden />
            {asTable ? "Charts" : "Table"}
          </button>
          <div className="flex items-stretch overflow-hidden rounded-[var(--radius)] border border-line">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDays(r)}
                className={`px-3 py-2 text-[13px] transition-colors duration-150 ${
                  r === days ? "bg-raised text-fg" : "text-muted hover:bg-raised hover:text-fg"
                } ${r !== 90 ? "border-r border-line" : ""}`}
              >
                {r}d
              </button>
            ))}
          </div>
        </div>
      }
    >
      {error ? (
        <ErrorState message={error} retry={() => load(days)} />
      ) : !data ? (
        <Loading text="Querying Vercel Web Analytics" />
      ) : !data.configured ? (
        <EmptyState title="Analytics not connected" body={data.reason ?? "Check the configuration."} />
      ) : (
        <>
          <div className="grid grid-cols-2 border-b border-line-soft lg:grid-cols-4">
            <div className="border-b border-r border-line-soft px-4 py-6 sm:px-6">
              <p className="text-[30px] font-semibold leading-none tabular-nums tracking-[-0.02em]">
                {t.pageviews}
              </p>
              <p className="label mt-3">Page views</p>
              <p className="mt-2"><Delta now={t.pageviews} before={p ? p.pageviews : null} /></p>
            </div>
            <div className="border-b border-r border-line-soft px-4 py-6 sm:px-6">
              <p className="text-[30px] font-semibold leading-none tabular-nums tracking-[-0.02em]">
                {t.visitors}
              </p>
              <p className="label mt-3">Visitors</p>
              <p className="mt-2"><Delta now={t.visitors} before={p ? p.visitors : null} /></p>
            </div>
            <div className="border-b border-r border-line-soft px-4 py-6 sm:px-6">
              <p className="text-[30px] font-semibold leading-none tabular-nums tracking-[-0.02em]">
                {d?.viewsPerVisitor ?? 0}
              </p>
              <p className="label mt-3">Views per visitor</p>
              <p className="mt-2 text-[12px] text-dim">{d?.activeDays ?? 0} days with traffic</p>
            </div>
            <div className="border-b border-r border-line-soft px-4 py-6 sm:px-6">
              <p className="text-[30px] font-semibold leading-none tabular-nums tracking-[-0.02em]">
                {d?.bestDay?.pageviews ?? 0}
              </p>
              <p className="label mt-3">Best day</p>
              <p className="mt-2 text-[12px] text-dim">
                {d?.bestDay?.date
                  ? new Date(d.bestDay.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                  : "—"}
              </p>
            </div>
          </div>

          <section className="border-b border-line-soft">
            <div className="flex flex-wrap items-center gap-4 border-b border-line-soft px-4 py-4 sm:px-6">
              <BarChart3 size={14} strokeWidth={1.6} aria-hidden style={{ color: "#c07a4e" }} />
              <span className="text-[14px] font-semibold text-fg">Traffic over time</span>
              <ul className="ml-auto flex items-center gap-4">
                {Object.values(SERIES).map((s) => (
                  <li key={s.label} className="flex items-center gap-2 text-[12px] text-muted">
                    <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
            {asTable ? (
              <div className="max-h-[320px] overflow-y-auto">
                <table className="w-full text-[13px]">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-line-soft text-left">
                      <th className="px-4 py-2 font-medium text-muted sm:px-6">Date</th>
                      <th className="px-4 py-2 text-right font-medium text-muted">Views</th>
                      <th className="px-4 py-2 text-right font-medium text-muted sm:pr-6">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.daily ?? []).map((r) => (
                      <tr key={String(r.timestamp)} className="border-b border-line-soft last:border-b-0">
                        <td className="px-4 py-2 text-fg sm:px-6">
                          {new Date(String(r.timestamp)).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-fg">{r.pageviews ?? 0}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-fg sm:pr-6">{r.visitors ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <TimeSeries data={data.daily ?? []} />
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="lg:border-r lg:border-line-soft">
              <Panel title="Pages" Icon={RouteIcon} rows={toRows(data.paths, "requestPath", "/")} />
              <Panel title="Referrers" Icon={MousePointer} rows={toRows(data.referrers, "referrerHostname")} />
              <Panel title="Browsers" Icon={Monitor} rows={toRows(data.browsers, "browserName", "unknown")} />
            </div>
            <div>
              <Panel title="Countries" Icon={Globe} rows={toRows(data.countries, "country", "unknown")} />
              <Panel title="Devices" Icon={Monitor} rows={toRows(data.devices, "deviceType", "unknown")} />
              <Panel title="Operating systems" Icon={Monitor} rows={toRows(data.systems, "osName", "unknown")} />
            </div>
          </div>

          <p className="px-4 py-4 text-[12px] text-dim sm:px-6">
            Custom events and UTM breakdowns need a Vercel Pro plan — the API returns 402 on this
            account. Hourly buckets are not offered by the API.
          </p>
        </>
      )}
    </AdminChrome>
  );
}
