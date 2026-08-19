import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc } from "drizzle-orm";
import { requireAdmin } from "../_lib/auth";
import { db } from "../_lib/db";
import { projects } from "../_lib/schema";
import { parseProject } from "../_lib/validate";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const rows = await db.select().from(projects).orderBy(asc(projects.position));
      return res.status(200).json({ projects: rows });
    }

    if (req.method === "POST") {
      const parsed = parseProject(req.body);
      if (!parsed.ok) return res.status(400).json({ error: "invalid", issues: parsed.issues });
      const [row] = await db.insert(projects).values(parsed.value).returning();
      return res.status(201).json({ project: row });
    }

    return res.status(405).json({ error: "method_not_allowed" });
  } catch {
    return res.status(500).json({ error: "request_failed" });
  }
}
