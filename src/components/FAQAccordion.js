"use client";

import React, { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "./Icons";

export default function FAQAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "setup", name: "Menu & Setup" },
    { id: "kitchen", name: "Kitchen & Hardware" },
    { id: "billing", name: "Pricing & Billing" },
  ];

  const faqs = [
    {
      category: "general",
      question: "Do customers need to download an app to view the menu?",
      answer: "Absolutely not! Customers simply point their mobile camera at the QR code on their table. The menu opens instantly in any standard browser (Safari, Chrome, Firefox) as a fast, responsive web app.",
    },
    {
      category: "general",
      question: "How does the QR menu increase table turnover?",
      answer: "By removing wait times. Guests don't need to flag down a waiter to read the menu, order extra drinks, or request the bill. They scan, add to cart, and checkout instantly. On average, this shaves 12 minutes off each dining cycle.",
    },
    {
      category: "setup",
      question: "How long does it take to get my restaurant set up?",
      answer: "You can go live in under 15 minutes. Sign up, input your categories and items, upload photos, and generate your table-specific QR codes instantly from our PDF print wizard.",
    },
    {
      category: "setup",
      question: "Can I update menu items and prices in real-time?",
      answer: "Yes. Any changes you make to prices, items, or 86'ed (out of stock) status in your admin dashboard update instantly on customers' screens. No reprint of QR codes required.",
    },
    {
      category: "kitchen",
      question: "Do I need special hardware to run the Kitchen Display System?",
      answer: "No. QuickBite's KDS is web-based. You can run it on any standard iPad, Android tablet, or Smart TV. All you need is an internet connection and a browser.",
    },
    {
      category: "kitchen",
      question: "Can we print receipts to our existing thermal kitchen printers?",
      answer: "Yes, we support standard ESC/POS printing. You can connect your existing Epson, Star, or generic thermal receipt printers via Bluetooth, Wi-Fi, or Ethernet to automatically print orders.",
    },
    {
      category: "billing",
      question: "Is there a transaction fee on online payments?",
      answer: "We do not charge any transaction fees or gateway markups on your sales. You connect your own Stripe, PayPal, or UPI gateway account, and pay only the standard merchant processor rate (usually ~1.5% to 2.9%).",
    },
    {
      category: "billing",
      question: "Can I cancel my subscription at any time?",
      answer: "Yes. There are no contracts or commitments. You can cancel your subscription from your billing dashboard with one click, and your service will remain active until the end of the billing period.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setExpandedIndex(null); // collapse all on search
          }}
          className="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-950 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
          placeholder="Search frequently asked questions..."
        />
      </div>

      {/* Categories filter */}
      <div className="flex gap-2 justify-center flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setExpandedIndex(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/15"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-zinc-950 shadow-xs transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-brand-500 flex-none" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-slate-400 flex-none" />
                  )}
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 border-t border-slate-100 dark:border-slate-800" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-zinc-900/20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No matches found for your search query. Try another search or clear filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
