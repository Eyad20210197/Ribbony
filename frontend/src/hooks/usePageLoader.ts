// src/hooks/usePageLoader.ts
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function usePageLoader(active = true) {
  const setLoading = useAppStore((state) => state.setLoading);
  useEffect(() => {
    if (!active) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => {
      clearTimeout(t);
      setLoading(false);
    };
  }, [active, setLoading]);
}
