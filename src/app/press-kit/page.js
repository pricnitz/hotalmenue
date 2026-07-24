"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { SparklesIcon, ArrowRightIcon, MailIcon, MapPinIcon } from "../../components/Icons";

export default function PressKitPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-left space-y-12">
        
        {/* Header Title */}
        <div className="space-y-4 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
            <SparklesIcon className="w-4 h-4" /> Media & Brand Assets
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            TableMenu.in Press Kit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Official logos, brand assets, founder bio information, and press resources for media publications.
          </p>
        </div>

        {/* Company Overview Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">About TableMenu.in</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Founded by <strong>Payal Pandit</strong>, <strong>Durgawati Pandit</strong>, and Co-Founder <strong>Nitesh Ahirwar</strong> in Bhopal, MP, TableMenu.in is an agile Next.js dining platform affiliated with <strong>Code World Sol</strong> (<a href="https://codeworldsol.com" target="_blank" rel="noopener noreferrer" className="text-brand-500 font-bold underline">codeworldsol.com</a>). TableMenu.in empowers restaurants to offer contactless QR menus, multi-currency pricing, and real-time Kitchen Display System (KDS) order routing.
          </p>
        </div>

        {/* Brand Assets Row */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Official Brand Assets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Logo Dark Mode Asset */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 text-white">
              <div>
                <img src="/logo/logo.png" alt="TableMenu.in Brand Logo" className="h-10 w-auto object-contain mb-3" />
                <h4 className="font-bold text-sm">Primary Brand Logo (Dark Backdrop)</h4>
                <p className="text-xs text-slate-400 mt-1">High-res PNG logo suited for dark publications.</p>
              </div>
              <a
                href="/logo/logo.png"
                download="tablemenu_logo.png"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-xs font-bold transition-all w-fit cursor-pointer"
              >
                Download Logo PNG
              </a>
            </div>

            {/* Leadership Info Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Leadership & Founders</h4>
                <ul className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                  <li>• Payal Pandit (Founder)</li>
                  <li>• Durgawati Pandit (Founder)</li>
                  <li>• Nitesh Ahirwar (Co-Founder)</li>
                </ul>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Affiliated & Powered by Code World Sol, Bhopal, MP, India.</p>
            </div>

          </div>
        </div>

        {/* Media Contact Box */}
        <div className="bg-slate-900 dark:bg-zinc-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border border-slate-800">
          <div>
            <h4 className="font-bold text-base">Press & Media Inquiries</h4>
            <p className="text-xs text-slate-400 mt-1">Reach out to our PR team for interviews or media feature requests.</p>
          </div>
          <a
            href="mailto:info@hotelmenu.in?subject=Press%20Inquiry"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
          >
            Email Press Team <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
