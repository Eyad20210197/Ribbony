import type { ReactNode } from 'react';
import VintageSquares from '@/components/VintageSquares';
import Noise from '@/components/Noise';
import TopPromoBar from '@/components/TopPromoBar';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import GlobalOverlays from '@/components/GlobalOverlays';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <VintageSquares count={40} density={0.90} />
      <Noise patternSize={256} patternRefreshInterval={3} patternAlpha={18}/>
      <GlobalOverlays />
      <TopPromoBar />
      <SiteHeader />
      <main className="flex-1 container py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
