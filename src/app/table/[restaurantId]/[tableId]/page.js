"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QrCodeIcon, StarIcon, ClockIcon, ChefHatIcon, CheckCircleIcon, SparklesIcon } from "../../../../components/Icons";
import { useSocket } from "../../../../lib/useSocket";

export default function TableMenuPage() {
  const params = useParams();
  const restaurantId = params.restaurantId;
  const tableId = params.tableId || "T1"; // e.g. T3

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurantProfile, setRestaurantProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All Dishes");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  const [cart, setCart] = useState([]);
  const [orderState, setOrderState] = useState("idle"); // idle -> placing -> confirmed
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const getCurrencySymbol = () => {
    const code = restaurantProfile?.currency || "INR";
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "د.إ",
    };
    return symbols[code] || "₹";
  };

  const enterFullscreenAndDismiss = () => {
    const docEl = document.documentElement;
    const requestFS = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    
    if (requestFS) {
      requestFS.call(docEl)
        .then(() => {
          setWelcomeDismissed(true);
        })
        .catch((err) => {
          console.warn("Fullscreen request blocked by browser policy:", err);
          setWelcomeDismissed(true);
        });
    } else {
      setWelcomeDismissed(true);
    }
  };

  // Fetch menu, categories, and restaurant profile from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes, profileRes] = await Promise.all([
          fetch(`/api/menu?restaurantId=${restaurantId}`),
          fetch(`/api/categories?restaurantId=${restaurantId}`),
          fetch(`/api/restaurants/${restaurantId}`)
        ]);

        if (menuRes.ok && catRes.ok) {
          const menuData = await menuRes.json();
          const catData = await catRes.json();
          setMenuItems(menuData);
          setCategories([{ name: "All Dishes" }, ...catData]);
        }

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          setRestaurantProfile(profileData);
        }
      } catch (err) {
        console.error("Error loading menu data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  // Realtime Socket.IO subscription
  useSocket(restaurantId, (data) => {
    if (data && data.type === "UPDATE" && submittedOrder && (data.id === submittedOrder._id || data.id === submittedOrder._id?.toString())) {
      setSubmittedOrder((prev) => (prev ? { ...prev, ...data.updateData } : prev));
    }
  });

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => (i._id === item._id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === itemId);
      if (!existing) return prev;
      if (existing.qty === 1) {
        return prev.filter((i) => i._id !== itemId);
      }
      return prev.map((i) => (i._id === itemId ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setOrderState("placing");

    try {
      const total = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
      const itemsPayload = cart.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.price
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId,
          items: itemsPayload,
          total,
          restaurantId: restaurantId || ""
        })
      });

      if (res.ok) {
        const orderData = await res.json();
        setSubmittedOrder(orderData);
        setOrderState("confirmed");
        setCart([]);
      } else {
        alert("Failed to send order. Please try again.");
        setOrderState("idle");
      }
    } catch (e) {
      console.error("Order POST Error:", e);
      setOrderState("idle");
    }
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const itemCat = item.category ? item.category.trim().toLowerCase() : "";
    const activeCat = activeCategory ? activeCategory.trim().toLowerCase() : "";

    const matchesCategory =
      activeCat === "all" ||
      activeCat === "all dishes" ||
      itemCat === activeCat;
    
    const matchesVeg = !vegOnly || item.isVeg === true;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesVeg && matchesSearch && item.isAvailable;
  });

  const cartTotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const totalQty = cart.reduce((acc, curr) => acc + curr.qty, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-6 text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-4">Connecting to table {tableId}...</p>
      </div>
    );
  }

  // Set brand theme color classes dynamically based on restaurant config
  const themeAccentBg = {
    orange: "from-brand-500 to-amber-500",
    red: "from-red-600 to-rose-500",
    green: "from-emerald-500 to-teal-500",
    blue: "from-blue-600 to-sky-500",
    charcoal: "from-slate-700 to-slate-900",
  };

  const selectedThemeColor = restaurantProfile?.themeColor || "orange";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 flex flex-col items-center justify-start text-slate-800 dark:text-slate-200 font-sans pb-28">
      
      {/* Immersive Welcome Splash Overlay */}
      {!welcomeDismissed && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md p-6 text-center select-none animate-fade-in">
          <div className="max-w-xs space-y-6 animate-scale-in">
            {/* Logo/Icon with Pulsing Glow */}
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/25 animate-pulse overflow-hidden">
              {restaurantProfile?.logo ? (
                <img
                  src={restaurantProfile.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">{restaurantProfile?.logoEmoji || "🍽️"}</span>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-brand-500 uppercase bg-brand-500/10 px-3 py-1 rounded-full">
                Table {tableId}
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                {restaurantProfile?.name || "Welcome to our Restaurant"}
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs">
                Scan successful! Tap below to open our interactive digital menu in full screen.
              </p>
            </div>

            <button
              onClick={enterFullscreenAndDismiss}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-brand-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Explore Menu 🍽️
            </button>
            
            <p className="text-[9px] text-zinc-500">Powered by QuickBite OS</p>
          </div>
        </div>
      )}
      
      {/* Table Title Header */}
      <div className="w-full bg-white dark:bg-zinc-950 px-4 pt-6 pb-4 border-b border-slate-150 dark:border-slate-850 shadow-xs max-w-lg mx-auto flex items-center justify-between sticky top-0 z-20">
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 tracking-wider uppercase bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
              TABLE {tableId}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            {restaurantProfile?.logo ? (
              <img
                src={restaurantProfile.logo}
                alt="Logo"
                className="w-6 h-6 rounded-lg object-cover border border-slate-200/50 dark:border-slate-805"
              />
            ) : (
              <span className="mr-0.5">{restaurantProfile?.logoEmoji || "🍽️"}</span>
            )}
            {restaurantProfile?.name || "Restaurant Menu"}
          </h1>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full font-bold">
          <StarIcon className="w-3.5 h-3.5" /> 4.9 (120+)
        </div>
      </div>

      {/* Main Panel */}
      <div className="w-full max-w-lg mx-auto px-4 mt-4 space-y-4">
        
        {orderState === "idle" && (
          <>
            {/* Search & Veg Filter Switch */}
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-xs">
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-slate-50 dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border-0 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  vegOnly
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                🟢 Veg Only
              </button>
            </div>

            {/* Categories Pills */}
            <div className="flex gap-2 overflow-x-auto py-1.5 no-scrollbar scroll-smooth">
              {categories.map((cat, idx) => {
                const isSelected =
                  activeCategory.trim().toLowerCase() === cat.name.trim().toLowerCase() ||
                  ((cat.name === "All Dishes" || cat.name === "all") &&
                    (activeCategory.toLowerCase() === "all" || activeCategory.toLowerCase() === "all dishes"));

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                        : "bg-white dark:bg-zinc-950 text-slate-500 border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-50"
                    }`}
                  >
                    {cat.svg && (
                      <img src={cat.svg} alt="" className="w-4 h-4 object-contain flex-none" />
                    )}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Menu Items List */}
            <div className="space-y-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const inCart = cart.find((i) => i._id === item._id);
                  return (
                    <div key={item._id} className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs flex justify-between gap-4 text-left relative overflow-hidden transition-all hover:scale-[1.01]">
                      
                      {/* Left: Dish Image (if exists) */}
                      {item.image && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-none border border-slate-200/50 dark:border-slate-800">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-grow space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-4 h-4 border rounded-sm font-bold text-[9px] ${
                            item.isVeg ? "border-emerald-500 text-emerald-500" : "border-red-500 text-red-500"
                          }`}>
                            {item.isVeg ? "V" : "N"}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{item.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                          <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 opacity-60" /> {item.prepTime} min prep</span>
                          <span className="text-slate-900 dark:text-white font-extrabold text-xs">{getCurrencySymbol()}{item.price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Add Cart Action */}
                      <div className="flex flex-col items-center justify-center flex-none">
                        {inCart ? (
                          <div className="flex items-center gap-2.5 bg-brand-500 rounded-full px-2.5 py-1 text-white text-xs font-bold shadow-sm">
                            <button onClick={() => removeFromCart(item._id)} className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-full text-sm">-</button>
                            <span className="w-4 text-center">{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-full text-sm">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                          >
                            Add +
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800 rounded-3xl">
                  <p className="text-slate-400 text-sm">No items found matching your filters.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Placing Order Loading Screen */}
        {orderState === "placing" && (
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center py-20 text-center space-y-4">
            <div className="w-14 h-14 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transmitting Order...</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Connecting table {tableId} session directly to kitchen display display terminal #1.
            </p>
          </div>
        )}

        {/* Confirmed Order screen */}
        {orderState === "confirmed" && submittedOrder && (
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-6 animate-fade-in text-left">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">Order Sent to Kitchen!</h3>
              <p className="text-xs text-slate-400 uppercase font-extrabold tracking-wider mt-1">Ticket session #{submittedOrder._id.slice(-6)}</p>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-2 border-b border-slate-200/50 dark:border-slate-800">
                <span>Dine-In Table {tableId}</span>
                <span>Session Active</span>
              </div>
              
              <div className="space-y-2.5">
                {submittedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-350">{i.qty}x {i.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{getCurrencySymbol()}{(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-800 pt-2.5 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Total checkout</span>
                <span>{getCurrencySymbol()}{submittedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center gap-3">
              <ChefHatIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-none" />
              <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                Chef accepted order! Your meal is being prepared. Grab a seat, we will serve you shortly.
              </p>
            </div>

            <button
              onClick={() => setOrderState("idle")}
              className="w-full text-center rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
            >
              Order More Items
            </button>
          </div>
        )}

      </div>

      {/* Floating Bottom Cart Bar */}
      {orderState === "idle" && cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-slate-900 dark:bg-slate-50 rounded-2xl shadow-xl p-4 flex items-center justify-between border border-white/10 text-white dark:text-slate-900 z-10 max-w-md mx-auto transition-all">
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"} IN CART
            </span>
            <h5 className="font-black text-base">{getCurrencySymbol()}{cartTotal.toFixed(2)}</h5>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-5 py-3 text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Place Order <ClockIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
