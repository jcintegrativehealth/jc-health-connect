import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { signInAdmin, useAdminAuth } from "@/lib/adminAuth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Sign in — JC Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const { authed, ready } = useAdminAuth();
  const search = useRouterState({ select: (s) => s.location.search }) as { redirect?: string };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && authed) {
      const to = typeof search?.redirect === "string" ? search.redirect : "/admin";
      nav({ to, replace: true });
    }
  }, [ready, authed, nav, search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = signInAdmin(email, password);
    setBusy(false);
    if (!ok) {
      setErr("Invalid email or password.");
      return;
    }
    const to = typeof search?.redirect === "string" ? search.redirect : "/admin";
    nav({ to, replace: true });
  };

  return (
    <div className="min-h-screen bg-paper text-navy grid place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="mx-auto h-11 w-11 border border-navy/15 flex items-center justify-center font-serif text-sm bg-card">JC</div>
          <div className="mt-4 eyebrow text-navy/45">Private · Admin</div>
          <h1 className="mt-1 font-serif text-2xl text-navy">JC Integrative Health</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-navy/45">Authorized personnel only</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-navy/55">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full h-11 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-navy/55">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full h-11 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
            />
          </label>

          {err && (
            <div className="text-[11px] uppercase tracking-widest text-terracotta border border-terracotta/40 bg-terracotta/5 px-3 py-2">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 size={13} className="animate-spin" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-navy/35">
          Sessions are stored locally on this device.
        </p>
      </div>
    </div>
  );
}
