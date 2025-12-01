// src/store/useAppStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type User = { id?: string; name?: string } | null;

type AppState = {
  loading: boolean;
  setLoading: (v: boolean) => void;

  user: User;
  setUser: (u: User) => void;

  couponCode?: string | null;
  couponWon: boolean;
  setCoupon: (code?: string | null) => void;
};

export const useAppStore = create(
  subscribeWithSelector<AppState>((set) => ({
    loading: false,
    setLoading: (v) => set({ loading: v }),

    user: null,
    setUser: (u) => set({ user: u }),

    couponCode: null,
    couponWon: false,
    setCoupon: (code) => set({ couponCode: code ?? null, couponWon: !!code }),
  }))
);
