"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCodeIcon, MailIcon } from "./Icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Logo & Intro */}
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-500 to-red-500 text-white">
                <QrCodeIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white">
                tablemenu<span className="text-brand-500 font-extrabold">.in</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              Empowering restaurants to digitize their dining experience. Create QR Menus, manage table occupancy, and optimize kitchen operations seamlessly.
            </p>
            <div className="flex space-x-6">
              {/* Fake social icons */}
              {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                <a key={social} href="#" className="hover:text-white transition-colors duration-200 capitalize text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links columns */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Platform</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><Link href="/features" className="text-sm hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/faqs" className="text-sm hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/#demo-simulator" className="text-sm hover:text-white transition-colors">Live Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="text-sm hover:text-white transition-colors">Blog & Guides</Link></li>
                <li><span className="text-sm text-slate-500 cursor-not-allowed">Careers (Hiring!)</span></li>
                <li><span className="text-sm text-slate-500 cursor-not-allowed">Press Kit</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                <li><span className="text-sm text-slate-500 cursor-not-allowed">Refund Policy</span></li>
                <li><span className="text-sm text-slate-500 cursor-not-allowed">SLA Agreement</span></li>
              </ul>
            </div>
            
            {/* Newsletter Column */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Newsletter</h3>
              <p className="mt-4 text-xs text-slate-400">
                Get product updates and restaurant management growth hacks directly in your inbox.
              </p>
              <form className="mt-4 sm:flex max-w-md" onSubmit={handleSubscribe}>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Enter email"
                />
                <button
                  type="submit"
                  className="mt-2 w-full sm:mt-0 sm:ml-2 sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 active:scale-95 transition-all"
                >
                  Join
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs text-emerald-400 font-medium animate-pulse">
                  Subscribed successfully! Welcome to TableMenu.in.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} TableMenu.in Inc. All rights reserved.
          </p>
          <p className="mt-4 text-xs text-slate-600 md:mt-0">
            Built for modern gastronomy. Digitized contactless dining.
          </p>
        </div>
      </div>
    </footer>
  );
}
