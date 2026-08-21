import { CalendarClock, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminChrome } from "../../components/admin/AdminChrome";
import { EmptyState, ErrorState, Loading } from "../../components/admin/States";
import { readError } from "../../lib/adminApi";

type Booking = {
  uid: string;
  title: string;
  start: string;
  end: string;
  status?: string;
  attendees?: Array<{ name?: string; email?: string }>;
};
type EventType = {
  id: number;
  title: string;
  slug: string;
  length: number;
  hidden: boolean;
  url: string;
};
type Data = {
  configured: boolean;
  reason?: string;
  user?: { username?: string; email?: string; timeZone?: string } | null;
  bookerUrl?: string;
  bookings?: Booking[];
  eventTypes?: EventType[];
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export function AdminBookings() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/cal", { credentials: "same-origin" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(readError(String(body.error ?? "request_failed")));
      setData(body as Data);
    } catch {
      setError(readError("network_unreachable"));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const cancel = async (uid: string, title: string) => {
    if (!window.confirm(`Cancel "${title}"? The attendee is notified by Cal.com.`)) return;
    setBusy(uid);
    const res = await fetch(`/api/cal?cancel=${encodeURIComponent(uid)}`, {
      method: "POST",
      credentials: "same-origin",
    });
    setBusy(null);
    if (res.ok) void load();
    else setError("Couldn't cancel that booking.");
  };

  const upcoming = (data?.bookings ?? [])
    .filter((b) => new Date(b.start).getTime() > Date.now())
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));

  return (
    <AdminChrome index="ADMIN" title="Bookings">
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : !data ? (
        <Loading text="Reading your calendar" />
      ) : !data.configured ? (
        <EmptyState
          title="Cal.com not connected"
          body={data.reason ?? "Set CAL_API_KEY to manage bookings here."}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 border-b border-line-soft lg:grid-cols-4">
            {[
              { k: "Upcoming", v: upcoming.length },
              { k: "Total bookings", v: (data.bookings ?? []).length },
              { k: "Event types", v: (data.eventTypes ?? []).length },
              { k: "Time zone", v: data.user?.timeZone?.split("/")[1]?.replace("_", " ") ?? "—" },
            ].map((s) => (
              <div key={s.k} className="border-b border-r border-line-soft px-4 py-6 sm:px-6">
                <p className="truncate text-[24px] font-semibold leading-none tracking-[-0.02em]">
                  {s.v}
                </p>
                <p className="label mt-3">{s.k}</p>
              </div>
            ))}
          </div>

          <section className="border-b border-line-soft">
            <div className="flex items-center gap-3 border-b border-line-soft px-4 py-4 sm:px-6">
              <CalendarClock size={14} strokeWidth={1.6} aria-hidden className="text-accent" />
              <span className="text-[14px] font-semibold text-fg">Upcoming</span>
            </div>
            {upcoming.length === 0 ? (
              <p className="label px-4 py-10 text-center text-dim sm:px-6">
                Nothing booked yet
              </p>
            ) : (
              upcoming.map((b) => (
                <div
                  key={b.uid}
                  className="flex flex-wrap items-center gap-4 border-b border-line-soft px-4 py-4 last:border-b-0 sm:px-6"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[15px] font-medium text-fg">{b.title}</span>
                    <span className="label text-dim">
                      {b.attendees?.[0]?.name ?? "—"}
                      {b.attendees?.[0]?.email ? ` · ${b.attendees[0].email}` : ""}
                    </span>
                  </span>
                  <span className="label ml-auto whitespace-nowrap">{when(b.start)}</span>
                  <button
                    type="button"
                    onClick={() => cancel(b.uid, b.title)}
                    disabled={busy === b.uid}
                    className="label inline-flex items-center gap-2 rounded-[var(--radius)] border border-line px-3 py-2 transition-colors duration-150 hover:border-strong hover:text-fg disabled:opacity-50"
                  >
                    <X size={11} strokeWidth={1.75} aria-hidden />
                    Cancel
                  </button>
                </div>
              ))
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 border-b border-line-soft px-4 py-4 sm:px-6">
              <span className="text-[14px] font-semibold text-fg">Event types</span>
              <a
                href="https://app.cal.com/event-types"
                target="_blank"
                rel="noopener noreferrer"
                className="label ml-auto inline-flex items-center gap-2 transition-colors duration-150 hover:text-fg"
              >
                Edit on Cal.com
                <ExternalLink size={11} strokeWidth={1.6} aria-hidden />
              </a>
            </div>
            {(data.eventTypes ?? []).map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-4 border-b border-line-soft px-4 py-4 last:border-b-0 sm:px-6"
              >
                <span className="text-[15px] font-medium text-fg">{e.title}</span>
                <span className="label text-dim">/{e.slug}</span>
                {e.hidden ? <span className="label text-dim">hidden</span> : null}
                <span className="label ml-auto">{e.length} min</span>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label inline-flex items-center gap-2 transition-colors duration-150 hover:text-fg"
                >
                  Open
                  <ExternalLink size={11} strokeWidth={1.6} aria-hidden />
                </a>
              </div>
            ))}
          </section>
        </>
      )}
    </AdminChrome>
  );
}
