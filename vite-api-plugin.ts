import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * Mounts api/**\/*.ts as request handlers on the Vite dev server so the
 * serverless routes run locally. Dev only — Vercel does this in production.
 */
export function apiPlugin(): Plugin {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (!url.pathname.startsWith("/api/")) return next();

        const segments = url.pathname.replace(/^\/api\//, "").split("/").filter(Boolean);
        const base = resolve(process.cwd(), "api");

        // exact file, then index, then a [id] dynamic segment
        let file = resolve(base, `${segments.join("/")}.ts`);
        const params: Record<string, string> = {};

        if (!existsSync(file)) file = resolve(base, ...segments, "index.ts");
        if (!existsSync(file) && segments.length > 1) {
          const dir = segments.slice(0, -1);
          const dynamic = resolve(base, ...dir, "[id].ts");
          if (existsSync(dynamic)) {
            file = dynamic;
            params.id = segments[segments.length - 1];
          }
        }

        if (!existsSync(file)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "not_found", path: url.pathname }));
          return;
        }

        const body = await readBody(req);
        Object.assign(req, {
          body,
          query: { ...Object.fromEntries(url.searchParams), ...params },
        });

        // minimal VercelResponse surface
        const r = res as typeof res & Record<string, unknown>;
        r.status = (code: number) => {
          res.statusCode = code;
          return r;
        };
        r.json = (payload: unknown) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(payload));
          return r;
        };
        r.send = (payload: unknown) => {
          res.end(typeof payload === "string" ? payload : JSON.stringify(payload));
          return r;
        };

        try {
          const mod = await server.ssrLoadModule(file);
          await mod.default(req, res);
        } catch (error) {
          server.config.logger.error(`[local-api] ${url.pathname}: ${String(error)}`);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "handler_threw" }));
          }
        }
      });
    },
  };
}

function readBody(req: { on: (e: string, cb: (c?: unknown) => void) => void }) {
  return new Promise<unknown>((done) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c as Buffer));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return done(undefined);
      try {
        done(JSON.parse(raw));
      } catch {
        done(raw);
      }
    });
    req.on("error", () => done(undefined));
  });
}
