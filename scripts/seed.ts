import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hashPassword } from "../api/_lib/auth";
import { admins, posts, projects } from "../api/_lib/schema";
import { POSTS } from "../src/data/posts";
import { PROJECTS } from "../src/data/projects";
import { DETAILS } from "../src/data/details";

const url = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url) throw new Error("DATABASE_URL is required");
if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
if (password.length < 11) throw new Error("ADMIN_PASSWORD must be at least 11 characters");

// the .env.example values are public — refuse to turn them into a real account
const PLACEHOLDERS = new Set(["you@example.com", "change-this-to-something-long"]);
if (PLACEHOLDERS.has(email.trim()) || PLACEHOLDERS.has(password)) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are still the .env.example placeholders — set real values");
}

const db = drizzle(neon(url));

await db
  .insert(admins)
  .values({ email: email.toLowerCase().trim(), passwordHash: await hashPassword(password) })
  .onConflictDoNothing({ target: admins.email });

await db
  .insert(projects)
  .values(
    PROJECTS.map((p, i) => ({
      slug: p.slug,
      position: i,
      published: true,
      index: p.index,
      kind: p.kind,
      name: p.name,
      headline: p.headline,
      summary: p.summary,
      status: p.status,
      url: p.url ?? null,
      stack: p.stack,
      sample: p.sample,
      detail: (DETAILS[p.slug] ?? null) as Record<string, unknown> | null,
    })),
  )
  .onConflictDoNothing({ target: projects.slug });

await db
  .insert(posts)
  .values(
    POSTS.map((p, i) => ({
      slug: p.slug,
      position: i,
      published: true,
      index: p.index,
      title: p.title,
      standfirst: p.standfirst,
      date: p.date,
      reading: p.reading,
      tags: p.tags,
      blocks: p.blocks,
    })),
  )
  .onConflictDoNothing({ target: posts.slug });

console.log("seed complete");
