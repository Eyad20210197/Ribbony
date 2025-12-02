// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-paper)">
      <main>{children}</main>
    </div>
  );
}
