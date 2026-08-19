import { Boxes, Home, PenLine, User, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/", text: "Home", Icon: Home, end: true },
  { to: "/work", text: "Work", Icon: Boxes, end: false },
  { to: "/blog", text: "Writing", Icon: PenLine, end: false },
  { to: "/about", text: "About", Icon: User, end: false },
  { to: "/uses", text: "Uses", Icon: Wrench, end: false },
];

/** Floating dock, sized to its contents. Hidden from tablet up. */
export function MobileDock() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <nav
        aria-label="Mobile"
        className="pointer-events-auto border border-line bg-bg/92 shadow-[0_8px_28px_rgba(0,0,0,0.55)] backdrop-blur-md"
      >
        <ul className="flex items-stretch">
          {ITEMS.map((item, i) => (
            <li key={item.to} className={i > 0 ? "border-l border-line-soft" : ""}>
              <NavLink
                to={item.to}
                end={item.end}
                className="flex h-14 w-[58px] flex-col items-center justify-center gap-1"
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden
                      className={`flex h-6 w-6 items-center justify-center transition-colors duration-150 ${
                        isActive ? "bg-fg text-bg" : "text-muted"
                      }`}
                    >
                      <item.Icon size={13} strokeWidth={1.5} />
                    </span>
                    <span
                      className={`font-mono text-[8px] uppercase leading-none tracking-[0.06em] transition-colors duration-150 ${
                        isActive ? "text-fg" : "text-dim"
                      }`}
                    >
                      {item.text}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
