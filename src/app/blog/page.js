import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BookOpenIcon, ClockIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Blog & Restaurant Growth Guides | QuickBite",
  description: "Learn how to optimize table turns, increase tickets by 22% using smart upsells, and configure digital kitchen display workflows.",
};

export default function BlogPage() {
  const posts = [
    {
      title: "How QR Menus Increase Average Table Value by 22%",
      desc: "A comprehensive data study of digital ordering habits. Learn how dynamic pairings and high-res photography trigger upselling without waiter intervention.",
      category: "Operations",
      readTime: "5 min read",
      date: "Jul 8, 2026",
      author: "Sylvia Chen",
    },
    {
      title: "The Ultimate Guide to Connecting QR Codes to Toast POS",
      desc: "Step-by-step instructions on linking cloud-based contactless ordering carts directly with legacy POS kitchen printers and inventory nodes.",
      category: "Integrations",
      readTime: "7 min read",
      date: "Jun 24, 2026",
      author: "Vikram Mehta",
    },
    {
      title: "How to Set Up a Kitchen Display System (KDS) Terminal",
      desc: "Why thermal paper receipt printing is costing you money. Learn how color-coded timers on mounted tablets optimize prep workflows.",
      category: "Hardware",
      readTime: "4 min read",
      date: "Jun 11, 2026",
      author: "Sarah Jenkins",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Growth Hub
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Restaurant Guides & Insights
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Actionable advice on table engineering, digital marketing, payment settlements, and kitchen logistics.
            </p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 justify-center border-b border-slate-200 dark:border-slate-800 pb-6 max-w-lg mx-auto">
            {["All Articles", "Operations", "Integrations", "Hardware", "Marketing"].map((cat, i) => (
              <span
                key={i}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  i === 0
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post, idx) => (
              <article
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                    <span className="text-brand-500">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug hover:text-brand-500 transition-colors">
                    <Link href="#">{post.title}</Link>
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {post.desc}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{post.author}</span>
                    <span className="text-slate-400 block mt-0.5">{post.date}</span>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700"
                  >
                    Read Guide <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* BLOG NEWSLETTER CALLOUT */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl text-left">
            <div className="space-y-2">
              <h4 className="text-lg font-bold">Subscribe to Restaurant Growth hacks</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Get monthly roundups of bestseller analytics tips, QR menu updates, and cashier optimization steps.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter work email"
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-full sm:w-60"
              />
              <button className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 flex-none shadow-md">
                Subscribe <BookOpenIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
