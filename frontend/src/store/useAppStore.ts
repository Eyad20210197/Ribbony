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

  // Cart Visibility State (New)
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;

  // Coupon State
  couponCode?: string | null;
  couponWon: boolean;
  setCoupon: (code?: string | null) => void;
};

export const useAppStore = create(
  subscribeWithSelector<AppState>((set, get) => ({
    // Loading State
    loading: false,
    setLoading: (v: boolean) => set({ loading: v }),

    // User State
    user: null,
    setUser: (u: User) => set({ user: u }),

    // Logout Action
    logout: () => {
      try {
        authClient.clearToken();
      } catch (e) {
        // ignore
      }
      set({ user: null });
    },

    // Admin Helper
    isAdmin: () => {
      const u = get().user;
      return !!(u && (u.role === 'ADMIN' || u.role === 'Admin' || u.role === 'admin'));
    },

    // Cart Visibility Logic (New)
    isCartOpen: false,
    setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

    // Coupon Logic
    couponCode: null,
    couponWon: false,
    setCoupon: (code?: string | null) => set({ couponCode: code ?? null, couponWon: !!code }),
  }))
);