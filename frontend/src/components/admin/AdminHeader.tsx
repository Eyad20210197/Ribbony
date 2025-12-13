'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { authClient } from '@/services/authClient';

export default function AdminHeader() {
  const user = useAppStore(s => s.user);
  const logout = useAppStore(s => s.logout);
  const router = useRouter();

  const handleSignOut = async () => {
    try { await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' }); } catch {}
    try { authClient.clearToken(); } catch {}
    try { logout(); } catch {}
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <div className="text-xl font-semibold">Ribbony <span className="text-sm text-slate-500">— Admin</span></div>
        <div className="text-xs text-slate-400">Management Console</div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-slate-100" aria-label="Toggle menu">≡</button>
        <div className="bg-white shadow-sm rounded-md px-3 py-2 text-sm flex items-center gap-3">
          {user?.firstName ? (
            <>
              <span className="text-slate-600">Signed in as</span>
              <strong>{user.firstName}</strong>
              <button onClick={handleSignOut} className="ml-3 text-xs px-2 py-1 rounded bg-rose-50 border border-rose-100">Sign out</button>
            </>
          ) : (
            <span className="text-slate-500">Not signed in</span>
          )}
        </div>
      </div>
    </header>
  );
}
