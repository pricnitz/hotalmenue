"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "./Icons";

const fallbackFaqs = [
  {
    _id: "1",
    category: "general",
    question: "Do customers need to download an app to view the menu?",
    answer: "Absolutely not! Customers simply point their mobile camera at the QR code on their table. The menu opens instantly in any standard browser (Safari, Chrome, Firefox) as a fast, responsive web app.",
  },
  {
    _id: "2",
    category: "general",
    question: "How does the QR menu increase table turnover?",
    answer: "By removing wait times. Guests don't need to flag down a waiter to read the menu, order extra drinks, or request the bill. They scan, add to cart, and checkout instantly. On average, this shaves 12 minutes off each dining cycle.",
  },
  {
    _id: "3",
    category: "setup",
    question: "How long does it take to get my restaurant set up?",
    answer: "You can go live in under 15 minutes. Sign up, input your categories and items, upload photos, and generate your table-specific QR codes instantly from our PDF print wizard.",
  },
  {
    _id: "4",
    category: "setup",
    question: "Can I update menu items and prices in real-time?",
    answer: "Yes. Any changes you make to prices, items, or 86'ed (out of stock) status in your admin dashboard update instantly on customers' screens. No reprint of QR codes required.",
  },
  {
    _id: "5",
    category: "kitchen",
    question: "Do I need special hardware to run the Kitchen Display System?",
    answer: "No. TableMenu.in's KDS is web-based. You can run it on any standard iPad, Android tablet, or Smart TV. All you need is an internet connection and a browser.",
  },
  {
    _id: "6",
    category: "billing",
    question: "Is there a transaction fee on online payments?",
    answer: "We do not charge any transaction fees or gateway markups on your sales. You connect your own Stripe, PayPal, or UPI gateway account, and pay only the standard merchant processor rate.",
  },
];

export default function FAQAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [faqs, setFaqs] = useState(fallbackFaqs);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setFaqs(data);
        }
      }
    } catch (e) {
      console.error("Failed to load FAQs:", e);
    }
  };

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "setup", name: "Menu & Setup" },
    { id: "kitchen", name: "Kitchen & Hardware" },
    { id: "billing", name: "Pricing & Billing" },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, searchQuery, activeCategory]);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions or keywords..."
          className="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-950 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-750"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 text-left">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={faq._id || idx}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left font-bold text-slate-900 dark:text-white text-base hover:text-brand-500 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className="flex-none text-slate-400">
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-brand-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 mt-2 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No FAQs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
