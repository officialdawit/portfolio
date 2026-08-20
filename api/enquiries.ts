import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { currentAdmin } from "./_lib/auth.js";
import { db } from "./_lib/db.js";
import { enquiries } from "./_lib/schema.js";

const TIMINGS = new Set(["as soon as possible", "next few months", "just exploring", "not sure"]);
const MAX_PER_WINDOW = 3;
const WINDOW_HOURS = 1;

const enc = new TextEncoder();
const hex = (b: ArrayBuffer) =>
  [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

async function hashIp(req: VercelRequest) {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? "unknown";
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(ip)));
}

/** Public submit, admin read. Deliberately not gated to the admin deployment. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  const conn = db;

  if (req.method === "GET") {
    if (!(await currentAdmin(req))) return res.status(401).json({ error: "unauthorized" });
    const rows = await conn.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(200);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ enquiries: rows });
  }

  if (req.method === "PATCH") {
    if (!(await currentAdmin(req))) return res.status(401).json({ error: "unauthorized" });
    const id = String((req.body as Record<string, unknown>)?.id ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "invalid_id" });
    const [row] = await conn
      .update(enquiries)
      .set({ read: true })
      .where(eq(enquiries.id, id))
      .returning();
    if (!row) return res.status(404).json({ error: "not_found" });
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const b = (req.body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const email = str(b.email);
  const about = str(b.about);
  const who = str(b.who);
  const timing = str(b.timing) || "not sure";

  const issues: string[] = [];
  if (name.length < 1 || name.length > 100) issues.push("Please add your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200)
    issues.push("That email address doesn't look right.");
  if (about.length < 10) issues.push("Please say a little more about what you need.");
  if (about.length > 4000) issues.push("That's a bit long — 4000 characters max.");
  if (who.length > 200) issues.push("Keep 'who it's for' under 200 characters.");
  if (!TIMINGS.has(timing)) issues.push("Pick one of the listed timings.");
  // honeypot: real people never fill a hidden field
  if (str(b.company)) return res.status(200).json({ ok: true });

  if (issues.length > 0) return res.status(400).json({ error: "invalid", issues });

  try {
    const ipHash = await hashIp(req);
    const since = new Date(Date.now() - WINDOW_HOURS * 3_600_000);
    const [recent] = await conn
      .select({ n: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(and(eq(enquiries.ipHash, ipHash), gt(enquiries.createdAt, since)));

    if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
      return res.status(429).json({ error: "too_many", issues: ["You've sent a few already — try again in an hour."] });
    }

    await conn.insert(enquiries).values({ name, email, about, who: who || null, timing, ipHash });
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "send_failed" });
  }
}
