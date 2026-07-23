"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BookOpenIcon, ClockIcon, ArrowRightIcon, XIcon } from "../../components/Icons";
import { slugify } from "../../lib/slugify";

const fallbackPosts = [
  {
    _id: "1",
    slug: "how-qr-menus-increase-average-table-value-by-22",
    title: "How QR Menus Increase Average Table Value by 22%",
    summary: "A comprehensive data study of digital ordering habits. Learn how dynamic pairings and high-res photography trigger upselling without waiter intervention.",
    content: `Digital menus have revolutionized how diners browse food. By presenting high-resolution imagery and automatic pairing suggestions (like suggesting fries with a burger), restaurants experience a proven 22% increase in average ticket size.

Key Takeaways:
1. High-res imagery increases dessert orders by 35%.
2. Real-time out-of-stock toggles prevent customer disappointment.
3. Multi-language translation captures international tourists effortlessly.`,
    category: "Operations",
    readTime: "5 min read",
    date: "Jul 8, 2026",
    author: "Payal Pandit",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
  },
  {
    _id: "2",
    slug: "dedicated-technical-support-standee-branding-for-modern-restaurants",
    title: "Dedicated Technical Support & Standee Branding for Modern Restaurants",
    summary: "Why having 1-on-1 technical and non-technical support transforms digital menu adoption for your restaurant staff and patrons.",
    content: `Onboarding a new restaurant technology shouldn't feel overwhelming. With TableMenu.in, every outlet receives 1 Month of Free Dedicated Support covering setup, staff training, and physical QR standee design.

Benefits of Dedicated Support:
- Zero technical friction for kitchen staff.
- Custom acrylic table tent cards delivered ready to print.
- 24/7 hotline for emergency menu updates.`,
    category: "Guides",
    readTime: "4 min read",
    date: "Jul 15, 2026",
    author: "Durgawati Pandit",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
  },
  {
    _id: "3",
    slug: "how-to-set-up-kitchen-display-system-kds-terminal",
    title: "How to Set Up a Kitchen Display System (KDS) Terminal",
    summary: "Why thermal paper receipt printing is costing you money. Learn how color-coded timers on mounted tablets optimize prep workflows.",
    content: `Paper receipt printing in hot kitchens creates clutter, lost tickets, and slow prep times. Replacing thermal printers with web-based tablets connected directly to customer QR carts guarantees instant order arrival.

KDS Advantages:
1. Color-coded prep timers (Green -> Amber -> Red urgency).
2. One-tap "Order Ready" chime to alert waiters.
3. Zero paper costs and zero missed orders.`,
    category: "Hardware",
    readTime: "4 min read",
    date: "Jun 11, 2026",
    author: "Nitesh Ahirwar",
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
  }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState(fallbackPosts);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setBlogs(data);
        }
      }
    } catch (e) {
      console.error("Failed to load blogs:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Growth Hub & Guides
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Restaurant Guides & Industry Insights
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Actionable advice on table engineering, digital ordering, payment settlements, and kitchen logistics.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug || slugify(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group"
              >
                {post.coverImage && (
                  <div className="h-48 w-full overflow-hidden relative bg-slate-100 dark:bg-zinc-800">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-brand-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {post.category || "Guide"}
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{post.readTime || "5 min read"}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {post.summary || post.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-500">
                    <span>Read Article ↗</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Read Blog Article Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in text-slate-800 dark:text-slate-200">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
              
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-none bg-slate-50 dark:bg-zinc-950">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-900/50">
                    {selectedPost.category || "Guide"}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2 leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-grow text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {selectedPost.coverImage && (
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md"
                  />
                )}
                <div className="whitespace-pre-line text-slate-700 dark:text-slate-200 font-normal space-y-4">
                  {selectedPost.content || selectedPost.summary || selectedPost.desc}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 flex justify-end flex-none">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Close Article
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
