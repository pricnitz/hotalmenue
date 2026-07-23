import React from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import QRMenuSimulator from "../../../components/QRMenuSimulator";
import { QrCodeIcon, SparklesIcon, CheckCircleIcon, ArrowRightIcon, StarIcon } from "../../../components/Icons";

export const metadata = {
  title: "Smart QR Menu & Contactless Digital Ordering | TableMenu.in",
  description: "Transform your dining room with interactive browser-based QR menus. Instant real-time updates, multi-language translation, photo & video stories, and zero app downloads required.",
};

export default function QRMenuFeaturePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  <QrCodeIcon className="w-4 h-4" /> Customer Facing Module
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
                  Smart QR Menu & Contactless Digital Ordering
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Eliminate re-printing costs and waiting delays. Give your diners instant access to visually rich, interactive menus right from their smartphone browser — no app download required.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-3.5 text-sm font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Create Your QR Menu Free <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    href="/contact?type=demo"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 px-6 py-3.5 text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Schedule Live Demo
                  </Link>
                </div>
              </div>

              {/* Stat Card Mockup */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                      <QrCodeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">QR Speed Metrics</h4>
                      <p className="text-xs text-slate-400">Average diner experience benchmark</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-bold">99.8% Uptime</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Scan-to-Order Speed</span>
                    <span className="text-2xl font-black text-brand-500 block mt-1">1.2 Sec</span>
                    <span className="text-[10px] text-slate-400 block">Instant WebAssembly PWA</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Average Order Lift</span>
                    <span className="text-2xl font-black text-emerald-500 block mt-1">+28%</span>
                    <span className="text-[10px] text-slate-400 block">Via AI Upsell Suggestions</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CORE ADVANTAGES */}
        <section className="py-20 bg-white dark:bg-zinc-900 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Why Top Restaurants Choose TableMenu.in QR
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Built specifically to solve high print costs, slow staff turnaround, and out-of-stock item confusion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "⚡ Instant Real-Time Item Updates",
                  desc: "Ran out of fresh salmon or specialty coffee beans? Mark any dish as 'Sold Out' with one tap on your manager dashboard. It updates instantly across all active customer tables.",
                },
                {
                  title: "🌐 Automated Multi-Language Translation",
                  desc: "Serve international tourists effortlesly. Your menu automatically translates into over 20+ languages based on the guest's phone browser settings.",
                },
                {
                  title: "🎨 4 Curated Theme Palettes",
                  desc: "Match your exact venue vibe. Choose between Dark Velvet (Lounges), Royal Gold (Fine Dining), Vibrant Sunset (Cafes), and Minimalist Emerald (Organic Eats).",
                },
                {
                  title: "🥗 Veg / Non-Veg & Allergen Badges",
                  desc: "Highlight dietary choices clearly with green and red dietary markers, nut warnings, gluten-free tags, and spice indicators.",
                },
                {
                  title: "🍔 High-Res Photos & Video Stories",
                  desc: "Showcase mouth-watering dish photos and short video previews that entice diners to try high-margin chef specials.",
                },
                {
                  title: "📲 Zero App Installation Required",
                  desc: "Diners scan the table QR code using their standard iPhone or Android camera app. The menu opens directly in their web browser in under 1 second.",
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

        {/* LIVE SIMULATOR SECTION */}
        <section className="py-16 bg-slate-50 dark:bg-zinc-950 border-y border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <QRMenuSimulator />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white dark:bg-zinc-900 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Ready to Upgrade Your Restaurant Menu?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Launch your custom branded QR menu in less than 10 minutes. Dedicated support included.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-sm font-extrabold text-white hover:bg-brand-600 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Start Free Trial Now
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
