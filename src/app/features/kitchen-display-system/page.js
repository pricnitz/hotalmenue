import React from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ChefHatIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon, SparklesIcon } from "../../../components/Icons";

export const metadata = {
  title: "Kitchen Display System (KDS) | TableMenu.in",
  description: "Ditch thermal paper printers. Streamline kitchen order preparation with real-time web-based KDS screens for cooks and chefs.",
};

export default function KDSFeaturePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-extrabold text-emerald-500 uppercase tracking-wider">
                  <ChefHatIcon className="w-4 h-4" /> Kitchen Operations Module
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
                  Real-Time Kitchen Display System (KDS)
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Replace messy thermal paper tickets and lost orders. Streamline customer orders directly to kitchen tablets or smart TV screens with instant status updates and color-coded timers.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 text-sm font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Setup KDS Free <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    href="/contact?type=demo"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 px-6 py-3.5 text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Schedule Live Demo
                  </Link>
                </div>
              </div>

              {/* KDS Mock Ticket Card */}
              <div className="lg:col-span-5 bg-zinc-950 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4 text-left font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-slate-300">LIVE KITCHEN TICKET #8493</span>
                  </div>
                  <span className="text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                    TABLE 04
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white">2x Truffle Cheeseburger</span>
                    <span className="text-[10px] text-amber-400 font-mono">Cooking...</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white">1x Margherita Basilico</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Ready!</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <ClockIcon className="w-4 h-4 text-amber-400" /> Prep Time: 04:12 Min
                  </div>
                  <button className="bg-emerald-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs">
                    Mark Ticket Ready ✓
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* KEY MODULES */}
        <section className="py-20 bg-white dark:bg-zinc-900 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Built for High-Speed Kitchen Productivity
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Give your head chef, line cooks, and bartenders full visibility of incoming order tickets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "⏱️ Color-Coded Preparation Timers",
                  desc: "Tickets automatically shift colors based on target prep thresholds: Green (New order <5 mins), Yellow (Cooking 5-12 mins), and Red (High priority alert >12 mins).",
                },
                {
                  title: "🔊 Custom Audio Order Chimes",
                  desc: "Distinct sound alerts play through connected tablet speakers or Bluetooth audio whenever a diner places a new order or requests waiter attention.",
                },
                {
                  title: "🍲 Course Grouping & Modifiers",
                  desc: "Automatically separate tickets into Appetizers, Main Course, and Dessert phases so chefs cook items in perfect sequence.",
                },
                {
                  title: "🖥️ Hardware Agnostic (Any Device)",
                  desc: "Runs smoothly in Google Chrome or Safari browser on any iPad, Android tablet, POS terminal, or Smart TV connected to Wi-Fi.",
                },
                {
                  title: "🔔 Waiter Ready Push Notifications",
                  desc: "When the chef taps 'Ready', an instant notification flashes on the waiter's handheld device so hot dishes reach the table immediately.",
                },
                {
                  title: "📊 Kitchen Speed Analytics",
                  desc: "Track average prep time per dish and pinpoint kitchen bottlenecks during weekend dinner rushes.",
                },
              ].map((feat, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-3 shadow-xs">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-slate-50 dark:bg-zinc-950 text-center border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Transform Your Kitchen Workflow Today
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Reduce kitchen ticket errors and improve dish prep speed by up to 35%.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-extrabold text-white hover:bg-emerald-700 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Try Free for 14 Days
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
