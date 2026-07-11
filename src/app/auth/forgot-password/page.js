"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCodeIcon, CheckCircleIcon } from "../../../components/Icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-200">
      
      {/* Back to Login Link */}
      <div className="absolute top-4 left-4">
        <Link href="/auth/login" className="text-xs font-semibold text-slate-500 hover:text-brand-500">
          ← Back to Login
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-red-500 text-white shadow-md">
          <QrCodeIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Enter your email below and we will send you a recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl sm:px-10 text-left space-y-6">
          
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recovery Email Sent!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We've dispatched a password reset link to <span className="font-semibold text-slate-800 dark:text-slate-100">{email}</span>. Click the demo link below to simulate receiving the link.
              </p>
              
              <Link
                href="/auth/reset-password"
                className="mt-4 block w-full text-center rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-600 active:scale-95 transition-all"
              >
                Simulate: Click Reset Link 🔗
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registered Email Address
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
                  placeholder="admin@myrestaurant.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-all cursor-pointer"
              >
                {loading ? "Sending reset links..." : "Send Reset Link"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
