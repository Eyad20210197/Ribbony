// src/components/TopPromoBar.tsx
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import GameModal from './GameModal';
import { useAppStore } from '@/store/useAppStore';

export default function TopPromoBar() {
  const [open, setOpen] = useState(false);

  // local state to mirror store values (subscribe from useEffect)
  const [couponWon, setCouponWon] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);

useEffect(() => {
  const s = useAppStore.getState();
  setCouponWon(s.couponWon);
  setCouponCode(s.couponCode ?? null);

  const unsub = useAppStore.subscribe(
    (state) => ({
      couponWon: state.couponWon,
      couponCode: state.couponCode ?? null,
    }),
    (sel: { couponWon: boolean; couponCode: string | null }) => {
      setCouponWon(sel.couponWon);
      setCouponCode(sel.couponCode);
    }
  );

  return () => unsub();
}, []);


  // small guard for keyboard accessibility to open modal
  const onActivate = useCallback(() => setOpen(true), []);

  return (
    <>
      <div className="promo-topbar" role="region" aria-label="Promotions">
        <button
          className="promo-marquee-btn"
          onClick={onActivate}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onActivate(); }}
          aria-haspopup="dialog"
          title="Click to play and win a coupon"
        >
          <span className="promo-marquee" aria-hidden>
            <span>Get a coupon of <strong>20% OFF</strong> — Click to play the game!</span>
            <span>Get a coupon of <strong>20% OFF</strong> — Click to play the game!</span>
          </span>
        </button>

        <div className="promo-status" aria-live="polite">
          {couponWon ? (
            <span className="promo-coupon">Your coupon: <strong>{couponCode}</strong></span>
          ) : (
            <span className="promo-cta">Play to win 20% off</span>
          )}
        </div>
      </div>

      <GameModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
