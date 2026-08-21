import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EnquiryForm } from "./EnquiryForm";

type Step = "ask" | "form";

/**
 * Two steps on purpose: a stranger who is only browsing should be able to
 * decline in one tap without ever seeing a form.
 */
export function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("ask");
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  const close = useCallback(() => {
    onClose();
    // reset only after the exit, so the panel does not flicker back to step one
    window.setTimeout(() => setStep("ask"), 220);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;

      // keep focus inside the dialog
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    }, 60);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (openerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/72 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="w-full max-w-xl overflow-hidden rounded-[var(--radius)] border border-line bg-card shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-4 border-b border-line px-6 py-4">
          <h2 id="enquiry-modal-title" className="text-[15px] font-semibold text-fg">
            {step === "ask" ? "Got something in mind?" : "Tell me about it"}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-line text-muted transition-colors duration-150 hover:border-strong hover:text-fg"
          >
            <X size={14} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        {step === "ask" ? (
          <div className="px-6 py-8">
            <p className="max-w-md text-[17px] leading-relaxed text-muted">
              An app, a website, or something you have been putting off because
              you did not know who to ask. If you have something, I would like
              to hear it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="min-h-12 rounded-[var(--radius)] bg-fg px-6 text-[15px] font-medium text-bg transition-opacity duration-150 hover:opacity-88"
              >
                Yes, I do
              </button>
              <button
                type="button"
                onClick={close}
                className="min-h-12 rounded-[var(--radius)] border border-line px-6 text-[15px] text-muted transition-colors duration-150 hover:border-strong hover:text-fg"
              >
                Not right now
              </button>
            </div>
          </div>
        ) : (
          <div className="max-h-[72vh] overflow-y-auto px-6 py-6">
            <EnquiryForm />
          </div>
        )}
      </div>
    </div>
  );
}
