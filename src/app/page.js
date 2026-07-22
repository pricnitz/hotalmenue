import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QRMenuSimulator from "../components/QRMenuSimulator";
import PricingToggle from "../components/PricingToggle";
import FAQAccordion from "../components/FAQAccordion";
import { QrCodeIcon, ChefHatIcon, TableIcon, ClockIcon, ChartIcon, CheckCircleIcon, ArrowRightIcon, StarIcon, SparklesIcon } from "../components/Icons";

export const metadata = {
  title: "TableMenu.in | Cloud Restaurant QR Menu & KDS Order Management System",
  description: "TableMenu.in is a professional food-tech SaaS landing page. Launch digital QR menus, manage table occupancy, optimize kitchen KDS workflows, and accept contactless payments with 0% commission.",
  openGraph: {
    title: "TableMenu.in | Cloud Restaurant QR Menu & Order Management",
    description: "Digitize your dining room. Guests scan QR, order food, and pay instantly without downloading any apps. Reduce order times by 12 mins.",
    type: "website",
  },
};

export default function Home() {
  const features = [
    {
      icon: <QrCodeIcon className="h-6 w-6 text-brand-500" />,
      title: "Smart contactless QR Menus",
      desc: "Beautiful high-resolution digital menus that update in real-time. Support for dietary filters, descriptions, and multi-language translation.",
    },
    {
      icon: <TableIcon className="h-6 w-6 text-brand-500" />,
      title: "Dynamic Table Management",
      desc: "Assign unique QR codes to tables, track live dining sessions, manage waiter zones, and check real-time seat occupancy.",
    },
    {
      icon: <ChefHatIcon className="h-6 w-6 text-brand-500" />,
      title: "Kitchen Display System (KDS)",
      desc: "Replace messy paper tickets. Direct digital order transmission to kitchen terminals with color-coded preparation timers.",
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-brand-500" />,
      title: "Contactless Payments & Checkout",
      desc: "Accept Apple Pay, Google Pay, credit cards, and local gateways directly from the guest's phone. Bill splitting supported.",
    },
    {
      icon: <ChartIcon className="h-6 w-6 text-brand-500" />,
      title: "POS Analytics & Sales Reports",
      desc: "Track bestselling dishes, average basket values, staff performance, and guest feedback metrics in a centralized dashboard.",
    },
    {
      icon: <SparklesIcon className="h-6 w-6 text-brand-500" />,
      title: "Smart Upselling Promos",
      desc: "Automated recommendations like 'Pair with craft beer' or 'Add garlic bread' to boost average ticket values by up to 22%.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Scan Table QR",
      desc: "Guests scan the table-specific QR code using their default smartphone camera. No app download required.",
    },
    {
      step: "02",
      title: "Browse & Order",
      desc: "Browse media-rich menus, select customizations, and submit order directly to the kitchen.",
    },
    {
      step: "03",
      title: "Instant KDS Alert",
      desc: "Orders immediately pop up on kitchen display screens grouped by table and prioritized by order times.",
    },
    {
      step: "04",
      title: "Fast Serve & Pay",
      desc: "Staff serves the food. Guests checkout and pay directly from their phones whenever they are ready.",
    },
  ];

  const testimonials = [
    {
      name: "Chef Marco Silva",
      role: "Owner, Bella Italia Bistro",
      stats: "+24% Average Order Value",
      quote: "TableMenu.in transformed our busy Friday nights. Guests order drinks immediately upon sitting, and they checkout without waiting for the waiter. Our sales increased and staff stress plummeted.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Operations Director, Curry Junction (3 locations)",
      stats: "14 min saved per table turn",
      quote: "We consolidated our menu management. Changing prices or marking items out-of-stock takes 10 seconds. The analytics help us optimize our prep waste. Essential POS addition.",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-50 dark:bg-zinc-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none">
            {/* Elegant grid background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  The Restaurant Operating System of the Future
                </span>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-tight">
                Digitize your dining room with{" "}
                <span className="gradient-text">TableMenu.in QR Menu</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Guests scan, order, and pay directly from their table. No app install required. Streamline kitchen workflows, reduce wait times, and increase orders by 22%.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-brand-600 hover:shadow-brand-500/25 active:scale-95 transition-all duration-200"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/contact?demo=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 px-8 py-4 text-base font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all duration-200"
                >
                  Request Demo
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="pt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> No Credit Card Required</span>
                <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> 14-Day Free Trial</span>
                <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> 0% Commission Gateways</span>
              </div>
            </div>
            
            {/* Dashboard Hero Graphic mockup container */}
            <div className="mt-16 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 shadow-2xl p-2 sm:p-4 max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] relative bg-slate-900 flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-slate-900 to-red-950/80 z-0"></div>
                <div className="relative z-10 text-center p-6 space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-500 border border-brand-500/30">
                    <ChartIcon className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">Cloud Analytics Dashboard Mockup</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Centralized platform monitoring orders in real-time, sales performance, category trends, and waiter response times.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap pt-2">
                    <span className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-slate-700/50">🟢 Live Outlet: active</span>
                    <span className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-slate-700/50">📊 Today: ₹4,920.00</span>
                    <span className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-slate-700/50">📋 Orders: 148 processed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 lg:py-28 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Robust Features
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Everything you need to run a modern, efficient restaurant
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Say goodbye to paper menus and chaotic wait times. TableMenu.in connects customers directly with the kitchen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-zinc-950/40 hover:bg-white dark:hover:bg-zinc-950 transition-all duration-300 shadow-xs hover:shadow-xl hover:scale-[1.01] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30 shadow-inner">
                      {feat.icon}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="pt-6">
                    <Link
                      href="/features"
                      className="text-xs font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
                    >
                      Learn more <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESTAURANT WORKFLOW */}
        <section className="py-20 lg:py-28 bg-slate-50 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                How It Works
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Seamless operation for staff and guests
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                A simple 4-step pipeline that cuts down ordering friction and gets food prepared faster.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="relative space-y-4 text-center sm:text-left bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                  <div className="absolute top-4 right-4 text-4xl font-extrabold text-slate-100 dark:text-zinc-800 select-none">
                    {step.step}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE QR MENU DEMO */}
        <section id="demo-simulator" className="py-20 lg:py-28 bg-white dark:bg-zinc-900 border-t border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Interactive Experience
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Try out the customer order simulator
              </h3>
              <p className="text-slate-500">
                Use the live simulator below to experience how easily a diner places an order and how KDS confirms it instantly.
              </p>
            </div>
            
            <QRMenuSimulator />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 lg:py-28 bg-slate-50 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Success Stories
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Loved by restaurant owners worldwide
              </h3>
              <p className="text-slate-500">
                See how eateries of all sizes leverage TableMenu.in to reduce stress and boost profitability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((test, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800/80 shadow-xl flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                    <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{test.quote}"
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{test.name}</h4>
                      <p className="text-xs text-slate-500">{test.role}</p>
                    </div>
                    <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
                      {test.stats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION SUMMARY */}
        <section id="pricing" className="py-20 lg:py-28 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Transparent Pricing
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Plans that grow with your kitchen
              </h3>
              <p className="text-slate-500">
                Choose the perfect option. Upgrade, downgrade, or cancel at any time. Start your free trial today.
              </p>
            </div>

            <PricingToggle showMatrix={false} />
            
            <div className="mt-12 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 hover:underline"
              >
                View Detailed Feature Matrix <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faqs" className="py-20 lg:py-28 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Got Questions?
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Frequently Asked Questions
              </h3>
              <p className="text-slate-500">
                Find quick answers about setup, POS hardware, payment settlement, and table management.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-slate-900 to-red-950/80 z-0"></div>
          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to double your restaurant's efficiency?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
              Join hundreds of restaurants already cutting menu costs, reducing staff strain, and providing contactless convenience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-brand-600 active:scale-95 transition-all duration-200"
              >
                Register Restaurant Now
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 px-8 py-4 text-base font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all duration-200"
              >
                Request a Demo Call
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
