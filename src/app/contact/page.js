import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DemoScheduler from "../../components/DemoScheduler";
import { MailIcon, PhoneIcon, MapPinIcon } from "../../components/Icons";

export const metadata = {
  title: "Contact Us & Book Demo | QuickBite Restaurant SaaS",
  description: "Get in touch with the QuickBite sales and support team. Book a 15-minute live platform demo to optimize your dining table checkout workflows.",
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: <MailIcon className="w-6 h-6 text-brand-500" />,
      title: "Email Us",
      value: "hello@quickbite.com",
      sub: "General queries, support, integration questions",
    },
    {
      icon: <PhoneIcon className="w-6 h-6 text-brand-500" />,
      title: "Call Sales",
      value: "+1 (555) 302-9011",
      sub: "Monday to Friday, 9am to 6pm EST",
    },
    {
      icon: <MapPinIcon className="w-6 h-6 text-brand-500" />,
      title: "Headquarters",
      value: "San Francisco & Mumbai",
      sub: "100 Pine St, SF, CA 94111 / Bandra East, Mumbai 400051",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact details list */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                  Get In Touch
                </span>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Let's optimize your dining experience
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Have questions about POS integrations, multi-outlet settings, or custom table QR codes? We are here to help.
                </p>
              </div>

              <div className="space-y-6">
                {contactDetails.map((detail, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                    <div className="flex-none flex items-center justify-center w-11 h-11 bg-brand-50 dark:bg-brand-950/30 rounded-xl">
                      {detail.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{detail.title}</h4>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mt-0.5">{detail.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{detail.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
                <h4 className="font-bold text-sm">Need direct developer support?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Already a customer? Create a ticket inside your restaurant dashboard or email us directly with your Merchant ID in the subject.
                </p>
              </div>
            </div>

            {/* Demo scheduler widget */}
            <div className="lg:col-span-7">
              <DemoScheduler />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
