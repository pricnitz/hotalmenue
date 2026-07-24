"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { CheckCircleIcon, ShieldCheckIcon, ClockIcon, ArrowRightIcon, InfoCircleIcon } from "../../components/Icons";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-left space-y-12">
        
        {/* Header Title */}
        <div className="space-y-4 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <ShieldCheckIcon className="w-4 h-4" /> Transparency & Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Last Updated: July 2026. Official terms governing subscription cancellations and refund eligibility for TableMenu.in dining software.
          </p>
        </div>

        {/* Highlighted 24-Hour Guarantee Card */}
        <div className="bg-gradient-to-br from-brand-500 to-amber-500 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏱️</span>
            <div>
              <h2 className="text-xl font-black">24-Hour Pre-Setup Money-Back Guarantee</h2>
              <p className="text-xs text-brand-100 font-semibold mt-0.5">
                Full 100% refund eligible within 24 hours prior to account setup & menu onboarding approval!
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
            We understand restaurant setup needs precision. If you register for any active paid plan (Starter, Growth, or Pro Enterprise) and request cancellation <strong>within 24 hours of payment and before your restaurant profile/QR setup is officially approved by our onboarding team</strong>, you are entitled to an immediate <strong>100% full refund</strong> with zero cancellation charges.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* Section 1: Conditions */}
          <section className="space-y-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> 1. Eligibility & Conditions for Refund
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Pre-Approval Window:</strong> Requests submitted within 24 hours of transaction and prior to final restaurant account verification/setup approval receive 100% refund.</li>
              <li><strong>Post-Setup Active Usage:</strong> Once custom QR menus are generated and account setup is approved, standard monthly or annual subscription fees become non-refundable for that billing cycle.</li>
              <li><strong>Trial Period:</strong> Demo accounts and free trial sessions carry ₹0 cost and do not require refund requests.</li>
            </ul>
          </section>

          {/* Section 2: Process */}
          <section className="space-y-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-brand-500" /> 2. How to Submit a Refund Claim
            </h3>
            <p className="text-xs sm:text-sm">
              To request a cancellation and refund, please follow these simple steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>Email our billing department at <a href="mailto:info@hotelmenu.in" className="text-brand-500 font-bold underline">info@hotelmenu.in</a> or <a href="mailto:support@tablemenu.in" className="text-brand-500 font-bold underline">support@tablemenu.in</a>.</li>
              <li>Include your Restaurant Name, Registered Email, Order/Transaction ID, and reason for cancellation.</li>
              <li>Our support team will verify timestamp eligibility within 2 hours.</li>
            </ol>
          </section>

          {/* Section 3: Processing Time */}
          <section className="space-y-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <InfoCircleIcon className="w-5 h-5 text-indigo-500" /> 3. Refund Disbursement & Timeline
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Approved refunds are credited back directly to the original payment source (UPI, Debit/Credit Card, NetBanking, or Bank Transfer) within <strong>5 to 7 business days</strong> depending on your banking institution.
            </p>
          </section>

        </div>

        {/* CTA Footer */}
        <div className="bg-slate-900 dark:bg-zinc-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border border-slate-800">
          <div>
            <h4 className="font-bold text-base">Have Billing Questions?</h4>
            <p className="text-xs text-slate-400 mt-1">Our support specialists in Bhopal, MP are available 24/7 to assist you.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
          >
            Contact Billing Support <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
