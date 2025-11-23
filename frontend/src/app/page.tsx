'use client';

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

// HomePage.tsx (client)
// Ribbony-branded Home page + Loading screen
// Fixes applied: client-only AnimatePresence mount guard + defensive motion initial states.
// Colors updated to use Ribbony token primary (#E11D48).

const RIBBONY_PRIMARY = "#E11D48";
const RIBBONY_PRIMARY_DARK = "#C2183B";

// ---------- LoadingScreen ----------
function LoadingScreen({ visible }: { visible: boolean }) {
  // Avoid rendering framer-motion components until we're on the client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414] text-white"
          aria-hidden={!visible}
          role="status"
          aria-label="Loading content"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Animated brand mark (defensive keyframes) */}
            <motion.div
              className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl"
              initial={{ scale: 0.95, rotate: -4 }}
              animate={{ scale: [0.95, 1.02, 0.98], rotate: [0, 6, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", repeatType: "mirror" }}
              style={{ background: `linear-gradient(135deg, ${RIBBONY_PRIMARY}, ${RIBBONY_PRIMARY_DARK})` }}
              aria-hidden={true}
            >
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true}>
                <path d="M3 12h18" stroke="#0b0b0b" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 8h12v8H6z" fill="#0b0b0b" />
              </svg>
            </motion.div>

            <div className="text-center">
              <motion.h2
                className="font-semibold text-xl md:text-2xl"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
              >
                RIBBONY
              </motion.h2>
              <motion.p
                className="text-sm text-gray-300 mt-1 max-w-[36ch]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                Loading Ribbony — fetching templates, assets and your preferences.
              </motion.p>
            </div>

            {/* Skeleton bars */}
            <div className="w-64 flex flex-col gap-2">
              <motion.div
                className="h-2 rounded-full bg-gray-700/50"
                initial={{ scaleX: 0.6 }}
                animate={{ scaleX: [0.6, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
              />
              <motion.div
                className="h-2 rounded-full bg-gray-700/40"
                initial={{ scaleX: 0.5 }}
                animate={{ scaleX: [0.5, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.25, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Hero / Home Content ----------
function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#141414] text-white">
      <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Design. Print. Delight.</h1>
          <p className="mt-4 text-gray-300 max-w-xl">
            Create beautiful custom gift magazines and order production-ready outputs. Fast previews, collaborative editing, and simple ordering.
          </p>

          <div className="mt-8 flex gap-3">
            <a
              href="#market"
              className="inline-flex items-center gap-3 rounded-2xl px-6 py-3" 
              style={{ background: RIBBONY_PRIMARY, color: '#fff' }}
            >
              Start Customizing
            </a>
            <a href="#templates" className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 border border-gray-700 text-gray-200 hover:bg-gray-800 transition">
              Browse Templates
            </a>
          </div>
        </div>

        {/* Visual / Card grid */}
        <div className="space-y-4">
          <div className="rounded-2xl p-4 bg-[#111111] shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-20 h-12 rounded-md bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-black font-bold">MG</div>
              <div>
                <h3 className="font-semibold">Premium Layout Pack</h3>
                <p className="text-xs text-gray-400">Curated magazine layouts for gifting.</p>
              </div>
              <div className="ml-auto text-sm font-semibold">Included</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-[#0f0f0f] shadow-lg border border-gray-800 flex items-center gap-4">
            <div className="w-20 h-12 rounded-md bg-gray-800 flex items-center justify-center font-medium">PH</div>
            <div>
              <h3 className="font-semibold">High-quality Prints</h3>
              <p className="text-xs text-gray-400">Multiple paper & finish options.</p>
            </div>
            <div className="ml-auto text-sm text-gray-400">From $9.99</div>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-r from-[#0b0b0b] to-[#161616] shadow-xl border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold">Recommended Workflows</h4>
                <p className="text-xs text-gray-400">Fast paths for event invites, corporate gifts and weddings.</p>
              </div>
              <div>
                <button className="rounded-lg px-4 py-2 bg-white text-black font-medium">Learn</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Home Page ----------
export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load (templates, user prefs, translations)
    // In real app, replace with actual data fetch + cache hydration.
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Head>
        <title>Ribbony — Custom Magazines & Gifts</title>
        <meta name="description" content="Ribbony — Create custom gift magazines, preview and order production-ready outputs." />
      </Head>

      <LoadingScreen visible={loading} />

      <main className={`min-h-screen ${loading ? "pointer-events-none" : ""} bg-[#0b0b0b] text-white`}>
        {/* Top nav (minimal) */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-gray-800">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold">RIBBONY</div>
              <nav className="hidden md:flex gap-4 text-sm text-gray-300">
                <a href="#custom" className="hover:text-white">Customizer</a>
                <a href="#templates" className="hover:text-white">Templates</a>
                <a href="#help" className="hover:text-white">Help</a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-md bg-gray-800 text-gray-200">Sign in</button>
              <button className="px-3 py-2 rounded-md border border-gray-700 text-gray-200">Cart</button>
            </div>
          </div>
        </header>

        <Hero />

        {/* Simple features / highlights */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl p-6 bg-[#111] border border-gray-800">
              <h5 className="font-semibold">Designer-first</h5>
              <p className="text-sm text-gray-400 mt-2">Templates built by professional designers.</p>
            </div>
            <div className="rounded-xl p-6 bg-[#111] border border-gray-800">
              <h5 className="font-semibold">Fast Previews</h5>
              <p className="text-sm text-gray-400 mt-2">Instant visual previews for every change.</p>
            </div>
            <div className="rounded-xl p-6 bg-[#111] border border-gray-800">
              <h5 className="font-semibold">Production Ready</h5>
              <p className="text-sm text-gray-400 mt-2">PDF and print-ready outputs with ZIP export.</p>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-800 mt-12 py-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Ribbony — All rights reserved.
        </footer>
      </main>
    </>
  );
}
