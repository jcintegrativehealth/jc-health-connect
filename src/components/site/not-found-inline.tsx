import { Link } from "@tanstack/react-router";
import { Container } from "./primitives";

interface NotFoundInlineProps {
  label?: string;
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export function NotFoundInline({
  label = "Not found",
  title = "This page is unavailable",
  description = "The item you are looking for may have been moved or is no longer published.",
  backTo = "/",
  backLabel = "Return home",
}: NotFoundInlineProps) {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="eyebrow text-gold mb-4">{label}</div>
        <h1 className="font-serif text-4xl md:text-5xl text-navy">{title}</h1>
        <p className="mt-4 text-sm text-navy/60 leading-relaxed">{description}</p>
        <div className="mt-8 flex justify-center">
          <Link
            to={backTo}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] ring-1 ring-navy hover:bg-academic transition-colors"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </Container>
  );
}
