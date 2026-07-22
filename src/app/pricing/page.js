import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PricingToggle from "../../components/PricingToggle";
import { CheckCircleIcon } from "../../components/Icons";

export const metadata = {
  title: "Pricing | Affordable Plans for QR Menus & Ordering",
  description: "View TableMenu.in pricing plans. Starter, Growth, and Pro Enterprise tiers. Free 14-day trial, annual discounts, and direct payment integrations.",
};

export default function PricingPage() {
  const billingFaqs = [
    {
      q: "Are there any setup fees or hidden installation costs?",
      a: "No. TableMenu.in is fully cloud-based. There are zero installation fees, hardware setup fees, or hidden charges. You can activate your account and start using it immediately on your own devices.",
    },
    {
      q: "Can I upgrade or downgrade my tier at any time?",
      a: "Yes. You can switch plans from your billing portal at any point. Upgrades take effect instantly with pro-rated billing, while downgrades apply at the start of your next billing cycle.",
    },
    {
      q: "Do I have to pay transaction fees to TableMenu.in on table sales?",
      a: "No. Unlike other platforms that take a 1% to 3% cut of your orders, TableMenu.in charges a flat SaaS fee. You keep 100% of your revenue, paying only standard credit card processing fees directly to Stripe/UPI.",
    },
    {
      q: "What payment gateways are supported?",
      a: "We integrate directly with Stripe, PayPal, Razorpay, PayU, and local instant bank transfers/UPI. You link your gateway account with a single click, and payouts go straight to your bank.",
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
              Transparent Pricing
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Simple, Flat Plans
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              No contracts. No hidden fees. No commission on your food sales. Choose a plan and start boosting efficiency.
            </p>
          </div>
        </section>

        {/* PRICING TOGGLE MODULE WITH MATRIX */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingToggle showMatrix={true} />
          </div>
        </section>

        {/* BILLING FAQS */}
        <section className="py-20 bg-slate-50 dark:bg-zinc-950 border-t border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Billing Help
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Billing & Subscription FAQs
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {billingFaqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOCK ENTERPRISE VALUE BANNER */}
        <section className="py-16 bg-white dark:bg-zinc-900 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Running a franchise with 10+ outlets?</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              We offer custom volume pricing, dedicated server infrastructure, consolidated payouts, and prioritized onsite installation training.
            </p>
            <Link
              href="/contact?type=enterprise"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white px-6 py-3.5 text-sm font-bold shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              Contact Franchise Team
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
