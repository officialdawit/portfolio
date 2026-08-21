import { Boxes, PenLine, User, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CommandPalette } from "./CommandPalette";
import { EnquiryModal } from "./EnquiryModal";

const LINKS = [
  { to: "/work", text: "Work", Icon: Boxes },
  { to: "/blog", text: "Writing", Icon: PenLine },
  { to: "/about", text: "About", Icon: User },
  { to: "/uses", text: "Uses", Icon: Wrench },
];

const SEEN_KEY = "dw:enquiry-seen-at";
const DELAY_MS = 5000;
/** Ask again after this long. Set to 0 to ask on every single visit. */
const COOLDOWN_DAYS = 3;

export function Nav() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Opens itself once, five seconds in, then waits out the cooldown.
  useEffect(() => {
    let suppressed = false;
    try {
      const last = Number(localStorage.getItem(SEEN_KEY) ?? 0);
      const cooldownMs = COOLDOWN_DAYS * 86_400_000;
      suppressed = cooldownMs > 0 && last > 0 && Date.now() - last < cooldownMs;
    } catch {
      suppressed = false; // private browsing
    }
    if (suppressed) return;

    const timer = window.setTimeout(() => setEnquiryOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setEnquiryOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      // nothing to do; it will simply ask again next visit
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line-soft bg-bg/85 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="rail flex h-[var(--nav-h)] items-center gap-6"
        >
          <NavLink
            to="/"
            className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.015em] text-fg transition-colors duration-150 hover:text-accent"
          >
            Dawit Worku
          </NavLink>

          <ul className="ml-auto hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-[14px] transition-colors duration-150 ${
                      isActive
                        ? "bg-raised text-fg"
                        : "text-muted hover:bg-raised hover:text-fg"
                    }`
                  }
                >
                  <l.Icon size={13} strokeWidth={1.6} aria-hidden />
                  {l.text}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <CommandPalette />
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="rounded-[var(--radius)] bg-fg px-4 py-2 text-[14px] font-medium text-bg transition-opacity duration-150 hover:opacity-88"
            >
              Hire me
            </button>
          </div>
        </nav>
      </header>

      <EnquiryModal open={enquiryOpen} onClose={handleClose} />
    </>
  );
}
