import type { ReactNode } from "react";

export function AdminChrome({
  title,
  index,
  action,
  children,
}: {
  title: string;
  index: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-b border-line-soft px-4 py-3 sm:px-6">
        <span className="label label-fg">{index}</span>
        <span aria-hidden className="label text-dim">/</span>
        <h1 className="label label-fg">{title}</h1>
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
      {children}
    </>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label label-fg">{label}</span>
      {children}
      {hint ? <span className="label text-dim">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full border border-line bg-card px-3 py-2.5 font-mono text-[12px] text-fg outline-none transition-colors duration-150 focus:border-strong";
