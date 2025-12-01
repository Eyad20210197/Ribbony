// src/components/ProductGrid.tsx
'use client';
import ProductCard, { Product } from './ProductCard';

type Props = { products: Product[]; columns?: number };

export default function ProductGrid({ products, columns = 4 }: Props) {
  return (
    <section className="pg-grid">
      {products.map((p) => (
        <div key={p.id} className="pg-cell">
          <ProductCard product={p} />
        </div>
      ))}
    </section>
  );
}
