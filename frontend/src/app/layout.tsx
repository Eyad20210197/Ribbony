// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import AppInitializer from '@/components/AppInitializer';
import RouteChangeLoader from '@/components/RouteLoader';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppInitializer />
        <RouteChangeLoader />
        <LoadingOverlay />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
