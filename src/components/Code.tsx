import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { highlight, type Lang } from "../lib/highlight";

type Props = {
  caption: string;
  meta?: string;
  lang: Lang;
  code: string;
  copyable?: boolean;
};

export function Code({ caption, meta, lang, code, copyable = true }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, [code]);

  const lines = code.split("\n");

  return (
    <figure className="flex min-w-0 flex-col border border-line bg-card">
      <figcaption className="flex items-center gap-3 border-b border-line px-3 py-2">
        <span className="label label-fg truncate">{caption}</span>
        {meta ? <span className="label shrink-0 text-dim">{meta}</span> : null}
        {copyable ? (
          <button
            type="button"
            onClick={handleCopy}
            className="label ml-auto flex min-h-8 shrink-0 items-center gap-2 border border-line px-3 py-2 transition-colors duration-100 hover:border-strong hover:bg-raised hover:text-fg"
          >
            {copied ? (
              <Check size={11} strokeWidth={2} aria-hidden />
            ) : (
              <Copy size={11} strokeWidth={1.75} aria-hidden />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </figcaption>

      <div className="code-scroll overflow-x-auto">
        <pre className="min-w-0 px-3 py-3 font-mono text-[11px] leading-[20px]">
          <code>
            {lines.map((line, i) => (
              <span key={i} className="grid grid-cols-[22px_1fr] gap-2">
                <span aria-hidden className="select-none text-right text-dim">
                  {i + 1}
                </span>
                <span className="whitespace-pre text-muted">
                  {line.length > 0 ? highlight(line, lang) : " "}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  );
}
