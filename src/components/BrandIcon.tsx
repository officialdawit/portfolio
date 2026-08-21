import * as si from "simple-icons";

type Brand = { title: string; path: string };

const REGISTRY: Record<string, Brand | undefined> = {
  Stripe: si.siStripe,
  Vercel: si.siVercel,
  Postgres: si.siPostgresql,
  Docker: si.siDocker,
  Swift: si.siSwift,
  Go: si.siGo,
  Rust: si.siRust,
  TypeScript: si.siTypescript,
  React: si.siReact,
  "SvelteKit 5": si.siSvelte,
  "Next.js 16": si.siNextdotjs,
  "Tailwind v4": si.siTailwindcss,
  Git: si.siGit,
  Neovim: si.siNeovim,
  Python: si.siPython,
  "Django Ninja": si.siDjango,
  Drizzle: si.siDrizzle,
  Neon: si.siNeon,
  Turso: si.siTurso,
  Biome: si.siBiome,
  Zod: si.siZod,
  Resend: si.siResend,
  fish: si.siFishshell,
};

/**
 * Real brand marks, drawn in currentColor rather than each brand's own colour —
 * sixteen corporate palettes on one page would fight everything else.
 * Falls back to null so callers can render their own glyph.
 */
export function BrandIcon({ name, size = 16 }: { name: string; size?: number }) {
  const brand = REGISTRY[name];
  if (!brand) return null;

  return (
    <svg
      role="img"
      aria-label={brand.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className="shrink-0"
    >
      <path d={brand.path} />
    </svg>
  );
}

export const hasBrandIcon = (name: string) => Boolean(REGISTRY[name]);
