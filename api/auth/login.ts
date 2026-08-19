import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDeploymentOnly } from "../_lib/target";
import { eq } from "drizzle-orm";
import { createSession, rateLimit, verifyPassword } from "../_lib/auth";
import { db } from "../_lib/db";
import { admins } from "../_lib/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!adminDeploymentOnly(res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!db) return res.status(503).json({ error: "database_not_configured" });

  const { email, password } = (req.body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ error: "email_and_password_required" });
  }

  try {
    if (!(await rateLimit(req))) {
      return res.status(429).json({ error: "too_many_attempts" });
    }

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()))
      .limit(1);

    // same response and roughly the same work either way — no user enumeration
    const ok = admin ? await verifyPassword(password, admin.passwordHash) : false;
    if (!admin || !ok) return res.status(401).json({ error: "invalid_credentials" });

    await createSession(admin.id, res);
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "login_failed" });
  }
}
