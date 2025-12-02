// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import AppInitializer from '@/components/AppInitializer';
import RouteChangeLoader from '@/components/RouteLoader';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppInitializer />
        <RouteChangeLoader />
        <LoadingOverlay />
        {children}
      </body>
    </html>
  );
}
