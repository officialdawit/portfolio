import { ArrowUpRight, Github, Mail, MessageSquare } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";
import { SectionHead } from "./SectionHead";

const STEPS = [
  "You send the note above. It goes straight to me — nobody else reads it.",
  "I reply within two working days, including an honest no if I'm not right for it.",
  "If it looks like a fit, we talk for thirty minutes. No charge, no pitch.",
  "You get a written plan with what I'd build, how long it takes and what it costs.",
];

const CHANNELS = [
  {
    label: "Email",
    value: "officialdawitworku@gmail.com",
    href: "mailto:officialdawitworku@gmail.com",
    Icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/officialdawit",
    href: "https://github.com/officialdawit",
    Icon: Github,
  },
];

export function Contact() {
  return (
    <section aria-labelledby="contact" className="border-b border-line-soft">
      <div className="rail py-14 sm:py-20">
        <SectionHead id="contact" title="Start a conversation" Icon={MessageSquare} />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div>
            <h3 className="max-w-xl text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[32px]">
              Have something that needs building properly?
            </h3>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted">
              Tell me what it does, who it's for, and when it has to be live.
              You don't need to know how it should be built — that's my part.
            </p>

            <div className="mt-9">
              <EnquiryForm />
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            <div>
              <p className="text-[14px] font-medium text-fg">What happens next</p>
              <ol className="mt-4 flex flex-col gap-4">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[10px] text-accent"
                    >
                      {i + 1}
                    </span>
                    <span className="text-[14px] leading-relaxed text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="text-[14px] font-medium text-fg">Or reach me directly</p>
              <ul className="mt-4 flex flex-col gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
                {CHANNELS.map(({ label, value, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-3 bg-card px-4 py-3.5 transition-colors duration-150 hover:bg-raised"
                    >
                      <Icon size={14} strokeWidth={1.6} aria-hidden className="shrink-0 text-muted transition-colors duration-150 group-hover:text-accent" />
                      <span className="flex min-w-0 flex-col">
                        <span className="label text-dim">{label}</span>
                        <span className="truncate text-[13px] text-fg">{value}</span>
                      </span>
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.75}
                        aria-hidden
                        className="ml-auto shrink-0 text-dim transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fg"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
