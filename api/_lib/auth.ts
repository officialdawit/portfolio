import { and, eq, gt, lt, sql } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireDb } from "./db";
import { admins, loginAttempts, sessions } from "./schema";

const ITERATIONS = 210_000;
const SESSION_DAYS = 7;
const MAX_ATTEMPTS = 8;
const WINDOW_MINUTES = 15;
export const COOKIE = "dwp_session";

const enc = new TextEncoder();
const hex = (b: ArrayBuffer) =>
  [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
  const bits = await pbkdf2(password, salt);
  return `pbkdf2$${ITERATIONS}$${hex(salt.buffer)}$${hex(bits)}`;
}

/** Constant-time compare so a wrong password can't be timed character by character. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, iterations, saltHex, expected] = stored.split("$");
  if (scheme !== "pbkdf2" || !saltHex || !expected) return false;
  const salt = new Uint8Array(
    (saltHex.match(/.{2}/g) ?? []).map((h) => Number.parseInt(h, 16)),
  ) as Uint8Array<ArrayBuffer>;
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: Number(iterations), hash: "SHA-256" },
    key,
    256,
  );
  return safeEqual(hex(bits), expected);
}

async function sha256(value: string) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}

export async function rateLimit(req: VercelRequest) {
  const db = requireDb();
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
    "unknown";
  const ipHash = await sha256(ip);
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);

  await db.delete(loginAttempts).where(lt(loginAttempts.attemptedAt, since));

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ipHash, ipHash), gt(loginAttempts.attemptedAt, since)));

  if ((row?.count ?? 0) >= MAX_ATTEMPTS) return false;
  await db.insert(loginAttempts).values({ ipHash });
  return true;
}

export async function createSession(adminId: string, res: VercelResponse) {
  const db = requireDb();
  const token = hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await db.insert(sessions).values({ tokenHash: await sha256(token), adminId, expiresAt });

  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86_400}`,
  );
}

export async function destroySession(req: VercelRequest, res: VercelResponse) {
  const token = readCookie(req);
  if (token) {
    await requireDb().delete(sessions).where(eq(sessions.tokenHash, await sha256(token)));
  }
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

function readCookie(req: VercelRequest) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === COOKIE) return v.join("=");
  }
  return null;
}

/** Returns the admin id for a valid session, or null. Expired rows are cleaned on read. */
export async function currentAdmin(req: VercelRequest) {
  const token = readCookie(req);
  if (!token) return null;
  const db = requireDb();

  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));

  const [row] = await db
    .select({ adminId: sessions.adminId })
    .from(sessions)
    .where(
      and(eq(sessions.tokenHash, await sha256(token)), gt(sessions.expiresAt, new Date())),
    )
    .limit(1);

  return row?.adminId ?? null;
}

/** Guard for every mutating route. Returns null and responds 401 when unauthenticated. */
export async function requireAdmin(req: VercelRequest, res: VercelResponse) {
  const adminId = await currentAdmin(req);
  if (!adminId) {
    res.status(401).json({ error: "unauthorized" });
    return null;
  }
  return adminId;
}

export { admins };
