// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { useAppStore } from "@/store/useAppStore";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { apiGet } from "@/lib/api";

export default function HomePage() {
  const setUser = useAppStore((s) => s.setUser);
  const params = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------
      Load current user
  ----------------------------- */
  const loadCurrentUser = async () => {
    try {
      const u = await apiGet("/auth/me");

      setUser({
        id: u.id ? String(u.id) : undefined,
        firstName: u.firstName ?? u.first_name ?? u.name,
        lastName: u.lastName ?? u.last_name,
        role: u.role,
      });
    } catch {
      // user not authenticated → ignore
    }
  };

  /* -----------------------------
      Run on first load
  ----------------------------- */
  useEffect(() => {
    loadCurrentUser();
  }, []);

  /* -----------------------------
      After successful login
  ----------------------------- */
  useEffect(() => {
    if (!params) return;

    const loginFlag = params.get("login");
    if (loginFlag === "success") {
      toast.success("Signed in successfully!");
      loadCurrentUser();
    }
  }, [params]);

  /* -----------------------------
      Load products
  ----------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const data = await apiGet("/products/list");

        if (mounted) {
          const mapped = (Array.isArray(data) ? data : []).map((p: any) => ({
            id: String(p.id),
            title: p.name ?? "Unnamed product",
            price:
              p.price !== undefined && p.price !== null
                ? `${p.price} EGP`
                : "—",
            image: p.productImage ?? "/images/placeholder.png",
            sticker: undefined,
            _raw: p,
          }));

          setProducts(mapped);
        }
      } catch {
        toast.error("Failed to load products.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* -----------------------------
      UI
  ----------------------------- */
  return (
    <main className="p-6">
      {loading ? (
        <div className="py-8 text-center">Loading products...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
