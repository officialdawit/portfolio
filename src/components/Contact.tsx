import { ArrowUpRight, Github, Mail } from "lucide-react";
import { SectionHead } from "./SectionHead";

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
      <div className="rail">
        <SectionHead id="contact" index="09" title="Contact" Icon={Mail} />
        <div className="px-4 py-14 sm:px-6 sm:py-20">
          <p className="max-w-2xl text-[26px] font-medium leading-snug tracking-[-0.015em] sm:text-[34px]">
            Have something that needs building properly?
          </p>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
            Tell me what it does, who it is for, and when it has to be live.
            I will tell you straight whether I am the right person to build it.
          </p>

          <ul className="mt-10 grid max-w-2xl grid-cols-1 border-t border-line-soft sm:grid-cols-2">
            {CHANNELS.map(({ label, value, href, Icon }) => (
              <li key={label} className="border-b border-line-soft sm:[&:first-child]:border-r">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3 px-4 py-5 transition-colors duration-150 hover:bg-raised"
                >
                  <Icon size={14} strokeWidth={1.5} aria-hidden className="text-muted" />
                  <span className="flex flex-col gap-1">
                    <span className="label">{label}</span>
                    <span className="label label-fg">{value}</span>
                  </span>
                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.75}
                    aria-hidden
                    className="ml-auto text-dim transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fg"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
