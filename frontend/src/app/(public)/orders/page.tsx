"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  priceAtTime: number;
};

type Order = {
  id: number;
  status: string; 
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
};

export default function UserOrdersPage() {
  const api = useApi();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Auth Check
  useEffect(() => {
    const t = setTimeout(() => {
        if (!useAppStore.getState().user) {
            router.push("/login");
        }
    }, 1000);
    return () => clearTimeout(t);
  }, [router]);

  // Fetch Orders
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    api.get("/orders/getUserOrders")
      .then((data) => {
        if (mounted) {
            const sorted = (Array.isArray(data) ? data : []).sort((a: Order, b: Order) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(sorted);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [api, user]);

  // Cancel Handler
  const handleCancel = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      await api.put(`/orders/cancel?id=${orderId}`, {});
      toast.success("Order cancelled successfully");
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: "CANCELLED" } : o
      ));
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "WORK_IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED": return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED": return "bg-red-50 text-red-800 border-red-200 decoration-line-through opacity-75";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div className="loading-track mx-auto"><div className="loading-bar"></div></div>
        <p className="mt-4 text-gray-400 text-sm">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      
      <div className="mb-8 flex items-end justify-between">
        <div>
            <h1 className="pr-title text-3xl mb-2">My Orders</h1>
            <p className="text-gray-500 text-sm">View and manage your past purchases.</p>
        </div>
        <Link href="/" className="text-[#e3166d] text-sm font-bold hover:underline">
            Continue Shopping →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-black/5 text-center shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-[#2b2220] mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t ordered anything yet.</p>
            <Link href="/" className="pc-cta px-8 py-3">Start Browsing</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden transition-transform hover:translate-y-[-2px]"
            >
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex gap-6 text-sm">
                        <div>
                            <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Order Placed</span>
                            <span className="font-medium text-[#2b2220]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Total</span>
                            <span className="font-medium text-[#2b2220]">{order.totalAmount} EGP</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider">Order #</span>
                            <span className="font-mono text-gray-600">{order.id}</span>
                        </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="flex-1 space-y-3 w-full">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-lg shrink-0">
                                        🎁
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#2b2220] text-sm">{item.productName}</div>
                                        <div className="text-xs text-gray-500">
                                            Qty: {item.quantity} × {item.priceAtTime} EGP
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 mt-4 md:mt-0">
                            {order.status === "PENDING" && (
                                <button 
                                    onClick={() => handleCancel(order.id)}
                                    disabled={cancellingId === order.id}
                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold uppercase rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
                                >
                                    {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                                </button>
                            )}
                            
                            {order.status === "SHIPPED" && (
                                <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold uppercase rounded cursor-not-allowed">
                                    Track Package
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}