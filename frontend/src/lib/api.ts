// src/lib/api.ts
import { useCallback } from 'react';
import { apiBase } from '@/lib/config';
import { useAppStore } from '@/store/useAppStore';

export async function apiFetchRaw(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${apiBase}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  return res;
}

// hook for components that need to fetch and show loader automatically
export function useApi() {
  const setLoading = useAppStore((s) => s.setLoading);
  return useCallback(
    async (path: string, opts: RequestInit = {}) => {
      setLoading(true);
      try {
        const res = await apiFetchRaw(path, opts);
        const json = await res.json();
        return json;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );
}
