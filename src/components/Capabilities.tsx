import {
  CreditCard,
  Database,
  Globe,
  Layers,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { IconCell } from "./IconCell";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const CAPABILITIES = [
  {
    Icon: Smartphone,
    title: "Mobile apps",
    body: "iOS and cross-platform apps that feel native — real gestures, sensible offline behaviour, and testing on mid-range Android as well as a new iPhone.",
  },
  {
    Icon: Database,
    title: "Schema and data layer",
    body: "Postgres modelled properly the first time. Drizzle for typed access, migrations that roll back, indexes before the query gets slow.",
  },
  {
    Icon: ShieldCheck,
    title: "Auth and access control",
    body: "Sessions, OAuth, and ownership checks on every route. Client-sent IDs are never trusted. Rate limits on anything a stranger can reach.",
  },
  {
    Icon: CreditCard,
    title: "Billing that reconciles",
    body: "Stripe subscriptions with idempotent webhooks and a local source of truth, so entitlement never depends on a webhook arriving.",
  },
  {
    Icon: Layers,
    title: "Interface and design system",
    body: "Tokens first, components second. Every surface handles loading, empty, error, denied and success before it ships.",
  },
  {
    Icon: Globe,
    title: "Bilingual and local-first",
    body: "English and አማርኛ across attendee surfaces, Ethiopian calendar and Ge'ez numerals where the context calls for it.",
  },
];

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities" className="border-b border-line-soft">
      <div className="rail">
        <SectionHead id="capabilities" title="What I do" Icon={Layers} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 45}
              className="group border-b border-r border-line-soft transition-colors duration-150 hover:bg-raised"
            >
              <article className="flex h-full flex-col px-4 py-7 sm:px-6">
                <IconCell Icon={c.Icon} size="lg" />
                <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.01em] text-fg">
                  {c.title}
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
