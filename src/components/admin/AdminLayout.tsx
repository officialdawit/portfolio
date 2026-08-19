import { BarChart3, Database, ExternalLink, LayoutDashboard, LogOut, PenLine, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../../lib/adminApi";

const LINKS = [
  { to: "/admin", text: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/admin/projects", text: "Projects", Icon: Database, end: false },
  { to: "/admin/posts", text: "Posts", Icon: PenLine, end: false },
  { to: "/admin/analytics", text: "Analytics", Icon: BarChart3, end: false },
];

/**
 * Deliberately distinct from the public shell: solid raised bar, monospace
 * console framing, environment badge, and a dense status footer.
 */
export function AdminLayout() {
  const navigate = useNavigate();
  const [dbOk, setDbOk] = useState<boolean | null>(null);

  useEffect(() => {
    void api.me().then((r) => setDbOk(r.ok));
  }, []);

  const handleLogout = async () => {
    await api.logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-50 border-b border-line bg-raised">
        <div className="mx-auto flex w-full max-w-[1440px] items-stretch">
          <div className="flex items-center gap-2.5 border-r border-line px-4 py-3">
            <Terminal size={13} strokeWidth={1.75} aria-hidden className="text-fg" />
            <span className="label label-fg tracking-[0.14em]">CONSOLE</span>
          </div>

          <nav aria-label="Admin" className="flex items-stretch">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `label flex items-center gap-2 whitespace-nowrap border-r border-line px-4 transition-colors duration-100 hover:bg-card hover:text-fg ${
                    isActive ? "label-fg bg-bg" : ""
                  }`
                }
              >
                <l.Icon size={12} strokeWidth={1.5} aria-hidden />
                {l.text}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-stretch">
            <span className="hidden items-center gap-2 border-l border-line px-4 sm:flex">
              <span
                aria-hidden
                className={
                  dbOk === null
                    ? "h-1.5 w-1.5 bg-dim"
                    : dbOk
                      ? "h-1.5 w-1.5 bg-fg"
                      : "h-1.5 w-1.5 border border-strong"
                }
              />
              <span className="label">{dbOk === null ? "checking" : dbOk ? "db up" : "db down"}</span>
            </span>
            <Link
              to="/"
              className="label hidden items-center gap-2 border-l border-line px-4 transition-colors duration-100 hover:bg-card hover:text-fg sm:flex"
            >
              <ExternalLink size={11} strokeWidth={1.5} aria-hidden />
              Live site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="label label-fg flex items-center gap-2 border-l border-line px-4 transition-colors duration-100 hover:bg-card"
            >
              <LogOut size={11} strokeWidth={1.5} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px]">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-line bg-raised">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="label text-dim">ADMIN CONSOLE</span>
          <span className="label text-dim">NEON POSTGRES · DRIZZLE</span>
          <span className="label text-dim">SESSION 7D · PBKDF2 210K</span>
          <span className="label ml-auto text-dim">
            Public site unaffected by changes until published
          </span>
        </div>
      </footer>
    </div>
  );
}
