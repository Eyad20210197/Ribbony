// src/components/GlobalOverlays.tsx
"use client";

import { useAppStore } from "@/store/useAppStore";
import CartDrawer from "@/components/CartDrawer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Toaster } from "react-hot-toast";

export default function GlobalOverlays() {
  const isCartOpen = useAppStore((s) => s.isCartOpen);
  const setCartOpen = useAppStore((s) => s.setCartOpen);

  return (
    <>
      {/* 1. Global Toaster */}
      <Toaster position="top-right" />

      {/* 2. Global Loader */}
      <LoadingOverlay />
    
      {/* 3. Cart Drawer */}
      {isCartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}