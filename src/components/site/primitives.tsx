import type { ReactNode } from "react";

export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-gold">
      {index && <span className="font-mono text-[10px] tracking-widest">{index}</span>}
      <span className="eyebrow text-gold">{children}</span>
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-gold/60 bg-gold/5 px-5 py-4 text-xs text-navy/70 leading-relaxed">
      {children}
    </div>
  );
}

export function Rule() {
  return <hr className="border-t rule-thin" />;
}

export function PageHeader({ eyebrow, title, lede, meta }: { eyebrow?: string; title: string; lede?: string; meta?: ReactNode }) {
  return (
    <header className="max-w-[1440px] mx-auto px-6 pt-14 md:pt-20 pb-10 md:pb-14">
      {eyebrow && (
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-gold/60" aria-hidden />
          <div className="eyebrow text-gold">{eyebrow}</div>
        </div>
      )}
      <h1 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl text-navy max-w-4xl text-balance tracking-[-0.01em]">{title}</h1>
      {lede && <p className="mt-5 md:mt-6 text-base md:text-lg text-navy/65 max-w-2xl text-pretty leading-relaxed">{lede}</p>}
      {meta && <div className="mt-8 md:mt-10 pt-5 border-t border-navy/10 text-[11px] font-mono uppercase tracking-[0.18em] text-navy/50 flex flex-wrap gap-x-6 gap-y-2">{meta}</div>}
    </header>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1440px] mx-auto px-6 ${className}`}>{children}</div>;
}

export function DemoBanner() {
  return (
    <div className="bg-gold/10 border-y border-gold/30 text-navy/80 text-xs px-6 py-2 text-center tracking-wide">
      Demonstration interface — no real medical, personal, or billing data is processed.
    </div>
  );
}
