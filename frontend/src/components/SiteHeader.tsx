"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function SiteHeader() {
  const router = useRouter();

  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="header-frame site-header">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Ribbony"
            width={48}
            height={48}
            priority
          />
          <div>
            <div className="font-bold">Ribbony</div>
            <div className="text-xs text-gray-400">
              Custom Gift Magazines
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/market" className="nav-link">
            Market
          </Link>

          <Link href="/orders" className="nav-link">
            My Orders
          </Link>

          {/* User Area */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#2b2220]">
                Welcome, {user.firstName ?? "User"}
              </span>

              <button
                onClick={handleLogout}
                className="nav-link font-semibold"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className="nav-link">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
