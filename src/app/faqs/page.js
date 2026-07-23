import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FAQAccordion from "../../components/FAQAccordion";

export const metadata = {
  title: "FAQs | Answer Engine & Help Center Q&A",
  description: "Browse TableMenu.in help center FAQs. Get answers about QR menu setup, contactless payments, KDS devices, waiter notifications, and pricing. Powered by Code World Sol.",
};

export default function FAQsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do diners need to download an app to view the QR menu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! TableMenu.in operates 100% in native mobile browsers (Safari, Chrome). Diners simply scan the table QR code with their phone camera and the digital menu opens in under 1.2 seconds.",
        },
      },
      {
        "@type": "Question",
        "name": "How does the Kitchen Display System (KDS) connect with customer orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When a customer submits an order on their phone, it instantly broadcasts via WebSockets to the kitchen display screen without needing any paper printing.",
        },
      },
      {
        "@type": "Question",
        "name": "What support is included with TableMenu.in plans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every outlet receives 1 Month of Free Dedicated Technical & Non-Technical Support, custom acrylic QR standee designs, and staff onboarding guidance.",
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-400 uppercase tracking-wider">
              💡 Answer Engine & Help Center
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Find instant solutions for QR menu setup, kitchen screen routing, staff billing, and dedicated support.
            </p>
          </div>
        </section>

        {/* CROSS-PAGE INTERLINKING NAV BAR */}
        <section className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-800 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Explore Related Modules:</span>
            <Link href="/features/qr-menu" className="text-brand-500 hover:underline">
              📱 Smart QR Menu
            </Link>
            <span>•</span>
            <Link href="/features/kitchen-display-system" className="text-brand-500 hover:underline">
              🍳 Kitchen Display System (KDS)
            </Link>
            <span>•</span>
            <Link href="/features/restaurant-analytics" className="text-brand-500 hover:underline">
              📊 POS Analytics & Reports
            </Link>
            <span>•</span>
            <Link href="/blog" className="text-brand-500 hover:underline">
              📝 Restaurant Growth Blogs
            </Link>
          </div>
        </section>

        {/* INTERACTIVE ACCORDION BLOCK */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FAQAccordion />
          </div>
        </section>

        {/* STILL NEED HELP BANNER */}
        <section className="bg-slate-900 text-white py-16 sm:py-20 border-t border-slate-800 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h3 className="text-2xl font-extrabold text-white">Still have unanswered questions?</h3>
            <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
              Our support team and engineering partners at Code World Sol are available 24/7. Reach out and we will help you setup your dining layout.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Submit Support Ticket ↗
              </Link>
              <a
                href="mailto:info@hotelmenu.in"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3 text-xs font-bold shadow-xs hover:bg-slate-700 transition-all"
              >
                Email info@hotelmenu.in
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
