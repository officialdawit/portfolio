import {
  Boxes,
  Braces,
  Cloud,
  Container,
  FileCode,
  FlaskConical,
  GitBranch,
  Lock,
  Mail,
  PanelsTopLeft,
  Ruler,
  Search,
  Server,
  Sparkles,
  Terminal as TerminalIcon,
  Workflow,
} from "lucide-react";
import { IconCell } from "./IconCell";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const TOOLS = [
  { name: "SvelteKit 5", role: "App framework", Icon: PanelsTopLeft },
  { name: "Next.js 16", role: "App framework", Icon: PanelsTopLeft },
  { name: "TypeScript", role: "Language", Icon: Braces },
  { name: "Tailwind v4", role: "Styling", Icon: Ruler },
  { name: "Drizzle", role: "ORM", Icon: Boxes },
  { name: "Postgres", role: "Database", Icon: Server },
  { name: "Neon", role: "Serverless PG", Icon: Cloud },
  { name: "Turso", role: "Edge libSQL", Icon: Cloud },
  { name: "Stripe", role: "Payments", Icon: Sparkles },
  { name: "Better Auth", role: "Sessions", Icon: Lock },
  { name: "Resend", role: "Transactional mail", Icon: Mail },
  { name: "Vercel", role: "Deploy", Icon: Workflow },
  { name: "Django Ninja", role: "Typed Python API", Icon: FileCode },
  { name: "Docker", role: "Runtime", Icon: Container },
  { name: "Playwright", role: "E2E tests", Icon: FlaskConical },
  { name: "Biome", role: "Lint + format", Icon: Search },
  { name: "Zod", role: "Boundary validation", Icon: Lock },
  { name: "Git", role: "Version control", Icon: GitBranch },
  { name: "Neovim", role: "Editor", Icon: TerminalIcon },
  { name: "fish", role: "Shell", Icon: TerminalIcon },
];

export function Tooling() {
  return (
    <section aria-labelledby="tooling" className="border-b border-line-soft">
      <div className="rail">
        <SectionHead id="tooling" index="05" title="Tooling" Icon={Ruler} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 5) * 30}>
              <div className="group flex h-full items-center gap-3 border-b border-r border-line-soft px-3 py-4 transition-colors duration-150 hover:bg-raised sm:px-4">
                <IconCell Icon={t.Icon} size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="label label-fg truncate">{t.name}</span>
                  <span className="label truncate text-dim">{t.role}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
