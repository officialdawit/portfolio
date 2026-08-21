import { Boxes, PenLine, User, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { EnquiryModal } from "./EnquiryModal";

const LINKS = [
  { to: "/work", text: "Work", Icon: Boxes },
  { to: "/blog", text: "Writing", Icon: PenLine },
  { to: "/about", text: "About", Icon: User },
  { to: "/uses", text: "Uses", Icon: Wrench },
];

const SEEN_KEY = "dw:enquiry-seen";
const DELAY_MS = 5000;

export function Nav() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Opens itself once, five seconds in. Remembered afterwards — a popup that
  // returns on every visit is the fastest way to make someone leave.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false; // private browsing
    }
    if (seen) return;

    const timer = window.setTimeout(() => setEnquiryOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setEnquiryOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // nothing to do; it will simply ask again next visit
    }
  };

  return (
    <>
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
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="label label-fg flex items-center whitespace-nowrap border-l border-line px-4 transition-colors duration-150 hover:bg-raised sm:px-5"
            >
              Hire me
            </button>
          </li>
        </ul>
      </nav>
    </header>

      <EnquiryModal open={enquiryOpen} onClose={handleClose} />
    </>
  );
}
