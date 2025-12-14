"use client";

import type { ReactNode } from "react";
import VintageSquares from "@/components/VintageSquares";
import Noise from "@/components/Noise";
import TopPromoBar from "@/components/TopPromoBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AsideCart from "@/components/AsideCart";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <VintageSquares count={40} density={0.9} />
      <Noise patternSize={256} patternRefreshInterval={3} patternAlpha={18} />

      <TopPromoBar />
      <SiteHeader />

      {/* PAGE LAYOUT */}
      <div className="flex-1 grid grid-cols-[1fr_380px] gap-6 container py-8">
        {/* Main page content */}
        <main className="min-w-0">
          {children}
        </main>

        {/* Cart lives here permanently */}
        <AsideCart />
      </div>

      <SiteFooter />
    </div>
  );
}
