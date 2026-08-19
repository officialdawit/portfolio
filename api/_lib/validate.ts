import type { posts, projects } from "./schema.js";

type ProjectInsert = typeof projects.$inferInsert;
type PostInsert = typeof posts.$inferInsert;

type Result<T> = { ok: true; value: T } | { ok: false; issues: string[] };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isSlug = (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);

const LANGS = new Set(["ts", "bash", "sql"]);
const STATUSES = new Set(["live", "in build", "private"]);

/** Boundary validation. Nothing reaches the database without passing through here. */
export function parseProject(body: unknown): Result<ProjectInsert> {
  const b = (body ?? {}) as Record<string, unknown>;
  const issues: string[] = [];

  const slug = str(b.slug);
  const name = str(b.name);
  const headline = str(b.headline);
  const summary = str(b.summary);
  const index = str(b.index);
  const kind = str(b.kind);
  const status = str(b.status) || "in build";
  const url = str(b.url);

  if (!isSlug(slug)) issues.push("slug must be lowercase-hyphenated");
  if (name.length < 1 || name.length > 80) issues.push("name must be 1–80 characters");
  if (headline.length < 1 || headline.length > 160) issues.push("headline must be 1–160 characters");
  if (summary.length < 1 || summary.length > 1200) issues.push("summary must be 1–1200 characters");
  if (!index) issues.push("index is required");
  if (!kind) issues.push("kind is required");
  if (!STATUSES.has(status)) issues.push("status must be live, in build or private");

  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") issues.push("url must be https");
    } catch {
      issues.push("url is not a valid URL");
    }
  }

  const stack = Array.isArray(b.stack) ? b.stack.filter((s) => typeof s === "string") : [];
  if (stack.length > 12) issues.push("stack is limited to 12 entries");

  const s = (b.sample ?? {}) as Record<string, unknown>;
  const sample = {
    caption: str(s.caption),
    meta: str(s.meta),
    lang: str(s.lang),
    code: typeof s.code === "string" ? s.code : "",
  };
  if (!sample.caption) issues.push("sample.caption is required");
  if (!LANGS.has(sample.lang)) issues.push("sample.lang must be ts, bash or sql");
  if (sample.code.length > 4000) issues.push("sample.code is limited to 4000 characters");

  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    value: {
      slug, name, headline, summary, index, kind, sample,
      status: status as ProjectInsert["status"],
      url: url || null,
      stack,
      position: Number.isFinite(Number(b.position)) ? Number(b.position) : 0,
      published: b.published !== false,
      detail: (b.detail ?? null) as ProjectInsert["detail"],
    },
  };
}

export function parsePost(body: unknown): Result<PostInsert> {
  const b = (body ?? {}) as Record<string, unknown>;
  const issues: string[] = [];

  const slug = str(b.slug);
  const title = str(b.title);
  const standfirst = str(b.standfirst);
  const date = str(b.date);
  const reading = str(b.reading);
  const index = str(b.index);

  if (!isSlug(slug)) issues.push("slug must be lowercase-hyphenated");
  if (title.length < 1 || title.length > 160) issues.push("title must be 1–160 characters");
  if (standfirst.length > 400) issues.push("standfirst is limited to 400 characters");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) issues.push("date must be YYYY-MM-DD");
  if (!index) issues.push("index is required");

  const tags = Array.isArray(b.tags) ? b.tags.filter((t) => typeof t === "string") : [];
  if (tags.length > 8) issues.push("tags are limited to 8");

  const rawBlocks = Array.isArray(b.blocks) ? b.blocks : [];
  if (rawBlocks.length > 200) issues.push("blocks are limited to 200");

  const blocks = rawBlocks.filter((raw) => {
    const blk = (raw ?? {}) as Record<string, unknown>;
    const type = str(blk.type);
    if (type === "p" || type === "h" || type === "note") return typeof blk.text === "string";
    if (type === "list") return Array.isArray(blk.items);
    if (type === "code") return LANGS.has(str(blk.lang)) && typeof blk.code === "string";
    return false;
  });
  if (blocks.length !== rawBlocks.length) issues.push("one or more blocks are malformed");

  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    value: {
      slug, title, standfirst, date, reading, index, tags,
      blocks: blocks as PostInsert["blocks"],
      position: Number.isFinite(Number(b.position)) ? Number(b.position) : 0,
      published: b.published === true,
    },
  };
}
