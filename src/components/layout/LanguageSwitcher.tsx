import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/i18n";

export function LanguageSwitcher({ variant = "inline" }: { variant?: "inline" | "compact" }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2) as LangCode;

  const set = (code: LangCode) => {
    void i18n.changeLanguage(code);
  };

  if (variant === "compact") {
    return (
      <select
        value={current}
        onChange={(e) => set(e.target.value as LangCode)}
        className="bg-transparent text-xs font-mono uppercase tracking-widest text-navy/60 outline-none"
        aria-label="Language"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.short}</option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-3" role="group" aria-label="Language">
      {SUPPORTED_LANGUAGES.map((l, i) => (
        <span key={l.code} className="flex items-center gap-3">
          {i > 0 && <span className="text-navy/20">/</span>}
          <button
            type="button"
            onClick={() => set(l.code)}
            className={`transition-colors ${current === l.code ? "text-navy" : "text-navy/45 hover:text-navy"}`}
            aria-current={current === l.code ? "true" : undefined}
          >
            {l.short}
          </button>
        </span>
      ))}
    </div>
  );
}
