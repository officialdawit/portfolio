import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDeploymentOnly } from "./_lib/target.js";
import { currentAdmin } from "./_lib/auth.js";
import { db } from "./_lib/db.js";

const BASE = "https://api.vercel.com/v1/query/web-analytics";

type Aggregate = { data?: Array<Record<string, unknown>> };

/**
 * Admin-only proxy for Vercel Web Analytics.
 * The token is read server-side and never reaches the client bundle.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!adminDeploymentOnly(res)) return;
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await currentAdmin(req))) return res.status(401).json({ error: "unauthorized" });

  // Vercel reserves the VERCEL_ prefix and injects its own values at runtime,
  // which silently overwrote these with the admin project's id in production.
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.ANALYTICS_PROJECT_ID;
  const teamId = process.env.ANALYTICS_TEAM_ID;

  if (!token || !projectId) {
    return res.status(200).json({
      configured: false,
      reason: "Set VERCEL_TOKEN and ANALYTICS_PROJECT_ID to enable analytics.",
    });
  }

  const days = Math.min(90, Math.max(1, Number(req.query.days ?? 30)));
  const until = new Date();
  const since = new Date(until.getTime() - days * 86_400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const prevUntil = new Date(since.getTime() - 86_400_000);
  const prevSince = new Date(prevUntil.getTime() - days * 86_400_000);

  const query = (by: string, limit?: number, window?: { a: Date; b: Date }) => {
    const w = window ?? { a: since, b: until };
    const params = new URLSearchParams({
      projectId,
      since: iso(w.a),
      until: iso(w.b),
      by,
    });
    if (teamId) params.set("teamId", teamId);
    if (limit) params.set("limit", String(limit));
    return `${BASE}/visits/aggregate?${params.toString()}`;
  };

  const fetchOne = async (url: string): Promise<Aggregate> => {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()) as Aggregate;
  };

  try {
    // events and utm are 402 on this plan; hour is 400 — deliberately not requested
    const [daily, paths, countries, referrers, devices, browsers, systems, prevDaily] =
      await Promise.all([
        fetchOne(query("day")),
        fetchOne(query("requestPath", 10)),
        fetchOne(query("country", 8)),
        fetchOne(query("referrerHostname", 8)),
        fetchOne(query("deviceType", 4)),
        fetchOne(query("browserName", 6)),
        fetchOne(query("osName", 6)),
        // optional: the plan's retention window may reject this range
        fetchOne(query("day", undefined, { a: prevSince, b: prevUntil })).catch(
          () => ({ data: [] as Array<Record<string, unknown>> }),
        ),
      ]);

    const sum = (rows: Array<Record<string, unknown>> | undefined) =>
      (rows ?? []).reduce<{ pageviews: number; visitors: number }>(
        (acc, row) => ({
          pageviews: acc.pageviews + Number(row.pageviews ?? 0),
          visitors: acc.visitors + Number(row.visitors ?? 0),
        }),
        { pageviews: 0, visitors: 0 },
      );

    const totals = sum(daily.data);
    const prevRows = prevDaily.data ?? [];
    const previous = prevRows.length > 0 ? sum(prevRows) : null;
    const activeDays = (daily.data ?? []).filter((r) => Number(r.pageviews ?? 0) > 0).length;
    const best = [...(daily.data ?? [])].sort(
      (a, b) => Number(b.pageviews ?? 0) - Number(a.pageviews ?? 0),
    )[0];

    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).json({
      configured: true,
      range: { since: iso(since), until: iso(until), days },
      totals,
      previous,
      comparisonAvailable: prevRows.length > 0,
      derived: {
        activeDays,
        viewsPerVisitor: totals.visitors > 0 ? +(totals.pageviews / totals.visitors).toFixed(1) : 0,
        bestDay: best ? { date: String(best.timestamp ?? ""), pageviews: Number(best.pageviews ?? 0) } : null,
      },
      daily: daily.data ?? [],
      paths: paths.data ?? [],
      countries: countries.data ?? [],
      referrers: referrers.data ?? [],
      devices: devices.data ?? [],
      browsers: browsers.data ?? [],
      systems: systems.data ?? [],
    });
  } catch (error) {
    const status = String(error instanceof Error ? error.message : "");
    if (status === "403" || status === "401") {
      return res.status(200).json({
        configured: false,
        reason: "Vercel rejected the token. Check VERCEL_TOKEN scope and team access.",
      });
    }
    if (status === "400") {
      return res.status(200).json({
        configured: false,
        reason:
          "Vercel rejected the query — usually Web Analytics not enabled on the project, or a date range beyond the plan's retention window.",
      });
    }
    if (status === "404") {
      return res.status(200).json({
        configured: false,
        reason: "Project not found, or Web Analytics is not enabled for it yet.",
      });
    }
    return res.status(502).json({ error: "analytics_upstream_failed" });
  }
}
