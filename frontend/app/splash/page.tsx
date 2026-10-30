"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <section
        aria-label="Loading Inquiro Tracker"
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 px-8 py-12 text-center text-white shadow-2xl shadow-blue-950/40 backdrop-blur-xl"
      >
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-400 to-cyan-300 shadow-lg shadow-cyan-500/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-bold text-white">
            I
          </div>
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white ring-4 ring-blue-400/30" />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Welcome to
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Inquiro Tracker
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-300">
          Customer Inquiry Management System
        </p>

        <div className="mx-auto mt-10 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" />
        </div>

        <p className="mt-4 text-xs font-medium tracking-wide text-slate-400">
          Preparing your workspace
        </p>
      </section>
    </main>
  );
}
