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

  const isCategoryMatch = (itemCat, targetCat) => {
    if (!targetCat) return true;
    const cleanTarget = targetCat.trim().toLowerCase();
    if (cleanTarget === "all" || cleanTarget === "all dishes") return true;
    if (!itemCat) return false;

    const cleanItem = itemCat.trim().toLowerCase();
    if (cleanItem === cleanTarget) return true;

    const singularItem = cleanItem.endsWith("s") ? cleanItem.slice(0, -1) : cleanItem;
    const singularTarget = cleanTarget.endsWith("s") ? cleanTarget.slice(0, -1) : cleanTarget;

    return singularItem === singularTarget || cleanItem.includes(singularTarget) || cleanTarget.includes(singularItem);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = isCategoryMatch(item.category, activeCategory);
    const matchesVeg = !vegOnly || item.isVeg === true;

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const isAvailable = item.isAvailable !== false;

    return matchesCategory && matchesVeg && matchesSearch && isAvailable;
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
  const themePalettes = {
    // 1. Vibrant Sunset / Orange (Default - Cafe & Fast Food)
    orange: {
      pageBg: "bg-zinc-950 text-slate-100",
      headerBg: "bg-zinc-950/95 border-zinc-800/80",
      cardBg: "bg-zinc-900 border-zinc-800/80",
      cardInnerBg: "bg-zinc-950 border-zinc-800",
      tableBadge: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
      btnPrimary: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/20",
      btnSecondary: "bg-orange-500 text-white shadow-orange-500/20",
      pillActive: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20",
      pillInactive: "bg-zinc-900 text-slate-400 border border-zinc-800 hover:bg-zinc-800",
      priceText: "text-orange-400 font-extrabold",
      searchInput: "bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 focus:ring-orange-500",
      addBtn: "bg-orange-500 hover:bg-orange-600 text-white font-extrabold",
      counterBtn: "bg-orange-500 text-white font-extrabold",
    },
    // 2. Royal Gold / Luxury (Fine Dining)
    gold: {
      pageBg: "bg-[#12100e] text-amber-50",
      headerBg: "bg-[#171410]/95 border-[#3d3221]/80",
      cardBg: "bg-[#1c1813] border-[#3d3221]/80",
      cardInnerBg: "bg-[#12100e] border-[#3d3221]",
      tableBadge: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
      btnPrimary: "bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 font-black shadow-amber-500/20",
      btnSecondary: "bg-amber-500 text-slate-950 font-black shadow-amber-500/20",
      pillActive: "bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 font-black shadow-md shadow-amber-500/20",
      pillInactive: "bg-[#1c1813] text-amber-200/60 border border-[#3d3221] hover:bg-[#28221b]",
      priceText: "text-amber-400 font-extrabold",
      searchInput: "bg-[#1c1813] text-amber-100 placeholder-amber-300/40 border border-[#3d3221] focus:ring-amber-500",
      addBtn: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black",
      counterBtn: "bg-amber-500 text-slate-950 font-black",
    },
    // 3. Dark Velvet / Midnight (Lounge & Clubs)
    velvet: {
      pageBg: "bg-[#0f0c1b] text-purple-50",
      headerBg: "bg-[#130f24]/95 border-[#2c234b]/80",
      cardBg: "bg-[#18132a] border-[#2c234b]/80",
      cardInnerBg: "bg-[#0f0c1b] border-[#2c234b]",
      tableBadge: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
      btnPrimary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/20",
      btnSecondary: "bg-purple-600 text-white shadow-purple-600/20",
      pillActive: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20",
      pillInactive: "bg-[#18132a] text-purple-200/60 border border-[#2c234b] hover:bg-[#231c3d]",
      priceText: "text-purple-400 font-extrabold",
      searchInput: "bg-[#18132a] text-purple-100 placeholder-purple-300/40 border border-[#2c234b] focus:ring-purple-500",
      addBtn: "bg-purple-600 hover:bg-purple-700 text-white font-extrabold",
      counterBtn: "bg-purple-600 text-white font-extrabold",
    },
    // 4. Minimalist Emerald (Healthy & Organic)
    emerald: {
      pageBg: "bg-[#0a1410] text-emerald-50",
      headerBg: "bg-[#0e1c16]/95 border-[#1d3b2e]/80",
      cardBg: "bg-[#11221b] border-[#1d3b2e]/80",
      cardInnerBg: "bg-[#0a1410] border-[#1d3b2e]",
      tableBadge: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
      btnPrimary: "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-emerald-500/20",
      btnSecondary: "bg-emerald-500 text-slate-950 font-black shadow-emerald-500/20",
      pillActive: "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20",
      pillInactive: "bg-[#11221b] text-emerald-200/60 border border-[#1d3b2e] hover:bg-[#1a3328]",
      priceText: "text-emerald-400 font-extrabold",
      searchInput: "bg-[#11221b] text-emerald-100 placeholder-emerald-300/40 border border-[#1d3b2e] focus:ring-emerald-500",
      addBtn: "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black",
      counterBtn: "bg-emerald-500 text-slate-950 font-black",
    }
  };

  const selectedThemeColor = restaurantProfile?.themeColor || "orange";
  const theme = themePalettes[selectedThemeColor] || themePalettes.orange;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start font-sans pb-28 ${theme.pageBg}`}>
      
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
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-lg active:scale-95 transition-all cursor-pointer ${theme.btnPrimary}`}
            >
              Explore Menu 🍽️
            </button>
            
            <p className="text-[9px] text-zinc-500">Powered by TableMenu.in OS</p>
          </div>
        </div>
      )}
      
      {/* Table Title Header */}
      <div className={`w-full px-4 pt-6 pb-4 border-b shadow-xs max-w-lg mx-auto flex items-center justify-between sticky top-0 z-20 ${theme.headerBg}`}>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md ${theme.tableBadge}`}>
              TABLE {tableId}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-lg font-bold mt-1 flex items-center gap-2">
            {restaurantProfile?.logo ? (
              <img
                src={restaurantProfile.logo}
                alt="Logo"
                className="w-6 h-6 rounded-lg object-cover border border-white/10"
              />
            ) : (
              <span className="mr-0.5">{restaurantProfile?.logoEmoji || "🍽️"}</span>
            )}
            {restaurantProfile?.name || "Restaurant Menu"}
          </h1>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full font-bold border border-amber-500/20">
          <StarIcon className="w-3.5 h-3.5 text-amber-400" /> 4.9 (120+)
        </div>
      </div>

      {/* Main Panel */}
      <div className="w-full max-w-lg mx-auto px-4 mt-4 space-y-4">
        
        {orderState === "idle" && (
          <>
            {/* Search & Veg Filter Switch */}
            <div className={`flex items-center gap-3 p-3 rounded-2xl shadow-xs ${theme.cardBg}`}>
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-grow px-3.5 py-2 rounded-xl text-xs focus:outline-none ${theme.searchInput}`}
              />
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  vegOnly
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                    : "border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                🟢 Veg Only
              </button>
            </div>

            {/* Categories Pills */}
            <div className="flex gap-2 overflow-x-auto py-1.5 no-scrollbar scroll-smooth">
              {categories.map((cat, idx) => {
                const isSelected = isCategoryMatch(cat.name, activeCategory);

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected ? theme.pillActive : theme.pillInactive
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
                    <div key={item._id} className={`p-4 rounded-3xl shadow-xs flex justify-between gap-4 text-left relative overflow-hidden transition-all hover:scale-[1.01] ${theme.cardBg}`}>
                      
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
                          <span className={`text-xs ${theme.priceText}`}>{getCurrencySymbol()}{item.price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Add Cart Action */}
                      <div className="flex flex-col items-center justify-center flex-none">
                        {inCart ? (
                          <div className={`flex items-center gap-2.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-md ${theme.counterBtn}`}>
                            <button onClick={() => removeFromCart(item._id)} className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded-full text-sm font-black">-</button>
                            <span className="w-4 text-center font-black">{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded-full text-sm font-black">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className={`rounded-full px-4 py-1.5 text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer ${theme.addBtn}`}
                          >
                            Add +
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-12 border rounded-3xl ${theme.cardBg}`}>
                  <p className="text-slate-400 text-sm">No items found matching your filters.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Placing Order Loading Screen */}
        {orderState === "submitting" && (
          <div className={`text-center py-20 border rounded-3xl space-y-4 shadow-inner ${theme.cardBg}`}>
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-extrabold">Transmitting order to Kitchen KDS...</p>
          </div>
        )}

        {/* Order Confirmed Screen */}
        {orderState === "confirmed" && submittedOrder && (
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6 text-left animate-fade-in ${theme.cardBg}`}>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black mt-4">Order Sent to Kitchen!</h3>
              <p className="text-xs text-slate-400 uppercase font-extrabold tracking-wider mt-1">Ticket session #{submittedOrder._id.slice(-6)}</p>
            </div>

            <div className={`rounded-2xl p-5 border space-y-3 ${theme.cardInnerBg}`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-2 border-b border-white/10">
                <span>Dine-In Table {tableId}</span>
                <span className="text-emerald-400 font-bold">Session Active</span>
              </div>
              
              <div className="space-y-2.5">
                {submittedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-medium">
                    <span className="opacity-90">{i.qty}x {i.name}</span>
                    <span className="font-bold">{getCurrencySymbol()}{(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-2.5 flex justify-between font-black text-sm">
                <span>Total checkout</span>
                <span className={theme.priceText}>{getCurrencySymbol()}{submittedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center gap-3">
              <ChefHatIcon className="w-6 h-6 text-emerald-400 flex-none" />
              <p className="text-[11px] font-semibold text-emerald-300">
                Chef accepted order! Your meal is being prepared. Grab a seat, we will serve you shortly.
              </p>
            </div>

            <button
              onClick={() => setOrderState("idle")}
              className={`w-full text-center rounded-xl py-3 text-xs font-extrabold shadow-md active:scale-95 transition-all cursor-pointer ${theme.btnPrimary}`}
            >
              Order More Items
            </button>
          </div>
        )}

      </div>

      {/* Floating Bottom Cart Bar */}
      {orderState === "idle" && cart.length > 0 && (
        <div className={`fixed bottom-4 left-4 right-4 rounded-2xl shadow-2xl p-4 flex items-center justify-between border z-10 max-w-md mx-auto transition-all ${theme.cardBg}`}>
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] font-extrabold uppercase tracking-wider block opacity-70">
              {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"} IN CART
            </span>
            <h5 className={`font-black text-base ${theme.priceText}`}>{getCurrencySymbol()}{cartTotal.toFixed(2)}</h5>
          </div>
          <button
            onClick={handlePlaceOrder}
            className={`rounded-xl px-5 py-3 text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${theme.btnPrimary}`}
          >
            Place Order <ClockIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
