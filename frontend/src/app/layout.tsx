// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import AppInitializer from "@/components/AppInitializer";
import RouteChangeLoader from "@/components/RouteLoader";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* App logic */}
        <AppInitializer />
        <RouteChangeLoader />

        {/* Main app */}
        {children}

      </body>
    </html>
  );
}
