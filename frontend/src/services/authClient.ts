// src/services/authClient.ts
import { apiBase } from '@/lib/config';
import toast from 'react-hot-toast';

const TOKEN_KEY = 'ribbony_token';

let memoryToken: string | null = null;
if (typeof window !== 'undefined') {
  try {
    memoryToken = localStorage.getItem(TOKEN_KEY);
  } catch {
    memoryToken = null;
  }
}

export const authClient = {
  saveToken(token: string) {
    memoryToken = token;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // ignore
    }
  },

  getToken(): string | null {
    if (memoryToken) return memoryToken;
    if (typeof window === 'undefined') return null;
    try {
      memoryToken = localStorage.getItem(TOKEN_KEY);
      return memoryToken;
    } catch {
      return null;
    }
  },

  clearToken() {
    memoryToken = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },

  logout(redirect = true) {
    this.clearToken();
    if (redirect && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  async login(dto: { email: string; password: string }) {
    return rawFetch('/auth/login', { method: 'POST', body: JSON.stringify(dto) });
  },

  async register(dto: { firstName: string; lastName: string; email: string; password: string }) {
    return rawFetch('/auth/register', { method: 'POST', body: JSON.stringify(dto) });
  },
};

export async function rawFetch(path: string, opts: RequestInit = {}) {
  const token = authClient.getToken();
  const url = `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;

  const hasBody = Boolean(opts.body);
  const baseHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  };
  if (token) baseHeaders['Authorization'] = `Bearer ${token}`;

  const headers = { ...(opts.headers as object || {}), ...baseHeaders };

  const res = await fetch(url, {
    credentials: 'include',
    ...opts,
    headers,
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      authClient.clearToken();
      try { toast.error('Session expired. Please sign in again.'); } catch {}
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error(body?.message ?? 'Unauthorized');
    }

    if (body) {
      if (Array.isArray(body)) throw new Error(body.join(', '));
      if (typeof body === 'object' && (body.message || body.error)) throw new Error(body.message ?? body.error);
      if (typeof body === 'string') throw new Error(body);
    }
    throw new Error(res.statusText || 'Request failed');
  }

  return body;
}

export function useAuthFetch() {
  return async (path: string, opts: RequestInit = {}) => rawFetch(path, opts);
}
