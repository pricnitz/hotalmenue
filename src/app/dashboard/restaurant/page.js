"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { QrCodeIcon, ChefHatIcon, TableIcon, ClockIcon, ChartIcon, CheckCircleIcon, SparklesIcon, MailIcon, PhoneIcon, MapPinIcon } from "../../../components/Icons";

const QRCodeImage = ({ value }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!value) return;
    let absoluteUrl = value;
    if (value.startsWith("/")) {
      if (typeof window !== "undefined") {
        absoluteUrl = window.location.origin + value;
      }
    }
    QRCode.toDataURL(absoluteUrl, { margin: 1, width: 256 })
      .then((url) => setSrc(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [value]);

  if (!src) {
    return <div className="w-full h-full bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />;
  }

  return (
    <img
      src={src}
      alt="QR Code"
      className="w-full h-full object-contain rounded-2xl"
    />
  );
};

export default function RestaurantDashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "menu", "tables", "staff", "analytics", or "settings"

  // Restaurant Admin State (Profiles, Contacts, Branding)
  const [profile, setProfile] = useState({
    restaurantName: "Cafe Aroma",
    ownerName: "Aarav Sharma",
    phone: "+91 98200 12345",
    email: "aarav@cafearoma.in",
    address: "Plot 42, Bandra Reclamation, Bandra West, Mumbai, MH 400050",
    gstNumber: "GST27AAACP9934B1Z3",
    logoEmoji: "☕",
    logo: "",
    currency: "INR",
    themeColor: "orange",
  });

  // DB States
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Table QR codes count and live domain state
  const [tableCount, setTableCount] = useState(20);
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [generatedTables, setGeneratedTables] = useState([]);

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState("");

  // New Menu Item Form State
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    category: "Mains",
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    description: "",
    image: "",
  });

  // New Category Form State
  const [categoryName, setCategoryName] = useState("");
  const [categorySvg, setCategorySvg] = useState("");

  // Editing Category State
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategorySvg, setEditCategorySvg] = useState("");

  // Category Filter for Active Menu Items
  const [selectedDashboardCategory, setSelectedDashboardCategory] = useState("All");

  // Editing Menu Item State
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Staff Management State
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    emailUsername: "",
    password: "",
    phone: "",
    role: "waiter",
  });
  const [editingStaff, setEditingStaff] = useState(null);

  const getSubdomain = () => {
    const fallback = profile.restaurantName
      ? profile.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "restaurant";
    if (!profile.address) return fallback;
    const match = profile.address.match(/Subdomain:\s*([^\s\/]+)/i);
    return match ? match[1] : fallback;
  };

  const getCurrencySymbol = () => {
    const code = profile.currency || "INR";
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "د.إ",
    };
    return symbols[code] || "₹";
  };

  const fetchRestaurantProfile = async () => {
    try {
      const restId = localStorage.getItem("restaurantId");
      if (!restId) return;

      const res = await fetch(`/api/restaurants/${restId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          restaurantName: data.name || "Cafe Aroma",
          ownerName: data.ownerName || "Aarav Sharma",
          phone: data.phone || "+91 98200 12345",
          email: data.email || "aarav@cafearoma.in",
          address: data.address || "Plot 42, Bandra Reclamation, Bandra West, Mumbai, MH 400050",
          gstNumber: data.gstNumber || "GST27AAACP9934B1Z3",
          logoEmoji: data.logoEmoji || "☕",
          logo: data.logo || "",
          currency: data.currency || "INR",
          themeColor: data.themeColor || "orange",
        });
      }
    } catch (e) {
      console.error("Failed to load restaurant profile:", e);
    }
  };

  // Fetch all databases from MongoDB API
  const fetchDbData = async () => {
    try {
      setLoadingDb(true);
      const restId = localStorage.getItem("restaurantId") || "";
      const [menuRes, catRes, orderRes] = await Promise.all([
        fetch(`/api/menu?restaurantId=${restId}`),
        fetch(`/api/categories?restaurantId=${restId}`),
        fetch(`/api/orders?restaurantId=${restId}`)
      ]);

      if (menuRes.ok && catRes.ok && orderRes.ok) {
        const menuData = await menuRes.json();
        const catData = await catRes.json();
        const orderData = await orderRes.json();

        setMenuItems(menuData);
        setCategories(catData);
        setOrders(orderData);

        if (catData.length > 0 && !itemForm.category) {
          setItemForm(prev => ({ ...prev, category: catData[0].name }));
        }
      }
    } catch (e) {
      console.error("Failed to load restaurant databases:", e);
    } finally {
      setLoadingDb(false);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const restId = localStorage.getItem("restaurantId") || "";
      if (!restId) return;
      const res = await fetch(`/api/staff?restaurantId=${restId}`);
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error("Failed to load staff list:", err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const getStaffDomain = () => {
    if (!profile.restaurantName) return "restaurant.com";
    const slug = profile.restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""); // Remove spaces and special characters
    return `${slug}.com`;
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.emailUsername || !staffForm.password || !staffForm.role) {
      alert("Username, Password, and Role are required.");
      return;
    }
    const finalEmail = `${staffForm.emailUsername.trim()}@${getStaffDomain()}`;
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...staffForm, email: finalEmail, restaurantId: restId }),
      });
      if (res.ok) {
        setStaffForm({
          name: "",
          emailUsername: "",
          password: "",
          phone: "",
          role: "waiter",
        });
        fetchStaff();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add staff member");
      }
    } catch (err) {
      console.error("Failed to create staff member:", err);
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff || !editingStaff.email || !editingStaff.role) {
      alert("Email and Role are required.");
      return;
    }
    try {
      const res = await fetch(`/api/staff/${editingStaff._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingStaff),
      });
      if (res.ok) {
        setEditingStaff(null);
        fetchStaff();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update staff member");
      }
    } catch (err) {
      console.error("Failed to update staff member:", err);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchStaff();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete staff member");
      }
    } catch (err) {
      console.error("Failed to delete staff member:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchRestaurantProfile();
    fetchDbData();
    fetchStaff();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setCustomBaseUrl(origin);
    // Auto-generate tables on initial load with live origin
    generateTablesList(20, origin);
  }, []);

  // Poll database for orders in the background every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const restId = localStorage.getItem("restaurantId") || "";
        const res = await fetch(`/api/orders?restaurantId=${restId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to poll orders:", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 1200);
  };

  const getEffectiveBaseUrl = () => {
    if (customBaseUrl && customBaseUrl.trim() !== "") {
      return customBaseUrl.trim().replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "";
  };

  // Generate Table URLs and session metadata
  const generateTablesList = (count, overrideBaseUrl) => {
    const restId = localStorage.getItem("restaurantId") || "demo";
    const base = overrideBaseUrl !== undefined ? overrideBaseUrl : getEffectiveBaseUrl();
    const cleanBase = base ? base.trim().replace(/\/+$/, "") : "";
    const tList = [];
    for (let i = 1; i <= count; i++) {
      const path = `/table/${restId}/T${i}`;
      const fullUrl = cleanBase ? `${cleanBase}${path}` : (typeof window !== "undefined" ? `${window.location.origin}${path}` : path);
      tList.push({
        id: `T${i}`,
        name: `Table ${i}`,
        path: path,
        url: fullUrl,
      });
    }
    setGeneratedTables(tList);
  };

  const handleTableGenerateSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(tableCount) || 1;
    generateTablesList(count);
  };

  const handleCopyTableUrl = (url, tableName) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url);
      alert(`Copied full QR link for ${tableName}:\n${url}`);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert(`Copied full QR link for ${tableName}:\n${url}`);
    }
  };

  // Serve ticket: Cooking -> Ready to Serve -> Served
  const handleUpdateTicketStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchDbData(); // Reload orders
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleClearTicket = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDbData(); // Reload orders
      }
    } catch (err) {
      console.error("Failed to clear ticket:", err);
    }
  };

  const handleSvgUpload = (file, callback) => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("File size must be less than 1 MB!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, svg: categorySvg, restaurantId: restId })
      });
      if (res.ok) {
        setCategoryName("");
        setCategorySvg("");
        fetchDbData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create category");
      }
    } catch (e) {
      console.error("Category creation error:", e);
    }
  };

  // Add Menu Item
  const handleImageUpload = (file, callback) => {
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
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) return;
    try {
      const restId = localStorage.getItem("restaurantId") || "";
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...itemForm, restaurantId: restId })
      });
      if (res.ok) {
        setItemForm({
          name: "",
          price: "",
          category: categories[0]?.name || "Mains",
          isVeg: true,
          isAvailable: true,
          prepTime: 12,
          description: "",
          image: "",
        });
        fetchDbData();
      } else {
        alert("Failed to add menu item. Review fields.");
      }
    } catch (error) {
      console.error("Menu creation error:", error);
    }
  };

  // Toggle item availability via PUT
  const toggleItemAvailability = async (id, currentVal) => {
    try {
      const item = menuItems.find((i) => i._id === id);
      if (!item) return;

      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isAvailable: !currentVal })
      });
      if (res.ok) {
        setMenuItems(prev => prev.map(i => i._id === id ? { ...i, isAvailable: !currentVal } : i));
      }
    } catch (e) {
      console.error("Toggle item error:", e);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category? Dishes in this category will remain, but their category label will not be managed.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDbData();
      } else {
        alert("Failed to delete category");
      }
    } catch (e) {
      console.error("Category delete error:", e);
    }
  };

  // Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName) return;
    try {
      const res = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName, svg: editCategorySvg })
      });
      if (res.ok) {
        setEditingCategory(null);
        setEditCategoryName("");
        setEditCategorySvg("");
        fetchDbData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update category");
      }
    } catch (e) {
      console.error("Category update error:", e);
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id) => {
    if (!confirm("Are you sure you want to delete this menu dish?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDbData();
      } else {
        alert("Failed to delete menu item");
      }
    } catch (e) {
      console.error("Menu item delete error:", e);
    }
  };

  // Update Menu Item
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    if (!editingMenuItem.name || !editingMenuItem.price) return;
    try {
      const res = await fetch(`/api/menu/${editingMenuItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMenuItem)
      });
      if (res.ok) {
        setEditingMenuItem(null);
        fetchDbData();
      } else {
        alert("Failed to update menu item");
      }
    } catch (e) {
      console.error("Menu item update error:", e);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const restId = localStorage.getItem("restaurantId");
      if (!restId) return;

      const payload = {
        name: profile.restaurantName,
        ownerName: profile.ownerName,
        phone: profile.phone,
        address: profile.address,
        logo: profile.logo,
        currency: profile.currency,
        themeColor: profile.themeColor,
      };

      const res = await fetch(`/api/restaurants/${restId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Restaurant details updated successfully!");
        fetchRestaurantProfile();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update profile details.");
      }
    } catch (e) {
      console.error("Failed to update profile details:", e);
      alert("Error: " + e.message);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus("error: New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("error: Passwords do not match.");
      return;
    }

    setPasswordStatus("success: Password updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordStatus(""), 4000);
  };

  // Dynamic calculations for Widgets
  const totalTables = generatedTables.length;
  const totalMenuItems = menuItems.length;

  const activeOrders = orders.filter(o => o.status !== "Served" && o.status !== "Pending");
  const completedOrders = orders.filter(o => o.status === "Served");

  const activeOrdersCount = activeOrders.length;
  const completedOrdersCount = completedOrders.length;
  const totalOrders = orders.length;

  // 1. Most Ordered Items Tally
  const getItemRankings = () => {
    const counts = {};
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          counts[item.name] = (counts[item.name] || 0) + item.qty;
        });
      }
    });
    const sorted = Object.keys(counts).map(name => ({
      name,
      qty: counts[name]
    })).sort((a, b) => b.qty - a.qty);
    return sorted.slice(0, 4);
  };

  // 2. Table-wise Analytics
  const getTableStats = () => {
    const stats = {};
    orders.forEach(order => {
      const tid = order.tableId;
      if (!stats[tid]) {
        stats[tid] = { count: 0, revenue: 0 };
      }
      stats[tid].count += 1;
      stats[tid].revenue += order.total || 0;
    });
    return Object.keys(stats).map(tableId => ({
      tableId,
      count: stats[tableId].count,
      revenue: stats[tableId].revenue
    })).sort((a, b) => {
      const numA = parseInt(a.tableId.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.tableId.replace(/\D/g, "")) || 0;
      return numA - numB;
    });
  };

  // 3. Average Prep Time (Ready Timestamp - Timestamp) in minutes
  const getAveragePrepTime = () => {
    let totalMins = 0;
    let countedOrders = 0;
    orders.forEach(order => {
      if (order.readyTimestamp && order.timestamp) {
        const ms = new Date(order.readyTimestamp) - new Date(order.timestamp);
        const mins = ms / 60000;
        if (mins >= 0) {
          totalMins += mins;
          countedOrders += 1;
        }
      }
    });
    if (countedOrders === 0) return 10.5; // fallback default representation
    return parseFloat((totalMins / countedOrders).toFixed(1));
  };

  // Brand Theme Styles Maps
  const themeAccentBg = {
    orange: "from-brand-500 to-amber-500 text-white shadow-brand-500/20",
    red: "from-red-600 to-rose-500 text-white shadow-red-500/20",
    green: "from-emerald-500 to-teal-500 text-white shadow-emerald-500/20",
    blue: "from-blue-600 to-sky-500 text-white shadow-blue-500/20",
    charcoal: "from-slate-700 to-slate-900 text-white shadow-slate-700/20",
  };

  const themeText = {
    orange: "text-brand-500",
    red: "text-red-500",
    green: "text-emerald-500",
    blue: "text-blue-500",
    charcoal: "text-slate-800 dark:text-slate-200",
  };

  const themeBorder = {
    orange: "border-brand-500 focus:ring-brand-500",
    red: "border-red-500 focus:ring-red-500",
    green: "border-emerald-500 focus:ring-emerald-500",
    blue: "border-blue-500 focus:ring-blue-500",
    charcoal: "border-slate-700 focus:ring-slate-700",
  };

  const themeButton = {
    orange: "bg-brand-500 hover:bg-brand-600 shadow-brand-500/25",
    red: "bg-red-500 hover:bg-red-600 shadow-red-500/25",
    green: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25",
    blue: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25",
    charcoal: "bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800",
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">

      {/* Dashboard Nav bar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${themeAccentBg[profile.themeColor]} text-white shadow-sm overflow-hidden`}>
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg leading-none">{profile.logoEmoji}</span>
            )}
          </div>
          <span className="font-extrabold text-base tracking-tight">
            {profile.restaurantName}{" "}
            <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 font-extrabold px-2 py-0.5 rounded-md ml-1 border border-slate-200/50 uppercase">
              RESTAURANT PORTAL
            </span>
          </span>
        </div>

        {/* Tab switches */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
          {[
            { id: "overview", label: "Live Floor Manager" },
            { id: "menu", label: "Menu Management" },
            { id: "tables", label: "Table QR Codes" },
            { id: "staff", label: "Staff Profiles" },
            { id: "analytics", label: "Analytics Insights" },
            { id: "settings", label: "Profile Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Mobile navigation tab switches */}
      <div className="lg:hidden flex bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-800 p-2 gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "Floor Console" },
          { id: "menu", label: "Menus" },
          { id: "tables", label: "Table QRs" },
          { id: "staff", label: "Staff" },
          { id: "analytics", label: "Insights" },
          { id: "settings", label: "Profile Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-slate-100 dark:bg-zinc-850 text-slate-900 dark:text-white" : "text-slate-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-grow p-6 space-y-8 max-w-7xl mx-auto w-full">

        {/* Dynamic widgets row (Total Tables, Total Orders, Total Menu Items, Active Orders, Completed Orders) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            { label: "Total Tables", val: totalTables, icon: <TableIcon className="w-5 h-5 text-indigo-500" />, desc: "Seating layout" },
            { label: "Total Orders", val: totalOrders, icon: <ChartIcon className="w-5 h-5 text-emerald-500" />, desc: "Combined orders" },
            { label: "Total Menu Items", val: totalMenuItems, icon: <QrCodeIcon className="w-5 h-5 text-indigo-500" />, desc: "Active items online" },
            { label: "Active Orders", val: activeOrdersCount, icon: <ChefHatIcon className={`w-5 h-5 ${themeText[profile.themeColor]}`} />, desc: "Cooking tickets" },
            { label: "Completed Orders", val: completedOrdersCount, icon: <CheckCircleIcon className="w-5 h-5 text-emerald-500" />, desc: "Served checkouts" },
          ].map((widget, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4 text-left col-span-1">
              <div className="flex-none flex items-center justify-center w-11 h-11 bg-slate-50 dark:bg-zinc-950 rounded-xl hidden sm:flex">
                {widget.icon}
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block leading-none">{widget.label}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{widget.val}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{widget.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* LOADING STATE FOR MONGODB */}
        {loadingDb ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-850 rounded-3xl">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-4">Connecting to local MongoDB...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & FLOOR MANAGER */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dine-in Floor Console (KDS)</h2>
                    <p className="text-xs text-slate-400">Manage orders sent from table QR codes directly to the kitchen display terminals. (Updates every 5s)</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchDbData}
                      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${themeButton[profile.themeColor]}`}
                    >
                      Refresh Queue 🔄
                    </button>
                  </div>
                </div>

                {/* Active Table Tickets */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Dine-in Order Queue</h3>
                  </div>

                  {activeOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-slate-850">
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Source Table</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order Items Cart</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Status</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order Time</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Total</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {activeOrders.map((t) => (
                            <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                              <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{t.tableId}</td>
                              <td className="p-4 text-sm text-slate-500 font-medium">
                                {t.items.map((i, idx) => (
                                  <span key={idx} className="inline-block mr-2.5 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg text-xs">
                                    {i.qty}x {i.name}
                                  </span>
                                ))}
                              </td>
                              <td className="p-4 text-sm">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${t.status === "Ready" || t.status === "Ready to Serve"
                                  ? "bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : t.status === "Preparing" || t.status === "Cooking"
                                    ? "bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-400"
                                    : "bg-amber-100 text-amber-850 dark:bg-amber-950/40 dark:text-amber-400"
                                  }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-4 text-xs font-semibold text-slate-400">
                                {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-4 text-sm font-extrabold text-slate-900 dark:text-white">{getCurrencySymbol()}{t.total.toFixed(2)}</td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {t.status === "Received" || t.status === "Waiter Approved" ? (
                                    <button
                                      onClick={() => handleUpdateTicketStatus(t._id, "Preparing")}
                                      className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                                    >
                                      Start Prep 🍳
                                    </button>
                                  ) : t.status === "Preparing" || t.status === "Cooking" ? (
                                    <button
                                      onClick={() => handleUpdateTicketStatus(t._id, "Ready")}
                                      className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                                    >
                                      Mark Ready 🔔
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdateTicketStatus(t._id, "Served")}
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                                    >
                                      Serve & Settle ✓
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleClearTicket(t._id)}
                                    className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-500 rounded-lg px-2.5 py-1.5 text-xs font-bold hover:text-red-500"
                                    title="Cancel Order"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-50 dark:bg-zinc-900/30 border-t border-slate-100 dark:border-slate-800">
                      <ChefHatIcon className="w-8 h-8 mx-auto text-slate-300 opacity-60 mb-2 animate-bounce" />
                      <p className="text-slate-400 text-sm font-medium">KDS Order queue is empty! Diner tables are fully served.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MENU CATALOG MANAGEMENT */}
            {activeTab === "menu" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 text-left animate-fade-in">

                {/* Left side Forms */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Category Builder */}
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                      1. Create Menu Categories
                    </h3>
                    <form onSubmit={handleCreateCategory} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="flex-grow rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                          placeholder="e.g. Appetizers"
                        />
                        <button
                          type="submit"
                          className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-90 cursor-pointer ${themeButton[profile.themeColor]}`}
                        >
                          Add
                        </button>
                      </div>

                      {/* SVG Picture Upload */}
                      <div className="space-y-1 pt-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Category SVG / Icon (Optional)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".svg,image/svg+xml,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleSvgUpload(file, (base64) => setCategorySvg(base64));
                              }
                            }}
                            className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-zinc-800 dark:file:text-slate-350 cursor-pointer"
                          />
                          {categorySvg && (
                            <div className="relative flex-none">
                              <img src={categorySvg} alt="SVG Preview" className="w-7 h-7 rounded-lg object-contain border border-slate-200 dark:border-slate-800 p-0.5" />
                              <button
                                type="button"
                                onClick={() => setCategorySvg("")}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3.5 h-3.5 text-[8px] flex items-center justify-center font-bold"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                    <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Manage Categories</label>
                      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar text-xs">
                        {categories.map((cat) => (
                          <div key={cat._id} className="flex items-center justify-between bg-slate-50 dark:bg-zinc-950 p-2 rounded-xl border border-slate-150 dark:border-slate-850">
                            {editingCategory && editingCategory._id === cat._id ? (
                              <form onSubmit={handleUpdateCategory} className="flex flex-col gap-2 w-full p-1 bg-white dark:bg-zinc-900 rounded-lg">
                                <div className="flex items-center gap-1 w-full">
                                  <input
                                    type="text"
                                    required
                                    value={editCategoryName}
                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                    className="flex-grow rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-2 py-1 text-[11px] focus:outline-none text-slate-800 dark:text-slate-200"
                                  />
                                  <button
                                    type="submit"
                                    className="px-2 py-1 bg-emerald-500 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="px-2 py-1 bg-slate-200 dark:bg-zinc-850 text-slate-600 dark:text-slate-400 rounded-lg font-bold text-[10px] cursor-pointer"
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    accept=".svg,image/svg+xml,image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleSvgUpload(file, (base64) => setEditCategorySvg(base64));
                                      }
                                    }}
                                    className="block w-full text-[9px] text-slate-500 file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 file:text-slate-700 dark:file:bg-zinc-800 dark:file:text-slate-350 cursor-pointer"
                                  />
                                  {editCategorySvg && (
                                    <img src={editCategorySvg} alt="" className="w-5 h-5 object-contain flex-none border rounded p-0.5" />
                                  )}
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 overflow-hidden">
                                  {cat.svg ? (
                                    <img src={cat.svg} alt="" className="w-5 h-5 object-contain flex-none border border-slate-200 dark:border-slate-800 rounded p-0.5" />
                                  ) : (
                                    <span className="text-[11px] flex-none">📁</span>
                                  )}
                                  <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase text-[10px] truncate">{cat.name}</span>
                                </div>
                                <div className="flex gap-2 flex-none">
                                  <button
                                    onClick={() => {
                                      setEditingCategory(cat);
                                      setEditCategoryName(cat.name);
                                      setEditCategorySvg(cat.svg || "");
                                    }}
                                    className="text-slate-400 hover:text-brand-500 font-bold cursor-pointer text-[10px]"
                                    title="Edit Category"
                                  >
                                    ✎
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat._id)}
                                    className="text-slate-400 hover:text-red-500 font-bold cursor-pointer text-[10px]"
                                    title="Delete Category"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Menu Item Builder */}

                </div>

                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                      2. Add Dish to Menu
                    </h3>
                    <form onSubmit={handleAddMenuItem} className="space-y-3.5">

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dish Name</label>
                        <input
                          type="text"
                          required
                          value={itemForm.name}
                          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                          placeholder="e.g. Cheese Fries"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Price ({getCurrencySymbol()})</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={itemForm.price}
                            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                            placeholder="6.99"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                          <select
                            value={itemForm.category}
                            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:outline-none text-slate-700 dark:text-slate-300"
                          >
                            {categories.map((cat, i) => (
                              <option key={i} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diet Tag</label>
                          <select
                            value={itemForm.isVeg ? "veg" : "nonveg"}
                            onChange={(e) => setItemForm({ ...itemForm, isVeg: e.target.value === "veg" })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:outline-none text-slate-700 dark:text-slate-300"
                          >
                            <option value="veg">🟢 Veg</option>
                            <option value="nonveg">🔴 Non-Veg</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prep Speed (mins)</label>
                          <input
                            type="number"
                            required
                            value={itemForm.prepTime}
                            onChange={(e) => setItemForm({ ...itemForm, prepTime: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                            placeholder="12"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dish Description</label>
                        <textarea
                          rows="2"
                          value={itemForm.description}
                          onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                          placeholder="Allergies warnings, taste details..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dish Picture (PNG only, max 1MB)</label>

                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (base64) => {
                                  setItemForm({ ...itemForm, image: base64 });
                                });
                              }
                            }}
                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-zinc-800 dark:file:text-slate-350 cursor-pointer"
                          />
                          {itemForm.image && (
                            <img
                              src={itemForm.image}
                              alt="Preview"
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800 flex-none"
                            />
                          )}
                        </div>
                        <p className="text-[8px] text-gray-500">Upload transparent image (PNG only)</p>
                      </div>

                      <button
                        type="submit"
                        className={`w-full rounded-xl py-3 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer ${themeButton[profile.themeColor]}`}
                      >
                        Publish Menu Dish
                      </button>

                    </form>
                  </div>
                </div>

                {/* Right side items list */}
                <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col">
                  <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Digital Menu Items</h3>
                      <span className="text-xs text-slate-400 font-semibold">{totalMenuItems} dishes online</span>
                    </div>

                    {/* Dashboard Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedDashboardCategory("All")}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                          selectedDashboardCategory === "All"
                            ? "bg-brand-500 text-white"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        All ({totalMenuItems})
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => setSelectedDashboardCategory(cat.name)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedDashboardCategory.trim().toLowerCase() === cat.name.trim().toLowerCase()
                              ? "bg-brand-500 text-white"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {cat.svg && <img src={cat.svg} alt="" className="w-3 h-3 object-contain flex-none" />}
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-y-auto space-y-4 max-h-[500px] pr-2 pt-4 no-scrollbar">
                    {menuItems.filter((item) => {
                      if (selectedDashboardCategory === "All") return true;
                      return item.category && item.category.trim().toLowerCase() === selectedDashboardCategory.trim().toLowerCase();
                    }).map((item) => (
                      <div key={item._id} className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">

                        {/* Optional thumbnail preview */}
                        {item.image && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-none border border-slate-200/50 dark:border-slate-850">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="text-left space-y-1 flex-grow">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center justify-center w-4.5 h-4.5 border rounded-sm font-bold text-[9px] ${item.isVeg ? "border-emerald-500 text-emerald-500" : "border-red-500 text-red-500"
                              }`}>
                              {item.isVeg ? "V" : "N"}
                            </span>
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">{item.name}</span>
                            <span className="text-[10px] text-brand-500 font-bold bg-brand-50 dark:bg-brand-950/20 px-2 py-0.5 rounded-md uppercase">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 max-w-lg leading-relaxed line-clamp-1">{item.description}</p>
                          <div className="flex gap-4 text-[10px] text-slate-400 font-semibold">
                            <span>Price: <span className="text-slate-800 dark:text-white font-extrabold">{getCurrencySymbol()}{item.price.toFixed(2)}</span></span>
                            <span>Prep Time: <span className="text-slate-800 dark:text-white font-extrabold">{item.prepTime} min</span></span>
                          </div>
                        </div>

                        {/* Actions & Availability */}
                        <div className="flex items-center gap-4 flex-none">
                          {/* Availability Toggler */}
                          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-slate-800 px-2 py-1 rounded-xl shadow-3xs">
                            <button
                              onClick={() => toggleItemAvailability(item._id, item.isAvailable)}
                              className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.isAvailable ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-700"
                                }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${item.isAvailable ? "translate-x-3" : "translate-x-0"
                                  }`}
                              />
                            </button>
                            <span className="text-[8px] font-bold uppercase text-slate-400">Available</span>
                          </div>

                          {/* Edit / Delete Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingMenuItem(item)}
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
                              title="Edit Item"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-955/40 flex items-center justify-center text-xs font-bold text-red-500 transition-all active:scale-95 cursor-pointer"
                              title="Delete Item"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Menu Item Modal Overlay */}
                {editingMenuItem && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in text-slate-800 dark:text-slate-200">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-xl w-full max-w-lg animate-scale-in text-left flex flex-col max-h-[90vh]">

                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex-none">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">📝 Edit Menu Dish</h3>
                        <button
                          onClick={() => setEditingMenuItem(null)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-black cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleUpdateMenuItem} className="space-y-4 text-xs font-semibold text-slate-500 overflow-y-auto pr-1 no-scrollbar flex-grow">

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Dish Name</label>
                          <input
                            type="text"
                            required
                            value={editingMenuItem.name}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Price ({getCurrencySymbol()})</label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              value={editingMenuItem.price}
                              onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-800 dark:text-slate-200"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Prep Speed (mins)</label>
                            <input
                              type="number"
                              required
                              value={editingMenuItem.prepTime}
                              onChange={(e) => setEditingMenuItem({ ...editingMenuItem, prepTime: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                            <select
                              value={editingMenuItem.category}
                              onChange={(e) => setEditingMenuItem({ ...editingMenuItem, category: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-850 dark:text-slate-200"
                            >
                              {categories.map((cat, idx) => (
                                <option key={idx} value={cat.name}>{cat.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Veg / Non-Veg</label>
                            <div className="grid grid-cols-2 gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => setEditingMenuItem({ ...editingMenuItem, isVeg: true })}
                                className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${editingMenuItem.isVeg
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-slate-250 dark:border-slate-800 hover:bg-slate-50"
                                  }`}
                              >
                                Veg
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingMenuItem({ ...editingMenuItem, isVeg: false })}
                                className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${!editingMenuItem.isVeg
                                  ? "bg-red-500 border-red-500 text-white"
                                  : "border-slate-250 dark:border-slate-800 hover:bg-slate-50"
                                  }`}
                              >
                                Non-Veg
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Dish Picture (PNG only, max 1MB)</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (base64) => {
                                    setEditingMenuItem({ ...editingMenuItem, image: base64 });
                                  });
                                }
                              }}
                              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-zinc-800 dark:file:text-slate-350 cursor-pointer"
                            />
                            {editingMenuItem.image && (
                              <div className="flex items-center gap-1.5 flex-none">
                                <img
                                  src={editingMenuItem.image}
                                  alt="Preview"
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingMenuItem({ ...editingMenuItem, image: "" })}
                                  className="text-red-500 font-bold hover:text-red-600 text-[10px] cursor-pointer"
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Dish Description</label>
                          <textarea
                            rows="2"
                            value={editingMenuItem.description}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer ${themeButton[profile.themeColor]}`}
                        >
                          Save Changes
                        </button>

                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: TABLE QR GENERATOR */}
            {activeTab === "tables" && (
              <div className="space-y-8 animate-fade-in text-left">
                {/* Generation Control panel */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">QR Code Generator Studio</h3>
                      <p className="text-xs text-slate-400">Generates scannable QR codes configured to your live production domain URL.</p>
                    </div>
                  </div>

                  <form onSubmit={handleTableGenerateSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Number of Dining Tables</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        required
                        value={tableCount}
                        onChange={(e) => setTableCount(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-5 space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Website Base Domain URL</label>
                      <input
                        type="text"
                        required
                        value={customBaseUrl}
                        onChange={(e) => {
                          setCustomBaseUrl(e.target.value);
                          generateTablesList(parseInt(tableCount) || 20, e.target.value);
                        }}
                        placeholder="https://your-domain.com"
                        className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${themeButton[profile.themeColor]}`}
                      >
                        Re-generate QRs ⚡
                      </button>
                    </div>
                  </form>
                </div>

                {/* Listing generated Table QRs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {generatedTables.map((table) => (
                    <div
                      key={table.id}
                      className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col items-center justify-between text-center gap-4 transition-all hover:scale-[1.01]"
                    >
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">{table.name}</h4>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Table Session ID: {table.id}</span>
                      </div>

                      {/* Real dynamic QR Code representation */}
                      <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-slate-250/70 shadow-inner flex items-center justify-center relative group">
                        <QRCodeImage value={table.url} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col gap-2 items-center justify-center rounded-2xl transition-opacity duration-200 p-2">
                          <Link
                            href={table.url}
                            target="_blank"
                            className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm hover:bg-slate-50 transition-colors w-full text-center"
                          >
                            Open Menu 🔗
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCopyTableUrl(table.url, table.name)}
                            className="bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm hover:bg-brand-600 transition-colors w-full"
                          >
                            Copy Link 📋
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 w-full pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] text-slate-500 font-mono select-all truncate bg-slate-50 dark:bg-zinc-950 p-1.5 rounded-lg border border-slate-150 dark:border-slate-850" title={table.url}>
                          {table.url}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyTableUrl(table.url, table.name)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl py-1.5 text-[10px] font-bold cursor-pointer"
                          >
                            Copy 📋
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl py-1.5 text-[10px] font-bold cursor-pointer"
                          >
                            Print 🖨️
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: PROFILE & BRANDING SETTINGS */}
            {activeTab === "settings" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in">

                {/* Left form inputs - profile and passwords */}
                <div className="lg:col-span-8 space-y-8">

                  {/* Profile card form */}
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
                    <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Update Restaurant Details</h3>
                      <p className="text-xs text-slate-400">Configure owner contact information, billing address, and GST nodes.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Restaurant Name</label>
                          <input
                            type="text"
                            required
                            value={profile.restaurantName}
                            onChange={(e) => setProfile({ ...profile, restaurantName: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Owner Name</label>
                          <input
                            type="text"
                            required
                            value={profile.ownerName}
                            onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Email (Read-only)</label>
                          <input
                            type="email"
                            disabled
                            value={profile.email}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-855 bg-slate-100 dark:bg-zinc-950/40 px-3.5 py-2.5 text-sm text-slate-400 focus:outline-none cursor-not-allowed font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Phone</label>
                          <input
                            type="tel"
                            required
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Restaurant Subdomain (Read-only)</label>
                          <div className="flex rounded-xl shadow-3xs">
                            <input
                              type="text"
                              disabled
                              value={getSubdomain()}
                              className="flex-grow min-w-0 block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-855 bg-slate-100 dark:bg-zinc-955/40 rounded-l-xl text-sm text-slate-400 focus:outline-none cursor-not-allowed font-semibold"
                            />
                            <span className="inline-flex items-center px-3.5 rounded-r-xl border border-l-0 border-slate-200 dark:border-slate-805 bg-slate-100 dark:bg-zinc-800 text-slate-400 text-xs font-bold select-none">
                              .quickbite.menu
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Menu Currency</label>
                          <select
                            value={profile.currency}
                            onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none font-semibold text-slate-700 dark:text-slate-300"
                          >
                            <option value="INR">INR (₹) - Indian Rupee</option>
                            <option value="USD">USD ($) - US Dollar</option>
                            <option value="EUR">EUR (€) - Euro</option>
                            <option value="GBP">GBP (£) - British Pound</option>
                            <option value="AED">AED (د.إ) - UAE Dirham</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Physical Address</label>
                        <input
                          type="text"
                          required
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none font-semibold"
                        />
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="submit"
                          className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${themeButton[profile.themeColor]}`}
                        >
                          Save Profile Updates
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Change password card form */}
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
                    <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Change Dashboard Password</h3>
                      <p className="text-xs text-slate-400">Ensure security by updating passwords regularly.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      {passwordStatus && (
                        <div className={`p-3.5 rounded-xl text-xs font-semibold ${passwordStatus.startsWith("success")
                          ? "bg-emerald-50 border border-emerald-250 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-red-50 border border-red-250 text-red-800 dark:bg-red-950/20 dark:text-red-400"
                          }`}>
                          {passwordStatus.split(": ")[1]}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                        <input
                          type="password"
                          required
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                          <input
                            type="password"
                            required
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="At least 6 characters"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                          <input
                            type="password"
                            required
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="submit"
                          className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${themeButton[profile.themeColor]}`}
                        >
                          Refurbish Password
                        </button>
                      </div>
                    </form>
                  </div>

                </div>

                {/* Right side panel - Branding Theme and Logo */}
                <div className="lg:col-span-4 space-y-8">

                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-6">
                    <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Branding Styles</h3>
                      <p className="text-xs text-slate-400">Tweak theme colors and logos representing your restaurant.</p>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2 text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Restaurant Logo (PNG/JPG/JPEG/WEBP max 1MB)</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (base64) => {
                                setProfile({ ...profile, logo: base64 });
                              });
                            }
                          }}
                          className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-zinc-800 dark:file:text-slate-350 cursor-pointer"
                        />
                        {profile.logo ? (
                          <div className="flex items-center gap-1.5 flex-none">
                            <img
                              src={profile.logo}
                              alt="Logo"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => setProfile({ ...profile, logo: "" })}
                              className="text-red-500 font-bold hover:text-red-600 text-[10px] cursor-pointer"
                              title="Remove logo"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold flex-none text-slate-400">
                            No Logo
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Brand Palette Theme</span>
                      <div className="space-y-2">
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
                            onClick={() => setProfile({ ...profile, themeColor: theme.id })}
                            className={`w-full inline-flex items-center gap-2 p-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${profile.themeColor === theme.id
                              ? "bg-slate-50 dark:bg-zinc-800 border-slate-900 dark:border-slate-200"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                              }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full ${theme.color}`}></span>
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                      <span className="font-extrabold text-slate-400 block uppercase tracking-wider text-[9px]">ℹ️ Real-Time Layout Sync</span>
                      <p className="text-slate-500 leading-relaxed">
                        Changing the theme color or logo icon instantly updates your current dashboard navigation headers!
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analytics & Performance Insights</h2>
                  <p className="text-xs text-slate-400">Tally kitchen preparation speeds, popular menu dishes, and diner expenditures in real-time.</p>
                </div>

                {/* Main Metrics cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Prep Time</span>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                      {getAveragePrepTime()} <span className="text-sm font-semibold text-slate-400">mins</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">Time elapsed between waiter approval and kitchen ready chimes.</p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
                    <p className="text-3xl font-black text-emerald-500 mt-2">
                      {completedOrdersCount} / {totalOrders}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">Count of active table tickets fully served and dismissed.</p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative Revenue</span>
                    <p className="text-3xl font-black text-brand-500 mt-2">
                      {getCurrencySymbol()}{orders.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">Sum of order totals registered across all active table sessions.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Most Popular Dishes progress grid */}
                  <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-6">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                      🔥 Most Ordered Menu Items
                    </h3>

                    {getItemRankings().length > 0 ? (
                      <div className="space-y-4">
                        {getItemRankings().map((item, idx) => {
                          const maxQty = Math.max(...getItemRankings().map(i => i.qty)) || 1;
                          const percent = Math.min(100, Math.floor((item.qty / maxQty) * 100));
                          return (
                            <div key={idx} className="space-y-1.5 text-xs">
                              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                                <span>{idx + 1}. {item.name}</span>
                                <span>{item.qty} ordered</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-brand-500 h-full rounded-full"
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs py-8 text-center">No orders registered yet to compile dishes ranking.</p>
                    )}
                  </div>

                  {/* Table-wise expenditures breakdown */}
                  <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-6">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                      📊 Table-wise Spend Breakdown
                    </h3>

                    {getTableStats().length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="pb-2">Table</th>
                              <th className="pb-2">Total Tickets</th>
                              <th className="pb-2 text-right">Cumulative Spend</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                            {getTableStats().map((stat, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10">
                                <td className="py-2.5 font-bold text-slate-900 dark:text-white">{stat.tableId}</td>
                                <td className="py-2.5 font-semibold text-slate-500">{stat.count} orders</td>
                                <td className="py-2.5 font-black text-slate-900 dark:text-white text-right">{getCurrencySymbol()}{stat.revenue.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs py-8 text-center">No table spending stats compiled.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeTab === "staff" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Staff Management Console</h2>
                  <p className="text-xs text-slate-400">Create, view, and update profiles for your kitchen chefs and floor waiters.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Register form */}
                  <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 self-start">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                      👤 Add New Staff Member
                    </h3>
                    <form onSubmit={handleCreateStaff} className="space-y-4 text-xs font-semibold text-slate-500">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Username</label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            required
                            placeholder="e.g. john"
                            value={staffForm.emailUsername}
                            onChange={(e) => setStaffForm({ ...staffForm, emailUsername: e.target.value.toLowerCase().replace(/\s/g, "") })}
                            className="flex-grow px-3 py-2 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-800 dark:text-slate-200"
                          />
                          <span className="px-3 py-2 border border-l-0 border-slate-200 dark:border-slate-800 rounded-r-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 font-bold text-xs select-none">
                            @{getStaffDomain()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={staffForm.password}
                          onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +91 98765 43210"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Staff Role</label>
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setStaffForm({ ...staffForm, role: "waiter" })}
                            className={`py-2 px-1 border rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${staffForm.role === "waiter"
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                              }`}
                          >
                            Waiter
                          </button>
                          <button
                            type="button"
                            onClick={() => setStaffForm({ ...staffForm, role: "kitchen" })}
                            className={`py-2 px-1 border rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${staffForm.role === "kitchen"
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                              }`}
                          >
                            Chef/Kitchen
                          </button>
                          <button
                            type="button"
                            onClick={() => setStaffForm({ ...staffForm, role: "billing" })}
                            className={`py-2 px-1 border rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${staffForm.role === "billing"
                              ? "bg-violet-600 text-white border-violet-600"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                              }`}
                          >
                            Billing Staff
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Register Staff
                      </button>
                    </form>
                  </div>

                  {/* Right: Active list */}
                  <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                      <span>👥 Active Staff Members</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 px-2 py-0.5 rounded-full">
                        {staff.length} registered
                      </span>
                    </h3>

                    {loadingStaff ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : staff.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {staff.map((member) => (
                          <div key={member._id} className="bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-150 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{member.name || "Unnamed"}</h4>
                                  <span className="text-[10px] text-slate-400 font-semibold">{member.email}</span>
                                </div>
                                <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md ${member.role === "waiter"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : member.role === "kitchen"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                  }`}>
                                  {member.role === "waiter" ? "Waitstaff" : member.role === "kitchen" ? "Culinary Chef" : "Billing Desk"}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                                <p>📱 {member.phone || "No phone listed"}</p>
                                <p>📅 Registered: {member.createdAt ? member.createdAt.split("T")[0] : "N/A"}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                              <button
                                onClick={() => setEditingStaff(member)}
                                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
                              >
                                Edit Profile
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(member._id)}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-[10px] font-bold rounded-lg cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-slate-400 text-xs">
                        No waiter or kitchen staff registered yet. Fill out the form to add your first member!
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Modal Overlay */}
                {editingStaff && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-xl w-full max-w-md animate-scale-in text-left">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">📝 Edit Staff Profile</h3>
                        <button
                          onClick={() => setEditingStaff(null)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-black cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <form onSubmit={handleUpdateStaff} className="space-y-4 text-xs font-semibold text-slate-500">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editingStaff.name}
                            onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Username</label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              required
                              value={editingStaff.emailUsername !== undefined ? editingStaff.emailUsername : (editingStaff.email ? editingStaff.email.split("@")[0] : "")}
                              onChange={(e) => {
                                const uname = e.target.value.toLowerCase().replace(/\s/g, "");
                                setEditingStaff({
                                  ...editingStaff,
                                  emailUsername: uname,
                                  email: `${uname}@${getStaffDomain()}`
                                });
                              }}
                              className="flex-grow px-3 py-2 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none font-medium text-slate-800 dark:text-slate-200"
                            />
                            <span className="px-3 py-2 border border-l-0 border-slate-200 dark:border-slate-800 rounded-r-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 font-bold text-xs select-none">
                              @{getStaffDomain()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Password (Leave empty to keep current)</label>
                          <input
                            type="password"
                            placeholder="New password (optional)"
                            value={editingStaff.password || ""}
                            onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number</label>
                          <input
                            type="text"
                            value={editingStaff.phone}
                            onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Staff Role</label>
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingStaff({ ...editingStaff, role: "waiter" })}
                              className={`py-2 px-1 border rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${editingStaff.role === "waiter"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                                }`}
                            >
                              Waiter
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStaff({ ...editingStaff, role: "kitchen" })}
                              className={`py-2 px-1 border rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${editingStaff.role === "kitchen"
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                                }`}
                            >
                              Chef/Kitchen
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStaff({ ...editingStaff, role: "billing" })}
                              className={`py-2 px-1 border rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${editingStaff.role === "billing"
                                ? "bg-violet-600 text-white border-violet-600"
                                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                                }`}
                            >
                              Billing Staff
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingStaff(null)}
                            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold transition-all hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
