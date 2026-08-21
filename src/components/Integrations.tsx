import {
  Boxes, Cloud, Container, CreditCard, Database, KeyRound,
  Lock, Mail, Server, Workflow, Zap,
} from "lucide-react";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const SERVICES = [
  { name: "Postgres", role: "Primary database", Icon: Database },
  { name: "Neon", role: "Serverless Postgres", Icon: Cloud },
  { name: "Turso", role: "Edge database", Icon: Server },
  { name: "Stripe", role: "Payments", Icon: CreditCard },
  { name: "Better Auth", role: "Sessions", Icon: Lock },
  { name: "Resend", role: "Email", Icon: Mail },
  { name: "Vercel", role: "Hosting", Icon: Workflow },
  { name: "Docker", role: "Runtime", Icon: Container },
  { name: "API keys", role: "Access control", Icon: KeyRound },
  { name: "Edge cache", role: "Delivery", Icon: Zap },
];

export function Integrations() {
  return (
    <section aria-labelledby="integrations" className="border-b border-line-soft">
      <div className="rail py-14 sm:py-20">
        <SectionHead id="integrations" title="What I connect together" Icon={Boxes} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <Reveal>
            <h3 className="max-w-md text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[32px]">
              Payments, sign-in, email and data — set up once, and yours to keep.
            </h3>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">
              I don't tie a product to one company's service. Your customer
              records live in your own database, and if something upstream goes
              down, the rest of the product keeps working.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li
                  key={s.name}
                  className="group flex items-center gap-3 bg-card px-4 py-4 transition-colors duration-150 hover:bg-raised"
                >
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] border border-line text-muted transition-colors duration-150 group-hover:border-accent group-hover:text-accent"
                  >
                    {hasBrandIcon(s.name) ? (
                      <BrandIcon name={s.name} size={14} />
                    ) : (
                      <s.Icon size={14} strokeWidth={1.6} />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[14px] font-medium text-fg">{s.name}</span>
                    <span className="label text-dim">{s.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
