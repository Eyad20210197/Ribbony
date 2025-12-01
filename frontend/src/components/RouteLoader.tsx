// src/components/RouteChangeLoader.tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

const MIN_MS = 2500;

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const setLoading = useAppStore((s) => s.setLoading);
  const lastChangeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // called whenever pathname changes
    const now = performance.now();
    lastChangeRef.current = now;
    // immediately show loader
    setLoading(true);

    // ensure minimum time
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, MIN_MS);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pathname, setLoading]);

  return null;
}
