import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { useAuth, signInWithPassword, signUpWithPassword, signInWithGoogle } from "@/lib/auth";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Patient Portal — JC Integrative Health" },
      { name: "description", content: "Sign in to the JC Integrative Health patient portal." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/portal" }],
  }),
  component: PortalPage,
});

function PortalPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "ready") navigate({ to: "/patient", replace: true });
  }, [auth.status, navigate]);

  if (auth.status === "loading" || auth.status === "ready") {
    return (
      <div className="min-h-screen grid place-items-center bg-mist/40 text-navy">
        <div className="flex items-center gap-3 text-sm text-navy/55">
          <Loader2 size={16} strokeWidth={1.5} className="animate-spin" /> Loading…
        </div>
      </div>
    );
  }

  return <PortalLogin />;
}

function PortalLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 8;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!emailValid || !passwordValid) {
      setError("Enter a valid email and a password of at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await signUpWithPassword(email.trim(), password, firstName.trim(), lastName.trim());
        if (res.error) { setError(res.error); return; }
        if (res.needsConfirmation) {
          setInfo("Check your email to confirm your account, then sign in.");
          setMode("signin");
          return;
        }
        navigate({ to: "/patient" });
      } else {
        const res = await signInWithPassword(email.trim(), password);
        if (res.error) {
          setError(/invalid/i.test(res.error) ? "Invalid email or password. Please try again." : res.error);
          return;
        }
        navigate({ to: "/patient" });
      }
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setGoogleLoading(true);
    const res = await signInWithGoogle("/patient");
    if (res.error) {
      setError(res.error);
      setGoogleLoading(false);
    }
    // On success the browser redirects to Google; no further action here.
  }

  return (
    <div className="min-h-screen bg-mist/40 grid lg:grid-cols-2">
      {/* Left — editorial panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-navy text-paper p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_10%,var(--gold),transparent_40%),radial-gradient(circle_at_80%_80%,var(--teal),transparent_45%)]" />
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-sm bg-beige ring-1 ring-paper/20 flex items-center justify-center overflow-hidden">
            <img src="/favicon.png" alt="" className="h-8 w-8 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg">JC</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-paper/60">Integrative Health</div>
          </div>
        </div>
        <div className="relative">
          <div className="eyebrow text-gold/90 mb-4">Patient Portal</div>
          <h1 className="font-serif text-4xl leading-[1.15] max-w-md">Your care, in one private place.</h1>
          <p className="text-sm text-paper/65 mt-4 max-w-md leading-relaxed">
            View your appointments, join telehealth visits, and keep your contact details up to date.
          </p>
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

          <div className="eyebrow text-gold mb-3">Patient access</div>
          <h2 className="font-serif text-3xl md:text-4xl text-navy leading-tight">
            {mode === "signin" ? "Sign in to your portal" : "Create your account"}
          </h2>
          <p className="text-sm text-navy/60 mt-2">
            {mode === "signin" ? "Welcome back. Enter your details to continue." : "Set up access to your patient portal."}
          </p>

          <button
            onClick={onGoogle}
            disabled={googleLoading || loading}
            className="mt-7 w-full h-11 inline-flex items-center justify-center gap-2 border border-navy/15 bg-paper text-navy text-sm font-medium rounded-sm hover:bg-mist/60 transition-colors disabled:opacity-70"
          >
            {googleLoading ? <Loader2 size={15} className="animate-spin" /> : <GoogleGlyph />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6 text-[11px] uppercase tracking-widest text-navy/35">
            <span className="h-px flex-1 bg-navy/10" /> or <span className="h-px flex-1 bg-navy/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {error && (
              <div role="alert" className="flex items-start gap-2.5 border border-destructive/30 bg-destructive/5 text-destructive/90 px-3.5 py-3 text-sm rounded-sm">
                <AlertCircle size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}
            {info && (
              <div className="border border-teal/40 bg-teal/5 text-navy px-3.5 py-3 text-sm rounded-sm">{info}</div>
            )}

            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <Labeled label="First name">
                  <IconInput icon={<UserIcon size={14} />} value={firstName} onChange={setFirstName} placeholder="First" autoComplete="given-name" />
                </Labeled>
                <Labeled label="Last name">
                  <IconInput icon={<UserIcon size={14} />} value={lastName} onChange={setLastName} placeholder="Last" autoComplete="family-name" />
                </Labeled>
              </div>
            )}

            <Labeled label="Email">
              <IconInput icon={<Mail size={14} />} type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" autoFocus />
            </Labeled>

            <Labeled label="Password">
              <div className="relative">
                <Lock size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/45" />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signin" ? "Your password" : "At least 8 characters"}
                  className="w-full h-11 pl-9 pr-10 bg-paper border border-navy/15 rounded-sm text-sm text-navy placeholder:text-navy/40 outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 disabled:opacity-60"
                />
                <button type="button" aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-navy/45 hover:text-navy">
                  {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </Labeled>

            <button type="submit" disabled={loading} className="w-full h-11 inline-flex items-center justify-center gap-2 bg-navy text-paper text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-academic transition-colors disabled:opacity-70">
              {loading ? <><Loader2 size={14} strokeWidth={2} className="animate-spin" /> Please wait…</> : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-navy/60">
            {mode === "signin" ? (
              <>New patient?{" "}
                <button onClick={() => { setMode("signup"); setError(null); setInfo(null); }} className="text-navy underline underline-offset-2 hover:text-academic">Create an account</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="text-navy underline underline-offset-2 hover:text-academic">Sign in</button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-navy/60 font-medium mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function IconInput({ icon, value, onChange, type = "text", placeholder, autoComplete, autoFocus }: {
  icon: React.ReactNode; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoComplete?: string; autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/45">{icon}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-9 pr-3 bg-paper border border-navy/15 rounded-sm text-sm text-navy placeholder:text-navy/40 outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10"
      />
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
