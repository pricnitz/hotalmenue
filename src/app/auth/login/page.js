"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrCodeIcon, CheckCircleIcon } from "../../../components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const getUrlCredentials = () => {
    if (typeof window === "undefined") return { email: "", password: "" };

    const params = new URLSearchParams(window.location.search);
    return {
      email: params.get("email") || "",
      password: params.get("password") || "",
    };
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const redirectToDashboard = useCallback((redirectPath) => {
    const target = redirectPath || "/dashboard/master";
    if (typeof window !== "undefined") {
      window.location.href = target;
    } else {
      router.replace(target);
    }
  }, [router]);

  useEffect(() => {
    const { email: urlEmail, password: urlPassword } = getUrlCredentials();
    if (!urlEmail || !urlPassword) return;

    setEmail(urlEmail);
    setPassword(urlPassword);

    const autoLogin = async () => {
      setErrorMsg("");
      setLoading(true);
      try {
        console.log("Auto-login request started...");
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: urlEmail, password: urlPassword }),
        });

        console.log("Auto-login response status:", res.status);
        const data = await res.json();
        console.log("Auto-login response data:", data);

        if (res.ok) {
          setSuccess(true);
          if (data.restaurantId) {
            try {
              localStorage.setItem("restaurantId", data.restaurantId);
            } catch (storageErr) {
              console.warn("Failed to save restaurantId to localStorage:", storageErr);
            }
          }
          redirectToDashboard(data.redirect);
        } else {
          setErrorMsg(data.error || "Invalid credentials.");
        }
      } catch (err) {
        console.error("Auto-login error:", err);
        setErrorMsg("Failed to connect to authentication server: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, [redirectToDashboard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      console.log("Submitting login form for:", email);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Submit response status:", res.status);
      const data = await res.json();
      console.log("Submit response data:", data);

      if (res.ok) {
        setSuccess(true);
        if (data.restaurantId) {
          try {
            localStorage.setItem("restaurantId", data.restaurantId);
          } catch (storageErr) {
            console.warn("Failed to save restaurantId to localStorage:", storageErr);
          }
        }
        redirectToDashboard(data.redirect);
      } else {
        setErrorMsg(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error exception:", err);
      setErrorMsg("Failed to connect to authentication server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-200">

      {/* Back to Home Link */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-brand-500">
          ← Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center bg-slate-950 px-5 py-2.5 rounded-3xl border border-slate-800 shadow-lg hover:border-brand-500/50 transition-all">
          <img src="/logo/logo.png" alt="TableMenu.in Logo" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />
        </Link>
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

            </>
          )}

        </div>
      </div>
    </div>
  );
}
