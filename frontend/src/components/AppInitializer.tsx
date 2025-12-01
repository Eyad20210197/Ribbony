// src/components/AppInitializer.tsx
'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const MIN_MS = 2500;

export default function AppInitializer() {
  const setLoading = useAppStore((s) => s.setLoading);

  useEffect(() => {
    let mounted = true;
    const start = performance.now();
    // Show the loader immediately
    setLoading(true);

    (async () => {
      try {
      } finally {
        if (!mounted) return;
        const elapsed = performance.now() - start;
        const remaining = Math.max(0, MIN_MS - elapsed);
        // ensure minimum display time
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, remaining);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setLoading]);

  return null;
}
