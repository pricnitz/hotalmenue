"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from "../../components/Icons";

export default function SLAPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-left space-y-12">
        
        {/* Header Title */}
        <div className="space-y-4 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheckIcon className="w-4 h-4" /> Enterprise Commitment
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Service Level Agreement (SLA)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Our strict operational uptime, menu loading latency, and 24/7 technical support benchmarks for TableMenu.in dining software.
          </p>
        </div>

        {/* 3 Core SLA Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-lg">⚡</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">99.9% Uptime</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Guaranteed cloud infrastructure availability across dining tables and KDS monitors.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-black text-lg">🚀</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">&lt; 1.2s Menu Scan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ultra-fast QR code menu rendering optimized for mobile browser performance.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-lg">📞</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">24/7 Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dedicated assistance for waitstaff, kitchen runners, and restaurant managers.</p>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> Planned Maintenance & Outage Protocol
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              System maintenance operations are scheduled exclusively during off-peak hours (between 2:00 AM and 4:00 AM IST) with 48 hours prior notification sent to all active restaurant accounts.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-brand-500" /> Incident Response Times
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Critical (KDS / Menu Outage):</strong> Response within &lt; 15 minutes.</li>
              <li><strong>Major (Table Ordering Glitch):</strong> Response within &lt; 1 hour.</li>
              <li><strong>Minor (General Enquiries):</strong> Response within &lt; 4 hours.</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 dark:bg-zinc-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border border-slate-800">
          <div>
            <h4 className="font-bold text-base">Need Priority SLA Support?</h4>
            <p className="text-xs text-slate-400 mt-1">Pro Enterprise outlets receive dedicated account management.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
          >
            Contact SLA Team <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
