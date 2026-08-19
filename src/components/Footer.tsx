import { ArrowUp, Github, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Sections",
    links: [
      { text: "Work", href: "/work" },
      { text: "Writing", href: "/blog" },
      { text: "About", href: "/about" },
      { text: "Uses", href: "/uses" },
    ],
  },
  {
    title: "Projects",
    links: [
      { text: "Lineup", href: "/work/lineup" },
      { text: "RepuTrack", href: "/work/reputrack" },
      { text: "Vigil", href: "/work/vigil" },
      { text: "Meskot", href: "/work/meskot" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { text: "GitHub", href: "https://github.com/officialdawit" },
      { text: "Email", href: "mailto:officialdawitworku@gmail.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-b border-line-soft">
      <div className="rail">
        <div className="grid grid-cols-1 border-b border-line-soft sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-line-soft px-4 py-8 sm:px-6 lg:border-b-0 lg:border-r">
            <p className="label label-fg tracking-[0.14em]">DAWIT WORKUJIMA</p>
            <p className="label mt-3 inline-flex items-center gap-1.5">
              <MapPin size={11} strokeWidth={1.5} aria-hidden />
              Addis Ababa, Ethiopia
            </p>
            <p className="label mt-2 inline-flex items-center gap-1.5">
              <span aria-hidden className="h-1.5 w-1.5 bg-fg" />
              Available for work
            </p>
          </div>

          {COLUMNS.map((col, i) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className={`border-b border-line-soft px-4 py-8 sm:px-6 lg:border-b-0 ${
                i < 2 ? "lg:border-r" : ""
              } ${i === 0 ? "sm:border-r lg:border-r" : ""}`}
            >
              <p className="label text-dim">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => {
                  const external = l.href.startsWith("http") || l.href.startsWith("mailto");
                  return (
                    <li key={l.text}>
                      <Link
                        to={l.href}
                        reloadDocument={false}
                        className="label inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-fg"
                      >
                        {l.text === "GitHub" ? (
                          <Github size={11} strokeWidth={1.5} aria-hidden />
                        ) : l.text === "Email" ? (
                          <Mail size={11} strokeWidth={1.5} aria-hidden />
                        ) : null}
                        {l.text}
                        {external ? <span aria-hidden className="text-dim">↗</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="label">
            Built from scratch — React 19, Vite, Tailwind v4. No template, no UI kit.
          </span>
          <Link
            to="/"
            className="label inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-fg"
          >
            <ArrowUp size={11} strokeWidth={1.75} aria-hidden />
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
