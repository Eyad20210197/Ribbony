'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrickBreaker from '@/components/BrickBreaker';
import { useAppStore } from '@/store/useAppStore';

export default function GameModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const setCoupon = useAppStore((s) => s.setCoupon);

  // handle coupon awarded event that will be sent by the BrickBreaker via window custom event
  useEffect(() => {
    function onWin(e: any) {
      const code = e?.detail?.code ?? `RIBBON20-${Math.floor(Math.random() * 9000 + 1000)}`;
      setCoupon(code);
      // small delay then close modal
      setTimeout(() => onClose(), 800);
    }
    window.addEventListener('ribbony:game:win', onWin as EventListener);
    return () => window.removeEventListener('ribbony:game:win', onWin as EventListener);
  }, [onClose, setCoupon]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="game-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="game-modal" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
              <h3 style={{margin:0}}>Play & Win 20% — Brick Breaker</h3>
              <button aria-label="Close" className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div style={{marginTop:12}}>
              <BrickBreaker width={720} height={420} />
            </div>

            <div style={{marginTop:12, fontSize:13, color:'rgba(0,0,0,0.6)'}}>Win by clearing all bricks to get your coupon code.</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
