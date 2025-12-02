// src/app/admin/layout.tsx
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // intentionally minimal — no TopPromoBar, no SiteHeader, no SiteFooter, no Game UI
  return (
    <div className="min-h-screen bg-(--bg-paper)">
      <main className="container py-8">{children}</main>
    </div>
  );
}
