// src/app/page.tsx
'use client';

import ProductGrid from '@/components/ProductGrid';
import { useAppStore } from '@/store/useAppStore';

const PRODUCTS = [
  { id: 'p1', title: 'Short Cargo', price: '25€', image: '/images/short-cargo.png', sticker: '/stickers/star-pink.png' },
  { id: 'p2', title: 'Sneaker CJ80', price: '50€', image: '/images/sneaker.png', sticker: '/stickers/sparkle.png' },
  { id: 'p3', title: 'T-Shirt Burgundy', price: '15€', image: '/images/tshirt.png', sticker: '/stickers/round-smile.png' },
  { id: 'p4', title: '2 Pairs Socks', price: '10€', image: '/images/socks.png', sticker: '/stickers/flash.png' },
];

export default function HomePage() {
  const user = useAppStore((s) => s.user);

  return (
    <main className="p-6">
      {user?.firstName && <div className="mb-4 text-lg">Welcome back, <strong>{user.firstName}</strong>!</div>}
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 14 }}>Featured</h2>
      <ProductGrid products={PRODUCTS} />
    </main>
  );
}
