import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // only the hash is stored — a database leak must not yield usable tokens
    tokenHash: text("token_hash").notNull(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("sessions_token_hash_idx").on(t.tokenHash)],
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ipHash: text("ip_hash").notNull(),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("login_attempts_ip_time_idx").on(t.ipHash, t.attemptedAt)],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    position: integer("position").notNull().default(0),
    published: boolean("published").notNull().default(true),
    index: text("index").notNull(),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    headline: text("headline").notNull(),
    summary: text("summary").notNull(),
    status: text("status").notNull().default("in build"),
    url: text("url"),
    stack: jsonb("stack").$type<string[]>().notNull().default([]),
    sample: jsonb("sample")
      .$type<{ caption: string; meta: string; lang: string; code: string }>()
      .notNull(),
    detail: jsonb("detail").$type<Record<string, unknown> | null>(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("projects_slug_idx").on(t.slug)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    position: integer("position").notNull().default(0),
    published: boolean("published").notNull().default(false),
    index: text("index").notNull(),
    title: text("title").notNull(),
    standfirst: text("standfirst").notNull(),
    date: text("date").notNull(),
    reading: text("reading").notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    blocks: jsonb("blocks").$type<unknown[]>().notNull().default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug)],
);

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    about: text("about").notNull(),
    who: text("who"),
    timing: text("timing").notNull().default("not sure"),
    read: boolean("read").notNull().default(false),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("enquiries_created_idx").on(t.createdAt)],
);
