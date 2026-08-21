import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDeploymentOnly } from "./_lib/target.js";
import { currentAdmin } from "./_lib/auth.js";
import { db } from "./_lib/db.js";

const BASE = "https://api.cal.com/v1";

/**
 * Admin-only proxy for the Cal.com API. The key is read server-side and never
 * reaches the browser — an exposed Cal key lets anyone read and cancel
 * bookings on the account.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!adminDeploymentOnly(res)) return;
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await currentAdmin(req))) return res.status(401).json({ error: "unauthorized" });

  const key = process.env.CAL_API_KEY;
  if (!key) {
    return res.status(200).json({
      configured: false,
      reason: "Set CAL_API_KEY to manage bookings and event types here.",
    });
  }

  const call = async (path: string) => {
    const r = await fetch(`${BASE}${path}${path.includes("?") ? "&" : "?"}apiKey=${key}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  };

  try {
    if (req.method === "DELETE") {
      const id = String(req.query.id ?? "");
      if (!/^\d+$/.test(id)) return res.status(400).json({ error: "invalid_id" });
      const r = await fetch(`${BASE}/bookings/${id}?apiKey=${key}`, { method: "DELETE" });
      if (!r.ok) return res.status(502).json({ error: "cancel_failed" });
      return res.status(200).json({ ok: true });
    }

    const [bookings, eventTypes, me] = await Promise.all([
      call("/bookings"),
      call("/event-types"),
      call("/me"),
    ]);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      configured: true,
      user: me?.user ?? null,
      bookings: bookings?.bookings ?? [],
      eventTypes: eventTypes?.event_types ?? [],
    });
  } catch (error) {
    const status = String(error instanceof Error ? error.message : "");
    if (status === "401" || status === "403") {
      return res.status(200).json({
        configured: false,
        reason: "Cal.com rejected the key. Check it is valid and has read access.",
      });
    }
    return res.status(502).json({ error: "cal_upstream_failed" });
  }
}
