import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";

const CAL_LINK = import.meta.env.VITE_CAL_LINK as string | undefined;

/**
 * Cal.com booking embed. Needs a booking link, not an API key — the embed is
 * public by design. Falls back to a plain email prompt when unconfigured, so
 * the section never renders as an empty hole.
 */
export function BookingWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CAL_LINK) return;
    let cancelled = false;

    (async () => {
      try {
        const cal = await getCalApi();
        if (cancelled) return;
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          cssVarsPerTheme: {
            dark: {
              "cal-brand": "#c8825a",
              "cal-bg": "#121213",
              "cal-bg-emphasis": "#171718",
              "cal-border": "rgba(244,242,239,0.14)",
              "cal-text": "#f4f2ef",
              "cal-text-emphasis": "#f4f2ef",
            },
            light: {
              "cal-brand": "#c8825a",
            },
          },
          layout: "month_view",
        });
        setReady(true);
      } catch {
        // embed script blocked or offline — the fallback below still shows
        setReady(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!CAL_LINK) {
    return (
      <div className="rounded-[var(--radius)] border border-line bg-card px-6 py-10">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-line bg-raised text-accent"
        >
          <CalendarClock size={18} strokeWidth={1.6} />
        </span>
        <p className="mt-5 text-[17px] font-semibold text-fg">Booking isn't connected yet</p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
          Set <code className="font-mono text-[13px] text-fg">VITE_CAL_LINK</code> to
          your Cal.com booking link and the calendar appears here.
        </p>
        <a
          href="mailto:officialdawitworku@gmail.com"
          className="mt-6 inline-flex rounded-[var(--radius)] bg-fg px-5 py-3 text-[15px] font-medium text-bg transition-opacity duration-150 hover:opacity-88"
        >
          Email me instead
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-card">
      {!ready ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <span className="label">Loading calendar</span>
        </div>
      ) : null}
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", minHeight: 620, overflow: "scroll" }}
        config={{ layout: "month_view", theme: "dark" }}
      />
    </div>
  );
}
