// src/store/useAppStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { authClient } from '@/services/authClient';

type User = {
  id?: string;
  // backwards-compatible keys you already used (name) + new keys:
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string; // e.g. 'ADMIN' | 'CUSTOMER'
} | null;

type AppState = {
  loading: boolean;
  setLoading: (v: boolean) => void;

  // user state (extended safely)
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
  isAdmin: () => boolean;

  couponCode?: string | null;
  couponWon: boolean;
  setCoupon: (code?: string | null) => void;
};

export const useAppStore = create(
  subscribeWithSelector<AppState>((set, get) => ({
    // existing state kept exactly
    loading: false,
    setLoading: (v: boolean) => set({ loading: v }),

    // user (was previously just id + name) — we keep old behavior and extend it
    user: null,
    setUser: (u: User) => set({ user: u }),

    // logout: clear user and token but keep other store values intact
    logout: () => {
      try {
        authClient.clearToken();
      } catch (e) {
        // ignore
      }
      set({ user: null });
      // don't redirect here — SiteHeader or caller can redirect if desired
    },

    // helper to quickly test admin role
    isAdmin: () => {
      const u = get().user;
      return !!(u && (u.role === 'ADMIN' || u.role === 'Admin' || u.role === 'admin'));
    },

    // coupon features remain unchanged
    couponCode: null,
    couponWon: false,
    setCoupon: (code?: string | null) => set({ couponCode: code ?? null, couponWon: !!code }),
  }))
);
