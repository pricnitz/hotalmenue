import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Privacy Policy | TableMenu.in Restaurant SaaS",
  description: "Read the Privacy Policy detailing how TableMenu.in collects, processes, and protects your restaurant data and customer session details.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect restaurant admin information (name, email, phone, restaurant details) to configure your account. For dining guests scanning QR codes, we collect browser type, order listings, and payment transaction tokens. We DO NOT track guest location outside the dining room or build personal identity profiles of diners.",
    },
    {
      title: "2. How We Use Information",
      content: "We use the collected information to provision the digital menu lookup, route order cart listings to kitchen display units, process card checkouts, and generate sales analytics for the restaurant owners. We do not sell guest data to third-party aggregators or advertising networks.",
    },
    {
      title: "3. Data Storage & Security",
      content: "All menus, sales databases, and customer records are stored securely in encrypted cloud servers. Payout configurations are stored using industry-standard TLS encryption. Payment checkouts are routed directly through PCI-DSS compliant processors (like Stripe), and card credentials never touch our servers.",
    },
    {
      title: "4. GDPR & CCPA Compliance",
      content: "Under GDPR and CCPA regulations, restaurant administrators and dining guests have the right to request access to, correction of, or deletion of their personal logs. Since diners are not required to create accounts or install apps, guest data is stored under anonymous session tokens that expire after 24 hours.",
    },
    {
      title: "5. Cookies & Local Storage",
      content: "We use browser local storage and essential cookies to maintain the active food cart selections and track table numbers across menu refreshes. If you block cookies, the checkout cart system may not operate correctly.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-left">
            
            <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400">
                Last updated: July 11, 2026
              </p>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              TableMenu.in ('we', 'our') values the privacy of restaurant operators and dining guests. This policy explains our data processing protocols, explaining how we store menu logs and route checkout tokens.
            </p>

            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center">
              If you have queries regarding data deletion or gdpr compliance, contact us at{" "}
              <a href="mailto:privacy@tablemenu.in" className="text-brand-500 hover:underline">
                privacy@tablemenu.in
              </a>
              .
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
