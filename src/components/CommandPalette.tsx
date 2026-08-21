import {
  ArrowUpRight,
  Command as CommandIcon,
  CornerDownLeft,
  Github,
  Mail,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { POSTS } from "../data/posts";
import { PROJECTS } from "../data/projects";

type Item = { label: string; hint: string; href: string; external: boolean };

const STATIC_ITEMS: Item[] = [
  { label: "Home", hint: "Page", href: "/", external: false },
  { label: "Work", hint: "Page", href: "/work", external: false },
  { label: "Writing", hint: "Page", href: "/blog", external: false },
  { label: "About", hint: "Page", href: "/about", external: false },
  { label: "Uses", hint: "Page", href: "/uses", external: false },
  { label: "officialdawitworku@gmail.com", hint: "Email", href: "mailto:officialdawitworku@gmail.com", external: true },
  { label: "github.com/officialdawit", hint: "GitHub", href: "https://github.com/officialdawit", external: true },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const projectItems: Item[] = PROJECTS.map((p) => ({
      label: p.name,
      hint: p.kind,
      href: `/work/${p.slug}`,
      external: false,
    }));
    const postItems: Item[] = POSTS.map((p) => ({
      label: p.title,
      hint: "Writing",
      href: `/blog/${p.slug}`,
      external: false,
    }));
    const all = [...projectItems, ...postItems, ...STATIC_ITEMS];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (i) =>
        i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q),
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const run = useCallback(
    (item: Item) => {
      close();
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }
      navigate(item.href);
    },
    [close, navigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, items.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && items[active]) {
        e.preventDefault();
        run(items[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, active, close, run]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="flex items-center gap-2 rounded-[var(--radius)] border border-line px-3 py-2 text-[13px] text-muted transition-colors duration-150 hover:border-strong hover:text-fg"
      >
        <Search size={12} strokeWidth={1.75} aria-hidden />
        <span className="hidden items-center gap-0.5 sm:flex">
          <CommandIcon size={10} strokeWidth={1.75} aria-hidden />K
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-lg border border-line bg-card"
          >
            <div className="flex items-center gap-3 border-b border-line px-3 py-3">
              <Search size={13} strokeWidth={1.75} aria-hidden className="text-dim" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Jump to a project or section"
                aria-label="Search"
                className="label label-fg w-full bg-transparent outline-none placeholder:text-dim"
              />
              <kbd className="label border border-line px-1.5 py-0.5 text-dim">ESC</kbd>
            </div>

            <ul className="max-h-[46vh] overflow-y-auto">
              {items.length === 0 ? (
                <li className="label px-3 py-6 text-center text-dim">
                  Nothing matches “{query}”
                </li>
              ) : (
                items.map((item, i) => (
                  <li key={`${item.label}-${item.href}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(item)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 ${
                        i === active ? "bg-raised" : ""
                      }`}
                    >
                      {item.hint === "Email" ? (
                        <Mail size={12} strokeWidth={1.5} aria-hidden className="text-dim" />
                      ) : item.hint === "GitHub" ? (
                        <Github size={12} strokeWidth={1.5} aria-hidden className="text-dim" />
                      ) : (
                        <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden className="text-dim" />
                      )}
                      <span className="label label-fg flex-1 truncate">{item.label}</span>
                      <span className="label shrink-0 text-dim">{item.hint}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center gap-4 border-t border-line px-3 py-2">
              <span className="label inline-flex items-center gap-2 text-dim">
                <CornerDownLeft size={10} strokeWidth={1.75} aria-hidden /> open
              </span>
              <span className="label text-dim">↑↓ navigate</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
