"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCodeIcon, ChefHatIcon, TableIcon, ClockIcon, ChartIcon, CheckCircleIcon, XIcon, SparklesIcon } from "../../../components/Icons";

export default function WaiterDashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ready Notification State
  const [notifiedReady, setNotifiedReady] = useState({}); // { [orderId]: true }

  // Edit Drawer
  const [editingOrder, setEditingOrder] = useState(null); // order object or null
  const [editForm, setEditForm] = useState({
    items: [],
    customerNotes: "",
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);

        // Check if there are newly ready orders to trigger a notification
        data.forEach(order => {
          if (order.status === "Ready" && !notifiedReady[order._id]) {
            // Trigger visual alert
            setNotifiedReady(prev => ({ ...prev, [order._id]: true }));
          }
        });
      }
    } catch (e) {
      console.error("Failed to load waiter orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll orders database every 4 seconds
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [notifiedReady]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 1200);
  };

  // Open Edit drawer
  const openEditDrawer = (order) => {
    setEditingOrder(order);
    setEditForm({
      items: order.items.map(i => ({ ...i })), // deep copy
      customerNotes: order.customerNotes || "",
    });
  };

  // Drawer quantity adjustments
  const handleQtyChange = (idx, amount) => {
    const updated = [...editForm.items];
    const nextQty = updated[idx].qty + amount;
    if (nextQty <= 0) return;
    updated[idx].qty = nextQty;
    setEditForm(prev => ({ ...prev, items: updated }));
  };

  const handleRemoveItem = (idx) => {
    const updated = editForm.items.filter((_, i) => i !== idx);
    setEditForm(prev => ({ ...prev, items: updated }));
  };

  const handleInstructionChange = (idx, value) => {
    const updated = [...editForm.items];
    updated[idx].instructions = value;
    setEditForm(prev => ({ ...prev, items: updated }));
  };

  // Calculate total price in edit form
  const getEditFormTotal = () => {
    return editForm.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  };

  // 1. Confirm Order (Pending -> Waiter Approved / Received)
  const handleConfirmOrder = async () => {
    if (editForm.items.length === 0) {
      alert("Order cannot be empty. Reject order instead.");
      return;
    }

    try {
      const updatedTotal = getEditFormTotal();
      const res = await fetch(`/api/orders/${editingOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Received", // Waiter Approved maps to Received stage
          items: editForm.items,
          total: updatedTotal,
          customerNotes: editForm.customerNotes,
        })
      });

      if (res.ok) {
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error("Confirm Order Error:", e);
    }
  };

  // 2. Deliver & Serve Order (Ready -> Served)
  const handleMarkServed = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Served" })
      });
      if (res.ok) {
        // Clear ready notification
        setNotifiedReady(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        fetchOrders();
      }
    } catch (e) {
      console.error("Mark Served Error:", e);
    }
  };

  // 3. Reject Order (DELETE)
  const handleRejectOrder = async (id) => {
    if (!confirm("Are you sure you want to REJECT and delete this guest order?")) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error("Reject Order Error:", e);
    }
  };

  const pendingOrders = orders.filter(o => o.status === "Pending");
  const cookingOrders = orders.filter(o => o.status === "Received" || o.status === "Waiter Approved" || o.status === "Preparing" || o.status === "Cooking");
  const readyOrders = orders.filter(o => o.status === "Ready");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-xs">
            <ClockIcon className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight">
            Waiter Console <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 font-extrabold px-2 py-0.5 rounded-md ml-1 border border-slate-200/50 uppercase">WAITSTAFF</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Logged in as waiter@cafe.com</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition-all active:scale-95 transition-colors cursor-pointer"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Flashing Ready Alerts Banner */}
        {readyOrders.length > 0 && (
          <div className="bg-emerald-500 text-white border border-emerald-400 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-emerald-500/20 animate-pulse text-left w-full">
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none">🛎️</span>
              <div>
                <h4 className="font-black text-sm">Dishes Ready for Table Runners!</h4>
                <p className="text-xs text-emerald-100">
                  {readyOrders.map(o => o.tableId).join(", ")} are ready in KDS. Deliver immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {readyOrders.map(o => (
                <button
                  key={o._id}
                  onClick={() => handleMarkServed(o._id)}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl px-3 py-1.5 text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Deliver {o.tableId} ✓
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Pending approvals */}
          <section className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">New Table Requests</h2>
              <p className="text-xs text-slate-400">Diner tickets waiting for waiter confirmation before kitchen routing.</p>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400 mt-3">Loading orders...</p>
              </div>
            ) : pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden transition-all hover:scale-[1.01]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-md">
                          {order.tableId}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {order.items.map((i, idx) => (
                          <span key={idx} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800 px-2 py-0.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-350">
                            {i.qty}x {i.name}
                          </span>
                        ))}
                      </div>

                      {order.customerNotes && (
                        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold italic">Note: "{order.customerNotes}"</p>
                      )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleRejectOrder(order._id)}
                        className="flex-1 sm:flex-none border border-slate-250 dark:border-slate-850 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => openEditDrawer(order)}
                        className="flex-1 sm:flex-none bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Review & Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl text-center">
                <CheckCircleIcon className="w-8 h-8 mx-auto text-emerald-500 opacity-60 mb-2 animate-bounce" />
                <p className="text-slate-400 text-sm font-medium">All new diner orders are approved!</p>
              </div>
            )}
          </section>

          {/* Right Column: Active queues - Kitchen and Ready items */}
          <section className="lg:col-span-5 space-y-6 text-left">
            
            {/* Ready to Deliver Column */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-sm uppercase tracking-widest font-black text-emerald-600 dark:text-emerald-400">🛎️ Ready to Deliver</h2>
                <p className="text-[10px] text-slate-400">Dishes ready to serve to table</p>
              </div>

              {readyOrders.length > 0 ? (
                <div className="space-y-3">
                  {readyOrders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-pulse">
                      <div className="text-left space-y-1">
                        <span className="font-black text-sm text-slate-900 dark:text-white block">{order.tableId}</span>
                        <p className="text-[11px] text-slate-400">
                          {order.items.map(i => `${i.qty}x ${i.name}`).join(", ")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleMarkServed(order._id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
                      >
                        Serve ✓
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl text-center">
                  <p className="text-slate-400 text-xs">No pending deliveries.</p>
                </div>
              )}
            </div>

            {/* Kitchen Queue */}
            <div className="space-y-4 pt-4">
              <div className="space-y-0.5">
                <h2 className="text-sm uppercase tracking-widest font-black text-slate-400">👨‍🍳 Cooking Queue</h2>
                <p className="text-[10px] text-slate-400">Tickets currently in preparation</p>
              </div>

              {cookingOrders.length > 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cookingOrders.map((order) => (
                      <div key={order._id} className="p-4 flex items-center justify-between gap-4 text-xs font-medium">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-950 dark:text-white">{order.tableId}</span>
                            <span className="inline-flex px-1.5 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-400 leading-tight">
                            {order.items.map(i => `${i.qty}x ${i.name}`).join(", ")}
                          </p>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl text-center">
                  <p className="text-slate-400 text-xs">No active kitchen orders.</p>
                </div>
              )}
            </div>

          </section>

        </div>
      </main>

      {/* -------------------- REVIEW EDIT DRAWER MODAL -------------------- */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review Diner Ticket</h3>
                <p className="text-xs text-slate-400 mt-0.5">Table {editingOrder.tableId} session validation</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* List of items inside order */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {editForm.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-200/50 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs font-bold shadow-3xs">
                        <button onClick={() => handleQtyChange(idx, -1)} className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 rounded-full">-</button>
                        <span className="w-4 text-center">{item.qty}</span>
                        <button onClick={() => handleQtyChange(idx, 1)} className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 rounded-full">+</button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-600 text-xs font-bold p-1"
                        title="Remove dish"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.instructions || ""}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    className="block w-full rounded-xl border border-slate-200/80 dark:border-slate-850 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs focus:outline-none placeholder-slate-400"
                    placeholder="Add special instructions (e.g. no spice, extra cheese)..."
                  />
                </div>
              ))}
            </div>

            {/* Customer Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Customer Notes</label>
              <textarea
                rows="2"
                value={editForm.customerNotes}
                onChange={(e) => setEditForm(prev => ({ ...prev, customerNotes: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                placeholder="Nut allergies, bill splitting requests, seating details..."
              />
            </div>

            {/* Total Price display */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recalculated Total</span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">${getEditFormTotal().toFixed(2)}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRejectOrder(editingOrder._id)}
                  className="rounded-xl border border-slate-250 dark:border-slate-850 hover:bg-red-50 hover:text-red-600 text-slate-500 px-4 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Reject Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Approve & Send 🍳
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
