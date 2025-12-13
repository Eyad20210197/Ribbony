// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import AppInitializer from '@/components/AppInitializer';
import RouteChangeLoader from '@/components/RouteLoader';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Logic-only components */}
        <AppInitializer />
        <RouteChangeLoader />
        {/* Visual Content */}
        {children}
      </body>
    </html>
  );
}