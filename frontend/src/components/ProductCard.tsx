// src/components/ProductCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export type Product = {
  id: string;
  title: string;
  price?: string | number;
  image?: string;     // product photo
  sticker?: string;   // decorative sticker shown above the image
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="pc-card" aria-labelledby={`pc-${product.id}-title`}>
      
      <div className="pc-sticker" aria-hidden>
        {product.sticker ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.sticker} alt="" className="pc-sticker-img" />
        ) : (
          <div className="pc-sticker-fallback" />
        )}
      </div>

      {/* product image (sticker-style white cutout) */}
      <div className="pc-image-wrap" role="img" aria-label={product.title}>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.title} className="pc-image" />
        ) : (
          <div className="pc-image-fallback" />
        )}
      </div>

      {/* meta: name / price / cta */}
      <div className="pc-meta">
        <h3 id={`pc-${product.id}-title`} className="pc-title">{product.title}</h3>
        <div className="pc-price">{product.price ?? ''}</div>
        <div className="pc-cta-row">
          <Link href={`/products/${product.id}`} className="pc-cta">Buy now</Link>
        </div>
      </div>
    </article>
  );
}
