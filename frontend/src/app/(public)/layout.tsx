// src/app/(public)/layout.tsx
import type { ReactNode } from 'react';
import VintageSquares from '@/components/VintageSquares';
import TopPromoBar from '@/components/TopPromoBar';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <VintageSquares count={28} density={0.85} />
      <TopPromoBar />
      <SiteHeader />
      <main className="flex-1 container py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
