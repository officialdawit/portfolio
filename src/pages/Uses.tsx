import { Wrench } from "lucide-react";
import { PageHead } from "../components/PageHead";
import { SectionHead } from "../components/SectionHead";
import { useMeta } from "../lib/useMeta";

const GROUPS = [
  {
    index: "01",
    name: "Editor and shell",
    items: [
      { k: "Editor", v: "Neovim", note: "Primary. VS Code when pairing." },
      { k: "Shell", v: "fish", note: "Config in chezmoi." },
      { k: "Terminal", v: "Warp", note: "" },
      { k: "OS", v: "Arch Linux", note: "" },
      { k: "Runtimes", v: "mise", note: "Per-project pinning." },
    ],
  },
  {
    index: "02",
    name: "Building",
    items: [
      { k: "Framework", v: "SvelteKit 5 / Next.js 16", note: "Runes, App Router." },
      { k: "Language", v: "TypeScript", note: "Strict. No any, ever." },
      { k: "Styling", v: "Tailwind v4", note: "@theme in CSS, no config file." },
      { k: "Lint", v: "Biome v2", note: "Replaced ESLint + Prettier." },
      { k: "Validation", v: "Zod", note: "At every system boundary." },
    ],
  },
  {
    index: "03",
    name: "Data and services",
    items: [
      { k: "ORM", v: "Drizzle", note: "Typed, migration-first." },
      { k: "Postgres", v: "Neon", note: "Serverless, branching." },
      { k: "SQLite", v: "Turso", note: "Edge libSQL replicas." },
      { k: "Payments", v: "Stripe", note: "Idempotent webhooks." },
      { k: "Email", v: "Resend", note: "" },
      { k: "Deploy", v: "Vercel", note: "Preview before promote, always." },
    ],
  },
];

export function Uses() {
  useMeta({
    title: "Uses",
    description:
      "The editor, shell, frameworks, databases and services I actually build with.",
    path: "/uses",
  });

  return (
    <>
      <PageHead
        index="U"
        eyebrow="Uses"
        title="What I actually build with."
        standfirst="The current setup. It changes, but not often and not without a reason."
        Icon={Wrench}
      />
      {GROUPS.map((g) => (
        <section key={g.index} className="border-b border-line-soft">
          <div className="rail">
            <SectionHead index={g.index} title={g.name} />
            <dl>
              {g.items.map((item) => (
                <div
                  key={item.k}
                  className="grid grid-cols-1 gap-1 border-b border-line-soft px-4 py-4 last:border-b-0 sm:grid-cols-[160px_200px_1fr] sm:items-center sm:gap-4 sm:px-6"
                >
                  <dt className="label">{item.k}</dt>
                  <dd className="label label-fg">{item.v}</dd>
                  <dd className="label text-dim">{item.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </>
  );
}
