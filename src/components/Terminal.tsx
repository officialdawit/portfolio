import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

const RUNNERS: Record<Manager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx",
};

/** Package-manager switcher over one runnable command. */
export function Terminal() {
  const [manager, setManager] = useState<Manager>("pnpm");
  const [copied, setCopied] = useState(false);
  const command = `${RUNNERS[manager]} degit officialdawit/starter my-app`;

  const handleCopy = useCallback(async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, [command]);

  return (
    <div className="border border-line bg-card">
      <div
        role="tablist"
        aria-label="Package manager"
        className="grid grid-cols-4 border-b border-line"
      >
        {MANAGERS.map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={m === manager}
            onClick={() => setManager(m)}
            className={`label px-3 py-2.5 transition-colors duration-100 ${
              m === manager
                ? "label-fg bg-raised"
                : "hover:bg-raised hover:text-fg"
            } ${m !== "bun" ? "border-r border-line" : ""}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-3 py-3">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-5">
          <span className="text-dim">$ </span>
          <span className="text-fg">{command}</span>
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy command"
          className="label flex min-h-9 shrink-0 items-center gap-1.5 border border-line px-3 py-2 transition-colors duration-100 hover:border-strong hover:bg-raised hover:text-fg"
        >
          {copied ? (
            <Check size={11} strokeWidth={2} aria-hidden />
          ) : (
            <Copy size={11} strokeWidth={1.75} aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
