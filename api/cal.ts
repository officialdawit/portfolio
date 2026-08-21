import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDeploymentOnly } from "./_lib/target.js";
import { currentAdmin } from "./_lib/auth.js";
import { db } from "./_lib/db.js";

const BASE = "https://api.cal.com/v2";
/** v2 pins breaking changes to a date. Bookings needs this explicitly. */
const BOOKINGS_VERSION = "2024-08-13";

type EventType = {
  id: number;
  slug: string;
  title: string;
  lengthInMinutes?: number;
  length?: number;
  hidden?: boolean;
};

/**
 * Admin-only Cal.com proxy. v1 was decommissioned — it answers 410 — so this
 * speaks v2, which authenticates with a bearer token rather than a query param.
 * The key never reaches the browser.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!adminDeploymentOnly(res)) return;
  if (!db) return res.status(503).json({ error: "database_not_configured" });
  if (!(await currentAdmin(req))) return res.status(401).json({ error: "unauthorized" });

  const key = process.env.CAL_API_KEY;
  if (!key) {
    return res.status(200).json({
      configured: false,
      reason: "Set CAL_API_KEY to manage bookings here.",
    });
  }

  const auth = { Authorization: `Bearer ${key}` };

  const get = async (path: string, extra: Record<string, string> = {}) => {
    const r = await fetch(`${BASE}${path}`, { headers: { ...auth, ...extra } });
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  };

  try {
    if (req.method === "POST" && req.query.cancel) {
      const uid = String(req.query.cancel);
      if (!/^[\w-]{1,64}$/.test(uid)) return res.status(400).json({ error: "invalid_uid" });
      const r = await fetch(`${BASE}/bookings/${uid}/cancel`, {
        method: "POST",
        headers: { ...auth, "cal-api-version": BOOKINGS_VERSION, "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationReason: "Cancelled from admin" }),
      });
      if (!r.ok) return res.status(502).json({ error: "cancel_failed" });
      return res.status(200).json({ ok: true });
    }

    const [me, types, bookings] = await Promise.all([
      get("/me"),
      get("/event-types"),
      get("/bookings", { "cal-api-version": BOOKINGS_VERSION }),
    ]);

    const user = me?.data ?? {};
    const groups = types?.data?.eventTypeGroups ?? [];
    const eventTypes: EventType[] = groups.flatMap(
      (g: { eventTypes?: EventType[] }) => g.eventTypes ?? [],
    );
    const bookerUrl: string = groups[0]?.bookerUrl ?? "https://cal.com";

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      configured: true,
      user: {
        username: user.username ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        timeZone: user.timeZone ?? null,
      },
      bookerUrl,
      eventTypes: eventTypes.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        length: e.lengthInMinutes ?? e.length ?? 0,
        hidden: Boolean(e.hidden),
        url: `${bookerUrl}/${user.username}/${e.slug}`,
      })),
      bookings: bookings?.data ?? [],
    });
  } catch (error) {
    const status = String(error instanceof Error ? error.message : "");
    if (status === "401" || status === "403") {
      return res.status(200).json({
        configured: false,
        reason: "Cal.com rejected the key. Check it is valid and not revoked.",
      });
    }
    if (status === "410") {
      return res.status(200).json({
        configured: false,
        reason: "Cal.com retired this API version. The proxy needs updating.",
      });
    }
    return res.status(502).json({ error: "cal_upstream_failed" });
  }
}
