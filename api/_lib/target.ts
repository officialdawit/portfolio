import type { VercelResponse } from "@vercel/node";

/**
 * Admin routes exist in both deployments' filesystem, but only respond on the
 * admin one. On the public deployment they are indistinguishable from a route
 * that was never written.
 */
export function adminDeploymentOnly(res: VercelResponse): boolean {
  if (process.env.APP_TARGET === "admin") return true;
  res.status(404).json({ error: "not_found" });
  return false;
}
