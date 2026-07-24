"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ClockIcon, ArrowRightIcon, SparklesIcon, CheckCircleIcon } from "../../../components/Icons";

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
3. Multi-language translation captures international tourists effortlessly.

Implementing dynamic QR menus allows your restaurant to adapt prices instantly during peak hours, launch seasonal specials in seconds, and eliminate reprinting costs forever.`,
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
- 24/7 hotline for emergency menu updates.

Our dedicated team ensures your staff is confident, your QR acrylic standees look stunning on tables, and your digital menu matches your restaurant's exact brand theme.`,
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
3. Zero paper costs and zero missed orders.

Mounting a simple tablet on your kitchen wall connected to TableMenu.in KDS streamlines communication between waitstaff and culinary chefs instantly.`,
    category: "Hardware",
    readTime: "4 min read",
    date: "Jun 11, 2026",
    author: "Nitesh Ahirwar",
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
  }
];

const fallbackFaqs = [
  {
    question: "Do diners need to download any app to scan the menu?",
    answer: "No! TableMenu.in operates 100% in native mobile browsers (Safari, Chrome). Diners simply scan the table QR code with their phone camera and the digital menu opens in under 1.2 seconds.",
    category: "general"
  },
  {
    question: "How does the Kitchen Display System (KDS) connect with customer orders?",
    answer: "When a customer submits an order on their phone, it instantly broadcasts via WebSockets to the kitchen display screen without needing any paper printing.",
    category: "kitchen"
  },
  {
    question: "What support is included with TableMenu.in plans?",
    answer: "Every outlet receives 1 Month of Free Dedicated Technical & Non-Technical Support, custom acrylic QR standee designs, and staff onboarding guidance.",
    category: "billing"
  }
];

export default function BlogDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [post, setPost] = useState(null);
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostAndFaqs();
  }, [id]);

  const fetchPostAndFaqs = async () => {
    try {
      setLoading(true);
      const [blogRes, faqRes] = await Promise.all([
        fetch(`/api/blogs/${id}`),
        fetch(`/api/faqs`)
      ]);

      if (blogRes.ok) {
        const data = await blogRes.json();
        setPost(data);
      } else {
        const fallback = fallbackPosts.find(p => p._id === id || p.slug === id);
        setPost(fallback || fallbackPosts[0]);
      }

      if (faqRes.ok) {
        const faqData = await faqRes.json();
        if (faqData && faqData.length > 0) setFaqs(faqData);
      }
    } catch (e) {
      console.error("Failed to load blog detail:", e);
      const fallback = fallbackPosts.find(p => p._id === id || p.slug === id);
      setPost(fallback || fallbackPosts[0]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading Article & SEO Data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
            <Link href="/blog" className="px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl inline-block">
              ← Back to All Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate AEO / GEO JSON-LD Schema for BlogPosting and FAQPage
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary || post.content?.slice(0, 160),
    "image": post.coverImage || "https://tablemenu.in/logo/logo.png",
    "datePublished": post.date || "2026-07-23",
    "author": {
      "@type": "Person",
      "name": post.author || "Payal Pandit",
    },
    "publisher": {
      "@type": "Organization",
      "name": "TableMenu.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tablemenu.in/logo/logo.png",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.slice(0, 4).map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 font-sans">

      {/* Inject AEO / GEO / SEO JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-grow py-12 sm:py-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">

          {/* Top Breadcrumb Nav & Category */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
              >
                ← Back to All Articles
              </Link>
              <span className="text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-500 border border-brand-500/20 px-3 py-1 rounded-full">
                {post.category || "Guide"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold pt-2">
              <span>✍️ {post.author || "Payal Pandit"}</span>
              <span>•</span>
              <span>📅 {post.date ? new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Jul 2026"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5" />
                {post.readTime || "5 min read"}
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-zinc-900">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Summary Callout */}
          {post.summary && (
            <div className="p-6 rounded-2xl bg-brand-500/5 border border-brand-500/20 text-slate-700 dark:text-slate-200 text-sm font-medium leading-relaxed italic">
              "{post.summary}"
            </div>
          )}

          {/* Full Content Body */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-base leading-relaxed font-normal whitespace-pre-line">
            {post.content}
          </div>

          {/* INTERLINKED FAQ ACCORDION BLOCK (AEO & GEO OPTIMIZED) */}
          <div className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Frequently Asked Questions (FAQ)
                </h3>
              </div>

              <Link
                href="/faqs"
                className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1 flex-none"
              >
                View All FAQs ({faqs.length}) →
              </Link>
            </div>

            {/* Interlinked FAQ Accordions */}
            <div className="space-y-3">
              {faqs.slice(0, 4).map((faq, idx) => (
                <div
                  key={faq._id || idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:text-brand-500 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-brand-500 font-mono">Q.</span>
                      {faq.question}
                    </span>
                    <span className="text-slate-400 text-base flex-none">
                      {openFaqIndex === idx ? "−" : "+"}
                    </span>
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 space-y-3 leading-relaxed animate-fade-in">
                      <p>{faq.answer}</p>

                      {/* Cross-page interlinks */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-bold text-brand-500 border-t border-slate-100 dark:border-slate-800/40">
                        <Link href="/features/qr-menu" className="hover:underline">
                          🔗 Explore Smart QR Menu
                        </Link>
                        <span>•</span>
                        <Link href="/features/kitchen-display-system" className="hover:underline">
                          🍳 Kitchen Display System (KDS)
                        </Link>
                        <span>•</span>
                        <Link href="/pricing" className="hover:underline">
                          💰 Pricing Plans
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Call-To-Action Registration Card */}
          <div className="mt-10 pt-4">
            <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 px-2.5 py-0.5 rounded-md border border-brand-500/20">
                  Ready to Transform Your Dining Room?
                </div>
                <h3 className="text-xl font-extrabold text-white">Start Your Free TableMenu.in Trial</h3>
                <p className="text-xs text-slate-400">Deploy QR Menus, KDS, and automated billing for your restaurant today. Powered by Code World Sol.</p>
              </div>

              <Link
                href="/auth/register"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all flex-none"
              >
                Register Restaurant ↗
              </Link>
            </div>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
