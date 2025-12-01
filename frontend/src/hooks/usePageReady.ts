'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function usePageReady(timeout = 800) {
  const setLoading = useAppStore((s) => s.setLoading);
  useEffect(() => {
    // ensure we hide loader after content mounted and small grace period
    const t = setTimeout(() => setLoading(false), timeout);
    return () => clearTimeout(t);
  }, [setLoading, timeout]);
}
