import { useEffect } from "react";

const SITE = "https://www.dawit.dev";
const SUFFIX = "Dawit Worku";

function upsert(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    el = selector.startsWith("link")
      ? document.createElement("link")
      : document.createElement("meta");
    const [, key, val] = selector.match(/\[(\w+)="([^"]+)"\]/) ?? [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Per-route title, description and canonical. Without this every route serves
 * the same title, which search engines read as duplicate pages.
 */
export function useMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  useEffect(() => {
    const full = title === SUFFIX ? title : `${title} — ${SUFFIX}`;
    document.title = full;
    upsert('meta[name="description"]', "content", description);
    upsert('meta[property="og:title"]', "content", full);
    upsert('meta[property="og:description"]', "content", description);
    upsert('meta[property="og:url"]', "content", `${SITE}${path}`);
    upsert('meta[name="twitter:title"]', "content", full);
    upsert('meta[name="twitter:description"]', "content", description);
    upsert('link[rel="canonical"]', "href", `${SITE}${path}`);
  }, [title, description, path]);
}
