"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/lib/api";
import cartService from "@/lib/cartService";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  productImage: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const api = useApi();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    let mounted = true;

    api
      .get(`/products/getproduct/${id}`)
      .then((data) => {
        if (mounted) setProduct(data);
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, api]);

  const handleAddToCart = () => {
    if (!product) return;

    cartService.add({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.productImage,
      payload: { message: customNote },
    });

    toast.success("Added to cart!");
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="loading-track">
          <div className="loading-bar"></div>
        </div>
      </div>
    );

  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="container py-12 z-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
        {/* LEFT — IMAGE STAGE */}
        <div className="relative flex justify-center p-8 checker-hero">
          {/* IMAGE CONTAINER (FIXED SIZE) */}
          <div className="w-full max-w-md h-[420px] flex items-center justify-center">
            <div className="sticker-image transform -rotate-2 hover:rotate-0 transition-transform duration-300 w-full h-full">
              <img
                src={product.productImage || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — INFO */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#e3166d] uppercase mb-2">
              {product.category || "General"}
            </div>

            <h1 className="pr-title text-4xl mb-2">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-[#2b2220]">
              {product.price} EGP
            </div>
          </div>

          <div className="text-sm leading-relaxed text-gray-600 border-l-4 border-[#e3166d] pl-4">
            {product.description}
          </div>

          {/* CUSTOM NOTE */}
          <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm mt-4">
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
              Personalize your Gift
            </label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#e3166d]"
              placeholder="Write a message to be printed on the magazine..."
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              className="pc-cta text-base px-10 py-4 w-full md:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
