import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FAQAccordion from "../../components/FAQAccordion";

export const metadata = {
  title: "FAQs | Help Center & Support Q&A",
  description: "Browse the TableMenu.in help center. Get answers about QR menu setup, contactless payments, KDS devices, waiter summon buttons, and pricing.",
};

export default function FAQsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Help Center
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Find solutions for menu configurations, table routing, kitchen terminal support, and billing queries.
            </p>
          </div>
        </section>

        {/* INTERACTIVE ACCORDION BLOCK */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FAQAccordion />
          </div>
        </section>

        {/* STILL NEED HELP BANNER */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-20 border-t border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Still have unanswered questions?</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Our support technicians are available 24/7. Reach out and we will help you map out your dining layout.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Submit a Support Ticket
              </Link>
              <a
                href="mailto:support@tablemenu.in"
                className="inline-flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
              >
                Email support@tablemenu.in
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
