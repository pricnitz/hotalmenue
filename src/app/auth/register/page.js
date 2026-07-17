"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCodeIcon, CheckCircleIcon, SparklesIcon } from "../../../components/Icons";

export default function RegisterPage() {
  const [form, setForm] = useState({
    restaurantName: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    subdomain: "",
    cuisine: "cafe",
    logo: "",
    currency: "INR",
  });

  const handleLogoUpload = (file) => {
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG, and WEBP images are allowed!");
      return;
    }
    if (file.size > 1024 * 1024) {
      alert("Image size must be less than 1 MB!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.restaurantName && form.fullName && form.email && form.password) {
      setLoading(true);
      try {
        const randId = Math.floor(1000 + Math.random() * 9000);
        const generatedUserId = `QB-OWNER-${randId}`;
        const payload = {
          name: form.restaurantName,
          ownerName: form.fullName,
          email: form.email,
          password: form.password,
          userId: generatedUserId,
          phone: form.phone,
          address: `Subdomain: ${form.subdomain}.quickbite.menu / Cuisine: ${form.cuisine}`,
          gstNumber: "GST-PENDING",
          planType: "Growth",
          status: "Active",
          logo: form.logo,
          currency: form.currency,
        };
        
        const res = await fetch("/api/restaurants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setSuccess(true);
          setGeneratedCredentials({
            userId: generatedUserId,
            password: form.password,
            loginUrl: "/auth/login",
          });
        } else {
          alert("Failed to save to database. Please review form details.");
        }
      } catch (err) {
        console.error("Database POST Error during onboarding:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-200">
      
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-brand-500">
          ← Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-red-500 text-white shadow-md">
          <QrCodeIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Create your restaurant dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{" "}
          <Link href="/auth/login" className="font-medium text-brand-500 hover:underline">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl sm:px-10 text-left">
          
          {success && generatedCredentials ? (
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Registration Successful!</h3>
                <p className="text-sm text-slate-500">
                  Welcome to the QuickBite ecosystem, <span className="font-semibold text-slate-800 dark:text-slate-200">{form.fullName}</span>.
                </p>
              </div>

              {/* Onboarding Credentials Receipt Card */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl space-y-4 max-w-sm mx-auto text-left shadow-inner">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-250/30 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">🔑 Owner Credentials</span>
                  <span className="text-[10px] font-semibold text-brand-500">Active License</span>
                </div>
                
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">User ID / Username:</span>
                    <p className="font-mono font-extrabold text-slate-900 dark:text-white bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800 text-sm">
                      {generatedCredentials.userId}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Temporary Password:</span>
                    <p className="font-mono font-extrabold text-slate-900 dark:text-white bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800 text-sm">
                      {generatedCredentials.password}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Login URL:</span>
                    <p className="font-mono text-brand-500 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs break-all">
                      https://quickbite.menu/auth/login
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 text-center">
                <p>Please copy your credentials. You can update these details inside your profile panel at any time.</p>
              </div>

              <div className="flex pt-4">
                <Link
                  href={generatedCredentials.loginUrl}
                  className="w-full text-center rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-600 hover:shadow-brand-500/20 active:scale-95 transition-all"
                >
                  Proceed to Login Portal →
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="text-center py-2 bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 rounded-xl flex items-center justify-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-semibold mb-4">
                <SparklesIcon className="w-4 h-4" /> You're registering for a 14-day free trial.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="restaurantName" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Restaurant Name
                  </label>
                  <input
                    id="restaurantName"
                    name="restaurantName"
                    type="text"
                    required
                    value={form.restaurantName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="e.g. Cafe Aroma"
                  />
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="cuisine" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Cuisine Type
                  </label>
                  <select
                    id="cuisine"
                    name="cuisine"
                    value={form.cuisine}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm text-slate-700 dark:text-slate-350"
                  >
                    <option value="cafe">Cafe / Coffee Shop</option>
                    <option value="bistro">Bistro / Diner</option>
                    <option value="fastfood">Fast Food / Food Truck</option>
                    <option value="finedining">Fine Dining Restaurant</option>
                    <option value="bar">Bar / Pub / Lounge</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Restaurant Logo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-zinc-800 dark:file:text-slate-350 cursor-pointer"
                    />
                    {form.logo && (
                      <img
                        src={form.logo}
                        alt="Logo Preview"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-none"
                      />
                    )}
                  </div>
                </div>
              </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Owner / Manager Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="manager@cafe.com"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contact Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="currency" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Menu Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={form.currency}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm text-slate-700 dark:text-slate-350"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                  </select>
                </div>
                <div className="space-y-1 invisible sm:block"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="subdomain" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Desired Menu Subdomain
                  </label>
                  <div className="mt-1 flex rounded-xl shadow-sm">
                    <input
                      id="subdomain"
                      name="subdomain"
                      type="text"
                      required
                      value={form.subdomain}
                      onChange={handleInputChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-l-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                      placeholder="aroma"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-xl border border-l-0 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-zinc-800 text-slate-500 text-xs font-semibold select-none">
                      .quickbite.menu
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Create Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 shadow-xs placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-all cursor-pointer"
              >
                {loading ? "Generating QR licenses & templates..." : "Setup Restaurant & Try Free"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
