// src/components/CartDrawer.tsx
"use client";
import { useEffect, useState } from "react";
import cartService, { Product } from "@/lib/cartService";
import { apiPost } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAppStore((s) => s.user);
  const router = useRouter();

  // Load items on mount
  useEffect(() => {
    setItems(cartService.getCart());
    const unsub = cartService.subscribe(setItems);
    return () => unsub();
  }, []);

  const total = items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      onClose(); // Close cart so they can see the login page
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare Payload for Backend
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: 1,
        // Ensure payload is a valid object, backend throws 400 if null
        payload: item.payload || { message: "Standard Order" }, 
      }));

      // POST /orders/create
      await apiPost("/orders/create", { orderItems });

      toast.success("Order placed successfully! 🎉");
      cartService.clear(); // Empty cart
      onClose(); // Close drawer
      // Optional: Redirect to order history
      // router.push("/profile"); 
    } catch (err: any) {
      console.error(err);
      toast.error(typeof err === "string" ? err : "Checkout failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-99999 flex justify-end cart">
      {/* Backdrop (Dark & Blurred) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[450px] bg-[#fdfdfd] h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2b2220]">Your Cart</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🛒</div>
              <p>Your cart is empty.</p>
              <button onClick={onClose} className="text-[#e3166d] text-sm font-bold hover:underline">
                Start Browsing
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="group flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img 
                    src={item.image || "/placeholder.png"} 
                    alt={item.title} 
                    className="w-full h-full object-contain mix-blend-multiply p-2" 
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="font-bold text-[#2b2220] truncate text-base">{item.title}</h4>
                  <div className="text-[#e3166d] font-bold mt-1">{item.price} EGP</div>
                </div>

                {/* Remove Button */}
                <div className="flex flex-col justify-center">
                  <button 
                    onClick={() => cartService.remove(item.id)} 
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="p-6 bg-white border-t border-gray-100 safe-area-bottom">
          <div className="flex justify-between text-xl font-bold mb-6 text-[#2b2220]">
            <span>Total</span>
            <span>{total} EGP</span>
          </div>
          
          <button 
            disabled={isSubmitting || items.length === 0}
            onClick={handleCheckout}
            className="w-full bg-[#e3166d] text-white py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_rgba(227,22,109,0.4)] hover:shadow-[0_6px_20px_rgba(227,22,109,0.6)] hover:bg-[#c91260] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/>
                Processing...
              </span>
            ) : (
              "Secure Checkout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}