import React from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ChartIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon } from "../../../components/Icons";

export const metadata = {
  title: "POS Analytics & Revenue Reports | TableMenu.in",
  description: "Extract actionable food-costing, menu engineering, peak dining hours, and consumer insight data directly from your digital sales ledger.",
};

export default function AnalyticsFeaturePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-extrabold text-indigo-500 uppercase tracking-wider">
                  <ChartIcon className="w-4 h-4" /> Back-Office Analytics Module
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
                  Advanced POS Analytics & Business Intelligence
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Turn raw order data into high-profit menu decisions. Track bestselling dishes, peak customer ordering hours, table turnover velocity, and net sales margins in real-time.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 text-sm font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    View Live Analytics Free <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    href="/contact?type=demo"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 px-6 py-3.5 text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Schedule Live Demo
                  </Link>
                </div>
              </div>

              {/* Analytics Mock Chart Card */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Weekly Revenue Matrix</span>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2.5 py-0.5 rounded-md">Live Stream</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Gross Sales</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">$14,280.00</span>
                  </div>
                  
                  {/* Progress bars */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Top Category: Starters & Mains</span>
                        <span>54% ($7,711)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[54%]"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Artisanal Pizzas</span>
                        <span>32% ($4,569)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[32%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-400 font-medium">
                  <span>Peak Hours: 7:00 PM - 9:30 PM</span>
                  <span className="text-emerald-500 font-bold">↗ +18% MoM</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CORE REPORTING MODULES */}
        <section className="py-20 bg-white dark:bg-zinc-900 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Data-Driven Intelligence for Restaurant Managers
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Stop relying on guesswork. Make menu pricing and staffing decisions based on real empirical customer analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "⭐ Menu Engineering Matrix",
                  desc: "Automatically categorize dishes into Stars (High profit/High popularity), Puzzles, Plowhorses, and Dogs so you optimize ingredient prep and margin pricing.",
                },
                {
                  title: "⏰ Peak Dining Hour Heatmaps",
                  desc: "Visualize hourly sales density across days of the week to align kitchen staff shifts and floor waiter scheduling perfectly.",
                },
                {
                  title: "🚀 Table Turnover Velocity",
                  desc: "Track average minutes spent from QR code scan to final bill payment to optimize dining room seating efficiency.",
                },
                {
                  title: "📈 Multi-Outlet Central Dashboard",
                  desc: "Running multiple cafe or dining locations? Compare sales performance, bestsellers, and average ticket sizes across all outlets in one view.",
                },
                {
                  title: "📄 CSV / PDF Accounting Ledger Exports",
                  desc: "Export itemized sales reports, tax breakdowns, and payment gateway settlement summaries for your accountant in 1-click.",
                },
                {
                  title: "💡 Smart AI Upsell Suggestions",
                  desc: "Analyze which dish pairings generate the highest cart totals and configure automatic combo popups.",
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
              Unlock Actionable Restaurant Analytics Now
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Get full access to all back-office analytics reports with your 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-extrabold text-white hover:bg-indigo-700 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
