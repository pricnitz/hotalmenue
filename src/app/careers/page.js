"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { UsersIcon, MapPinIcon, ClockIcon, ArrowRightIcon, CheckCircleIcon, SparklesIcon } from "../../components/Icons";

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error("Failed to load jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-left space-y-12">
        
        {/* Header Hero */}
        <div className="space-y-4 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <SparklesIcon className="w-4 h-4" /> We're Hiring! Join Our Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Build the Future of Restaurant Tech
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
            Join Payal Pandit, Durgawati Pandit, Nitesh Ahirwar, and the Code World Sol engineering team in Bhopal, MP. We are looking for passionate innovators to digitize gastronomy.
          </p>
        </div>

        {/* Culture Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-2xl">🚀</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">High Impact Engineering</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Build real-time KDS and POS menu web applications used by active restaurant servers daily.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-2xl">💡</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Agile & Autonomous</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fast decision cycles, flat team structure, and direct leadership mentorship in Bhopal, MP.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-2xl">🏆</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Competitive Perks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Attractive salary, remote work flexibility, learning stipends, and performance bonuses.</p>
          </div>
        </div>

        {/* Dynamic Jobs Openings List Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Current Job Openings</h2>
              <p className="text-xs text-slate-400">Live positions updated via Content Console portal</p>
            </div>
            <span className="text-xs font-bold bg-slate-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
              {jobs.length} Positions Available
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 mt-3">Loading open roles...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs transition-all hover:scale-[1.01] text-left space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold bg-brand-500/10 text-brand-500 px-2.5 py-0.5 rounded-md uppercase">
                          {job.department}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <MapPinIcon className="w-3.5 h-3.5" /> {job.location}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" /> {job.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white pt-1">{job.title}</h3>
                    </div>

                    <button
                      onClick={() => setSelectedJob(selectedJob?._id === job._id ? null : job)}
                      className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer flex-none"
                    >
                      {selectedJob?._id === job._id ? "Close Details" : "View Role & Apply"}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Expanded Details Drawer */}
                  {selectedJob?._id === job._id && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Key Requirements</h4>
                          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            {Array.isArray(job.requirements) ? job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            )) : <li>{job.requirements}</li>}
                          </ul>
                        </div>
                      )}

                      <div className="bg-slate-50 dark:bg-zinc-955 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Ready to apply? Send your resume to <strong className="text-brand-500">{job.applyEmail || "careers@hotelmenu.in"}</strong>
                        </span>
                        <a
                          href={`mailto:${job.applyEmail || "careers@hotelmenu.in"}?subject=Application%20for%20${encodeURIComponent(job.title)}`}
                          className="rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2 text-xs font-bold hover:opacity-90 cursor-pointer flex-none"
                        >
                          Apply Now ✉️
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl text-center space-y-3">
              <UsersIcon className="w-10 h-10 mx-auto text-brand-500 opacity-60" />
              <p className="text-slate-400 text-sm font-medium">No open positions at this moment.</p>
              <p className="text-xs text-slate-500">Send your resume speculatively to <strong>careers@hotelmenu.in</strong></p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
