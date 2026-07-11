import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { QrCodeIcon, ChefHatIcon, TableIcon, ClockIcon, ChartIcon, SparklesIcon, CheckCircleIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Features | Cloud Restaurant QR Ordering Platform",
  description: "Explore the comprehensive features of QuickBite: QR Menus, Live Table Management, contactless payments, web-based KDS, and robust back-office analytics.",
};

export default function FeaturesPage() {
  const featureList = [
    {
      icon: <QrCodeIcon className="w-8 h-8 text-brand-500" />,
      tag: "Customer Facing",
      title: "Smart QR Menu & Digital Ordering",
      desc: "Provide your guests with a fast, modern browser-based menu. Replace printing costs with real-time editing.",
      details: [
        "Real-time item status (mark 86'ed/out-of-stock instantly)",
        "Rich media upload: food photography, video stories",
        "Dietary tags (Vegan, Gluten-free, Spicy, Nuts alert)",
        "Multi-language support with automated Google Translate integration",
        "Smart upselling promotions linked to basket selections",
      ],
    },
    {
      icon: <TableIcon className="w-8 h-8 text-brand-500" />,
      tag: "Dining Room",
      title: "Live Table & Waiter Management",
      desc: "Assign tables, map service zones, and track seating times without physical logbooks.",
      details: [
        "Table-specific QR generation with anti-fraud geo-verification",
        "Live occupancy monitor (Vacant, Ordering, Seated, Billing)",
        "Waiter zones mapping and digital summon alert ('Call Waiter' button)",
        "Guest duration tracking to increase overall table turnover",
        "Interactive floor map configurator on the admin panel",
      ],
    },
    {
      icon: <ChefHatIcon className="w-8 h-8 text-brand-500" />,
      tag: "Kitchen Operations",
      title: "Kitchen Display System (KDS)",
      desc: "Ditch thermal paper printers. Streamline orders to cooking terminals with real-time sync.",
      details: [
        "Responsive web-based KDS app (works on any Android/iOS tablet or TV)",
        "Color-coded prep timers (Green: New, Orange: Slow, Red: Delayed)",
        "Course grouping: automatically group starters, mains, and desserts",
        "Chef completion button triggers instant ready notification for waitstaff",
        "Sound alerts for new orders with custom volume controls",
      ],
    },
    {
      icon: <ClockIcon className="w-8 h-8 text-brand-500" />,
      tag: "Checkout & Payments",
      title: "Contactless Payments & Ledger",
      desc: "Enable guests to check out on their own schedule with direct payment integrations.",
      details: [
        "Stripe, PayPal, Apple Pay, Google Pay, and UPI gateways supported",
        "Guests can split the bill equally, by seat, or by specific items",
        "Automated tips suggestions (10%, 15%, 20%, Custom)",
        "Direct email receipt generation for tax compliance",
        "0% transaction gateway markup (direct account links)",
      ],
    },
    {
      icon: <ChartIcon className="w-8 h-8 text-brand-500" />,
      title: "Advanced POS Analytics & Reports",
      tag: "Back Office",
      desc: "Extract actionable food-costing and consumer insight data directly from your sales.",
      details: [
        "Bestselling dishes analysis and menu engineering grid",
        "Peak ordering times & average dining duration charts",
        "Customer satisfaction scoring (linked to review popups)",
        "Staff response timers (from QR order click to table serve)",
        "Daily, weekly, and monthly CSV/PDF ledger exports",
      ],
    },
    {
      icon: <SparklesIcon className="w-8 h-8 text-brand-500" />,
      title: "Upselling Engine & Campaigns",
      tag: "Marketing",
      desc: "Run campaigns and automate marketing directly from customer order logs.",
      details: [
        "Automated cross-sell popups ('Would you like to add fries?')",
        "Happy hour scheduling (auto-switches pricing on designated hours)",
        "SMS newsletter opt-in at checkout for promo distribution",
        "Loyalty points accumulator linked to customer phone numbers",
        "Direct integrations with Mailchimp and active POS systems",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Product Overview
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Features Deep-Dive
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore the advanced features powering restaurant dining rooms, kitchens, and back-office management.
            </p>
          </div>
        </section>

        {/* DETAILED FEATURES LIST */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {featureList.map((feat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col lg:flex-row items-center gap-12 py-8 border-b border-slate-100 dark:border-slate-800/80 last:border-0 ${
                    idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual mockup block */}
                  <div className="flex-1 w-full bg-slate-50 dark:bg-zinc-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden aspect-[4/3] flex flex-col justify-between shadow-xs">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-transparent z-0"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full">
                        {feat.tag}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">QuickBite POS Module</span>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center py-6 text-slate-400">
                      <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-md text-brand-500">
                        {feat.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-4 text-center">
                        {feat.title} Graphic Simulator
                      </span>
                    </div>
                    
                    <div className="relative z-10 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-center">
                      <span className="text-[11px] font-medium text-slate-400">Cloud Sync: 🟢 Synchronized</span>
                    </div>
                  </div>

                  {/* Info list */}
                  <div className="flex-1 space-y-6 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                      {feat.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Detailed Modules:</h4>
                      <ul className="space-y-3">
                        {feat.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <CheckCircleIcon className="w-5 h-5 text-brand-500 flex-none mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Want to see these features in action?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Our specialists can guide you through a live walk-through with a mock menu structured around your restaurant's cuisine.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/contact?type=demo"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-600 shadow-md active:scale-95 transition-all"
              >
                Schedule Demo Call
              </Link>
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 shadow-md active:scale-95 transition-all"
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
