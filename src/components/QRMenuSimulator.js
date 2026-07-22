"use client";

import React, { useState } from "react";
import { StarIcon, ClockIcon, ChefHatIcon, CheckCircleIcon, SparklesIcon } from "./Icons";

export default function QRMenuSimulator() {
  const [selectedTheme, setSelectedTheme] = useState("orange"); // "velvet" | "gold" | "orange" | "emerald"
  const [currency, setCurrency] = useState("₹"); // "₹" | "$"
  const [activeCategory, setActiveCategory] = useState("burgers");
  const [cart, setCart] = useState([]);
  const [orderState, setOrderState] = useState("idle"); // "idle" | "placing" | "kitchen_prep" | "confirmed"

  const themePalettes = {
    velvet: {
      name: "Dark Velvet / Midnight",
      tagline: "Lounges & Nightclubs",
      bg: "bg-[#0f0c1b]",
      card: "bg-[#18132a] border-[#292244]",
      header: "bg-[#140f26] border-[#292244]",
      accent: "bg-purple-600 text-white hover:bg-purple-500",
      accentText: "text-purple-400",
      pillActive: "bg-purple-600 text-white",
      pillInactive: "bg-[#1f1938] text-purple-200",
      tagBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    },
    gold: {
      name: "Royal Gold / Luxury",
      tagline: "Fine Dining & Steakhouse",
      bg: "bg-[#12100e]",
      card: "bg-[#1c1813] border-[#332b20]",
      header: "bg-[#171410] border-[#332b20]",
      accent: "bg-amber-500 text-slate-950 hover:bg-amber-400",
      accentText: "text-amber-400",
      pillActive: "bg-amber-500 text-slate-950",
      pillInactive: "bg-[#241f18] text-amber-200",
      tagBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    orange: {
      name: "Vibrant Sunset / Orange",
      tagline: "Cafes & Fast Food",
      bg: "bg-[#09090b]",
      card: "bg-[#18181b] border-[#27272a]",
      header: "bg-[#121215] border-[#27272a]",
      accent: "bg-orange-500 text-white hover:bg-orange-600",
      accentText: "text-orange-500",
      pillActive: "bg-orange-500 text-white",
      pillInactive: "bg-[#27272a] text-zinc-300",
      tagBg: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    },
    emerald: {
      name: "Minimalist Emerald",
      tagline: "Healthy & Organic",
      bg: "bg-[#0a1410]",
      card: "bg-[#11221b] border-[#1d3b2e]",
      header: "bg-[#0e1b15] border-[#1d3b2e]",
      accent: "bg-emerald-500 text-white hover:bg-emerald-400",
      accentText: "text-emerald-400",
      pillActive: "bg-emerald-500 text-white",
      pillInactive: "bg-[#162d24] text-emerald-200",
      tagBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
  };

  const activePalette = themePalettes[selectedTheme];

  const categories = [
    { id: "burgers", name: "Starters & Mains" },
    { id: "pizzas", name: "Artisanal Pizzas" },
    { id: "desserts", name: "Chef Desserts" },
    { id: "drinks", name: "Mocktails & Drinks" },
  ];

  const rates = currency === "₹" ? 80 : 1;

  const formatPrice = (usdPrice) => {
    if (currency === "₹") {
      return `₹${Math.round(usdPrice * 80)}`;
    }
    return `$${usdPrice.toFixed(2)}`;
  };

  const menuItems = {
    burgers: [
      { id: "b1", name: "Truffle Cheeseburger", price: 12.99, isVeg: false, desc: "Prime beef patty, black truffle aioli, aged cheddar, brioche bun.", tag: "Chef Special" },
      { id: "b2", name: "Crispy Paneer Slider", price: 9.50, isVeg: true, desc: "Spicy marinated paneer steak, mint chutney, crispy cabbage slaw.", tag: "Bestseller" },
    ],
    pizzas: [
      { id: "p1", name: "Margherita Basilico", price: 14.00, isVeg: true, desc: "San Marzano tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil.", tag: "Classic" },
      { id: "p2", name: "Smoky Chicken Pepperoni", price: 16.50, isVeg: false, desc: "Cured pepperoni, spicy chicken, hot honey drizzle, fresh oregano.", tag: "Must Try" },
    ],
    desserts: [
      { id: "ds1", name: "Belgian Chocolate Lava", price: 7.99, isVeg: true, desc: "Warm molten Belgian dark chocolate cake served with vanilla bean gelato.", tag: "Sweet Choice" },
      { id: "ds2", name: "Classic Gulab Jamun", price: 5.50, isVeg: true, desc: "Golden milk solids dumplings soaked in cardamom saffron syrup.", tag: "Traditional" },
    ],
    drinks: [
      { id: "d1", name: "Vanilla Cold Brew", price: 4.50, isVeg: true, desc: "Slow-steeped cold brew coffee infused with Madagascar vanilla cream.", tag: "Cold" },
      { id: "d2", name: "Fresh Mint Lemonade", price: 3.99, isVeg: true, desc: "Hand-pressed lemon juice, organic garden mint, crushed ice, soda.", tag: "Refreshing" },
    ],
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing) return prev;
      if (existing.qty === 1) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) => (i.id === itemId ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setOrderState("placing");
    setTimeout(() => {
      setOrderState("kitchen_prep");
      setTimeout(() => {
        setOrderState("confirmed");
      }, 2000);
    }, 1500);
  };

  const resetSimulator = () => {
    setCart([]);
    setOrderState("idle");
  };

  const cartTotalUSD = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const totalQty = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto py-8 text-left">
      {/* Simulation explanation & Controls */}
      <div className="flex-1 space-y-6 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-extrabold uppercase tracking-wider">
          <SparklesIcon className="w-4 h-4" /> Live Mobile & Theme Simulator
        </div>

        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl leading-tight">
          Test Live Themes & Order Flow
        </h3>
        
        <p className="text-base text-slate-600 dark:text-slate-300">
          Try the exact experience your diners get! Switch themes, toggle currencies (`₹` INR / `$` USD), add dishes, and simulate instant kitchen dispatch.
        </p>

        {/* Live Controls Box */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
          {/* Theme Selector Controls */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              1. Select Restaurant Theme Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(themePalettes).map((tKey) => (
                <button
                  key={tKey}
                  onClick={() => setSelectedTheme(tKey)}
                  className={`p-2.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer text-left flex items-center gap-2 ${
                    selectedTheme === tKey
                      ? "border-brand-500 bg-brand-500/10 text-brand-500 shadow-sm ring-1 ring-brand-500"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full flex-none ${
                    tKey === "velvet" ? "bg-purple-600" :
                    tKey === "gold" ? "bg-amber-500" :
                    tKey === "orange" ? "bg-orange-500" : "bg-emerald-500"
                  }`}></span>
                  <div className="truncate">
                    <span className="block truncate">{themePalettes[tKey].name.split(" (")[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              2. Currency Unit Format
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl">
              <button
                onClick={() => setCurrency("₹")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  currency === "₹" ? "bg-emerald-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("$")}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  currency === "$" ? "bg-brand-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <ul className="space-y-3.5 pt-2">
          {[
            { step: "01", title: "Add Dishes to Order Cart", desc: "Tap items in categories (Starters, Pizzas, Desserts, Mocktails)." },
            { step: "02", title: "Click 'Place Order'", desc: "Instant KDS dispatch sent to table 04." },
            { step: "03", title: "Automated Multi-Currency Bill", desc: "Simulate live preparation ticket & auto-generated receipt." },
          ].map((item, idx) => (
            <li key={idx} className="flex gap-3.5 items-start">
              <div className="flex-none flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white font-bold text-xs mt-0.5">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {orderState === "confirmed" && (
          <button
            onClick={resetSimulator}
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-xs font-bold shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            🔄 Reset Live Simulator
          </button>
        )}
      </div>

      {/* Mobile Mockup Screen */}
      <div className="relative w-[340px] h-[670px] bg-slate-950 rounded-[45px] p-3 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-900/10 flex-none animate-float">
        {/* Speaker notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Simulator Inside Screen with Dynamic Theme */}
        <div className={`w-full h-full ${activePalette.bg} rounded-[36px] overflow-hidden relative flex flex-col font-sans select-none text-white transition-colors duration-300`}>
          
          {/* Mock App Header */}
          <div className={`${activePalette.header} px-4 pt-8 pb-3 shadow-sm flex items-center justify-between border-b`}>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-extrabold uppercase ${activePalette.accentText}`}>TABLE 04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">tablemenu.in 🍷</h4>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold">
              <StarIcon className="w-3 h-3" /> 4.9 (240+)
            </div>
          </div>

          {/* IDLE / BROWSING STATE */}
          {orderState === "idle" && (
            <>
              {/* Category pills */}
              <div className={`flex gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-none ${activePalette.header} border-b`}>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                      activeCategory === c.id ? activePalette.pillActive : activePalette.pillInactive
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Menu items list */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-24 scrollbar-none text-left">
                {menuItems[activeCategory].map((item) => {
                  const inCart = cart.find((i) => i.id === item.id);
                  return (
                    <div key={item.id} className={`${activePalette.card} p-3 rounded-2xl border shadow-sm space-y-2 transition-all hover:scale-[1.01]`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-sm border ${item.isVeg ? "border-emerald-500 flex items-center justify-center" : "border-red-500 flex items-center justify-center"}`}>
                              <span className={`w-1 h-1 rounded-full ${item.isVeg ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${activePalette.tagBg} px-1.5 py-0.2 rounded`}>
                              {item.tag}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-white leading-snug">{item.name}</h5>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{item.desc}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className={`font-black text-xs ${activePalette.accentText}`}>
                          {formatPrice(item.price)}
                        </span>
                        
                        {inCart ? (
                          <div className={`flex items-center gap-2 ${activePalette.accent} rounded-full px-2 py-0.5 text-xs font-extrabold shadow-xs`}>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full transition-colors text-xs"
                            >
                              -
                            </button>
                            <span className="w-3 text-center text-[11px]">{inCart.qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full transition-colors text-xs"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className={`${activePalette.accent} rounded-full px-3 py-1 text-[11px] font-extrabold shadow-xs transition-transform active:scale-95 cursor-pointer`}
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Bottom Cart Bar */}
              {cart.length > 0 && (
                <div className={`absolute bottom-3 left-3 right-3 ${activePalette.card} rounded-2xl shadow-2xl p-3 flex items-center justify-between border z-10 animate-fade-in`}>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"}
                    </span>
                    <h5 className={`font-black text-xs ${activePalette.accentText}`}>
                      {formatPrice(cartTotalUSD)}
                    </h5>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className={`${activePalette.accent} rounded-xl px-3.5 py-2 text-xs font-extrabold flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer`}
                  >
                    Place Order <ClockIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* PLACING ORDER ANIMATION */}
          {orderState === "placing" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 text-center">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <h5 className="font-bold text-sm text-white">Sending Ticket to Kitchen...</h5>
              <p className="text-[10px] text-slate-400 max-w-xs">Pinging Kitchen Display & Waiter Station for Table 04...</p>
            </div>
          )}

          {/* KITCHEN PREPARATION ALERT */}
          {orderState === "kitchen_prep" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                <ChefHatIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-sm text-white">Chef Accepted Order!</h5>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Ticket #8493 • Table 04</p>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          )}

          {/* ORDER CONFIRMED & AUTOMATED BILL RECEIPT */}
          {orderState === "confirmed" && (
            <div className="flex-1 flex flex-col justify-between p-5 text-center overflow-y-auto scrollbar-none space-y-4">
              <div className="space-y-3 flex flex-col items-center pt-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircleIcon className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-extrabold text-sm text-white">Order Confirmed & Printed!</h5>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-extrabold">
                    TICKET #8493 • TABLE 04
                  </p>
                </div>
                
                {/* Simulated Order Bill Receipt */}
                <div className={`${activePalette.card} border rounded-2xl p-3 w-full text-left space-y-2 shadow-xs`}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Digital Tax Invoice</span>
                    <span className="text-[9px] font-mono text-emerald-400">PAID</span>
                  </div>
                  {cart.map((i) => (
                    <div key={i.id} className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-300 truncate max-w-[140px]">
                        {i.qty}x {i.name}
                      </span>
                      <span className="font-bold text-white">{formatPrice(i.price * i.qty)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex justify-between font-extrabold text-xs text-white">
                    <span>Total Amount</span>
                    <span className={activePalette.accentText}>{formatPrice(cartTotalUSD)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 flex items-center gap-2.5">
                <ChefHatIcon className="w-5 h-5 text-emerald-400 flex-none" />
                <p className="text-[10px] font-semibold text-emerald-300 text-left leading-tight">
                  Automated receipt dispatched to staff & diner dashboard.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
