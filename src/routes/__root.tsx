import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Toaster } from "../components/ui/sonner";
import "../i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <div className="eyebrow text-gold mb-4">Error 404</div>
        <h1 className="font-serif text-5xl text-navy">Page not found</h1>
        <p className="mt-4 text-sm text-navy/60">The page you are looking for is unavailable or has been moved.</p>
        <div className="mt-8 flex justify-center">
          <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] ring-1 ring-navy hover:bg-academic transition-colors">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <div className="eyebrow text-gold mb-4">Something went wrong</div>
        <h1 className="font-serif text-4xl text-navy">This page didn't load</h1>
        <p className="mt-4 text-sm text-navy/60">You can retry or return home.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic transition-colors"
          >
            Try again
          </button>
          <a href="/" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.18em] hover:bg-navy/5 transition-colors">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JC Integrative Health — Integrative Medicine. Longevity. Medical Innovation." },
      { name: "description", content: "Personalized, evidence-based integrative medicine, longevity, and preventive care. Serving Colorado, Washington, and via telehealth." },
      { name: "author", content: "JC Integrative Health" },
      { name: "theme-color", content: "#0D1B2A" },
      { property: "og:site_name", content: "JC Integrative Health" },
      { property: "og:title", content: "JC Integrative Health — Integrative Medicine. Longevity. Medical Innovation." },
      { property: "og:description", content: "Personalized, evidence-based integrative medicine, longevity, and preventive care. Serving Colorado, Washington, and via telehealth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JC Integrative Health — Integrative Medicine. Longevity. Medical Innovation." },
      { name: "twitter:description", content: "Personalized, evidence-based integrative medicine, longevity, and preventive care. Serving Colorado, Washington, and via telehealth." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dfc19d86-ec8c-4b70-beb3-0af0115b97b3/id-preview-d5dffd79--d77700c8-2bda-4091-b0ec-ef7b3c7dd16b.lovable.app-1784600093207.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dfc19d86-ec8c-4b70-beb3-0af0115b97b3/id-preview-d5dffd79--d77700c8-2bda-4091-b0ec-ef7b3c7dd16b.lovable.app-1784600093207.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=Public+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: "JC Integrative Health",
          medicalSpecialty: ["IntegrativeMedicine", "PreventiveMedicine"],
          areaServed: ["Colorado", "Washington"],
          availableService: [
            "Integrative Medicine",
            "Longevity Medicine",
            "Preventive Health",
            "Metabolic Health",
            "Telehealth",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isPatient = pathname === "/patient" || pathname.startsWith("/patient/");
  const isJoin = pathname.startsWith("/join/");
  const hideChrome = isAdmin || isPatient || isJoin;

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen flex flex-col bg-paper`}>
        {!hideChrome && <Header />}
        <main className={`flex-1`}>
          <Outlet />
        </main>
        {!hideChrome && <Footer />}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
