"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, QrCodeIcon } from "./Icons";



export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const logo = "/logo/logo.png";

  const navigation = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQs", href: "/faqs" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-header transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 grouptransition-all">
              <img
                className="h-9 w-auto object-contain hover:scale-105 transition-transform"
                src={logo}
                alt="TableMenu.in Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-x-8">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-brand-400 ${isActive(link.href)
                  ? "text-brand-400 font-extrabold"
                  : "text-slate-200 font-semibold"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-200 hover:text-brand-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-2 text-sm font-bold shadow-sm transition-all duration-200"
            >
              Register Restaurant
            </Link>
            <Link
              href="/contact?demo=true"
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 active:scale-95 transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-inner">
          <div className="space-y-1">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base font-medium transition-all ${isActive(link.href)
                  ? "bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-lg px-3 py-2.5 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-lg bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-3 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Register Restaurant
            </Link>
            <Link
              href="/contact?demo=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-lg bg-brand-500 px-3 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-brand-600"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
