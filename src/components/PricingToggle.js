"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "./Icons";

export default function PricingToggle({ showMatrix = true }) {
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly", "quarterly", "halfyearly", or "annual"

  const defaultPlans = [
    {
      id: "starter",
      name: "Starter (1-10 QRs)",
      description: "Ideal for small cafes and eateries needing basic QR table ordering.",
      priceMonthly: 29,
      priceQuarterly: 26,
      priceHalfYearly: 23,
      priceAnnual: 21,
      ctaText: "Start Free Trial",
      ctaLink: "/auth/register?plan=starter",
      details: {
        tables: "1 - 10 Dining Tables (QR Range)",
        menuItems: "Up to 50 Menu Items",
        support: "1 Month Free Dedicated Support (Tech & Non-Tech)",
        standee: "Digital Printable QR Cards",
        staff: "3 Staff Accounts",
      },
      popular: false,
      gradient: "from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950",
      border: "border-slate-200 dark:border-slate-800",
    },
    {
      id: "growth",
      name: "Growth (11-30 QRs)",
      description: "Best for growing bistros and family restaurants looking to scale table orders.",
      priceMonthly: 79,
      priceQuarterly: 71,
      priceHalfYearly: 65,
      priceAnnual: 59,
      ctaText: "Start Free Trial",
      ctaLink: "/auth/register?plan=growth",
      details: {
        tables: "11 - 30 Dining Tables (QR Range)",
        menuItems: "Up to 200 Menu Items",
        support: "1 Month Free Dedicated Support (Tech & Non-Tech)",
        standee: "Physical QR Standee / Tent Cards Included",
        staff: "15 Staff Accounts",
      },
      popular: true, // Recommended Plan
      gradient: "from-brand-50 to-orange-100/50 dark:from-zinc-900 dark:to-brand-950/20",
      border: "border-brand-500",
    },
    {
      id: "pro",
      name: "Pro Enterprise (31-50+ QRs)",
      description: "Perfect for high-volume dining, fine dining, and multi-outlet chains.",
      priceMonthly: 149,
      priceQuarterly: 134,
      priceHalfYearly: 120,
      priceAnnual: 111,
      ctaText: "Talk to Sales / Register",
      ctaLink: "/contact?type=demo",
      details: {
        tables: "31 - 50+ Dining Tables (QR Range)",
        menuItems: "Unlimited Menu Items",
        support: "1 Month Free Dedicated Support (Tech & Non-Tech)",
        standee: "Custom Acrylic QR Standees & Branding Kit",
        staff: "Unlimited Staff Accounts",
      },
      popular: false,
      gradient: "from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950",
      border: "border-slate-200 dark:border-slate-800",
    },
  ];

  const [plans, setPlans] = useState(defaultPlans);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setPlans(data.map((p, idx) => ({
            ...defaultPlans[idx],
            ...p,
            details: p.details || {
              tables: p.qrRange || defaultPlans[idx].details.tables,
              menuItems: p.menuItems || defaultPlans[idx].details.menuItems,
              support: p.support || defaultPlans[idx].details.support,
              standee: p.standee || defaultPlans[idx].details.standee,
              staff: defaultPlans[idx].details.staff,
            }
          })));
        }
      }
    } catch (e) {
      console.error("Failed to fetch live pricing:", e);
    }
  };

  const getCycleLabel = () => {
    if (billingCycle === "annual") return "billed annually (12 Months)";
    if (billingCycle === "halfyearly") return "billed every 6 Months";
    if (billingCycle === "quarterly") return "billed quarterly (3 Months)";
    return "billed monthly";
  };

  const getCalculatedPrice = (plan) => {
    if (billingCycle === "annual") return plan.priceAnnual;
    if (billingCycle === "halfyearly") return plan.priceHalfYearly;
    if (billingCycle === "quarterly") return plan.priceQuarterly;
    return plan.priceMonthly;
  };

  const comparisonMatrix = [
    {
      category: "Plan Limits",
      features: [
        { name: "Tables Allowed", starter: "Up to 10", growth: "Up to 50", pro: "Unlimited" },
        { name: "Menu Items Allowed", starter: "Up to 50", growth: "Up to 200", pro: "Unlimited" },
        { name: "Staff Accounts", starter: "3 accounts", growth: "15 accounts", pro: "Unlimited" },
        { name: "Support Type", starter: "Email (24h response)", growth: "24/7 Live Chat", pro: "Dedicated Account Manager & Phone" },
        { name: "Cloud Storage Limit", starter: "500 MB", growth: "2 GB", pro: "10 GB" },
      ]
    },
    {
      category: "Features Included",
      features: [
        { name: "Smart QR Menu Builder", starter: "✅ Basic styling", growth: "✅ Advanced custom brand styling", pro: "✅ Full White-label & Custom Domain" },
        { name: "Waiter Summon Button", starter: "❌", growth: "✅", pro: "✅" },
        { name: "Kitchen Display App (KDS)", starter: "✅ 1 terminal", growth: "✅ Up to 5 terminals", pro: "✅ Unlimited terminals" },
        { name: "Contactless Payments (Stripe/UPI)", starter: "❌", growth: "✅ (0% gateway markup)", pro: "✅ (0% gateway markup)" },
        { name: "Advanced Sales Analytics", starter: "❌", growth: "✅", pro: "✅" },
      ]
    }
  ];

  return (
    <div className="space-y-16">
      {/* 3-Cycle Billing Toggle */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("quarterly")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              billingCycle === "quarterly"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Quarterly (3 Mos) <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold bg-brand-50 dark:bg-brand-950/50 px-1.5 py-0.5 rounded-md ml-1">Save 10%</span>
          </button>
          <button
            onClick={() => setBillingCycle("halfyearly")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              billingCycle === "halfyearly"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            6 Months <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold bg-brand-50 dark:bg-brand-950/50 px-1.5 py-0.5 rounded-md ml-1">Save 15%</span>
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              billingCycle === "annual"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            12 Months <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold bg-brand-50 dark:bg-brand-950/50 px-1.5 py-0.5 rounded-md ml-1">Save 25%</span>
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All tiers include a 14-day free trial. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => {
          const price = getCalculatedPrice(plan);
          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl bg-gradient-to-b ${plan.gradient} p-8 border-2 ${plan.border} shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-red-500 px-4 py-1 text-[10px] font-bold text-white shadow-md uppercase tracking-wider">
                  Recommended Plan
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">${price}</span>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">/ month</span>
                </div>

                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                  {getCycleLabel()}
                </p>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Plan Limitations & Specs:</h5>
                  <ul className="space-y-3">
                    {Object.values(plan.details).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircleIcon className="w-5 h-5 text-brand-500 flex-none mt-0.5" />
                        <span className="font-medium text-left">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center rounded-2xl py-3 px-4 text-sm font-bold shadow-md transition-all active:scale-95 ${
                    plan.popular
                      ? "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25"
                      : "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800 dark:hover:bg-slate-100"
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Plan Comparison Table */}
      {showMatrix && (
        <div className="max-w-5xl mx-auto pt-12 hidden md:block">
          <div className="text-center space-y-2 mb-10">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Plan Comparison</h4>
            <p className="text-sm text-slate-500">Compare specs and limits across our plans to choose your fit.</p>
          </div>
          
          <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 text-sm font-bold text-slate-900 dark:text-white w-1/3">Feature Set</th>
                  <th className="p-4 text-sm font-bold text-slate-900 dark:text-white">Starter</th>
                  <th className="p-4 text-sm font-bold text-slate-900 dark:text-white">Growth (Recommended)</th>
                  <th className="p-4 text-sm font-bold text-slate-900 dark:text-white">Pro Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {comparisonMatrix.map((cat, i) => (
                  <React.Fragment key={i}>
                    <tr className="bg-slate-100/50 dark:bg-zinc-900/30">
                      <td colSpan="4" className="p-3 text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.features.map((feat, j) => (
                      <tr key={j} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                        <td className="p-4 text-sm text-slate-800 dark:text-slate-300 font-semibold">{feat.name}</td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{feat.starter}</td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium text-slate-900 dark:text-white">{feat.growth}</td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{feat.pro}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
