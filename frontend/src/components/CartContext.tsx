// src/components/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import cartService, { Product as ServiceProduct } from "@/lib/cartService";

export type Product = ServiceProduct;

type CartContextType = {
  cart: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>(() => cartService.getCart());

  useEffect(() => {
    const unsub = cartService.subscribe((items) => {
      setCart(items);
    });
    return () => unsub();
  }, []);

  const addToCart = (p: Product) => cartService.add(p);
  const removeFromCart = (id: number) => cartService.remove(id);
  const clearCart = () => cartService.clear();

  const value = useMemo(() => ({ cart, addToCart, removeFromCart, clearCart }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Safe useCart() — never throws.
 * If a provider exists it returns the reactive provider value.
 * If not, it returns a snapshot + functions that proxy to cartService.
 */
export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (ctx) return ctx;

  return {
    cart: cartService.getCart(),
    addToCart: (p: Product) => cartService.add(p),
    removeFromCart: (id: number) => cartService.remove(id),
    clearCart: () => cartService.clear(),
  };
};
