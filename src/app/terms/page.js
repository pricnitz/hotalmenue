import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Terms & Conditions | TableMenu.in POS Solutions",
  description: "Read the Terms and Conditions governing the use of the TableMenu.in restaurant management SaaS platform.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By accessing or using our cloud-based Restaurant QR Menu and KDS Order Management System (the 'Service'), you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not access or use the Service.",
    },
    {
      title: "2. Restaurant Account Registration",
      content: "To register a restaurant and generate menus, you must create an admin account. You agree to provide accurate, current, and complete details during registration. You are solely responsible for safeguarding your password and for all activities that occur under your account.",
    },
    {
      title: "3. Service Description & Commission-Free Guarantee",
      content: "TableMenu.in provides restaurant software as a service (SaaS). We guarantee that we do not take any percentage-based commissions on transactions processed through your connected payment gateways (e.g. Stripe, PayPal). You are responsible for all fees charged by your merchant processor directly.",
    },
    {
      title: "4. Billing, Subscriptions & Cancellations",
      content: "Subscriptions are billed on a recurring monthly or annual cycle. A 14-day free trial is offered for new sign-ups. If you do not cancel before the end of the trial period, your card will be charged. You may cancel your subscription at any time; however, no refunds are provided for partial periods.",
    },
    {
      title: "5. Customer Data & Content Ownership",
      content: "You retain all intellectual property rights in the menus, branding logos, and dishes catalog uploaded to our service. You grant TableMenu.in a worldwide, non-exclusive license to host and display your content to your restaurant customers via QR code lookups.",
    },
    {
      title: "6. Limitation of Liability",
      content: "To the maximum extent permitted by law, TableMenu.in shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits, revenue, data, or dining guest feedback arising out of or in connection with your use of the service.",
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
                Terms & Conditions
              </h1>
              <p className="text-xs text-slate-400">
                Last updated: July 11, 2026
              </p>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Please read these Terms and Conditions carefully before using our software. These terms outline your legal obligations, payment structures, and rules regarding the digital hosting of menus and dining transactions.
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
              If you have any questions regarding these Terms, contact us at{" "}
              <a href="mailto:legal@tablemenu.in" className="text-brand-500 hover:underline">
                legal@tablemenu.in
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
