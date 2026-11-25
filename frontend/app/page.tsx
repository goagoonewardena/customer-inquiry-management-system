
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage, apiFetch } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch(
        mode === "signup" ? "/auth/signup" : "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(
            mode === "signup"
              ? { email: email.trim(), password, inviteCode }
              : { email: email.trim(), password }
          ),
        }
      );

      if (!response.ok) {
        setError(
          await apiErrorMessage(
            response,
            mode === "signup"
              ? "Could not create your account."
              : "Could not sign in."
          )
        );
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError(
        "Could not reach the authentication service. Make sure the backend and database are running."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
            I
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Inquiro Tracker
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Customer Inquiry Management System
          </p>
        </div>

        <h2 className="text-xl font-semibold text-slate-800">
          {mode === "signup" ? "Create staff account" : "Staff sign in"}
        </h2>

        <p className="mb-6 mt-1 text-sm text-slate-500">
          {mode === "signup"
            ? "Create an account to manage customer inquiries."
            : "Sign in to manage customer inquiries."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-busy={isSubmitting}
        >
          {/* Email address */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address <span className="text-red-500">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              maxLength={254}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password <span className="text-red-500">*</span>
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={
                mode === "signup"
                  ? "At least 8 characters"
                  : "Enter your password"
              }
              minLength={8}
              maxLength={72}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label
                htmlFor="inviteCode"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Staff invitation code <span className="text-red-500">*</span>
              </label>
              <input
                id="inviteCode"
                name="inviteCode"
                type="password"
                required
                autoComplete="off"
                maxLength={256}
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="Enter the code from your administrator"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                minLength={8}
                maxLength={72}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          {mode === "signup"
            ? "Already have an account?"
            : "Need to create an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
              setInviteCode("");
            }}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>

        <p className="mt-6 text-center text-xs text-slate-400">
          <span className="text-red-500">*</span> Required fields
        </p>

        <p className="mt-2 text-center text-xs text-slate-400">
          Staff portal
        </p>
      </section>
    </main>
  );
}
