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

export function PageHeader({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <header className="max-w-[1440px] mx-auto px-6 pt-20 pb-14">
      {eyebrow && <div className="eyebrow text-gold mb-6">{eyebrow}</div>}
      <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-navy max-w-4xl text-balance">{title}</h1>
      {lede && <p className="mt-6 text-lg text-navy/65 max-w-2xl text-pretty">{lede}</p>}
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
