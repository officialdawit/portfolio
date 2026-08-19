import { BarChart3, Globe, MonitorSmartphone, Route as RouteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { BarChart, StepChart } from "../../components/admin/Charts";
import { EmptyState, ErrorState, Loading } from "../../components/admin/States";
import { readError } from "../../lib/adminApi";

type Row = Record<string, unknown>;
type Data = {
  configured: boolean;
  reason?: string;
  range?: { since: string; until: string; days: number };
  totals?: { pageviews: number; visitors: number };
  daily?: Row[];
  routes?: Row[];
  countries?: Row[];
  referrers?: Row[];
  devices?: Row[];
};

const RANGES = [7, 30, 90];

const toBars = (rows: Row[] | undefined, key: string) =>
  (rows ?? []).map((r) => ({
    label: String(r[key] ?? "unknown") || "direct",
    value: Number(r.pageviews ?? 0),
  }));

export function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <AdminChrome
      index="ADMIN"
      title="Analytics"
      action={
        <div className="flex items-stretch border border-line">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              className={`label px-3 py-1.5 transition-colors duration-100 ${
                r === days ? "label-fg bg-raised" : "hover:bg-raised hover:text-fg"
              } ${r !== 90 ? "border-r border-line" : ""}`}
            >
              {r}d
            </button>
          ))}
        </div>
      }
    >
      {error ? (
        <ErrorState message={error} retry={() => load(days)} />
      ) : !data ? (
        <Loading text="Querying Vercel Web Analytics" />
      ) : !data.configured ? (
        <EmptyState
          title="Analytics not connected"
          body={data.reason ?? "Set VERCEL_TOKEN and VERCEL_PROJECT_ID, then enable Web Analytics on the project."}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 border-b border-line-soft lg:grid-cols-4">
            {[
              { k: "Page views", v: data.totals?.pageviews ?? 0 },
              { k: "Visitors", v: data.totals?.visitors ?? 0 },
              { k: "Window", v: `${data.range?.days ?? days}d` },
              { k: "Since", v: data.range?.since ?? "—" },
            ].map((s) => (
              <div key={s.k} className="border-b border-r border-line-soft px-4 py-6 sm:px-6">
                <p className="text-[26px] font-medium leading-none tracking-[-0.02em]">{s.v}</p>
                <p className="label mt-3">{s.k}</p>
              </div>
            ))}
          </div>

          <div className="border-b border-line-soft">
            <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3 sm:px-6">
              <BarChart3 size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
              <span className="label label-fg">Page views per day</span>
            </div>
            {(data.daily ?? []).length === 0 ? (
              <p className="label px-4 py-10 text-center text-dim sm:px-6">
                No traffic recorded in this window yet
              </p>
            ) : (
              <StepChart
                data={(data.daily ?? []).map((d) => ({
                  label: String(d.timestamp ?? "").slice(5, 10),
                  value: Number(d.pageviews ?? 0),
                }))}
              />
            )}
          </div>

          <div className="grid grid-cols-1 border-b border-line-soft lg:grid-cols-2">
            {[
              { title: "Top routes", Icon: RouteIcon, rows: toBars(data.routes, "route") },
              { title: "Countries", Icon: Globe, rows: toBars(data.countries, "country") },
              { title: "Referrers", Icon: BarChart3, rows: toBars(data.referrers, "referrerHostname") },
              { title: "Devices", Icon: MonitorSmartphone, rows: toBars(data.devices, "deviceType") },
            ].map((panel, i) => (
              <section
                key={panel.title}
                className={`border-b border-line-soft ${i % 2 === 0 ? "lg:border-r" : ""}`}
              >
                <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3 sm:px-6">
                  <panel.Icon size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
                  <span className="label label-fg">{panel.title}</span>
                </div>
                {panel.rows.length === 0 ? (
                  <p className="label px-4 py-8 text-center text-dim sm:px-6">No data yet</p>
                ) : (
                  <BarChart data={panel.rows} />
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </AdminChrome>
  );
}
