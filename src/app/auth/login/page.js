"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrCodeIcon, CheckCircleIcon } from "../../../components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      const lowerEmail = email.toLowerCase().trim();
      const pw = password.trim();

      if (lowerEmail === "master@quickbite.com" && pw === "password") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/master");
        }, 1000);
      } else if (lowerEmail === "owner@cafe.com" && pw === "password") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/restaurant");
        }, 1000);
      } else if (lowerEmail === "waiter@cafe.com" && pw === "password") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/waiter");
        }, 1000);
      } else if (lowerEmail === "kitchen@cafe.com" && pw === "password") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/kitchen");
        }, 1000);
      } else {
        setErrorMsg("Invalid credentials. Try using the credentials listed in the helper box below.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-200">
      
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-brand-500">
          ← Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-red-500 text-white shadow-md">
          <QrCodeIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Sign in to your kitchen
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{" "}
          <Link href="/auth/register" className="font-medium text-brand-500 hover:underline">
            register your restaurant
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl sm:px-10 text-left space-y-6">
          
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Successful!</h3>
              <p className="text-xs text-slate-500">
                Redirecting you to your administrative control dashboard...
              </p>
            </div>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl text-xs font-semibold leading-relaxed">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="e.g. manager@cafe.com"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-brand-500 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-slate-300 rounded-md"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-500">
                    Remember my terminal
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-all cursor-pointer"
                >
                  {loading ? "Verifying credentials..." : "Sign In"}
                </button>
              </form>

              {/* Testing Credentials Helper Box */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl space-y-2 text-xs">
                <p className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  💡 Demo Testing Accounts
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[9px]">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-400">1. Master Admin</span>
                    <p className="font-mono text-brand-500 font-bold">master@quickbite.com</p>
                    <p className="font-mono text-slate-500">password</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-400">2. Restaurant Admin</span>
                    <p className="font-mono text-brand-500 font-bold">owner@cafe.com</p>
                    <p className="font-mono text-slate-500">password</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-400">3. Waiter Staff</span>
                    <p className="font-mono text-brand-500 font-bold">waiter@cafe.com</p>
                    <p className="font-mono text-slate-500">password</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-400">4. Kitchen Staff</span>
                    <p className="font-mono text-brand-500 font-bold">kitchen@cafe.com</p>
                    <p className="font-mono text-slate-500">password</p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
