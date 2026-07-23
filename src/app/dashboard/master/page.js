"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCodeIcon, ChartIcon, UsersIcon, ShieldCheckIcon, CheckCircleIcon, XIcon, SparklesIcon, CalendarIcon, PhoneIcon, MailIcon, MapPinIcon } from "../../../components/Icons";
import { validatePassword } from "../../../lib/passwordValidation";

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

  // State for Billing Invoice details
  const [billingForm, setBillingForm] = useState({
    invoiceNo: "",
    date: "",
    amount: 79,
    gstRate: 18,
    discount: 0,
  });

  // Master Tab Switch State
  const [activeMasterTab, setActiveMasterTab] = useState("outlets"); // "outlets" | "website_cms"
  const [cmsTab, setCmsTab] = useState("blogs"); // "blogs" | "faqs" | "pricing"

  // Website CMS States
  const [blogsList, setBlogsList] = useState([]);
  const [faqsList, setFaqsList] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  
  // Blog Form
  const [blogForm, setBlogForm] = useState({ title: "", category: "Operations", summary: "", content: "", coverImage: "" });
  const [editingBlogId, setEditingBlogId] = useState(null);

  // FAQ Form
  const [faqForm, setFaqForm] = useState({ category: "general", question: "", answer: "" });
  const [editingFaqId, setEditingFaqId] = useState(null);

  // Outlets Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.ownerName && r.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.phone && r.phone.includes(searchQuery));
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesPlan = planFilter === "all" || r.planType === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
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

  // Content Users States
  const [contentUsersList, setContentUsersList] = useState([]);
  const [contentUserForm, setContentUserForm] = useState({ name: "", email: "", password: "" });

  const fetchCmsData = async () => {
    try {
      const [blogRes, faqRes, priceRes, contentUserRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/faqs"),
        fetch("/api/pricing"),
        fetch("/api/content-users")
      ]);
      if (blogRes.ok) setBlogsList(await blogRes.json());
      if (faqRes.ok) setFaqsList(await faqRes.json());
      if (priceRes.ok) setPricingList(await priceRes.json());
      if (contentUserRes.ok) setContentUsersList(await contentUserRes.json());
    } catch (e) {
      console.error("Error fetching CMS data:", e);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image file size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBlogForm((prev) => ({ ...prev, coverImage: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateContentUser = async (e) => {
    e.preventDefault();
    const passVal = validatePassword(contentUserForm.password);
    if (!passVal.isValid) {
      alert(passVal.error);
      return;
    }

    try {
      const res = await fetch("/api/content-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentUserForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Content User account created for ${data.email}!`);
        setContentUserForm({ name: "", email: "", password: "" });
        fetchCmsData();
      } else {
        alert(data.error || "Failed to create content user");
      }
    } catch (e) {
      console.error("Error creating content user:", e);
    }
  };

  const handleDeleteContentUser = async (id) => {
    if (!confirm("Are you sure you want to delete this Content User?")) return;
    try {
      const res = await fetch(`/api/content-users/${id}`, { method: "DELETE" });
      if (res.ok) fetchCmsData();
    } catch (e) {
      console.error("Error deleting content user:", e);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchRestaurants();
    fetchCmsData();
  }, []);

  // CMS CRUD Handlers
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
      const method = editingBlogId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogForm),
      });
      if (res.ok) {
        setBlogForm({ title: "", category: "Operations", summary: "", content: "", coverImage: "" });
        setEditingBlogId(null);
        fetchCmsData();
      }
    } catch (e) {
      console.error("Error saving blog:", e);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || "",
      category: blog.category || "Operations",
      summary: blog.summary || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
    });
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) fetchCmsData();
    } catch (e) {
      console.error("Error deleting blog:", e);
    }
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFaqId ? `/api/faqs/${editingFaqId}` : "/api/faqs";
      const method = editingFaqId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm),
      });
      if (res.ok) {
        setFaqForm({ category: "general", question: "", answer: "" });
        setEditingFaqId(null);
        fetchCmsData();
      }
    } catch (e) {
      console.error("Error saving FAQ:", e);
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq._id);
    setFaqForm({
      category: faq.category || "general",
      question: faq.question || "",
      answer: faq.answer || "",
    });
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) fetchCmsData();
    } catch (e) {
      console.error("Error deleting FAQ:", e);
    }
  };

  const handlePricingPlanChange = (index, field, value) => {
    setPricingList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSavePricing = async () => {
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricingList),
      });
      if (res.ok) {
        alert("Pricing plans saved & published successfully!");
        fetchCmsData();
      }
    } catch (e) {
      console.error("Error saving pricing plans:", e);
    }
  };

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

  // 4b. Toggle Profile & Theme Lock via PUT
  const toggleLock = async (id, currentVal) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLocked: !currentVal }),
      });
      if (res.ok) {
        setRestaurants(prev => prev.map(r => r._id === id ? { ...r, isLocked: !currentVal } : r));
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
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

  // 6. Open billing modal with dynamic currency (₹ for INR, $ for USD)
  const openBillingModal = (rest) => {
    setSelectedRest(rest);
    const isINR = rest.currency === "INR" || rest.currency === "₹" || (rest.address && /india/i.test(rest.address));
    const symbol = isINR ? "₹" : "$";

    let basePrice = isINR ? 2499 : 79;
    if (rest.planType === "Starter") basePrice = isINR ? 999 : 29;
    if (rest.planType === "Pro Enterprise") basePrice = isINR ? 4999 : 149;

    setBillingForm({
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      amount: basePrice,
      currencySymbol: symbol,
      gstRate: 18,
      discount: 0,
    });
    setActiveModal("billing");
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    const subtotal = billingForm.amount - billingForm.discount;
    const gstVal = (subtotal * billingForm.gstRate) / 100;
    const total = subtotal + gstVal;
    const curr = billingForm.currencySymbol || "$";

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${selectedRest.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-b: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 800; color: #f97316; }
            .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
            .details div { width: 45%; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .total-section { margin-top: 30px; display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; justify-content: space-between; width: 250px; padding: 6px 0; font-size: 14px; }
            .total-row.grand { font-size: 18px; font-weight: 800; border-top: 2px solid #e2e8f0; padding-top: 12px; color: #10b981; }
            .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">TableMenu.in OS</div>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Premium Restaurant Management SaaS</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 18px;">INVOICE</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 600; color: #64748b;">${billingForm.invoiceNo}</p>
            </div>
          </div>

          <div class="details">
            <div>
              <strong style="color: #64748b; font-size: 11px; text-transform: uppercase;">Billed To:</strong>
              <h3 style="margin: 6px 0 2px 0; font-size: 15px;">${selectedRest.name}</h3>
              <p style="margin: 0; font-size: 13px; color: #475569;">Proprietor: ${selectedRest.ownerName}</p>
              <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Email: ${selectedRest.email}</p>
              <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Phone: ${selectedRest.phone}</p>
              <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">GSTIN: ${selectedRest.gstNumber || "GST-PENDING"}</p>
            </div>
            <div style="text-align: right;">
              <strong style="color: #64748b; font-size: 11px; text-transform: uppercase;">Invoice Info:</strong>
              <p style="margin: 6px 0 0 0; font-size: 13px;"><strong>Date:</strong> ${billingForm.date}</p>
              <p style="margin: 2px 0 0 0; font-size: 13px;"><strong>Payment Status:</strong> Paid</p>
              <p style="margin: 2px 0 0 0; font-size: 13px;"><strong>Licence Period:</strong> 1 Year</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>TableMenu.in Digital QR Menu License</strong><br/>
                  <span style="font-size: 11px; color: #64748b;">Access tier: ${selectedRest.planType} Plan. Live table manager & active waiter portals.</span>
                </td>
                <td style="text-align: right; vertical-align: top;">${curr}${billingForm.amount.toFixed(2)}</td>
                <td style="text-align: right; vertical-align: top;">${curr}${billingForm.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${curr}${billingForm.amount.toFixed(2)}</span>
            </div>
            ${billingForm.discount > 0 ? `
            <div class="total-row" style="color: #ef4444;">
              <span>Discount:</span>
              <span>-${curr}${billingForm.discount.toFixed(2)}</span>
            </div>
            ` : ""}
            <div class="total-row">
              <span>GST (${billingForm.gstRate}%):</span>
              <span>${curr}${gstVal.toFixed(2)}</span>
            </div>
            <div class="total-row grand">
              <span>Total Paid:</span>
              <span>${curr}${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing TableMenu.in OS to power your dining experience!</p>
            <p>This is a system generated invoice and requires no signature.</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
          <img src="/logo/logo.png" alt="TableMenu.in Logo" className="h-9 w-auto object-contain" />
          <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 font-extrabold px-2 py-0.5 rounded-md border border-slate-200/50 uppercase">MASTER PANEL</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Logged in as master@tablemenu.in</span>
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
              </div>
            </div>
          ))}
        </div>

        {/* Master Navigation Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveMasterTab("outlets")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeMasterTab === "outlets"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                : "bg-white dark:bg-zinc-900 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            }`}
          >
            🏢 Restaurant Outlets ({totalRestaurants})
          </button>
          <button
            onClick={() => setActiveMasterTab("website_cms")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeMasterTab === "website_cms"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-white dark:bg-zinc-900 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            }`}
          >
            🌐 Website Info CMS (Blogs, FAQs, Pricing)
          </button>
        </div>

        {/* TAB 1: RESTAURANT OUTLETS */}
        {activeMasterTab === "outlets" && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs text-left">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Restaurant Subscriptions (MongoDB)</h3>
                <p className="text-xs text-slate-400">Showing {filteredRestaurants.length} of {totalRestaurants} registered outlets</p>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 w-52"
                />
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="all">All Plans</option>
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Pro Enterprise">Pro Enterprise</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {loadingList ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400 mt-4">Connecting to local MongoDB...</p>
              </div>
            ) : filteredRestaurants.length > 0 ? (
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
                    {filteredRestaurants.map((rest) => (
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
                              <span className="text-[11px] text-slate-400 font-mono">id: {rest._id.slice(-6)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Owner */}
                        <td className="p-4">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{rest.ownerName}</span>
                          <span className="text-[11px] text-slate-400 block">{rest.email}</span>
                          <span className="text-[11px] text-slate-400 block">{rest.phone}</span>
                        </td>

                        {/* GST */}
                        <td className="p-4">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                            {rest.gstNumber || "N/A"}
                          </span>
                        </td>

                        {/* Plan & Expiry */}
                        <td className="p-4 space-y-1">
                          <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                            {rest.planType}
                          </span>
                          <input
                            type="date"
                            value={rest.expiryDate}
                            onChange={(e) => handleExpiryChange(rest._id, e.target.value)}
                            className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                          />
                        </td>

                        {/* Status Toggle */}
                        <td className="p-4">
                          <button
                            onClick={() => toggleStatus(rest._id, rest.status)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              rest.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                            }`}
                          >
                            {rest.status === "Active" ? "● Active" : "○ Expired"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toggleLock(rest._id, rest.isLocked)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold shadow-2xs transition-colors cursor-pointer ${
                                rest.isLocked
                                  ? "bg-amber-500 text-slate-950 hover:bg-amber-600"
                                  : "bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                              }`}
                            >
                              {rest.isLocked ? "🔒 Locked" : "🔓 Lock"}
                            </button>
                            <button
                              onClick={() => openBrandingModal(rest)}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                              Brand Config
                            </button>
                            <button
                              onClick={() => openBillingModal(rest)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                              Generate Bill
                            </button>
                            <button
                              onClick={() => openStatsModal(rest)}
                              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
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
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-400 text-sm font-semibold">No restaurant outlets found matching your search and filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WEBSITE INFO CMS */}
        {activeMasterTab === "website_cms" && (
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* CMS Sub Navigation */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-850 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setCmsTab("blogs")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cmsTab === "blogs" ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                📝 Dynamic Blogs ({blogsList.length})
              </button>
              <button
                onClick={() => setCmsTab("faqs")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cmsTab === "faqs" ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                ❓ Help FAQs ({faqsList.length})
              </button>
              <button
                onClick={() => setCmsTab("pricing")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cmsTab === "pricing" ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                💰 Pricing Plans ({pricingList.length || 3})
              </button>
              <button
                onClick={() => setCmsTab("content_users")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cmsTab === "content_users" ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                👤 Content Managers ({contentUsersList.length})
              </button>
            </div>

            {/* CMS SUB-TAB 1: BLOGS MANAGER */}
            {cmsTab === "blogs" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Blog Creation Form */}
                <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {editingBlogId ? "Edit Blog Article" : "Create New Blog Article"}
                    </h3>
                    {editingBlogId && (
                      <button
                        onClick={() => { setEditingBlogId(null); setBlogForm({ title: "", category: "Operations", summary: "", content: "", coverImage: "" }); }}
                        className="text-xs text-brand-500 font-bold hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Article Title</label>
                      <input
                        type="text"
                        required
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="e.g. How QR Menus Increase Table Turnover"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400">Category</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                        >
                          <option value="Operations">Operations</option>
                          <option value="Guides">Guides</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400">Choose Blog Image</label>
                        {blogForm.coverImage ? (
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 p-2 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img
                                src={blogForm.coverImage}
                                alt="Cover Preview"
                                className="w-14 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 flex-none"
                              />
                              <span className="text-xs text-emerald-500 font-bold truncate">Image Attached ✓</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setBlogForm({ ...blogForm, coverImage: "" })}
                              className="px-2.5 py-1 text-[10px] bg-red-500/10 text-red-500 rounded-lg font-bold hover:bg-red-500/20 cursor-pointer flex-none"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="relative border border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-500 rounded-xl p-2.5 text-center bg-slate-50 dark:bg-zinc-950 transition-all cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm">📷</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Image File</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Short Summary</label>
                      <textarea
                        rows={2}
                        required
                        value={blogForm.summary}
                        onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                        placeholder="Brief 2-line intro snippet..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Full Article Content</label>
                      <textarea
                        rows={6}
                        required
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Write full article body text..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      {editingBlogId ? "Update Blog Post" : "Publish Blog Post"}
                    </button>
                  </form>
                </div>

                {/* Published Blogs List */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Published Blog Posts ({blogsList.length})</h3>
                    <div className="space-y-3">
                      {blogsList.map((blog) => (
                        <div key={blog._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800 flex items-start justify-between gap-4">
                          <div className="space-y-1 text-left">
                            <span className="text-[9px] font-extrabold uppercase bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-md">
                              {blog.category}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{blog.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{blog.summary}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-none">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="px-3 py-1.5 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* CMS SUB-TAB 2: FAQS MANAGER */}
            {cmsTab === "faqs" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* FAQ Creation Form */}
                <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {editingFaqId ? "Edit FAQ Item" : "Create New FAQ Item"}
                    </h3>
                    {editingFaqId && (
                      <button
                        onClick={() => { setEditingFaqId(null); setFaqForm({ category: "general", question: "", answer: "" }); }}
                        className="text-xs text-brand-500 font-bold hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleFaqSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Category</label>
                      <select
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      >
                        <option value="general">General</option>
                        <option value="setup">Menu & Setup</option>
                        <option value="kitchen">Kitchen & Hardware</option>
                        <option value="billing">Pricing & Billing</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Question</label>
                      <input
                        type="text"
                        required
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                        placeholder="e.g. Do diners need an app?"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Answer Text</label>
                      <textarea
                        rows={4}
                        required
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                        placeholder="Detailed answer text..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      {editingFaqId ? "Update FAQ" : "Save FAQ Question"}
                    </button>
                  </form>
                </div>

                {/* Published FAQs List */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Help FAQs ({faqsList.length})</h3>
                    <div className="space-y-3">
                      {faqsList.map((faq) => (
                        <div key={faq._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800 flex items-start justify-between gap-4">
                          <div className="space-y-1 text-left">
                            <span className="text-[9px] font-extrabold uppercase bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-md">
                              {faq.category}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{faq.question}</h4>
                            <p className="text-xs text-slate-400">{faq.answer}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-none">
                            <button
                              onClick={() => handleEditFaq(faq)}
                              className="px-3 py-1.5 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(faq._id)}
                              className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CMS SUB-TAB 3: PRICING PLANS MANAGER */}
            {cmsTab === "pricing" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Website SaaS Pricing Plans Editor</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Configure monthly, quarterly, 6-month, annual rates, and QR range tiers shown on tablemenu.in/pricing.</p>
                    </div>
                    <button
                      onClick={handleSavePricing}
                      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      💾 Save & Publish Pricing
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pricingList.map((plan, idx) => (
                      <div key={plan.id || idx} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
                          <span className="text-xs font-black uppercase text-brand-500">{plan.name}</span>
                          <span className="text-[10px] font-bold bg-slate-200 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-slate-400">ID: {plan.id}</span>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Plan Display Name</label>
                            <input
                              type="text"
                              value={plan.name}
                              onChange={(e) => handlePricingPlanChange(idx, "name", e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400">QR Table Range</label>
                            <input
                              type="text"
                              value={plan.qrRange || plan.details?.tables || ""}
                              onChange={(e) => handlePricingPlanChange(idx, "qrRange", e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-400">Monthly ($/₹)</label>
                              <input
                                type="number"
                                value={plan.priceMonthly}
                                onChange={(e) => handlePricingPlanChange(idx, "priceMonthly", Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none text-brand-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-400">Quarterly ($/₹)</label>
                              <input
                                type="number"
                                value={plan.priceQuarterly}
                                onChange={(e) => handlePricingPlanChange(idx, "priceQuarterly", Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-400">6 Months ($/₹)</label>
                              <input
                                type="number"
                                value={plan.priceHalfYearly}
                                onChange={(e) => handlePricingPlanChange(idx, "priceHalfYearly", Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-400">12 Months ($/₹)</label>
                              <input
                                type="number"
                                value={plan.priceAnnual}
                                onChange={(e) => handlePricingPlanChange(idx, "priceAnnual", Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none text-emerald-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Dedicated Support Detail</label>
                            <input
                              type="text"
                              value={plan.support || plan.details?.support || "1 Month Free Support"}
                              onChange={(e) => handlePricingPlanChange(idx, "support", e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CMS SUB-TAB 4: CONTENT USERS MANAGER */}
            {cmsTab === "content_users" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-left">
                
                {/* Create Content User Form */}
                <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Create New Content User</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Content users can log in to manage blogs, FAQs, and pricing plans only.</p>
                  </div>

                  <form onSubmit={handleCreateContentUser} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Full Name / Display Name</label>
                      <input
                        type="text"
                        required
                        value={contentUserForm.name}
                        onChange={(e) => setContentUserForm({ ...contentUserForm, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Login Email ID</label>
                      <input
                        type="email"
                        required
                        value={contentUserForm.email}
                        onChange={(e) => setContentUserForm({ ...contentUserForm, email: e.target.value })}
                        placeholder="e.g. content@tablemenu.in"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-400">Password</label>
                      <input
                        type="text"
                        required
                        value={contentUserForm.password}
                        onChange={(e) => setContentUserForm({ ...contentUserForm, password: e.target.value })}
                        placeholder="Enter account password..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      + Create Content User Account
                    </button>
                  </form>
                </div>

                {/* Active Content Users List */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Registered Content Managers ({contentUsersList.length})</h3>
                    
                    {contentUsersList.length === 0 ? (
                      <div className="text-center py-10 space-y-2">
                        <p className="text-xs text-slate-400">No custom content users registered yet.</p>
                        <p className="text-xs text-slate-400">Default demo account: <span className="font-mono text-brand-500 font-bold">content@tablemenu.in</span> / <span className="font-mono text-brand-500 font-bold">password</span></p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {contentUsersList.map((cUser) => (
                          <div key={cUser._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-4">
                            <div className="space-y-0.5 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{cUser.name || "Content User"}</span>
                                <span className="text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                                  Content Role
                                </span>
                              </div>
                              <p className="text-xs font-mono text-slate-400">{cUser.email}</p>
                              <p className="text-[10px] text-slate-400">Created: {new Date(cUser.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>

                            <button
                              onClick={() => handleDeleteContentUser(cUser._id)}
                              className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 cursor-pointer flex-none"
                            >
                              Delete User
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

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
                      { id: "orange", label: "Vibrant Sunset (Orange)", color: "bg-orange-500" },
                      { id: "gold", label: "Royal Gold (Luxury)", color: "bg-amber-400" },
                      { id: "velvet", label: "Dark Velvet (Midnight)", color: "bg-purple-600" },
                      { id: "emerald", label: "Minimalist Emerald", color: "bg-emerald-500" },
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
      {/* MODAL 4: GENERATE BILL */}
      {activeModal === "billing" && selectedRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 text-left flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
            
            {/* Left: Billing Fields configuration */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generate Subscription Bill</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Configure parameters for {selectedRest.name}'s invoice.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Invoice Number</label>
                    <input
                      type="text"
                      value={billingForm.invoiceNo}
                      onChange={(e) => setBillingForm({ ...billingForm, invoiceNo: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Invoice Date</label>
                    <input
                      type="date"
                      value={billingForm.date}
                      onChange={(e) => setBillingForm({ ...billingForm, date: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Base Plan Amount ($)</label>
                  <input
                    type="number"
                    value={billingForm.amount}
                    onChange={(e) => setBillingForm({ ...billingForm, amount: parseFloat(e.target.value) || 0 })}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Discount ($)</label>
                    <input
                      type="number"
                      value={billingForm.discount}
                      onChange={(e) => setBillingForm({ ...billingForm, discount: parseFloat(e.target.value) || 0 })}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">GST Rate (%)</label>
                    <input
                      type="number"
                      value={billingForm.gstRate}
                      onChange={(e) => setBillingForm({ ...billingForm, gstRate: parseFloat(e.target.value) || 0 })}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={handlePrintInvoice}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
                  >
                    Print & Send Invoice 📄
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-350 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Close Invoicing Panel
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Premium Live Invoice Preview */}
            <div className="w-full md:w-[380px] bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-inner">
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-black text-brand-500 uppercase tracking-wide">TableMenu.in Invoice</h4>
                    <p className="text-[9px] text-slate-400 font-medium">SaaS License Receipt</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    <p>{billingForm.invoiceNo}</p>
                    <p>{billingForm.date}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Billed To:</p>
                  <p className="font-extrabold text-slate-900 dark:text-white">{selectedRest.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Proprietor: {selectedRest.ownerName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedRest.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono">GST: {selectedRest.gstNumber || "GST-PENDING"}</p>
                </div>

                <div className="border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-3 text-xs space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">{selectedRest.planType} License Fee</span>
                    <span className="text-slate-800 dark:text-white">${billingForm.amount.toFixed(2)}</span>
                  </div>
                  {billingForm.discount > 0 && (
                    <div className="flex justify-between text-red-500 font-medium">
                      <span>Discount</span>
                      <span>-${billingForm.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>GST ({billingForm.gstRate}%)</span>
                    <span>${(((billingForm.amount - billingForm.discount) * billingForm.gstRate) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-500">Total Paid:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ${((billingForm.amount - billingForm.discount) * (1 + billingForm.gstRate / 100)).toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
