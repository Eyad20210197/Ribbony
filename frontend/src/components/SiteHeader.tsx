// src/components/SiteHeader.tsx
'use client';
import Link from 'next/link';
export default function SiteHeader(){
  return (
    <header className="header-frame" style={{position:'relative', zIndex:90}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:56,height:56,background:'var(--frame-dark)',borderRadius:999,display:'grid',placeItems:'center',color:'var(--muted-light)',fontWeight:700}}>R</div>
          <div>
            <div className="site-title">ribbony</div>
            <div className="site-sub">Custom gift magazines</div>
          </div>
        </div>

        <nav style={{display:'flex',gap:18,alignItems:'center'}}>
          <Link href="/explore" className="text-[12px]">Explore</Link>
          <Link href="/market" className="text-[12px]">Market</Link>
          <div className="hamburger">≡</div>
        </nav>
      </div>
    </header>
  );
}
