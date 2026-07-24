"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { QrCodeIcon, SparklesIcon, BookOpenIcon, InfoCircleIcon, ReceiptIcon, PlusIcon, EditIcon, TrashIcon } from "../../../components/Icons";

export default function ContentDashboardPage() {
  const [cmsTab, setCmsTab] = useState("blogs"); // "blogs" | "faqs" | "pricing"
  const [userEmail, setUserEmail] = useState("content@tablemenu.in");
  const [loggingOut, setLoggingOut] = useState(false);

  // Website CMS States
  const [blogsList, setBlogsList] = useState([]);
  const [faqsList, setFaqsList] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  
  // Blog Form
  const [blogForm, setBlogForm] = useState({ title: "", category: "Operations", summary: "", content: "", coverImage: "" });
  const [editingBlogId, setEditingBlogId] = useState(null);

  // FAQ Form
  const [faqForm, setFaqForm] = useState({ category: "general", question: "", answer: "" });
  const [editingFaqId, setEditingFaqId] = useState(null);

  // Job Form
  const [jobForm, setJobForm] = useState({ title: "", department: "Engineering", location: "Bhopal, MP / Remote", type: "Full-time", experience: "1-3 Years", description: "", applyEmail: "careers@hotelmenu.in" });
  const [editingJobId, setEditingJobId] = useState(null);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail") || localStorage.getItem("email");
      if (storedEmail) setUserEmail(storedEmail);
    }
    fetchCmsData();
  }, []);

  const fetchCmsData = async () => {
    try {
      const [blogRes, faqRes, priceRes, jobRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/faqs"),
        fetch("/api/pricing"),
        fetch("/api/jobs")
      ]);
      if (blogRes.ok) setBlogsList(await blogRes.json());
      if (faqRes.ok) setFaqsList(await faqRes.json());
      if (priceRes.ok) setPricingList(await priceRes.json());
      if (jobRes.ok) setJobsList(await jobRes.json());
    } catch (e) {
      console.error("Failed to load CMS data:", e);
    }
  };

  // Blog CRUD Handlers
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

  // FAQ CRUD Handlers
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

  // Pricing Handlers
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

  // Job Posting Handlers
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs";
      const method = editingJobId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      if (res.ok) {
        setJobForm({ title: "", department: "Engineering", location: "Bhopal, MP / Remote", type: "Full-time", experience: "1-3 Years", description: "", applyEmail: "careers@hotelmenu.in" });
        setEditingJobId(null);
        fetchCmsData();
      }
    } catch (e) {
      console.error("Error saving job posting:", e);
    }
  };

  const handleEditJob = (job) => {
    setEditingJobId(job._id);
    setJobForm({
      title: job.title || "",
      department: job.department || "Engineering",
      location: job.location || "Bhopal, MP / Remote",
      type: job.type || "Full-time",
      experience: job.experience || "1-3 Years",
      description: job.description || "",
      applyEmail: job.applyEmail || "careers@hotelmenu.in",
    });
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) fetchCmsData();
    } catch (e) {
      console.error("Error deleting job posting:", e);
    }
  };

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo/logo.png" alt="TableMenu.in Logo" className="h-9 w-auto object-contain" />
          <span className="text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full">
            Content Manager Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Logged in as {userEmail}</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-xs font-bold shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 space-y-8 max-w-7xl mx-auto w-full text-left">
        
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white leading-tight">Website Content CMS</h1>
            <p className="text-sm text-slate-400">Publish blog articles, manage customer help FAQs, and adjust SaaS pricing tier specifications.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              🌐 Preview Live Website ↗
            </Link>
          </div>
        </div>

        {/* CMS Sub Navigation Bar */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl w-fit border border-slate-800">
          <button
            onClick={() => setCmsTab("blogs")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cmsTab === "blogs" ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            📝 Dynamic Blogs ({blogsList.length})
          </button>
          <button
            onClick={() => setCmsTab("faqs")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cmsTab === "faqs" ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            ❓ Help FAQs ({faqsList.length})
          </button>
          <button
            onClick={() => setCmsTab("pricing")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cmsTab === "pricing" ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            💰 Pricing Plans ({pricingList.length || 3})
          </button>
          <button
            onClick={() => setCmsTab("jobs")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cmsTab === "jobs" ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            💼 Careers / Jobs ({jobsList.length})
          </button>
        </div>

        {/* CMS SUB-TAB 1: BLOGS MANAGER */}
        {cmsTab === "blogs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Blog Creation Form */}
            <div className="lg:col-span-5 bg-zinc-900 border border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">
                  {editingBlogId ? "Edit Blog Article" : "Create New Blog Article"}
                </h3>
                {editingBlogId && (
                  <button
                    onClick={() => { setEditingBlogId(null); setBlogForm({ title: "", category: "Operations", summary: "", content: "", coverImage: "" }); }}
                    className="text-xs text-brand-400 font-bold hover:underline"
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
                    className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-400">Category</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
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
                      <div className="relative rounded-xl border border-slate-800 bg-zinc-950 p-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={blogForm.coverImage}
                            alt="Cover Preview"
                            className="w-14 h-10 object-cover rounded-lg border border-slate-800 flex-none"
                          />
                          <span className="text-xs text-emerald-400 font-bold truncate">Image Attached ✓</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBlogForm({ ...blogForm, coverImage: "" })}
                          className="px-2.5 py-1 text-[10px] bg-red-500/10 text-red-400 rounded-lg font-bold hover:bg-red-500/20 cursor-pointer flex-none"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-slate-800 hover:border-brand-500 rounded-xl p-2.5 text-center bg-zinc-950 transition-all cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm">📷</span>
                          <span className="text-xs font-bold text-slate-300">Choose Image File</span>
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
                    className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
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
                    className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
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
              <div className="bg-zinc-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-white text-base">Published Blog Posts ({blogsList.length})</h3>
                <div className="space-y-3">
                  {blogsList.map((blog) => (
                    <div key={blog._id} className="p-4 rounded-2xl bg-zinc-950 border border-slate-800 flex items-start justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-extrabold uppercase bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-md border border-brand-500/20">
                          {blog.category}
                        </span>
                        <h4 className="font-bold text-white text-sm">{blog.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{blog.summary}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-none">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="px-3 py-1.5 bg-zinc-800 text-slate-200 rounded-lg text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 cursor-pointer"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* FAQ Creation Form */}
            <div className="lg:col-span-5 bg-zinc-900 border border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">
                  {editingFaqId ? "Edit FAQ Item" : "Create New FAQ Item"}
                </h3>
                {editingFaqId && (
                  <button
                    onClick={() => { setEditingFaqId(null); setFaqForm({ category: "general", question: "", answer: "" }); }}
                    className="text-xs text-brand-400 font-bold hover:underline"
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
                    className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
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
                    className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
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
                    className="w-full rounded-xl border border-slate-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
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
              <div className="bg-zinc-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-white text-base">Active Help FAQs ({faqsList.length})</h3>
                <div className="space-y-3">
                  {faqsList.map((faq) => (
                    <div key={faq._id} className="p-4 rounded-2xl bg-zinc-950 border border-slate-800 flex items-start justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-extrabold uppercase bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-md border border-brand-500/20">
                          {faq.category}
                        </span>
                        <h4 className="font-bold text-white text-sm">{faq.question}</h4>
                        <p className="text-xs text-slate-400">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-none">
                        <button
                          onClick={() => handleEditFaq(faq)}
                          className="px-3 py-1.5 bg-zinc-800 text-slate-200 rounded-lg text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq._id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 cursor-pointer"
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
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">Website SaaS Pricing Plans Editor</h3>
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
                  <div key={plan.id || idx} className="bg-zinc-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-black uppercase text-brand-400">{plan.name}</span>
                      <span className="text-[10px] font-bold bg-zinc-800 px-2 py-0.5 rounded-md text-slate-400">ID: {plan.id}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Plan Display Name</label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => handlePricingPlanChange(idx, "name", e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs text-white font-bold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">QR Table Range</label>
                        <input
                          type="text"
                          value={plan.qrRange || plan.details?.tables || ""}
                          onChange={(e) => handlePricingPlanChange(idx, "qrRange", e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Monthly ($/₹)</label>
                          <input
                            type="number"
                            value={plan.priceMonthly}
                            onChange={(e) => handlePricingPlanChange(idx, "priceMonthly", Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none text-brand-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Quarterly ($/₹)</label>
                          <input
                            type="number"
                            value={plan.priceQuarterly}
                            onChange={(e) => handlePricingPlanChange(idx, "priceQuarterly", Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none text-white"
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
                            className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">12 Months ($/₹)</label>
                          <input
                            type="number"
                            value={plan.priceAnnual}
                            onChange={(e) => handlePricingPlanChange(idx, "priceAnnual", Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs font-extrabold focus:outline-none text-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Dedicated Support Detail</label>
                        <input
                          type="text"
                          value={plan.support || plan.details?.support || "1 Month Free Support"}
                          onChange={(e) => handlePricingPlanChange(idx, "support", e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CMS SUB-TAB 4: CAREERS & JOB POSTINGS MANAGER */}
        {cmsTab === "jobs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Job Posting Creation Form */}
            <div className="lg:col-span-5 bg-zinc-900 border border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">
                  {editingJobId ? "Edit Job Posting" : "Publish New Job Opening"}
                </h3>
                {editingJobId && (
                  <button
                    onClick={() => { setEditingJobId(null); setJobForm({ title: "", department: "Engineering", location: "Bhopal, MP / Remote", type: "Full-time", experience: "1-3 Years", description: "", applyEmail: "careers@hotelmenu.in" }); }}
                    className="text-xs text-brand-400 font-bold hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Next.js Engineer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Department</label>
                    <select
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Customer Success">Customer Success</option>
                      <option value="Sales & Growth">Sales & Growth</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Employment Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bhopal, MP / Remote"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Apply Email</label>
                    <input
                      type="email"
                      placeholder="careers@hotelmenu.in"
                      value={jobForm.applyEmail}
                      onChange={(e) => setJobForm({ ...jobForm, applyEmail: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Job Overview & Role Responsibilities</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe role objectives, daily tasks, and requirements..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {editingJobId ? "Update Job Opening" : "Publish Job Opening 💼"}
                </button>
              </form>
            </div>

            {/* Published Jobs List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">Active Job Openings ({jobsList.length})</h3>
                <Link href="/careers" target="_blank" className="text-xs text-brand-400 hover:underline">
                  Preview Careers Page ↗
                </Link>
              </div>

              {jobsList.length > 0 ? (
                <div className="space-y-3">
                  {jobsList.map((job) => (
                    <div key={job._id} className="bg-zinc-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded">
                            {job.department}
                          </span>
                          <span className="text-xs text-slate-400">{job.location}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{job.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{job.description}</p>
                      </div>

                      <div className="flex gap-2 flex-none">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 bg-zinc-900 border border-slate-800 rounded-3xl text-center">
                  <p className="text-slate-400 text-xs">No job openings created yet. Use the form on the left to post one.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
