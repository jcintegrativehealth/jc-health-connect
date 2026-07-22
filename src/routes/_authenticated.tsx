// HANDOFF §6 — pathless auth gate for /admin/* and /patient/*.
// URLs stay the same; this layout only decides who gets through:
//   /admin/*   → session + admin/clinician role (via user_roles under RLS)
//   /patient/* → any authenticated session
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { isStaff, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const auth = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const needsStaff = pathname.startsWith("/admin");

  const allowed =
    auth.status === "ready" && (!needsStaff || isStaff(auth.roles));

  useEffect(() => {
    if (auth.status === "signed-out") {
      nav({ to: needsStaff ? "/admin/login" : "/portal", replace: true });
      return;
    }
    if (auth.status === "ready" && needsStaff && !isStaff(auth.roles)) {
      // Signed in but not staff — send them to the patient side.
      nav({ to: "/portal", replace: true });
    }
  }, [auth.status, auth.roles, needsStaff, nav]);

  if (!allowed) {
    return (
      <div className="min-h-screen grid place-items-center bg-paper text-navy">
        <div className="flex items-center gap-3 text-sm text-navy/55">
          <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
          Verifying access…
        </div>
      </div>
    );
  }

  return <Outlet />;
}
