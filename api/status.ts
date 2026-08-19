import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "drizzle-orm";
import { currentAdmin } from "./_lib/auth";
import { db } from "./_lib/db";
import { posts, projects, sessions } from "./_lib/schema";

/** Live system health. Admin-only — counts and latency are not public. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await currentAdmin(req))) return res.status(401).json({ error: "unauthorized" });

  const checks: Array<{ name: string; ok: boolean; detail: string; ms: number }> = [];

  const timed = async (name: string, fn: () => Promise<string>) => {
    const started = Date.now();
    try {
      const detail = await fn();
      checks.push({ name, ok: true, detail, ms: Date.now() - started });
    } catch {
      checks.push({ name, ok: false, detail: "unreachable", ms: Date.now() - started });
    }
  };

  await timed("Database", async () => {
    await db.execute(sql`select 1`);
    return "connected";
  });

  await timed("Projects table", async () => {
    const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(projects);
    return `${r?.n ?? 0} rows`;
  });

  await timed("Posts table", async () => {
    const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(posts);
    return `${r?.n ?? 0} rows`;
  });

  await timed("Active sessions", async () => {
    const [r] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(sql`${sessions.expiresAt} > now()`);
    return `${r?.n ?? 0} open`;
  });

  const [pubProjects] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where published)::int`,
    })
    .from(projects);

  const [pubPosts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where published)::int`,
    })
    .from(posts);

  const byMonth = await db.execute(sql`
    select to_char(date_trunc('month', date::date), 'YYYY-MM') as month,
           count(*)::int as n
    from ${posts}
    group by 1 order by 1
  `);

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    checks,
    projects: pubProjects ?? { total: 0, published: 0 },
    posts: pubPosts ?? { total: 0, published: 0 },
    postsByMonth: (byMonth.rows ?? byMonth) as Array<{ month: string; n: number }>,
    runtime: {
      node: process.version,
      region: process.env.VERCEL_REGION ?? "local",
      env: process.env.VERCEL_ENV ?? "development",
    },
  });
}
