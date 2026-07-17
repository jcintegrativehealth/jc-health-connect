import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Search, Filter, Download, MoreHorizontal, Plus } from "lucide-react";
import type { Status } from "@/data/admin";

/* ----------------------------- Page primitives ---------------------------- */

export function PageHeader({
  eyebrow, title, description, actions, crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <header className="mb-8">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-navy/45 mb-4">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {c.to ? <Link to={c.to} className="hover:text-navy">{c.label}</Link> : <span className={i === crumbs.length - 1 ? "text-navy/70" : ""}>{c.label}</span>}
              {i < crumbs.length - 1 && <ChevronRight size={11} strokeWidth={1.5} />}
            </span>
          ))}
        </nav>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          {eyebrow && <div className="eyebrow text-gold mb-2">{eyebrow}</div>}
          <h1 className="font-serif text-3xl md:text-4xl text-navy leading-[1.1] truncate">{title}</h1>
          {description && <p className="text-sm text-navy/60 mt-2 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

/* -------------------------------- Buttons -------------------------------- */

export function Btn({
  variant = "primary", size = "md", className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "gold"; size?: "sm" | "md" }) {
  const sizes = size === "sm" ? "h-8 px-3 text-[11px]" : "h-9 px-4 text-xs";
  const styles = {
    primary: "bg-navy text-paper hover:bg-academic",
    outline: "border border-navy/20 text-navy hover:border-navy/40",
    ghost: "text-navy/70 hover:text-navy",
    gold: "border border-gold/50 text-navy hover:bg-gold/10",
  }[variant];
  return <button {...rest} className={`inline-flex items-center justify-center gap-2 uppercase tracking-widest font-semibold transition-colors ${sizes} ${styles} ${className}`} />;
}

/* -------------------------------- StatCard ------------------------------- */

export function StatCard({
  label, value, sub, tone = "navy", trend,
}: { label: string; value: string | number; sub?: string; tone?: "navy" | "teal" | "gold"; trend?: string }) {
  const accent = tone === "teal" ? "border-teal/40" : tone === "gold" ? "border-gold/40" : "border-navy/10";
  return (
    <div className={`bg-card border ${accent} p-5`}>
      <div className="eyebrow text-navy/45">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-serif text-3xl md:text-4xl text-navy leading-none">{value}</div>
        {trend && <span className="text-[10px] uppercase tracking-widest text-teal">{trend}</span>}
      </div>
      {sub && <div className="text-xs text-navy/50 mt-2">{sub}</div>}
    </div>
  );
}

/* -------------------------------- Badges --------------------------------- */

const badgeMap: Record<string, string> = {
  Confirmed: "text-teal border-teal/40",
  "Checked In": "text-navy border-navy/30",
  "In Progress": "text-gold border-gold/40",
  Completed: "text-navy/60 border-navy/20",
  Cancelled: "text-navy/40 border-navy/10",
  "No Show": "text-destructive border-destructive/40",
  Active: "text-teal border-teal/40",
  New: "text-gold border-gold/40",
  "Follow-Up": "text-gold border-gold/40",
  "Follow-Up Required": "text-gold border-gold/40",
  Inactive: "text-navy/40 border-navy/10",
  Archived: "text-navy/40 border-navy/10",
  Draft: "text-navy/50 border-navy/15",
  "In Review": "text-gold border-gold/40",
  Approved: "text-teal border-teal/40",
  Scheduled: "text-navy border-navy/30",
  Published: "text-teal border-teal/40",
  Sent: "text-navy border-navy/30",
  Paid: "text-teal border-teal/40",
  Partial: "text-gold border-gold/40",
  Overdue: "text-destructive border-destructive/40",
  Refunded: "text-navy/40 border-navy/10",
  "To Do": "text-navy border-navy/30",
  Waiting: "text-navy/50 border-navy/15",
  Reviewed: "text-teal border-teal/40",
  "Requires Follow-Up": "text-gold border-gold/40",
};

export function Badge({ children, tone }: { children: React.ReactNode; tone?: Status | string }) {
  const cls = (tone && badgeMap[tone as string]) || "text-navy/60 border-navy/20";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] uppercase tracking-[0.18em] font-medium ${cls}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-7 text-[11px] uppercase tracking-widest border transition-colors ${active ? "border-navy text-navy" : "border-navy/15 text-navy/55 hover:text-navy hover:border-navy/40"}`}
    >{children}</button>
  );
}

/* -------------------------------- Toolbar -------------------------------- */

export function Toolbar({
  searchPlaceholder = "Search…",
  onSearch,
  right,
  filters,
}: {
  searchPlaceholder?: string;
  onSearch?: (v: string) => void;
  right?: React.ReactNode;
  filters?: React.ReactNode;
}) {
  return (
    <div className="border border-navy/10 bg-paper">
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-navy/10">
        <label className="flex items-center gap-2 h-9 border border-navy/15 bg-card px-3 min-w-0 flex-1 sm:max-w-sm">
          <Search size={13} strokeWidth={1.5} className="text-navy/40 shrink-0" />
          <input
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-transparent w-full text-sm outline-none placeholder:text-navy/40"
          />
        </label>
        <div className="flex items-center gap-2 flex-wrap">{right}</div>
      </div>
      {filters && (
        <div className="flex items-center gap-2 flex-wrap p-3 border-b border-navy/10">
          <Filter size={12} strokeWidth={1.5} className="text-navy/40" />
          {filters}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Table ---------------------------------- */

export function DataTable<T extends { id: string }>({
  columns, rows, onRowClick, empty = "No results", renderMobile,
}: {
  columns: { key: string; label: string; align?: "right" | "left"; render?: (row: T) => React.ReactNode }[];
  rows: T[];
  onRowClick?: (row: T) => void;
  empty?: string;
  renderMobile?: (row: T) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return <div className="p-12 text-center text-sm text-navy/50 border border-t-0 border-navy/10 bg-paper">{empty}</div>;
  }
  return (
    <div className="border border-t-0 border-navy/10 bg-paper">
      {/* Desktop */}
      <table className="w-full text-sm hidden md:table">
        <thead className="text-left">
          <tr className="border-b border-navy/10 bg-mist/40">
            {columns.map((c) => (
              <th key={c.key} className={`p-3 eyebrow font-normal text-navy/50 ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>
            ))}
            <th className="p-3 w-8" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onRowClick?.(r)} className={`border-b border-navy/5 hover:bg-mist/40 ${onRowClick ? "cursor-pointer" : ""}`}>
              {columns.map((c) => (
                <td key={c.key} className={`p-3 text-navy ${c.align === "right" ? "text-right" : ""}`}>
                  {c.render ? c.render(r) : (r as never)[c.key]}
                </td>
              ))}
              <td className="p-3 text-right"><MoreHorizontal size={14} className="text-navy/40 inline" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-navy/10">
        {rows.map((r) => (
          <div key={r.id} onClick={() => onRowClick?.(r)} className={`p-4 ${onRowClick ? "cursor-pointer" : ""}`}>
            {renderMobile ? renderMobile(r) : (
              <div className="space-y-1">
                {columns.slice(0, 3).map((c) => (
                  <div key={c.key} className="flex justify-between gap-3 text-sm">
                    <span className="text-navy/50 text-xs uppercase tracking-widest">{c.label}</span>
                    <span className="text-navy text-right">{c.render ? c.render(r) : (r as never)[c.key]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pagination({ page = 1, total = 1 }: { page?: number; total?: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-t-0 border-navy/10 bg-paper text-xs text-navy/55">
      <span>Page {page} of {total}</span>
      <div className="flex items-center gap-1">
        <button className="h-7 px-3 border border-navy/15 hover:border-navy/40">Prev</button>
        <button className="h-7 px-3 border border-navy/15 hover:border-navy/40">Next</button>
      </div>
    </div>
  );
}

/* --------------------------------- States -------------------------------- */

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="border border-navy/10 bg-paper p-12 text-center">
      <div className="mx-auto h-10 w-10 border border-navy/15 flex items-center justify-center text-navy/40 mb-4">
        <Plus size={16} strokeWidth={1.5} />
      </div>
      <div className="font-serif text-xl text-navy">{title}</div>
      {description && <p className="text-sm text-navy/55 mt-2 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingBar() {
  return <div className="h-0.5 bg-navy/10 overflow-hidden"><div className="h-full w-1/3 bg-gold animate-pulse" /></div>;
}

/* --------------------------------- Charts -------------------------------- */

export function BarChart({ data, height = 140, tone = "teal" }: { data: number[]; height?: number; tone?: "teal" | "navy" | "gold" }) {
  const max = Math.max(...data);
  const color = tone === "teal" ? "bg-teal/60" : tone === "gold" ? "bg-gold/70" : "bg-navy/70";
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <div className={color} style={{ height: `${(v / max) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, height = 140 }: { data: number[]; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 90 - 5}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height, width: "100%" }} className="overflow-visible">
      <polyline fill="none" stroke="var(--teal)" strokeWidth="1.5" points={points} vectorEffect="non-scaling-stroke" />
      <polyline fill="var(--teal)" fillOpacity="0.12" stroke="none" points={`0,100 ${points} 100,100`} />
    </svg>
  );
}

export function Donut({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" width="120" height="120" className="-rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--mist)" strokeWidth="14" />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} />
          );
          acc += len;
          return el;
        })}
      </svg>
      <ul className="text-xs space-y-1.5">
        {segments.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2 w-2" style={{ background: s.color }} />
            <span className="text-navy/70">{s.label}</span>
            <span className="text-navy/45">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------- Card wrapper --------------------------- */

export function Panel({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-card border border-navy/10 ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between p-4 border-b border-navy/10">
          {title && <div className="eyebrow text-navy/50">{title}</div>}
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

/* ------------------------------ Export button ---------------------------- */

export function ExportBtn() {
  return <Btn variant="outline" size="sm"><Download size={12} /> Export</Btn>;
}
