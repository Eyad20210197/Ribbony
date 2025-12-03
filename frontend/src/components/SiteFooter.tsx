'use client';
import { useState } from 'react';

export default function SiteFooter(){
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(!email) return;
    setStatus('loading');
    try {
      // replace with your real API
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus('ok');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('err');
    }
  }

  return (
    <footer className="site-footer" role="contentinfo" aria-hidden={false}>
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="site-title" style={{fontSize:18}}>ribbony</div>
          <div className="site-sub" style={{marginTop:6}}>Handmade gift magazines</div>
          <p className="muted" style={{marginTop:8,fontSize:13}}>Beautiful little worlds made with love — packaging, stickers, and curated stories.</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Company</h4>
          <nav aria-label="Footer navigation">
            <ul className="footer-list">
              <li><a href="/about">About</a></li>
              <li><a href="/shipping">Shipping</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Join our newsletter</h4>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="footer-email">Email</label>
            <input
              id="footer-email"
              className="newsletter-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              required
            />
            <button className="btn-add" style={{marginLeft:8}} type="submit" disabled={status==='loading'}>
              {status === 'loading' ? 'Sending...' : 'Subscribe'}
            </button>
          </form>

          <div style={{marginTop:8}}>
            {status === 'ok' && <span role="status">Thanks — check your inbox!</span>}
            {status === 'err' && <span role="alert" style={{color:'crimson'}}>Something went wrong.</span>}
          </div>

          <div className="social-row" style={{marginTop:12}}>
            <a href="#" aria-label="Instagram" className="social-pill">IG</a>
            <a href="#" aria-label="Pinterest" className="social-pill">PT</a>
            <a href="#" aria-label="TikTok" className="social-pill">TT</a>
          </div>
        </div>
      </div>

      <div className="container" style={{marginTop:18,textAlign:'center',fontSize:12}}>
        © {new Date().getFullYear()} Ribbony — Handmade gift magazines · All rights reserved
      </div>
    </footer>
  );
}
