import { MapPin, User } from "lucide-react";
import { PageHead } from "../components/PageHead";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { useMeta } from "../lib/useMeta";

const TIMELINE = [
  { year: "2026", title: "Gebeta, Meskot", body: "Two Ethiopian-market products in build — restaurant operations and scheduling, both bilingual from the schema up." },
  { year: "2025", title: "RepuTrack, Lineup, Vigil", body: "Three SaaS products shipped solo. Billing, monitoring, and waitlists — each one live and taking real users." },
  { year: "2024", title: "PH Performance", body: "Joined the largest codebase I work in: ~420k lines, ~10k users, one dyno. Learned what shipping carefully actually means." },
];

const PRINCIPLES = [
  "A product nobody uses teaches you nothing — ship the smallest honest version first.",
  "Boring where it counts: parameterised queries, ownership checks, rollbackable migrations.",
  "Mid-range Android on metered data is the target device, not a laptop on fibre.",
  "If I can't explain the decision in a sentence, I don't understand it yet.",
];

export function About() {
  useMeta({
    title: "About",
    description:
      "Mobile developer, web developer and system architect in Addis Ababa. How I work and what I have shipped.",
    path: "/about",
  });

  return (
    <>
      <PageHead
        index="A"
        eyebrow="About"
        title="I build the whole thing — app, web and everything under it."
        standfirst="Mobile developer, web developer and system architect in Addis Ababa. I work solo on most of what I ship, so the database design and the button states are the same person's problem."
        Icon={User}
        meta={[
          { k: "Based", v: "Addis Ababa, Ethiopia" },
          { k: "Building", v: "Mobile · Web · Systems" },
          { k: "Languages", v: "English, አማርኛ" },
        ]}
      />

      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="01" title="Track" Icon={MapPin} />
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 60}>
              <article className="grid grid-cols-1 gap-3 border-b border-line-soft px-4 py-7 sm:grid-cols-[100px_1fr] sm:px-6">
                <span className="label label-fg">{t.year}</span>
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.01em]">{t.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{t.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-b border-line-soft">
        <div className="rail">
          <SectionHead index="02" title="How I think about it" />
          <ul className="px-4 py-6 sm:px-6">
            {PRINCIPLES.map((p, i) => (
              <li key={p} className="flex gap-4 border-b border-line-soft py-4 last:border-b-0">
                <span className="label label-fg shrink-0">0{i + 1}</span>
                <span className="max-w-2xl text-[15px] leading-relaxed text-muted">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
