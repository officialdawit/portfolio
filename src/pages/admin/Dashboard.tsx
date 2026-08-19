import { useEffect, useState } from "react";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { BarChart, SplitBar, StepChart } from "../../components/admin/Charts";
import { StatusPanel, type Check } from "../../components/admin/StatusPanel";
import { ErrorState, Loading } from "../../components/admin/States";
import { readError } from "../../lib/adminApi";

type Status = {
  checks: Check[];
  projects: { total: number; published: number };
  posts: { total: number; published: number };
  postsByMonth: Array<{ month: string; n: number }>;
  runtime: { node: string; region: string; env: string };
};

export function AdminDashboard() {
  const [data, setData] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/status", { credentials: "same-origin" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(readError(String(body.error ?? "request_failed")));
      setData(body as Status);
    } catch {
      setError(readError("network_unreachable"));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <AdminChrome index="ADMIN" title="Overview">
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : !data ? (
        <Loading text="Reading system status" />
      ) : (
        <>
          <div className="grid grid-cols-1 border-b border-line-soft lg:grid-cols-[1fr_420px]">
            <div className="grid grid-cols-1 border-b border-line-soft sm:grid-cols-2 lg:border-b-0 lg:border-r">
              <div className="border-b border-line-soft sm:border-r">
                <SplitBar
                  label="Projects"
                  done={data.projects.published}
                  total={data.projects.total}
                  doneText="Live"
                  restText="Hidden"
                />
              </div>
              <div className="border-b border-line-soft">
                <SplitBar
                  label="Posts"
                  done={data.posts.published}
                  total={data.posts.total}
                  doneText="Published"
                  restText="Draft"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="border-b border-line-soft px-4 py-3 sm:px-6">
                  <span className="label label-fg">Response time by check</span>
                </div>
                <BarChart
                  data={data.checks.map((c) => ({ label: c.name, value: c.ms }))}
                  unit="ms"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <StatusPanel checks={data.checks} runtime={data.runtime} />
            </div>
          </div>

          <div className="border-b border-line-soft">
            <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3 sm:px-6">
              <span className="label label-fg">Posts published per month</span>
              <span className="label ml-auto text-dim">
                {data.postsByMonth.reduce((sum, m) => sum + m.n, 0)} total
              </span>
            </div>
            <StepChart data={data.postsByMonth.map((m) => ({ label: m.month, value: m.n }))} />
          </div>
        </>
      )}
    </AdminChrome>
  );
}
