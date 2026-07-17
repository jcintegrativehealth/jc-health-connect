import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Inbox, Loader2 } from "lucide-react";

const shell =
  "border border-navy/10 bg-card/60 rounded-sm px-8 py-14 text-center flex flex-col items-center gap-4";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className={shell} role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 text-academic animate-spin" strokeWidth={1.5} />
      <div className="eyebrow text-navy/50">{label}</div>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className={shell}>
      <div className="h-10 w-10 rounded-full bg-mist grid place-items-center text-academic">
        {icon ?? <Inbox className="h-4 w-4" strokeWidth={1.5} />}
      </div>
      <div>
        <h3 className="font-serif text-xl text-navy">{title}</h3>
        {description && <p className="mt-2 text-sm text-navy/60 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={`${shell} border-l-2 border-l-destructive`}
      role="alert"
    >
      <div className="h-10 w-10 rounded-full bg-destructive/10 grid place-items-center text-destructive">
        <AlertCircle className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-serif text-xl text-navy">{title}</h3>
        <p className="mt-2 text-sm text-navy/60 max-w-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SuccessState({
  title = "Confirmed",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`${shell} border-l-2 border-l-teal`}>
      <div className="h-10 w-10 rounded-full bg-teal/25 grid place-items-center text-academic">
        <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-serif text-xl text-navy">{title}</h3>
        {description && <p className="mt-2 text-sm text-navy/60 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
