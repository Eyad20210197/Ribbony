'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { authClient } from '@/services/authClient';

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCart({count}:{count:number}) {
  return (
    <div className="cart-icon" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 6h15l-1.5 9h-11z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="20" r="1" fill="currentColor"/>
        <circle cx="18" cy="20" r="1" fill="currentColor"/>
      </svg>
      {count > 0 && <span className="cart-badge" aria-hidden>{count}</span>}
    </div>
  );
}

type LocalUser = { firstName?: string; email?: string; avatarUrl?: string } | null;

export default function SiteHeader(){
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);

  const router = useRouter();

  // useAppStore: non-destructive usage — we only read & set user via store helpers.
  const storeUser = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const logout = useAppStore((s) => s.logout);

  const handleLogout = () => {
    try {
      authClient.clearToken(); // ensure token removed
    } catch {}
    // clear app store user
    try { logout(); } catch {}
    // clear local fallback and redirect
    try { localStorage.removeItem('user'); } catch {}
    if (typeof window !== 'undefined') router.push('/');
  };

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  // demo: set a persistent cart count (replace with real state)
  useEffect(()=> {
    setCartCount(2);
  },[]);

  // Try to fetch the authenticated user and populate the store (non-destructive)
  useEffect(()=> {
    let mounted = true;
    async function loadUser(){
      setLoadingUser(true);

      // If store already has user, use it and skip fetching
      if (storeUser) {
        setLoadingUser(false);
        return;
      }

      // 1) try API
      try {
        const res = await fetch('/api/me', { method: 'GET', credentials: 'include' });
        if(!mounted) return;
        if(res.ok){
          const data = await res.json();
          // expecting { firstName, email, avatarUrl? }
          try { setUser(data || null); } catch {}
          setLoadingUser(false);
          return;
        }
      } catch (err) {
        // ignore fetch errors; fallback next
      }

      // 2) fallback: localStorage (dev)
      try {
        const raw = localStorage.getItem('user');
        if(raw){
          const parsed = JSON.parse(raw);
          try { setUser(parsed); } catch {}
          setLoadingUser(false);
          return;
        }
      } catch (err) {
        // ignore
      }

      // default: not signed in
      try { setUser(null); } catch {}
      setLoadingUser(false);
    }

    loadUser();
    return ()=> { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  async function handleSignOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore — still clear local state
    }
    // clear local fallback and state
    try { localStorage.removeItem('user'); } catch {}
    try { authClient.clearToken(); } catch {}
    try { logout(); } catch {}
    router.push('/');
  }

  return (
    <>
      <header className="header-frame site-header" role="banner" style={{position:'relative', zIndex:90}}>
        <div className="container header-inner" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          
          <div className="brand-row" style={{display:'flex',alignItems:'center',gap:12}}>
           <Link href="/" className="logo-link" aria-label="Ribbony home" style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="logo-wrap">
            <Image
              src="/logo.jpg"
              alt="Ribbony Logo"
              width={64}
              height={64}
              className="ribbony-logo"
              priority
            />
          </div>
          <div className="brand-text">
          <div className="brand-title">Ribbony</div>
          <div className="brand-sub">Custom Gift Magazines</div>
          </div>
          </Link>
          </div>



          <nav className="main-nav" role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
              <li><Link href="/explore" className="nav-link">Explore</Link></li>
              <li><Link href="/market" className="nav-link">Market</Link></li>
              <li><Link href="/about" className="nav-link">About</Link></li>
            </ul>
          </nav>

          <div className="header-actions" style={{display:'flex',gap:12,alignItems:'center'}}>
            <button
              className="icon-btn icon-search"
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={() => setSearchOpen(s => !s)}
            >
              <IconSearch />
            </button>

            <Link href="/cart" className="cart-link" aria-label="Open cart">
              <IconCart count={cartCount} />
            </Link>

            <div className="desktop-only" style={{display:'flex', alignItems:'center', gap:10}}>
              {/* Auth area */}
              {loadingUser ? (
                <span className="nav-link" aria-hidden>…</span>
              ) : storeUser && storeUser.firstName ? (
                <div className="user-pill" style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontWeight:700}}>Welcome back, {storeUser.firstName}</span>
                  <button
                    className="icon-btn"
                    title="Sign out"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                  >Sign out</button>
                </div>
              ) : (
                <Link href="/login" className="nav-link">Sign in</Link>
              )}
            </div>

            <button
              className="hamburger mobile-only"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(o => !o)}
            >≡</button>
          </div>
        </div>

        {/* inline search area */}
        <div className={`header-search ${searchOpen ? 'open' : ''}`} role="search" aria-hidden={!searchOpen}>
          <div className="container" style={{display:'flex',alignItems:'center',gap:10}}>
            <input className="search-input" placeholder="Search products, stickers, kits..." aria-label="Search" />
            <button className="btn-add" aria-label="Search">Search</button>
          </div>
        </div>
      </header>

      {/* mobile menu overlay */}
      <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal={mobileOpen} aria-hidden={!mobileOpen}>
        <div className="mobile-menu-inner">
          <button className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>✕</button>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <ul>
              <li><Link href="/explore" onClick={()=>setMobileOpen(false)}>Explore</Link></li>
              <li><Link href="/market" onClick={()=>setMobileOpen(false)}>Market</Link></li>
              <li><Link href="/about" onClick={()=>setMobileOpen(false)}>About</Link></li>
              <li>
                {storeUser ? (
                  <button className="nav-link" onClick={() => { setMobileOpen(false); handleSignOut(); }}>Sign out</button>
                ) : (
                  <Link href="/login" onClick={()=>setMobileOpen(false)}>Sign in</Link>
                )}
              </li>
              <li><Link href="/help" onClick={()=>setMobileOpen(false)}>Help</Link></li>
            </ul>
          </nav>

          <div className="mobile-cta-row">
            <Link href="/cart" className="pc-cta" onClick={()=>setMobileOpen(false)}>View cart</Link>
          </div>
        </div>
      </div>
    </>
  );
}
