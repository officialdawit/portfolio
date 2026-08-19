import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDeploymentOnly } from "../_lib/target.js";
import { currentAdmin } from "../_lib/auth.js";
import { db } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!adminDeploymentOnly(res)) return;
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  try {
    const adminId = await currentAdmin(req);
    return res.status(200).json({ authenticated: Boolean(adminId) });
  } catch {
    return res.status(500).json({ error: "session_check_failed" });
  }
}
