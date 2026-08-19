import { Boxes, Home, PenLine, User, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/", text: "Home", Icon: Home, end: true },
  { to: "/work", text: "Work", Icon: Boxes, end: false },
  { to: "/blog", text: "Writing", Icon: PenLine, end: false },
  { to: "/about", text: "About", Icon: User, end: false },
  { to: "/uses", text: "Uses", Icon: Wrench, end: false },
];

/** Fixed bottom navigation on small screens. Hidden from tablet up. */
export function MobileDock() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.to} className="flex">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex min-h-[56px] w-full flex-col items-center justify-center gap-1.5 transition-colors duration-150 ${
                  isActive ? "text-fg" : "text-dim"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 items-center justify-center border transition-colors duration-150 ${
                      isActive
                        ? "border-fg bg-fg text-bg"
                        : "border-line bg-raised text-muted"
                    }`}
                  >
                    <item.Icon size={13} strokeWidth={1.5} />
                  </span>
                  <span className="label text-[9px] leading-none">{item.text}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
