"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCodeIcon, MailIcon } from "./Icons";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

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
    <footer className="bg-slate-900 dark:bg-zinc-950 text-slate-400 border-t border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">

          {/* Logo & Intro */}
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="inline-flex items-center transition-all">
              <img
                src="/logo/logo.png"
                alt="TableMenu.in Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Empowering restaurants to digitize their dining experience. Create QR Menus, manage table occupancy, and optimize kitchen operations seamlessly.
            </p>

            <div className="flex space-x-5 items-center">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-slate-300" title="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-slate-300" title="Facebook">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-slate-300" title="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-slate-300" title="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </a>
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
                <li><Link href="/careers" className="text-sm hover:text-white transition-colors">Careers </Link></li>
                <li><Link href="/press-kit" className="text-sm hover:text-white transition-colors">Press Kit</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal & SLA</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="text-sm hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/sla" className="text-sm hover:text-white transition-colors">SLA Agreement</Link></li>
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
