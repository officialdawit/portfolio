import type { ReactNode } from "react";

type Lang = "bash" | "ts" | "sql";

const KEYWORDS =
  /\b(const|let|await|async|import|from|export|default|return|if|throw|new|type|interface|function)\b/;
const TS_RULES: Array<[RegExp, string]> = [
  [/\/\/[^\n]*/, "text-dim"],
  [/(["'`])(?:\\.|(?!\1)[^\\])*\1/, "text-muted"],
  [KEYWORDS, "text-fg/90 font-medium"],
  [/\b\d[\d_.]*\b/, "text-muted"],
  [/\b[a-zA-Z_$][\w$]*(?=\()/, "text-fg"],
];
const BASH_RULES: Array<[RegExp, string]> = [
  [/^\s*[#][^\n]*/, "text-dim"],
  [/(["'])(?:\\.|(?!\1)[^\\])*\1/, "text-muted"],
  [/^\s*[$>]/, "text-dim"],
  [/\b(pnpm|npm|npx|git|docker|psql|curl|drizzle-kit)\b/, "text-fg font-medium"],
  [/\s-{1,2}[\w-]+/, "text-muted"],
];
const SQL_RULES: Array<[RegExp, string]> = [
  [/--[^\n]*/, "text-dim"],
  [/\b(select|from|where|join|on|group|by|order|limit|create|table|index|not|null|references)\b/i, "text-fg/90 font-medium"],
  [/\b\d+\b/, "text-muted"],
];

const RULES: Record<Lang, Array<[RegExp, string]>> = {
  ts: TS_RULES,
  bash: BASH_RULES,
  sql: SQL_RULES,
};

/** Tiny single-pass tokenizer. Monochrome by design — weight and opacity carry the signal, not hue. */
export function highlight(line: string, lang: Lang): ReactNode {
  const rules = RULES[lang];
  const out: ReactNode[] = [];
  let rest = line;
  let key = 0;

  while (rest.length > 0) {
    let best: { i: number; len: number; cls: string } | null = null;
    for (const [re, cls] of rules) {
      const m = re.exec(rest);
      if (!m) continue;
      if (!best || m.index < best.i) best = { i: m.index, len: m[0].length, cls };
    }
    if (!best) {
      out.push(rest);
      break;
    }
    if (best.i > 0) out.push(rest.slice(0, best.i));
    out.push(
      <span key={key++} className={best.cls}>
        {rest.slice(best.i, best.i + best.len)}
      </span>,
    );
    rest = rest.slice(best.i + best.len);
  }
  return out;
}

export type { Lang };
