import { createFileRoute, Navigate } from "@tanstack/react-router";

// Dev-only stub: real auth will be wired later. Any hit on /admin/login redirects to /admin.
export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin — JC Integrative Health" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Navigate to="/admin" replace />,
});
