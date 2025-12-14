"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, Minus, Plus, Lock } from "lucide-react";
import cartService, { Product } from "@/lib/cartService";
import { apiPost } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type CartItem = Product & { quantity: number };

export default function AsideCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAppStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    syncCart();
    return cartService.subscribe(syncCart);
  }, []);

  const syncCart = () => {
    const raw = cartService.getCart();
    const grouped: Record<number, CartItem> = {};

    raw.forEach((item) => {
      if (!grouped[item.id]) {
        grouped[item.id] = { ...item, quantity: 1 };
      } else {
        grouped[item.id].quantity += 1;
      }
    });

    setItems(Object.values(grouped));
  };

  const total = items.reduce(
    (sum, i) => sum + Number(i.price || 0) * i.quantity,
    0
  );

  const checkout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiPost("/orders/create", {
        orderItems: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          payload: i.payload || {},
        })),
      });

      cartService.clear();
      toast.success("Order placed 🎉");
    } catch {
      toast.error("Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="h-full bg-white rounded-3xl border border-black/10 shadow-sm flex flex-col sticky top-24">
      {/* Header */}
      <div className="px-6 py-5 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-[#e3166d] text-white rounded-xl flex items-center justify-center">
          <ShoppingBag size={20} />
        </div>
        <h2 className="font-serif font-bold text-xl">Your Cart</h2>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Your cart is empty
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 rounded-2xl bg-[#fafafa]"
            >
              <img
                src={item.image || "/placeholder.png"}
                className="w-16 h-16 object-contain rounded-xl bg-white p-2"
              />

              <div className="flex-1">
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-[#e3166d] font-bold text-sm">
                  {item.price} EGP
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => cartService.removeOne(item.id)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => cartService.add(item)}>
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => cartService.remove(item.id)}
                    className="ml-auto text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t">
        <div className="flex justify-between font-bold mb-4">
          <span>Total</span>
          <span>{total} EGP</span>
        </div>
        <button
          onClick={checkout}
          disabled={!items.length || isSubmitting}
          className="w-full h-12 rounded-xl bg-[#e3166d] text-white font-bold flex items-center justify-center gap-2"
        >
          <Lock size={16} />
          Checkout
        </button>
      </div>
    </aside>
  );
}
