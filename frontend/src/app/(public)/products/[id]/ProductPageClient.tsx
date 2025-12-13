'use client';

import { useEffect, useState } from 'react';

export default function ProductPageClient({ id }: { id: string }) {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid product id');
      return;
    }

    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`http://localhost:9090/products/getproduct/${encodeURIComponent(id)}`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 404) setError('Product not found');
          else setError(`Failed to load product (${res.status})`);
          return;
        }

        const json = await res.json();
        if (mounted) setProduct(json);
      } catch (e) {
        if (mounted) setError('Network error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-6">Loading product...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!product) return <div className="p-6">No product data</div>;

  return (
    <main className="container p-6">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <img src={product.productImage ?? '/images/placeholder.png'} alt={product.name} />
      <p className="mt-4">{product.description}</p>
    </main>
  );
}
