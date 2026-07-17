"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCodeIcon, ChefHatIcon, TableIcon, ClockIcon, ChartIcon, CheckCircleIcon, XIcon, SparklesIcon } from "../../../components/Icons";

export default function WaiterDashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Ready Notification State
  const [notifiedReady, setNotifiedReady] = useState({}); // { [orderId]: true }
  const [restaurantProfile, setRestaurantProfile] = useState(null);

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

  // New Order on Behalf States
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
  const [newOrderTable, setNewOrderTable] = useState("T1");
  const [newOrderCart, setNewOrderCart] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");

  // Edit Drawer
  const [editingOrder, setEditingOrder] = useState(null); // order object or null
  const [editForm, setEditForm] = useState({
    items: [],
    customerNotes: "",
  });

  const fetchOrders = async () => {
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      const res = await fetch(`/api/orders?restaurantId=${restId}`);
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

  const fetchMenu = async () => {
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      if (!restId) return;
      const res = await fetch(`/api/menu?restaurantId=${restId}`);
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (e) {
      console.error("Failed to fetch menu in waiter portal:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      if (!restId) return;
      const res = await fetch(`/api/categories?restaurantId=${restId}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Failed to fetch categories in waiter portal:", e);
    }
  };

  const fetchRestaurantProfile = async () => {
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      if (!restId) return;
      const res = await fetch(`/api/restaurants/${restId}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurantProfile(data);
      }
    } catch (e) {
      console.error("Failed to fetch restaurant profile in waiter portal:", e);
    }
  };

  const addToNewOrderCart = (item) => {
    setNewOrderCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => (i._id === item._id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { name: item.name, price: item.price, _id: item._id, qty: 1 }];
    });
  };

  const removeFromNewOrderCart = (itemId) => {
    setNewOrderCart((prev) => {
      const existing = prev.find((i) => i._id === itemId);
      if (!existing) return prev;
      if (existing.qty === 1) {
        return prev.filter((i) => i._id !== itemId);
      }
      return prev.map((i) => (i._id === itemId ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const handlePlaceOrderBehalf = async () => {
    if (newOrderCart.length === 0) return;
    setPlacingOrder(true);
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      const total = newOrderCart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
      const itemsPayload = newOrderCart.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.price
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: newOrderTable,
          items: itemsPayload,
          total,
          restaurantId: restId,
          status: "Received" // Approve immediately
        })
      });

      if (res.ok) {
        setNewOrderCart([]);
        setShowPlaceOrderModal(false);
        fetchOrders();
      } else {
        alert("Failed to submit order.");
      }
    } catch (e) {
      console.error("Error placing order on behalf:", e);
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchRestaurantProfile();
    fetchOrders();
    fetchMenu();
    fetchCategories();
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

  if (!isMounted) return null;

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
            onClick={() => {
              setNewOrderTable("T1");
              setNewOrderCart([]);
              setMenuSearch("");
              setShowPlaceOrderModal(true);
            }}
            className="rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span> Place Order
          </button>
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
                        <span className="font-black text-slate-900 dark:text-white">{getCurrencySymbol()}{order.total.toFixed(2)}</span>
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
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{getCurrencySymbol()}{getEditFormTotal().toFixed(2)}</p>
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
      {/* Place Order Modal */}
      {showPlaceOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-scale-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] text-left">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex-none">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">🛎️ Place Order on Behalf of Customer</h3>
                <p className="text-[10px] text-slate-400">Select a table, filter by category, and add menu items for direct kitchen routing.</p>
              </div>
              <button
                onClick={() => setShowPlaceOrderModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Core Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden flex-grow">
              
              {/* Left & Middle Column (8 cols): Table, Search & Two-Column Category Menu picker */}
              <div className="lg:col-span-8 flex flex-col space-y-4 overflow-hidden">
                
                {/* Table Select + Search Bar */}
                <div className="flex gap-3 items-center flex-none bg-slate-50 dark:bg-zinc-955 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850">
                  <div className="w-1/3">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Dine-In Table</label>
                    <select
                      value={newOrderTable}
                      onChange={(e) => setNewOrderTable(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
                    >
                      {Array.from({ length: 20 }, (_, i) => `T${i + 1}`).map(t => (
                        <option key={t} value={t}>Table {t.replace("T", "")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Search Menu Items</label>
                    <input
                      type="text"
                      placeholder="Type dish name or category to search..."
                      value={menuSearch}
                      onChange={(e) => {
                        setMenuSearch(e.target.value);
                        if (e.target.value !== "" && activeCategory !== "All") {
                          setActiveCategory("All"); // Reset to global search if typing
                        }
                      }}
                      className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* Two-Column Category selector + Dishes List */}
                <div className="grid grid-cols-12 gap-4 flex-grow overflow-hidden">
                  
                  {/* Category Sidebar Navigation */}
                  <div className="col-span-4 bg-slate-50 dark:bg-zinc-955 border border-slate-200/50 dark:border-slate-850 p-2 rounded-2xl overflow-y-auto space-y-1.5 no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setActiveCategory("All")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === "All"
                          ? "bg-brand-500 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-800"
                      }`}
                    >
                      📖 All Dishes
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => setActiveCategory(cat.name)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCategory.toLowerCase() === cat.name.toLowerCase()
                            ? "bg-brand-500 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-800"
                        }`}
                      >
                        🏷️ {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Filtered Dishes Grid scrollable viewport with images */}
                  <div className="col-span-8 overflow-y-auto pr-1 no-scrollbar">
                    {menuItems.filter(item => {
                      const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                                            item.category.toLowerCase().includes(menuSearch.toLowerCase());
                      const matchesCategory = activeCategory === "All" || 
                                              item.category.toLowerCase() === activeCategory.toLowerCase();
                      return matchesSearch && matchesCategory;
                    }).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {menuItems.filter(item => {
                          const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                                                item.category.toLowerCase().includes(menuSearch.toLowerCase());
                          const matchesCategory = activeCategory === "All" || 
                                                  item.category.toLowerCase() === activeCategory.toLowerCase();
                          return matchesSearch && matchesCategory;
                        }).map((item) => {
                          const qtyInCart = newOrderCart.find(i => i._id === item._id)?.qty || 0;
                          return (
                            <div key={item._id} className="bg-slate-50 dark:bg-zinc-955 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-all text-xs shadow-3xs group">
                              
                              {/* Dish Image container */}
                              <div className="relative h-20 sm:h-24 w-full bg-slate-100 dark:bg-zinc-900 overflow-hidden flex-none">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center text-2xl select-none">
                                    🍔
                                  </div>
                                )}
                                
                                {/* Veg/Non-Veg tag */}
                                <span className={`absolute top-2 left-2 inline-flex items-center justify-center w-4 h-4 border bg-white dark:bg-zinc-900 rounded-sm font-black text-[9px] ${
                                  item.isVeg ? "border-emerald-500 text-emerald-500" : "border-red-500 text-red-500"
                                }`}>
                                  {item.isVeg ? "V" : "N"}
                                </span>
                                
                                {/* Price tag */}
                                <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                  {getCurrencySymbol()}{item.price.toFixed(2)}
                                </span>
                              </div>

                              {/* Content details */}
                              <div className="p-2 flex-grow flex flex-col justify-between space-y-1.5 text-left">
                                <div className="space-y-0.5">
                                  <h4 className="font-extrabold text-[10px] sm:text-[11px] text-slate-900 dark:text-white line-clamp-1 leading-tight">{item.name}</h4>
                                  <p className="text-[9px] text-slate-400 font-semibold">{item.category}</p>
                                </div>

                                <div className="pt-1 flex-none">
                                  {qtyInCart > 0 ? (
                                    <div className="flex items-center justify-between bg-brand-500 text-white rounded-xl p-0.5 font-bold shadow-xs">
                                      <button
                                        type="button"
                                        onClick={() => removeFromNewOrderCart(item._id)}
                                        className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-md text-xs font-black"
                                      >
                                        -
                                      </button>
                                      <span className="text-[10px] select-none">{qtyInCart}</span>
                                      <button
                                        type="button"
                                        onClick={() => addToNewOrderCart(item)}
                                        className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-md text-xs font-black"
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => addToNewOrderCart(item)}
                                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl text-[9px] font-extrabold shadow-3xs cursor-pointer text-center"
                                    >
                                      Add +
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 py-16 text-xs bg-slate-50 dark:bg-zinc-955 rounded-2xl">No dishes found in category matching filter.</p>
                    )}
                  </div>

                </div>

              </div>

              {/* Right Column (4 cols): Cart summary */}
              <div className="lg:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-150 dark:border-slate-800 lg:pl-6 pt-4 lg:pt-0 overflow-hidden">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex-none pb-3 border-b border-slate-100 dark:border-slate-800/80">📋 Selected Items Summary</h4>
                
                <div className="overflow-y-auto flex-grow space-y-2.5 py-3 pr-1 no-scrollbar">
                  {newOrderCart.length > 0 ? (
                    newOrderCart.map((i) => (
                      <div key={i._id} className="flex justify-between items-center text-xs">
                        <div className="text-left">
                          <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{i.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{i.qty} x {getCurrencySymbol()}{i.price.toFixed(2)}</span>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">{getCurrencySymbol()}{(i.price * i.qty).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 text-center space-y-2">
                      <span className="text-2xl">🛒</span>
                      <p className="text-[11px]">Your order list is empty. Add dishes from the categories picker on the left.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex-none space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">Dine-In {newOrderTable.replace("T", "Table ")}</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      Total: {getCurrencySymbol()}{newOrderCart.reduce((acc, curr) => acc + curr.price * curr.qty, 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPlaceOrderModal(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={placingOrder || newOrderCart.length === 0}
                      onClick={handlePlaceOrderBehalf}
                      className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-md disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {placingOrder ? "Placing..." : "Confirm & Send 🍳"}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
