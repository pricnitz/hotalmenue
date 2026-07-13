"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCodeIcon, ChartIcon, UsersIcon, ShieldCheckIcon, CheckCircleIcon, XIcon, SparklesIcon, CalendarIcon, PhoneIcon, MailIcon, MapPinIcon } from "../../../components/Icons";

export default function MasterDashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Core Restaurants List State
  const [restaurants, setRestaurants] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // New session registrations count
  const [newRegCount, setNewRegCount] = useState(0);

  // Active Modals
  const [activeModal, setActiveModal] = useState(null); // 'register', 'brand', 'stats', or null
  const [selectedRest, setSelectedRest] = useState(null);

  // Form states for Register
  const [regForm, setRegForm] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    gstNumber: "",
    planType: "Growth",
    expiryDate: "",
    status: "Active",
  });

  // Form states for Brand Customization
  const [brandForm, setBrandForm] = useState({
    logoEmoji: "🍔",
    themeColor: "orange",
  });

  // Fetch restaurants from API
  const fetchRestaurants = async () => {
    try {
      setLoadingList(true);
      const res = await fetch("/api/restaurants");
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (e) {
      console.error("Failed to load restaurants from API:", e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 1200);
  };

  // 1. Register restaurant via POST
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.ownerName || !regForm.email) return;

    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });

      if (res.ok) {
        setNewRegCount(prev => prev + 1);
        setActiveModal(null);
        setRegForm({
          name: "",
          ownerName: "",
          phone: "",
          email: "",
          password: "",
          address: "",
          gstNumber: "",
          planType: "Growth",
          expiryDate: "",
          status: "Active",
        });
        fetchRestaurants(); // Refresh table from database
      } else {
        alert("Failed to register restaurant. Check API fields.");
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };

  // 2. Activate/Deactivate Toggle via PUT
  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Expired" : "Active";
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchRestaurants();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // 3. Plan change via PUT
  const handlePlanChange = async (id, newPlan) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: newPlan }),
      });
      if (res.ok) {
        fetchRestaurants();
      }
    } catch (error) {
      console.error("Error changing plan:", error);
    }
  };

  // 4. Expiry date change via PUT
  const handleExpiryChange = async (id, newDate) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiryDate: newDate }),
      });
      if (res.ok) {
        fetchRestaurants();
      }
    } catch (error) {
      console.error("Error updating expiry:", error);
    }
  };

  // 5. Open branding modal
  const openBrandingModal = (rest) => {
    setSelectedRest(rest);
    setBrandForm({
      logoEmoji: rest.logoEmoji || "🍔",
      themeColor: rest.themeColor || "orange",
    });
    setActiveModal("brand");
  };

  // Submit branding via PUT
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/restaurants/${selectedRest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoEmoji: brandForm.logoEmoji, themeColor: brandForm.themeColor }),
      });
      if (res.ok) {
        setActiveModal(null);
        fetchRestaurants();
      }
    } catch (error) {
      console.error("Error applying branding:", error);
    }
  };

  // Open statistics
  const openStatsModal = (rest) => {
    setSelectedRest(rest);
    setActiveModal("stats");
  };

  // Widget Calculations
  const totalRestaurants = restaurants.length;
  const activePlansCount = restaurants.filter(r => r.status === "Active").length;
  const expiredPlansCount = restaurants.filter(r => r.status === "Expired").length;
  
  const monthlyRevenue = restaurants.reduce((acc, curr) => {
    if (curr.status !== "Active") return acc;
    if (curr.planType === "Starter") return acc + 29;
    if (curr.planType === "Growth") return acc + 79;
    return acc + 149;
  }, 0);

  const themeColorsMap = {
    orange: "from-brand-500 to-amber-500",
    red: "from-red-600 to-rose-500",
    green: "from-emerald-500 to-teal-500",
    blue: "from-blue-600 to-sky-500",
    charcoal: "from-slate-700 to-slate-900",
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Header Nav */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-red-500 text-white shadow-xs">
            <QrCodeIcon className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight">
            QuickBite <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 font-extrabold px-2 py-0.5 rounded-md ml-1 border border-slate-200/50 uppercase">MASTER PANEL</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Logged in as master@quickbite.com</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-xs font-bold shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow p-6 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Header and Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Master Console</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Register new outlets, toggle plan statuses, and configure color palettes from MongoDB.</p>
          </div>
          <div>
            <button
              onClick={() => setActiveModal("register")}
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 text-xs font-bold shadow-md hover:shadow-brand-500/20 active:scale-95 transition-all cursor-pointer"
            >
              + Register Restaurant
            </button>
          </div>
        </div>

        {/* Dynamic Widgets Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: "Total Restaurants", val: totalRestaurants, sub: "Registered outlets", color: "text-indigo-500", icon: <UsersIcon className="w-5 h-5 text-indigo-500" /> },
            { label: "Active Plans", val: activePlansCount, sub: "Serving diners", color: "text-emerald-500", icon: <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> },
            { label: "Expired/Disabled", val: expiredPlansCount, sub: "Offline menus", color: "text-red-500", icon: <XIcon className="w-5 h-5 text-red-500" /> },
            { label: "Monthly Revenue (MRR)", val: `$${monthlyRevenue}`, sub: "Flat SaaS billing", color: "text-brand-500", icon: <ChartIcon className="w-5 h-5 text-brand-500" /> },
            { label: "New Registrations", val: newRegCount, sub: "This session", color: "text-pink-500", icon: <SparklesIcon className="w-5 h-5 text-pink-500" /> },
          ].map((widget, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4 text-left">
              <div className="flex-none flex items-center justify-center w-11 h-11 bg-slate-50 dark:bg-zinc-950 rounded-xl">
                {widget.icon}
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block leading-none">{widget.label}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">{widget.val}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{widget.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Master Outlets Table */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs text-left">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Restaurant Subscriptions (MongoDB)</h3>
            <span className="text-xs text-slate-400 font-semibold">{totalRestaurants} outlets total</span>
          </div>

          {loadingList ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 mt-4">Connecting to local MongoDB...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-slate-850">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Restaurant / Logo</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Owner & Contact</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">GST No.</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan & Expiry</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status Toggle</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {restaurants.map((rest) => (
                    <tr key={rest._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                      
                      {/* Logo & Name */}
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-inner border border-slate-200/50 dark:border-slate-700">
                          {rest.logoEmoji}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white text-sm block leading-snug">{rest.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] text-slate-400 capitalize font-medium">{rest.themeColor} theme</span>
                          </div>
                        </div>
                      </td>

                      {/* Owner & Contact */}
                      <td className="p-4">
                        <div className="space-y-0.5 text-xs text-slate-500">
                          <p className="font-semibold text-slate-800 dark:text-slate-250">{rest.ownerName}</p>
                          <p className="flex items-center gap-1"><MailIcon className="w-3.5 h-3.5 opacity-60" /> {rest.email}</p>
                          <p className="flex items-center gap-1"><PhoneIcon className="w-3.5 h-3.5 opacity-60" /> {rest.phone}</p>
                        </div>
                      </td>

                      {/* GST Number */}
                      <td className="p-4 font-mono text-xs text-slate-400 font-semibold">{rest.gstNumber || "N/A"}</td>

                      {/* Plan & Expiry */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <select
                            value={rest.planType}
                            onChange={(e) => handlePlanChange(rest._id, e.target.value)}
                            className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-brand-600 dark:text-brand-400 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="Starter">Starter ($29/mo)</option>
                            <option value="Growth">Growth ($79/mo)</option>
                            <option value="Pro Enterprise">Pro ($149/mo)</option>
                          </select>
                          
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <CalendarIcon className="w-3.5 h-3.5 opacity-60" />
                            <input
                              type="date"
                              value={rest.expiryDate}
                              onChange={(e) => handleExpiryChange(rest._id, e.target.value)}
                              className="bg-transparent border-0 p-0 text-xs focus:outline-none focus:ring-0 text-slate-500 font-medium"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Toggle Slider */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleStatus(rest._id, rest.status)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              rest.status === "Active" ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-700"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                rest.status === "Active" ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className={`text-[10px] font-extrabold uppercase ${
                            rest.status === "Active"
                              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full"
                              : "text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full"
                          }`}>
                            {rest.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openBrandingModal(rest)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                          >
                            Brand Config
                          </button>
                          <button
                            onClick={() => openStatsModal(rest)}
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                          >
                            View Stats
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* -------------------- MODALS -------------------- */}

      {/* MODAL 1: REGISTER RESTAURANT */}
      {activeModal === "register" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Register New Restaurant</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. Sushi House"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={regForm.ownerName}
                    onChange={(e) => setRegForm({...regForm, ownerName: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Email</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="owner@sushihouse.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="+1 (555) 203-9099"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">GST Registration Number</label>
                  <input
                    type="text"
                    required
                    value={regForm.gstNumber}
                    onChange={(e) => setRegForm({...regForm, gstNumber: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. GST29AAACP9291A1Z0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={regForm.expiryDate}
                    onChange={(e) => setRegForm({...regForm, expiryDate: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Physical Address</label>
                  <input
                    type="text"
                    required
                    value={regForm.address}
                    onChange={(e) => setRegForm({...regForm, address: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Street, City, Zipcode"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Password</label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Initial Subscription Plan</label>
                  <select
                    value={regForm.planType}
                    onChange={(e) => setRegForm({...regForm, planType: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="Starter">Starter Plan ($29/mo)</option>
                    <option value="Growth">Growth Plan ($79/mo)</option>
                    <option value="Pro Enterprise">Pro Enterprise ($149/mo)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    value={regForm.status}
                    onChange={(e) => setRegForm({...regForm, status: e.target.value})}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Deactivated / Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-3 text-xs font-bold text-slate-500 text-center hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand-500 hover:bg-brand-600 py-3 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  Save Restaurant
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BRAND SETTINGS CUSTOMIZER */}
      {activeModal === "brand" && selectedRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 text-left flex flex-col md:flex-row gap-8">
            
            {/* Form Controls */}
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Brand Config</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 md:hidden">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Customize branding settings for <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRest.name}</span>. Changes sync immediately.
              </p>

              <form onSubmit={handleBrandSubmit} className="space-y-5">
                {/* Logo picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Select Logo Emoji</label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {["🍔", "🍕", "☕", "🥩", "🍣", "🌮", "🍰", "🥗", "🍜", "🍹"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, logoEmoji: emoji })}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border text-xl cursor-pointer transition-all ${
                          brandForm.logoEmoji === emoji
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white scale-105"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Brand Palette Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "orange", label: "Warm Amber", color: "bg-orange-500" },
                      { id: "red", label: "Sunset Red", color: "bg-red-500" },
                      { id: "green", label: "Emerald Mint", color: "bg-emerald-500" },
                      { id: "blue", label: "Ocean Blue", color: "bg-blue-500" },
                      { id: "charcoal", label: "Dark Slate", color: "bg-slate-800" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setBrandForm({ ...brandForm, themeColor: theme.id })}
                        className={`inline-flex items-center gap-2 p-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          brandForm.themeColor === theme.id
                            ? "bg-slate-50 dark:bg-zinc-800 border-slate-900 dark:border-slate-200"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${theme.color}`}></span>
                        <span>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-3 text-xs font-bold text-slate-500 text-center hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-brand-500 hover:bg-brand-600 py-3 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    Apply Theme
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile preview mockup */}
            <div className="hidden md:flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-slate-800 flex-none w-[260px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-wider">Live Customer QR Preview</span>
              <div className="w-[200px] h-[380px] bg-white dark:bg-zinc-900 border-4 border-slate-800 rounded-[28px] shadow-lg overflow-hidden flex flex-col relative text-slate-800 dark:text-slate-200 font-sans">
                {/* notch */}
                <div className="h-4 bg-slate-800 w-16 mx-auto rounded-b-lg absolute top-0 left-1/2 -translate-x-1/2 z-10"></div>
                
                {/* Header Mockup */}
                <div className="bg-slate-50 dark:bg-zinc-950 p-3 pt-6 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{brandForm.logoEmoji}</span>
                    <span className="font-extrabold text-[10px] truncate max-w-[100px]">{selectedRest.name}</span>
                  </div>
                  <span className="text-[8px] bg-slate-200 dark:bg-zinc-800 px-1 rounded-md font-bold">T4</span>
                </div>
                
                {/* Body mockup */}
                <div className="flex-grow p-3 space-y-3 overflow-y-auto">
                  <div className="h-10 bg-slate-100 dark:bg-zinc-850 rounded-xl p-2 flex items-center gap-2">
                    <span className="text-sm">🍔</span>
                    <div className="space-y-0.5">
                      <div className="w-16 h-1.5 bg-slate-350 dark:bg-slate-700 rounded-full"></div>
                      <div className="w-24 h-1 bg-slate-250 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 dark:bg-zinc-850 rounded-xl p-2 flex items-center gap-2">
                    <span className="text-sm">🍕</span>
                    <div className="space-y-0.5">
                      <div className="w-16 h-1.5 bg-slate-350 dark:bg-slate-700 rounded-full"></div>
                      <div className="w-24 h-1 bg-slate-250 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Mock CTA Button with themed color */}
                <div className="p-2.5 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-slate-850">
                  <div className={`w-full rounded-xl py-2 text-[10px] text-white font-extrabold text-center bg-gradient-to-r ${themeColorsMap[brandForm.themeColor]} shadow-sm`}>
                    Checkout Cart ($0.00)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: VIEW RESTAURANT STATISTICS */}
      {activeModal === "stats" && selectedRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Restaurant Statistics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Performance index logs for {selectedRest.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">30D Orders</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">482 orders</p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Checkout AOV</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">$21.40</p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">KDS Speed</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">8m 42s</p>
              </div>
            </div>

            {/* Performance charts mockup */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Weekly Sales Performance ($)</h4>
              <div className="h-44 bg-slate-900 text-slate-400 rounded-2xl flex items-end justify-between p-6 gap-3 relative overflow-hidden border border-slate-800">
                <div className="absolute inset-0 bg-radial-gradient(circle at top, #1e293b 0%, #090d16 100%) z-0 opacity-80"></div>
                
                {/* Simulated bar chart graph */}
                {[
                  { label: "Wk 1", val: "h-20 bg-brand-500", rev: "$2,890" },
                  { label: "Wk 2", val: "h-28 bg-brand-500", rev: "$3,400" },
                  { label: "Wk 3", val: "h-24 bg-brand-500", rev: "$3,100" },
                  { label: "Wk 4", val: "h-36 bg-emerald-500", rev: "$4,800" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10">
                    <span className="text-[9px] text-white font-mono leading-none">{bar.rev}</span>
                    <div className={`w-full rounded-t-lg transition-all duration-500 ${bar.val}`}></div>
                    <span className="text-[9px] uppercase tracking-wider font-semibold leading-none">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Meta Details */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-800 dark:text-slate-350">GST Number:</span> {selectedRest.gstNumber}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-350">Licensing Plan:</span> {selectedRest.planType}</p>
              </div>
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-800 dark:text-slate-350">Registration Date:</span> {selectedRest.registrationDate}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-350">License Expiry:</span> {selectedRest.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
