import { Check, Send } from "lucide-react";
import { BorderBeam } from "./fx/BorderBeam";
import { ThinkingOrb } from "./fx/ThinkingOrb";
import { useState, type FormEvent } from "react";

const TIMINGS = ["as soon as possible", "next few months", "just exploring", "not sure"] as const;

type State = "idle" | "sending" | "sent";

const field =
  "w-full rounded-[var(--radius)] border border-line bg-card px-3.5 py-3 text-[15px] text-fg outline-none transition-colors duration-150 placeholder:text-dim focus:border-strong";

export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");
  const [issues, setIssues] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;

    const data = new FormData(e.currentTarget);
    setState("sending");
    setIssues([]);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState("idle");
        setIssues(
          Array.isArray(body.issues) && body.issues.length > 0
            ? body.issues
            : ["That didn't send. Try again, or email me directly."],
        );
        return;
      }
      setState("sent");
    } catch {
      setState("idle");
      setIssues(["Couldn't reach the server. Check your connection, or email me directly."]);
    }
  };

  if (state === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius)] border border-line bg-card px-6 py-8">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-line bg-raised text-accent"
        >
          <Check size={18} strokeWidth={1.75} />
        </span>
        <p className="text-[20px] font-semibold tracking-[-0.015em]">Got it — thank you.</p>
        <p className="max-w-md text-[15px] leading-relaxed text-muted">
          I read every message myself. You'll hear back from me within two
          working days, including an honest no if I'm not the right person for it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-medium text-fg">Your name</span>
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-medium text-fg">Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            inputMode="email"
            className={field}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[14px] font-medium text-fg">What do you need built?</span>
        <textarea
          name="about"
          required
          rows={5}
          maxLength={4000}
          placeholder="A booking app for my clinic. Patients pick a time, we confirm by SMS."
          className={field}
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-medium text-fg">
            Who is it for? <span className="text-dim">(optional)</span>
          </span>
          <input
            name="who"
            maxLength={200}
            placeholder="Dentists in Addis"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-medium text-fg">When does it need to be live?</span>
          <select name="timing" defaultValue="not sure" className={field}>
            {TIMINGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* honeypot — hidden from people, filled by bots */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {issues.length > 0 ? (
        <div role="alert" className="flex flex-col gap-1.5 rounded-[var(--radius)] border border-line bg-card px-4 py-3">
          {issues.map((i) => (
            <p key={i} className="text-[14px] text-fg">
              {i}
            </p>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <BorderBeam>
          <button
            type="submit"
            disabled={state === "sending"}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[calc(var(--radius)-1px)] bg-fg px-6 text-[15px] font-medium text-bg transition-opacity duration-150 hover:opacity-88 disabled:opacity-60"
          >
            {state === "sending" ? (
              <ThinkingOrb size={15} />
            ) : (
              <Send size={15} strokeWidth={1.75} aria-hidden />
            )}
            {state === "sending" ? "Sending" : "Send it"}
          </button>
        </BorderBeam>
        <span className="text-[14px] text-muted">Or email me directly — link below.</span>
      </div>
    </form>
  );
}
