import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/i18n";
import { useEffect, useState } from "react";
import { Globe, X, Check } from "lucide-react";

export function LanguageSwitcher({ variant = "inline" }: { variant?: "inline" | "compact" }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2) as LangCode;
  const [open, setOpen] = useState(false);

  const currentMeta = SUPPORTED_LANGUAGES.find((l) => l.code === current) ?? SUPPORTED_LANGUAGES[0];

  const set = (code: LangCode) => {
    void i18n.changeLanguage(code);
    setOpen(false);
  };

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const triggerClass =
    variant === "compact"
      ? "inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-navy/60 hover:text-navy transition-colors"
      : "group inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy/70 hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Language — ${currentMeta.label}`}
        className={triggerClass}
      >
        <Globe size={13} strokeWidth={1.5} className="text-navy/50 group-hover:text-gold transition-colors" />
        <span>{currentMeta.short}</span>
        <span aria-hidden="true" className="hidden sm:inline text-navy/25">·</span>
        <span aria-hidden="true" className="hidden sm:inline text-navy/40 normal-case tracking-normal font-serif italic text-[13px]">
          {currentMeta.label}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Select language"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy/25 backdrop-blur-[3px] animate-in fade-in duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <aside
            className="absolute inset-y-0 right-0 w-[88%] max-w-[420px] bg-paper border-l border-navy/15 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out"
          >
            {/* Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-navy/15">
              <div className="flex items-baseline gap-3">
                <span className="eyebrow text-gold">Language</span>
                <span className="font-mono text-[10px] text-navy/35">04 · OPTIONS</span>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="w-10 h-10 grid place-items-center text-navy/60 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Intro */}
            <div className="px-8 pt-8 pb-6 border-b border-navy/10">
              <h2 className="font-serif text-3xl text-navy leading-tight">
                Choose your <em className="text-gold not-italic font-serif">language</em>
              </h2>
              <p className="mt-3 text-sm text-navy/55 leading-relaxed">
                Content, forms, and clinical materials adapt to your preferred language across the site.
              </p>
            </div>

            {/* Options */}
            <ul className="flex-1 overflow-y-auto px-4 py-4">
              {SUPPORTED_LANGUAGES.map((l, i) => {
                const active = current === l.code;
                return (
                  <li key={l.code}>
                    <button
                      type="button"
                      onClick={() => set(l.code)}
                      aria-current={active ? "true" : undefined}
                      className={[
                        "w-full flex items-center gap-5 px-4 py-4 border-l-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        active
                          ? "border-l-gold bg-gold/[0.06]"
                          : "border-l-transparent hover:border-l-navy/25 hover:bg-navy/[0.02]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "font-mono text-[10px] tracking-widest w-6",
                          active ? "text-gold" : "text-navy/30",
                        ].join(" ")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 text-left">
                        <div
                          className={[
                            "font-serif text-2xl leading-none transition-colors",
                            active ? "text-navy" : "text-navy/75 group-hover:text-navy",
                          ].join(" ")}
                        >
                          {l.label}
                        </div>
                        <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-navy/40">
                          {l.short}
                        </div>
                      </div>
                      <span
                        aria-hidden="true"
                        className={[
                          "w-7 h-7 grid place-items-center rounded-full border transition-all",
                          active
                            ? "border-gold bg-gold text-paper"
                            : "border-navy/15 text-transparent group-hover:border-navy/40",
                        ].join(" ")}
                      >
                        <Check size={13} strokeWidth={2} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-navy/15 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-navy/40">
                JC · Integrative Health
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-navy/40">Global care</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
