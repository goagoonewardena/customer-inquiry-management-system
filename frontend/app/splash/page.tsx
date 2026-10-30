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
    <main className="flex min-h-screen items-center justify-center bg-blue-600 px-4">
      <section
        aria-label="Loading Inquiro Tracker"
        className="text-center text-white"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl font-bold text-blue-600 shadow-lg">
          I
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          Inquiro Tracker
        </h1>

        <p className="mt-2 text-blue-100">
          Customer Inquiry Management System
        </p>

        <div
          aria-label="Loading"
          className="mx-auto mt-8 h-2 w-32 overflow-hidden rounded-full bg-blue-400"
          role="progressbar"
        >
          <div className="h-full w-1/2 animate-pulse rounded-full bg-white" />
        </div>
      </section>
    </main>
  );
}
