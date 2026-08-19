import { Boxes, PenLine, User, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";
import { CommandPalette } from "./CommandPalette";

const LINKS = [
  { to: "/work", text: "Work", Icon: Boxes },
  { to: "/blog", text: "Writing", Icon: PenLine },
  { to: "/about", text: "About", Icon: User },
  { to: "/uses", text: "Uses", Icon: Wrench },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-bg/90 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="rail flex h-[var(--nav-h)] items-stretch justify-between pl-4 sm:pl-6"
      >
        <NavLink
          to="/"
          className="label label-fg flex items-center whitespace-nowrap tracking-[0.14em] transition-colors duration-150 hover:text-muted"
        >
          <span className="sm:hidden">DW</span>
          <span className="hidden sm:inline">DAWIT&nbsp;WORKUJIMA</span>
        </NavLink>

        <ul className="flex items-stretch">
          {LINKS.map((l) => (
            <li key={l.to} className="hidden sm:flex">
              {/* full-height cell keeps the tap target at 44px without growing the bar */}
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `label flex items-center gap-2 whitespace-nowrap px-3 transition-colors duration-150 hover:bg-raised hover:text-fg sm:px-4 ${
                    isActive ? "label-fg bg-raised" : ""
                  }`
                }
              >
                <l.Icon size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
                {l.text}
              </NavLink>
            </li>
          ))}
          <li className="flex">
            <CommandPalette />
          </li>
          <li className="flex">
            <a
              href="mailto:officialdawitworku@gmail.com"
              className="label label-fg flex items-center whitespace-nowrap border-l border-line px-4 transition-colors duration-150 hover:bg-raised sm:px-5"
            >
              Hire me
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
