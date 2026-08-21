import { Analytics } from "@vercel/analytics/react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "./components/Footer";
import { GooeyDefs } from "./components/fx/Gooey";
import { PageFade } from "./components/fx/PageFade";
import { BackToTop } from "./components/BackToTop";
import { MobileDock } from "./components/MobileDock";
import { ScrollProgress } from "./components/ScrollProgress";
import { Nav } from "./components/Nav";
import { Shell } from "./components/Shell";

export function Layout() {
  return (
    <Shell>
      <a
        href="#main"
        className="label label-fg sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:border focus:border-line focus:bg-bg focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Nav />
      <ScrollProgress />
      <main id="main">
        <PageFade>
          <Outlet />
        </PageFade>
      </main>
      <div className="pb-[92px] sm:pb-0">
        <Footer />
      </div>
      <MobileDock />
      <BackToTop />
      <GooeyDefs />
      <ScrollRestoration />
      <Analytics />
    </Shell>
  );
}
