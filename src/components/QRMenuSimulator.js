"use client";

import React, { useState } from "react";
import { StarIcon, ClockIcon, ChefHatIcon, CheckCircleIcon, SparklesIcon } from "./Icons";

export default function QRMenuSimulator() {
  const [activeCategory, setActiveCategory] = useState("burgers");
  const [cart, setCart] = useState([]);
  const [orderState, setOrderState] = useState("idle"); // idle -> placing -> confirmed

  const categories = [
    { id: "burgers", name: "Burgers" },
    { id: "pizzas", name: "Pizzas" },
    { id: "drinks", name: "Drinks" },
  ];

  const menuItems = {
    burgers: [
      { id: "b1", name: "Truffle Cheeseburger", price: 12.99, desc: "Prime beef patty, black truffle aioli, aged cheddar, brioche bun.", tag: "Chef's Special" },
      { id: "b2", name: "Spicy Crunch Chicken", price: 11.50, desc: "Crispy chicken breast, spicy coleslaw, jalapeño slices, house sauce.", tag: "Popular" },
    ],
    pizzas: [
      { id: "p1", name: "Margherita Classic", price: 14.00, desc: "San Marzano tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil.", tag: "Vegetarian" },
      { id: "p2", name: "Spicy Pepperoni & Honey", price: 16.50, desc: "Cured pepperoni, hot honey drizzle, fresh mozzarella, organic oregano.", tag: "Must Try" },
    ],
    drinks: [
      { id: "d1", name: "Vanilla Cold Brew", price: 4.50, desc: "Slow-steeped cold brew infused with madagascar vanilla bean cream.", tag: "Cold" },
      { id: "d2", name: "Fresh Mint Lemonade", price: 3.99, desc: "Hand-pressed lemons, fresh organic mint, sparkling soda.", tag: "Refreshing" },
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
      setOrderState("confirmed");
    }, 2000);
  };

  const resetSimulator = () => {
    setCart([]);
    setOrderState("idle");
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const totalQty = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto py-8">
      {/* Simulation explanation */}
      <div className="flex-1 space-y-6 max-w-xl text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-sm font-semibold">
          <SparklesIcon className="w-4 h-4" /> Live Simulator
        </div>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Scan QR. Browse Menu. Order instantly.
        </h3>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Try it yourself on our live phone mockup! Simulate the experience of your guests in three simple steps:
        </p>
        
        <ul className="space-y-4">
          {[
            { step: "01", title: "Select Categories & Add Items", desc: "Interact with our mobile mockup on the right. Tap between categories and add food to your cart." },
            { step: "02", title: "Click 'Place Order'", desc: "Submit the request. In a real restaurant, this instantly displays on wait-staff tablets and Kitchen Display Screens." },
            { step: "03", title: "Instant Kitchen Alert", desc: "Observe the simulator transition into confirmation. The kitchen receives instructions with zero friction." },
          ].map((item, idx) => (
            <li key={idx} className="flex gap-4">
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm">
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {orderState === "confirmed" && (
          <button
            onClick={resetSimulator}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-3 text-sm font-semibold text-white dark:text-slate-900 shadow-md hover:bg-slate-800 transition-all cursor-pointer"
          >
            Reset Simulator & Try Again
          </button>
        )}
      </div>

      {/* Mobile Mockup Screen */}
      <div className="relative w-[340px] h-[670px] bg-slate-950 rounded-[45px] p-3 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-900/10 flex-none animate-float">
        {/* Speaker notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Simulator Inside Screen */}
        <div className="w-full h-full bg-slate-50 dark:bg-zinc-900 rounded-[36px] overflow-hidden relative flex flex-col font-sans select-none text-slate-800 dark:text-slate-200">
          
          {/* Mock App Header */}
          <div className="bg-white dark:bg-zinc-950 px-4 pt-8 pb-3 shadow-sm flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">TABLE 04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Cafe Aroma ☕</h4>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
              <StarIcon className="w-3.5 h-3.5" /> 4.9 (120+)
            </div>
          </div>

          {/* If simulator is showing idle/browsing state */}
          {orderState === "idle" && (
            <>
              {/* Category tabs */}
              <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-none bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-slate-800">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === c.id
                        ? "bg-brand-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Menu items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 scrollbar-none">
                {menuItems[activeCategory].map((item) => {
                  const inCart = cart.find((i) => i.id === item.id);
                  return (
                    <div key={item.id} className="bg-white dark:bg-zinc-950 p-3.5 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between gap-2.5 transition-all hover:scale-[1.01]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded-md">
                            {item.tag}
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{item.name}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-extrabold text-sm text-slate-950 dark:text-slate-50">${item.price.toFixed(2)}</span>
                        
                        {inCart ? (
                          <div className="flex items-center gap-2.5 bg-brand-500 rounded-full px-2 py-1 text-white text-xs font-bold shadow-xs">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors text-base"
                            >
                              -
                            </button>
                            <span className="w-4 text-center">{inCart.qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors text-base"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-full px-4 py-1 text-xs font-bold shadow-xs transition-colors"
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
                <div className="absolute bottom-4 left-3 right-3 bg-slate-900 dark:bg-slate-50 rounded-2xl shadow-xl p-3.5 flex items-center justify-between border border-white/10 text-white dark:text-slate-900 z-10 transition-all duration-300">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"}
                    </span>
                    <h5 className="font-extrabold text-sm">${cartTotal.toFixed(2)}</h5>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-brand-500 dark:bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    Place Order <ClockIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Placing Order Transition State */}
          {orderState === "placing" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 bg-white dark:bg-zinc-950">
              <div className="w-14 h-14 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <h5 className="font-bold text-base text-slate-900 dark:text-white text-center">
                Sending Order to Kitchen...
              </h5>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-xs">
                Generating instant receipt and pinging the Kitchen Display Screen (KDS) at Table 4.
              </p>
            </div>
          )}

          {/* Confirmed Order State */}
          {orderState === "confirmed" && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
              <div></div>
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-lg text-slate-900 dark:text-white">Order Confirmed!</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    TICKET #8493 - TABLE 04
                  </p>
                </div>
                
                {/* Simulated Order Items */}
                <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 w-full text-left space-y-2 shadow-xs">
                  {cart.map((i) => (
                    <div key={i.id} className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {i.qty}x {i.name}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">${(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                    <span>Total Paid</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
                <ChefHatIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-none" />
                <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 text-left">
                  Chef accepted order. Real-time updates: preparing now!
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
