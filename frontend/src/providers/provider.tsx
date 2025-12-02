// src/providers/Providers.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';

type Props = { children: ReactNode };

export default function Providers({ children }: Props) {
  // Make sure the document uses the retro theme class if you want
  useEffect(() => {
    // Add a class to HTML for any global selectors (optional)
    document.documentElement.classList.add('ribbony-retro');
    return () => {
      document.documentElement.classList.remove('ribbony-retro');
    };
  }, []);

  return <>{children}</>;
}
