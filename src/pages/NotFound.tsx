import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export function NotFound() {
  return (
    <section className="border-b border-line-soft">
      <div className="rail px-4 py-24 sm:px-6 sm:py-32">
        <div className="flex items-center gap-2.5">
          <span className="label label-fg">404</span>
          <span aria-hidden className="label text-dim">/</span>
          <Compass size={12} strokeWidth={1.5} aria-hidden className="text-fg" />
          <span className="label">No such route</span>
        </div>
        <h1 className="mt-6 max-w-xl text-[30px] font-medium leading-tight tracking-[-0.02em] sm:text-[44px]">
          This page doesn't exist.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
          Nothing is broken — the address just doesn't match anything here.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/" className="label label-fg border border-line px-4 py-3 transition-colors duration-150 hover:border-strong hover:bg-raised">
            Home
          </Link>
          <Link to="/work" className="label border border-line px-4 py-3 transition-colors duration-150 hover:border-strong hover:text-fg">
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
