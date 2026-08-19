import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDeploymentOnly } from "../_lib/target";
import { asc } from "drizzle-orm";
import { requireAdmin } from "../_lib/auth";
import { db } from "../_lib/db";
import { posts } from "../_lib/schema";
import { parsePost } from "../_lib/validate";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!adminDeploymentOnly(res)) return;
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const rows = await db.select().from(posts).orderBy(asc(posts.position));
      return res.status(200).json({ posts: rows });
    }

    if (req.method === "POST") {
      const parsed = parsePost(req.body);
      if (!parsed.ok) return res.status(400).json({ error: "invalid", issues: parsed.issues });
      const [row] = await db.insert(posts).values(parsed.value).returning();
      return res.status(201).json({ post: row });
    }

    return res.status(405).json({ error: "method_not_allowed" });
  } catch {
    return res.status(500).json({ error: "request_failed" });
  }
}
