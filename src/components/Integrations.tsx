import {
  Boxes, Cloud, Container, CreditCard, Database, GitBranch, Globe, KeyRound,
  Lock, Mail, Server, Terminal, Workflow, Zap,
} from "lucide-react";
import { IconMosaic } from "./IconMosaic";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const CELLS = [
  null, { Icon: Database, name: "Postgres" }, null, { Icon: CreditCard, name: "Stripe" }, null,
  { Icon: Cloud, name: "Neon" }, null, { Icon: Lock, name: "Better Auth" }, null, { Icon: Mail, name: "Resend" },
  null, { Icon: Workflow, name: "Vercel" }, null, { Icon: Container, name: "Docker" }, null,
  { Icon: Server, name: "Turso" }, null, { Icon: KeyRound, name: "Sessions" }, null, { Icon: Zap, name: "Edge" },
  null, { Icon: GitBranch, name: "Git" }, null, { Icon: Terminal, name: "CLI" }, null,
];

export function Integrations() {
  return (
    <section aria-labelledby="integrations" className="border-b border-line-soft">
      <div className="rail">
        <SectionHead id="integrations" index="06" title="What I wire together" Icon={Boxes} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px]">
          <Reveal className="flex flex-col justify-center border-b border-line-soft px-4 py-10 sm:px-6 lg:border-b-0 lg:border-r">
            <div className="dashed-frame w-fit px-3 py-1">
              <span className="label label-fg inline-flex items-center gap-2">
                <Globe size={11} strokeWidth={1.5} aria-hidden />
                Bring your own services
              </span>
            </div>
            <h3 className="mt-6 max-w-md text-[24px] font-medium leading-snug tracking-[-0.015em] sm:text-[30px]">
              Payments, auth, mail and data — connected once, owned by you.
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              I don't lock a product into a vendor I happen to like. Entitlement
              state lives in your database, sessions stay in your control, and
              every integration has a local source of truth so an outage
              upstream is a degraded feature, not a dead product.
            </p>
          </Reveal>

          <Reveal delay={120} className="flex items-center px-4 py-10 sm:px-6">
            <IconMosaic cells={CELLS} cols={5} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
