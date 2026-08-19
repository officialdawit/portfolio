import type { VercelRequest, VercelResponse } from "@vercel/node";
import { destroySession } from "../_lib/auth";
import { db } from "../_lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  try {
    await destroySession(req, res);
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "logout_failed" });
  }
}
