import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../_lib/auth";
import { db } from "../_lib/db";
import { projects } from "../_lib/schema";
import { parseProject } from "../_lib/validate";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await requireAdmin(req, res))) return;

  const id = String(req.query.id ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "invalid_id" });

  try {
    if (req.method === "PUT") {
      const parsed = parseProject(req.body);
      if (!parsed.ok) return res.status(400).json({ error: "invalid", issues: parsed.issues });
      const [row] = await db
        .update(projects)
        .set({ ...parsed.value, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      if (!row) return res.status(404).json({ error: "not_found" });
      return res.status(200).json({ project: row });
    }

    if (req.method === "DELETE") {
      const [row] = await db.delete(projects).where(eq(projects.id, id)).returning();
      if (!row) return res.status(404).json({ error: "not_found" });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method_not_allowed" });
  } catch {
    return res.status(500).json({ error: "request_failed" });
  }
}
