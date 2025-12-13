// src/lib/cartUi.tsx
"use client";

import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

let root: Root | null = null;
let container: HTMLElement | null = null;

function createContainer() {
  container = document.createElement("div");
  container.id = "ribbony-cart-root";

  // make it cover viewport but pointer events only inside drawer
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.zIndex = "99999";

  document.body.appendChild(container);
  root = createRoot(container);
}

export function openCartUI() {
  if (typeof window === "undefined") return;
  if (!container) createContainer();
  if (!root) return;

  root.render(
    <CartProvider>
      <CartDrawer onClose={closeCartUI} />
    </CartProvider>
  );
}

export function closeCartUI() {
  if (!root || !container) return;
  root.unmount();
  try {
    container.remove();
  } catch (e) {
    // ignore
  }
  root = null;
  container = null;
}
