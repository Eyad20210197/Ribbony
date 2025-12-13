// src/lib/cartService.ts
// Simple singleton cart service with localStorage persistence and listeners.

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  payload?: any;
};

type Listener = (items: Product[]) => void;

const STORAGE_KEY = "ribbony_cart_v1";

class CartService {
  private cart: Product[] = [];
  private listeners: Listener[] = [];

  constructor() {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) this.cart = JSON.parse(raw) as Product[];
    } catch (err) {
      this.cart = [];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
    } catch (err) {
      // ignore
    }
  }

  private notify() {
    for (const l of this.listeners) {
      try { l([...this.cart]); } catch {}
    }
  }

  getCart() {
    return [...this.cart];
  }

  add(product: Product) {
    this.cart.push(product);
    this.persist();
    this.notify();
  }

  remove(id: number) {
    this.cart = this.cart.filter((p) => p.id !== id);
    this.persist();
    this.notify();
  }

  clear() {
    this.cart = [];
    this.persist();
    this.notify();
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    try { listener([...this.cart]); } catch {}
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

const cartService = new CartService();
export default cartService;
