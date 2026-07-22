import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { requestPasswordReset, signInWithPassword } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — JC Integrative Health" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 6;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError(null);

    if (!emailValid || !passwordValid) {
      setError("Please enter a valid email and password (min. 6 characters).");
      return;
    }

    setLoading(true);
    const result = await signInWithPassword(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(
        /invalid/i.test(result.error)
          ? "Invalid email or password. Please try again."
          : result.error,
      );
      return;
    }

    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-mist/40 grid lg:grid-cols-2">
      {/* Left — editorial panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-navy text-paper p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_10%,var(--gold),transparent_40%),radial-gradient(circle_at_80%_80%,var(--teal),transparent_45%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-sm bg-beige ring-1 ring-paper/20 flex items-center justify-center overflow-hidden">
              <img src="/favicon.png" alt="" className="h-8 w-8 object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg">JC</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-paper/60">Integrative Health</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="eyebrow text-gold/90 mb-4">Practice console</div>
          <h1 className="font-serif text-4xl leading-[1.15] max-w-md">
            Deliver measured, longitudinal care — with clarity.
          </h1>
          <p className="text-sm text-paper/65 mt-4 max-w-md leading-relaxed">
            Secure, HIPAA-aligned tools for scheduling, clinical records, labs, and
            longitudinal care plans across the JC Integrative Health practice.
          </p>
          <div className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest text-paper/50">
            <ShieldCheck size={14} strokeWidth={1.5} className="text-teal" />
            Encrypted session · Audit-logged access
          </div>
        </div>
        <div className="relative text-[11px] uppercase tracking-widest text-paper/45">
          © {new Date().getFullYear()} JC Integrative Health
        </div>
      </aside>

      {/* Right — form */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-sm bg-beige ring-1 ring-navy/15 flex items-center justify-center overflow-hidden">
              <img src="/favicon.png" alt="" className="h-7 w-7 object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-navy">JC</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-navy/55">Integrative Health</div>
            </div>
          </div>

          <div className="eyebrow text-gold mb-3">Admin access</div>
          <h2 className="font-serif text-3xl md:text-4xl text-navy leading-tight">Sign in to your console</h2>
          <p className="text-sm text-navy/60 mt-2">
            Enter your credentials to continue. Sessions are audit-logged.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-destructive/30 bg-destructive/5 text-destructive/90 px-3.5 py-3 text-sm rounded-sm"
              >
                <AlertCircle size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <Field
              label="Email"
              htmlFor="admin-email"
              error={touched.email && !emailValid ? "Enter a valid email address." : undefined}
            >
              <div className="relative">
                <Mail size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/45" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@clinic.com"
                  className="w-full h-11 pl-9 pr-3 bg-paper border border-navy/15 rounded-sm text-sm text-navy placeholder:text-navy/40 outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 disabled:opacity-60"
                />
              </div>
            </Field>

            <Field
              label="Password"
              htmlFor="admin-password"
              error={touched.password && !passwordValid ? "Password must be at least 6 characters." : undefined}
              action={
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-widest text-navy/55 hover:text-navy"
                  onClick={async () => {
                    if (!emailValid) {
                      setTouched((t) => ({ ...t, email: true }));
                      setError("Enter your email first, then tap Forgot.");
                      return;
                    }
                    await requestPasswordReset(email.trim());
                    toast.success("If that account exists, a reset link is on its way.");
                  }}
                >
                  Forgot?
                </button>
              }
            >
              <div className="relative">
                <Lock size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/45" />
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className="w-full h-11 pl-9 pr-10 bg-paper border border-navy/15 rounded-sm text-sm text-navy placeholder:text-navy/40 outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-navy/45 hover:text-navy"
                >
                  {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </Field>

            <label className="flex items-center gap-2 text-xs text-navy/70 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded-[2px] border-navy/25 text-navy focus:ring-navy/20"
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 bg-navy text-paper text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-academic transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={14} strokeWidth={2} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-[11px] text-navy/50 text-center leading-relaxed">
              Authorized personnel only. Access attempts are logged.
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  action,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={htmlFor} className="text-[11px] uppercase tracking-widest text-navy/60 font-medium">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <div className="mt-1.5 text-xs text-destructive/90 flex items-center gap-1.5">
          <AlertCircle size={12} strokeWidth={1.5} /> {error}
        </div>
      )}
    </div>
  );
}
