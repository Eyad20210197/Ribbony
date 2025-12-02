// src/components/LoadingOverlay.tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function LoadingOverlay() {
  const loading = useAppStore((s) => s.loading);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="loading-full"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="grain" aria-hidden="true" />
          <div className="text-center">
            <div style={{ marginBottom: 12, fontFamily: '"Press Start 2P"', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              LOADING RIBBONY ...
            </div>

            <div className="loading-track" aria-hidden>
              <div className="loading-bar" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
