"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "./Icons";

export default function PricingToggle({ showMatrix = true }) {
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly", "quarterly", "halfyearly", or "annual"
  const [currency, setCurrency] = useState("INR"); // "INR" or "USD"

  const defaultPlans = [
    {
      id: "starter",
      name: "Starter (1-10 QRs)",
      description: "Ideal for small cafes and eateries needing basic QR table ordering.",
      inrPrices: {
        monthly: 1999,
        quarterly: 1799,
        halfyearly: 1599,
        annual: 1399,
      },
      usdPrices: {
        monthly: 29,
        quarterly: 26,
        halfyearly: 23,
        annual: 21,
      },
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
      inrPrices: {
        monthly: 4999,
        quarterly: 4499,
        halfyearly: 3999,
        annual: 3499,
      },
      usdPrices: {
        monthly: 79,
        quarterly: 71,
        halfyearly: 65,
        annual: 59,
      },
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
      inrPrices: {
        monthly: 9999,
        quarterly: 8999,
        halfyearly: 7999,
        annual: 6999,
      },
      usdPrices: {
        monthly: 149,
        quarterly: 134,
        halfyearly: 120,
        annual: 111,
      },
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
            inrPrices: p.inrPrices || defaultPlans[idx].inrPrices,
            usdPrices: p.usdPrices || defaultPlans[idx].usdPrices,
            details: p.details || defaultPlans[idx].details,
          })));
        }
      }
    } catch (e) {
      console.error("Failed to fetch live pricing:", e);
    }
  };

  const getCycleLabel = () => {
    if (billingCycle === "annual") return "Billed Annually (12 Months)";
    if (billingCycle === "halfyearly") return "Billed Every 6 Months";
    if (billingCycle === "quarterly") return "Billed Quarterly (3 Months)";
    return "Billed Monthly";
  };

  const getCalculatedPrice = (plan) => {
    const priceObj = currency === "INR" ? plan.inrPrices : plan.usdPrices;
    if (billingCycle === "annual") return priceObj.annual;
    if (billingCycle === "halfyearly") return priceObj.halfyearly;
    if (billingCycle === "quarterly") return priceObj.quarterly;
    return priceObj.monthly;
  };

  const currencySymbol = currency === "INR" ? "₹" : "$";

  const comparisonMatrix = [
    {
      category: "Plan Limits",
      features: [
        { name: "Tables Allowed", starter: "Up to 10", growth: "Up to 30", pro: "31-50+ Unlimited" },
        { name: "Menu Items Allowed", starter: "Up to 50", growth: "Up to 200", pro: "Unlimited" },
        { name: "Staff Accounts", starter: "3 accounts", growth: "15 accounts", pro: "Unlimited" },
        { name: "Support Type", starter: "1 Month Free Tech & Non-Tech Support", growth: "1 Month Free Dedicated Support + 24/7 Hotline", pro: "1 Month Free Support + Dedicated Account Manager" },
        { name: "Standee Branding", starter: "Digital Printable QR Cards", growth: "Physical Acrylic Standees Included", pro: "Custom Premium Standees & Branding Kit" },
      ]
    },
    {
      category: "Features Included",
      features: [
        { name: "Smart QR Menu Builder", starter: "✅ Basic styling", growth: "✅ Custom brand theme & logo", pro: "✅ Full White-label & Custom Domain" },
        { name: "Waiter Summon Button", starter: "✅ Included", growth: "✅ Included", pro: "✅ Included" },
        { name: "Kitchen Display App (KDS)", starter: "✅ 1 terminal", growth: "✅ Up to 5 terminals", pro: "✅ Unlimited terminals" },
        { name: "Contactless Payments (UPI/Stripe)", starter: "✅ (0% commission)", growth: "✅ (0% commission)", pro: "✅ (0% commission)" },
        { name: "Advanced Sales Analytics", starter: "✅ Basic Reports", growth: "✅ Advanced POS Analytics", pro: "✅ Full Enterprise Reports" },
      ]
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* Currency & Billing Cycle Switchers */}
      <div className="flex flex-col items-center justify-center space-y-4">
        
        {/* Currency Switcher (INR / USD) */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              currency === "INR"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md scale-105"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="text-base">🇮🇳</span>
            <span>₹ INR (India & Subcontinent)</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              currency === "USD"
                ? "bg-brand-500 text-white border-brand-500 shadow-md scale-105"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="text-base">🌐</span>
            <span>$ USD (International)</span>
          </button>
        </div>

        {/* Duration Tabs */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("quarterly")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              billingCycle === "quarterly"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Quarterly (3 Mos) <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold bg-brand-50 dark:bg-brand-950/50 px-1.5 py-0.5 rounded-md ml-1">Save 10%</span>
          </button>
          <button
            onClick={() => setBillingCycle("halfyearly")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              billingCycle === "halfyearly"
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            6 Months <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold bg-brand-50 dark:bg-brand-950/50 px-1.5 py-0.5 rounded-md ml-1">Save 15%</span>
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              billingCycle === "annual"
                ? "bg-brand-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            12 Months <span className="text-[9px] text-white font-extrabold bg-black/20 px-1.5 py-0.5 rounded-md ml-1">Save 25%</span>
          </button>
        </div>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          All tiers include 1 Month Free Dedicated Support (Tech & Non-Tech) + Standee Design.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => {
          const price = getCalculatedPrice(plan);
          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl bg-gradient-to-b ${plan.gradient} p-8 border-2 ${plan.border} shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-left`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-amber-500 px-4 py-1 text-[10px] font-extrabold text-white shadow-md uppercase tracking-wider">
                  RECOMMENDED PLAN
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{plan.name}</h4>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">{currencySymbol}{price.toLocaleString()}</span>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">/ month</span>
                </div>

                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {getCycleLabel()}
                </p>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PLAN LIMITATIONS & SPECS:</h5>
                  <ul className="space-y-3">
                    {Object.values(plan.details).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircleIcon className="w-4 h-4 text-brand-500 flex-none mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center rounded-2xl py-3.5 px-4 text-xs font-extrabold shadow-md transition-all active:scale-95 ${
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
        <div className="max-w-5xl mx-auto pt-12 hidden md:block text-left">
          <div className="text-center space-y-2 mb-10">
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">Detailed Plan Comparison</h4>
            <p className="text-sm text-slate-500">Compare specs and limits across our plans to choose your fit.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white">
                  <th className="p-4 font-bold">Feature</th>
                  <th className="p-4 font-bold text-center">Starter</th>
                  <th className="p-4 font-bold text-center text-brand-500">Growth (Popular)</th>
                  <th className="p-4 font-bold text-center">Pro Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {comparisonMatrix.map((section, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="bg-slate-50/50 dark:bg-zinc-950/50 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      <td colSpan={4} className="px-4 py-2">{section.category}</td>
                    </tr>
                    {section.features.map((feat, fIdx) => (
                      <tr key={fIdx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                        <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{feat.name}</td>
                        <td className="p-4 text-center text-slate-500 dark:text-slate-400">{feat.starter}</td>
                        <td className="p-4 text-center font-bold text-slate-900 dark:text-white">{feat.growth}</td>
                        <td className="p-4 text-center text-slate-500 dark:text-slate-400">{feat.pro}</td>
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
