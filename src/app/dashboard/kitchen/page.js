"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChefHatIcon, ClockIcon, CheckCircleIcon, XIcon, SparklesIcon } from "../../../components/Icons";

export default function KitchenDashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Local state to track checked menu item rows per order (so chefs can tap-strike items they've prepared)
  const [checkedItems, setCheckedItems] = useState({}); // { [orderId_itemIndex]: true }

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to load kitchen orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll orders database every 4 seconds
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update clock every minute for elapsing timers
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(clockInterval);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 1200);
  };

  // Update order status via PUT
  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error("KDS Status update error:", e);
    }
  };

  const toggleCheckedItem = (orderId, idx) => {
    const key = `${orderId}_${idx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper to calculate elapsing minutes
  const getElapsedMins = (timestamp) => {
    const diffMs = currentTime - new Date(timestamp);
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  // Group columns
  const newOrders = orders.filter(o => o.status === "Received" || o.status === "Waiter Approved");
  const preparingOrders = orders.filter(o => o.status === "Preparing");
  const readyOrders = orders.filter(o => o.status === "Ready");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      
      {/* KDS Header bar - Dark theme fit for industrial screens */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-sm animate-pulse">
            <ChefHatIcon className="h-6 w-6" />
          </div>
          <div className="text-left">
            <span className="font-black text-lg tracking-tight uppercase block leading-none">
              Kitchen Display (KDS)
            </span>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1 block">
              Dine-In Kitchen Terminal #1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Local Server Time</span>
            <span className="text-sm font-mono font-bold text-slate-350">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-300 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Columns Grid */}
      <main className="flex-grow p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch overflow-hidden">
        
        {/* COLUMN 1: NEW ORDERS (RECEIVED) */}
        <section className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-none">
            <div className="text-left space-y-0.5">
              <h2 className="text-sm uppercase tracking-widest font-black text-slate-400">1. New Orders</h2>
              <p className="text-[10px] text-slate-600">Pending chef acceptance</p>
            </div>
            <span className="bg-slate-800 text-white font-mono text-xs px-2.5 py-1 rounded-full font-black">
              {newOrders.length}
            </span>
          </div>

          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : newOrders.length > 0 ? (
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 no-scrollbar max-h-[70vh]">
              {newOrders.map((order) => {
                const elapsed = getElapsedMins(order.timestamp);
                const isDelayed = elapsed >= 15;
                return (
                  <div key={order._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4 text-left">
                    <div className="space-y-3">
                      
                      {/* Card Header Info */}
                      <div className="flex justify-between items-start pb-2.5 border-b border-slate-800">
                        <span className="text-base font-black text-white">{order.tableId}</span>
                        <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isDelayed ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30" : "bg-slate-800 text-slate-400"
                        }`}>
                          <ClockIcon className="w-3.5 h-3.5" /> {elapsed}m ago
                        </div>
                      </div>

                      {/* Items Checklist */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => toggleCheckedItem(order._id, idx)}
                            className="flex items-start gap-2.5 py-1 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={!!checkedItems[`${order._id}_${idx}`]}
                              readOnly
                              className="h-4.5 w-4.5 rounded-md border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 mt-0.5"
                            />
                            <div className="text-left space-y-0.5">
                              <span className={`text-sm font-bold ${
                                checkedItems[`${order._id}_${idx}`] ? "line-through text-slate-600" : "text-slate-200"
                              }`}>
                                {item.qty}x {item.name}
                              </span>
                              {item.instructions && (
                                <p className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                  ⚠️ Instruction: "{item.instructions}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order general note */}
                      {order.customerNotes && (
                        <div className="bg-blue-500/10 border border-blue-500/25 p-2 rounded-xl text-[10px] font-semibold text-blue-400">
                          Note: "{order.customerNotes}"
                        </div>
                      )}
                    </div>

                    {/* Touch Action Button */}
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Preparing")}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer text-center"
                    >
                      Start Prep 🍳
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-center items-center py-20 text-slate-600">
              <CheckCircleIcon className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs font-semibold">No new orders in queue.</p>
            </div>
          )}
        </section>

        {/* COLUMN 2: PREPARING (COOKING) */}
        <section className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-none">
            <div className="text-left space-y-0.5">
              <h2 className="text-sm uppercase tracking-widest font-black text-slate-400">2. Preparing</h2>
              <p className="text-[10px] text-slate-600">Chefs cooking dishes</p>
            </div>
            <span className="bg-amber-500/20 text-amber-400 font-mono text-xs px-2.5 py-1 rounded-full font-black border border-amber-500/30 animate-pulse">
              {preparingOrders.length}
            </span>
          </div>

          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : preparingOrders.length > 0 ? (
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 no-scrollbar max-h-[70vh]">
              {preparingOrders.map((order) => {
                const elapsed = getElapsedMins(order.timestamp);
                const isDelayed = elapsed >= 15;
                return (
                  <div key={order._id} className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between gap-4 text-left">
                    <div className="space-y-3">
                      
                      {/* Card Header Info */}
                      <div className="flex justify-between items-start pb-2.5 border-b border-slate-800">
                        <span className="text-base font-black text-white">{order.tableId}</span>
                        <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isDelayed ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30" : "bg-slate-800 text-slate-400"
                        }`}>
                          <ClockIcon className="w-3.5 h-3.5" /> {elapsed}m cooking
                        </div>
                      </div>

                      {/* Items Checklist */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => toggleCheckedItem(order._id, idx)}
                            className="flex items-start gap-2.5 py-1 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={!!checkedItems[`${order._id}_${idx}`]}
                              readOnly
                              className="h-4.5 w-4.5 rounded-md border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 mt-0.5"
                            />
                            <div className="text-left space-y-0.5">
                              <span className={`text-sm font-bold ${
                                checkedItems[`${order._id}_${idx}`] ? "line-through text-slate-600" : "text-slate-200"
                              }`}>
                                {item.qty}x {item.name}
                              </span>
                              {item.instructions && (
                                <p className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                  ⚠️ Instruction: "{item.instructions}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order general note */}
                      {order.customerNotes && (
                        <div className="bg-blue-500/10 border border-blue-500/25 p-2 rounded-xl text-[10px] font-semibold text-blue-400">
                          Note: "{order.customerNotes}"
                        </div>
                      )}
                    </div>

                    {/* Touch Action Button */}
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Ready")}
                      className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer text-center"
                    >
                      Mark Ready 🔔
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-center items-center py-20 text-slate-600">
              <ChefHatIcon className="w-9 h-9 mb-2 opacity-40" />
              <p className="text-xs font-semibold">No orders currently preparing.</p>
            </div>
          )}
        </section>

        {/* COLUMN 3: READY ORDERS */}
        <section className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-none">
            <div className="text-left space-y-0.5">
              <h2 className="text-sm uppercase tracking-widest font-black text-slate-400">3. Ready</h2>
              <p className="text-[10px] text-slate-600">Waiting for runner service</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-full font-black border border-emerald-500/30">
              {readyOrders.length}
            </span>
          </div>

          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : readyOrders.length > 0 ? (
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 no-scrollbar max-h-[70vh]">
              {readyOrders.map((order) => {
                const elapsed = getElapsedMins(order.timestamp);
                return (
                  <div key={order._id} className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between gap-4 text-left">
                    <div className="space-y-3">
                      
                      {/* Card Header Info */}
                      <div className="flex justify-between items-start pb-2.5 border-b border-slate-800">
                        <span className="text-base font-black text-white">{order.tableId}</span>
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Ready to Serve
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs py-1">
                            <span className="text-slate-300 font-bold">{item.qty}x {item.name}</span>
                            {item.instructions && (
                              <span className="text-[9px] text-amber-400 font-medium">({item.instructions})</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.customerNotes && (
                        <div className="bg-slate-850 p-2 rounded-xl text-[10px] text-slate-400 leading-normal">
                          Note: "{order.customerNotes}"
                        </div>
                      )}
                    </div>

                    {/* Touch Action Button */}
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Served")}
                      className="w-full bg-slate-800 hover:bg-slate-750 active:scale-95 text-slate-300 font-extrabold text-xs py-3 rounded-xl border border-slate-700 transition-all cursor-pointer text-center"
                    >
                      Serve & Settle ✓
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-center items-center py-20 text-slate-600">
              <CheckCircleIcon className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs font-semibold">No ready orders waiting.</p>
            </div>
          )}
        </section>

      </main>

    </div>
  );
}
