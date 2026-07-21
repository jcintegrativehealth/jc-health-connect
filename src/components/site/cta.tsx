import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

/**
 * Shared CTA primitives for public routes.
 * Ensures consistent sizing, paint, and responsive width across hero, section, and form CTAs.
 * - Primary: navy fill, gold ring accent, uppercase micro-tracking.
 * - Secondary: navy outline on paper.
 * - Submit: primary paint applied to <button type="submit">.
 * All variants: w-full on mobile, w-auto on ≥sm (except SubmitCta which supports fullWidth).
 */

const BASE =
  "inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors";

const PRIMARY = "bg-navy text-paper ring-1 ring-gold/50 hover:bg-academic";
const SECONDARY = "border border-navy/15 text-navy hover:bg-navy/5";

type LinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  fullWidth?: boolean;
};

export function PrimaryCta({ children, className = "", fullWidth, ...rest }: LinkProps) {
  const width = fullWidth ? "w-full" : "w-full sm:w-auto";
  return (
    <Link {...rest} className={`${width} ${BASE} ${PRIMARY} group ${className}`}>
      {children}
    </Link>
  );
}

export function SecondaryCta({ children, className = "", fullWidth, ...rest }: LinkProps) {
  const width = fullWidth ? "w-full" : "w-full sm:w-auto";
  return (
    <Link {...rest} className={`${width} ${BASE} ${SECONDARY} ${className}`}>
      {children}
    </Link>
  );
}

type SubmitProps = ComponentProps<"button"> & { fullWidth?: boolean };

export function SubmitCta({ children, className = "", fullWidth, type = "submit", ...rest }: SubmitProps) {
  const width = fullWidth ? "w-full" : "w-full sm:w-auto";
  return (
    <button {...rest} type={type} className={`${width} ${BASE} ${PRIMARY} ${className}`}>
      {children}
    </button>
  );
}
