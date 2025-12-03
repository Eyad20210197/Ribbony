// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';
import styles from './auth.module.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <main className={styles.card}>
            <div style={{ marginBottom: 12 }}>
              <img src="/logo.jpg" alt="Ribbony" style={{ height: 36 }} />
            </div>
        {children}
      </main>
    </div>
  );
}
