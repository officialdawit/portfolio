import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc, eq } from "drizzle-orm";
import { db } from "../api/_lib/db";
import { posts, projects } from "../api/_lib/schema";

/** Public read. Returns 204 when unconfigured so the client keeps its seed data. */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!db) return res.status(204).end();

  try {
    const [projectRows, postRows] = await Promise.all([
      db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.position)),
      db.select().from(posts).where(eq(posts.published, true)).orderBy(asc(posts.position)),
    ]);

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
    return res.status(200).json({ projects: projectRows, posts: postRows });
  } catch {
    return res.status(500).json({ error: "content_unavailable" });
  }
}
