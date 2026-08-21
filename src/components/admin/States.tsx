import { AlertTriangle, Inbox } from "lucide-react";
import { ThinkingOrb } from "../fx/ThinkingOrb";
import type { ReactNode } from "react";

export function Loading({ text = "Loading" }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-16">
      <ThinkingOrb size={16} />
      <span className="label">{text}</span>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <AlertTriangle size={18} strokeWidth={1.5} aria-hidden className="text-fg" />
      <p className="max-w-sm text-[15px] leading-relaxed text-muted">{message}</p>
      {retry ? (
        <button
          type="button"
          onClick={retry}
          className="label label-fg border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:bg-raised"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <Inbox size={18} strokeWidth={1.5} aria-hidden className="text-muted" />
      <p className="label label-fg">{title}</p>
      <p className="max-w-sm text-[15px] leading-relaxed text-muted">{body}</p>
      {action}
    </div>
  );
}
