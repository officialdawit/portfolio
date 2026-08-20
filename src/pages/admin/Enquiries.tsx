import { Check, Inbox, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { EmptyState, ErrorState, Loading } from "../../components/admin/States";
import { readError } from "../../lib/adminApi";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  about: string;
  who: string | null;
  timing: string;
  read: boolean;
  createdAt: string;
};

export function AdminEnquiries() {
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setRows(null);
    try {
      const res = await fetch("/api/enquiries", { credentials: "same-origin" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(readError(String(body.error ?? "request_failed")));
      setRows(body.enquiries as Enquiry[]);
    } catch {
      setError(readError("network_unreachable"));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const markRead = async (id: string) => {
    setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, read: true } : r)) ?? null);
    await fetch("/api/enquiries", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const unread = rows?.filter((r) => !r.read).length ?? 0;

  return (
    <AdminChrome
      index="ADMIN"
      title={unread > 0 ? `Enquiries — ${unread} unread` : "Enquiries"}
    >
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : !rows ? (
        <Loading text="Loading enquiries" />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          body="Messages sent through the contact form on your site will appear here."
        />
      ) : (
        <div className="divide-y divide-line-soft">
          {rows.map((r) => (
            <article key={r.id} className="px-4 py-6 sm:px-6">
              <div className="flex flex-wrap items-center gap-3">
                {!r.read ? (
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                ) : (
                  <Inbox size={12} strokeWidth={1.5} aria-hidden className="shrink-0 text-dim" />
                )}
                <span className="text-[15px] font-semibold text-fg">{r.name}</span>
                <a
                  href={`mailto:${r.email}`}
                  className="label inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-fg"
                >
                  <Mail size={11} strokeWidth={1.5} aria-hidden />
                  {r.email}
                </a>
                <time className="label ml-auto text-dim" dateTime={r.createdAt}>
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>

              <p className="mt-4 max-w-3xl whitespace-pre-wrap text-[15px] leading-relaxed text-muted">
                {r.about}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                {r.who ? <span className="label">For: {r.who}</span> : null}
                <span className="label">Timing: {r.timing}</span>
                {!r.read ? (
                  <button
                    type="button"
                    onClick={() => markRead(r.id)}
                    className="label ml-auto inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-line px-2.5 py-1.5 transition-colors duration-150 hover:border-strong hover:text-fg"
                  >
                    <Check size={11} strokeWidth={1.75} aria-hidden />
                    Mark read
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminChrome>
  );
}
