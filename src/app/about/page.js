import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SparklesIcon, CheckCircleIcon, UsersIcon, ShieldCheckIcon, UtensilsIcon } from "../../components/Icons";

export const metadata = {
  title: "About Us | TableMenu.in Restaurant Solutions",
  description: "Learn about the founders, mission, and technology partnership behind TableMenu.in—the cloud-based QR menu & kitchen display system powered by Code World Sol.",
};

export default function About() {
  const stats = [
    { value: "100%", label: "Cloud-Based Agility" },
    { value: "< 1.2s", label: "Instant QR Menu Speed" },
    { value: "24/7", label: "Dedicated Support" },
    { value: "₹0 / $0", label: "Hardware Setup Cost" },
  ];

  const values = [
    {
      icon: <UtensilsIcon className="w-6 h-6 text-brand-500" />,
      title: "Gastronomy First",
      desc: "We design software around real kitchen workflows and customer behavior, ensuring technology simplifies service rather than disrupting it.",
    },
    {
      icon: <UsersIcon className="w-6 h-6 text-brand-500" />,
      title: "Empowering Staff",
      desc: "We don't replace restaurant workers; we elevate them. By automating order entry, waitstaff focus on hospitality and chef teams work in harmony.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-brand-500" />,
      title: "Transparency & Trust",
      desc: "No hidden commission markups, no rigid locked contracts, and zero guest data harvesting. We offer straight, merchant-owned subscription plans.",
    },
  ];

  const team = [
    {
      name: "Payal Pandit",
      role: "Founder",
      initials: "PP",
      bio: "Strategic vision, restaurant operational workflow, and business development leadership."
    },
    {
      name: "Durgawati Pandit",
      role: "Founder",
      initials: "DP",
      bio: "Brand strategy, customer satisfaction, and operational excellence."
    },
    {
      name: "Nitesh Ahirwar",
      role: "Co-Founder",
      initials: "NA",
      bio: "Product architecture, technology innovation, and digital platform engineering."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100">
      <Header />

      <main className="flex-grow">

        {/* HERO HEADER */}
        <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-400 uppercase tracking-wider">
              🚀 Fast-Growing Restaurant Tech Startup
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              About TableMenu.in
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We build cloud-based digital QR menus, kitchen display systems, and automated billing solutions to power modern dining rooms.
            </p>
          </div>
        </section>

        {/* MISSION & STARTUP MILESTONES */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-500 text-xs font-bold uppercase tracking-wider border border-brand-500/20">
                  Our Mission
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Bringing digital agility and instant ordering to restaurant dining rooms
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  TableMenu.in is an innovative, fast-growing restaurant technology startup committed to digitizing the dining experience across India and globally. We noticed that while food delivery apps digitised rapidly, in-restaurant dining remained dependent on paper menus and slow verbal order taking.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  We built TableMenu.in as a lean, cloud-first platform allowing diners to scan table QR codes, explore multi-lingual menus with dietary badges, and dispatch tickets directly to chef display screens without waiting for staff.
                </p>
              </div>

              {/* Startup Benchmarks Grid */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-zinc-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-inner">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    <p className="text-2xl sm:text-3xl font-extrabold gradient-text leading-tight">{stat.value}</p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AFFILIATION & TECHNOLOGY PARTNER SECTION (Code World Sol) */}
        <section className="py-16 bg-slate-900 text-white border-t border-b border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-zinc-950 via-slate-900 to-zinc-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-extrabold text-brand-400 uppercase tracking-wider">
                  🤝 Official Technology Partner
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Affiliated with & Powered by <span className="text-brand-400">Code World Sol</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  TableMenu.in is proudly engineered in strategic partnership with <a href="https://codeworldsol.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 font-bold hover:underline">Code World Sol (codeworldsol.com)</a> — a premier software development, custom ERP, and IT agency based in Bhopal, MP, India. Code World Sol specializes in full-stack web platforms, SaaS product engineering, custom business ERPs, and user-centric UI/UX design.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-2">
                  <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">⚙️ Full-Stack SaaS Engineering</span>
                  <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">🏢 Custom ERP Development</span>
                  <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">🎯 Business-First Tech Solutions</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3 flex-none w-full md:w-auto">
                <a
                  href="https://codeworldsol.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto text-center px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Visit CodeWorldSol.com ↗
                </a>
                <span className="text-[10px] text-slate-400 font-semibold">Bhopal, India • Development Agency</span>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDERS & LEADERSHIP TEAM */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-500">
                Founding Leadership
              </h2>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Meet the Founders behind TableMenu.in
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Driven by passion for restaurant digitization, engineering excellence, and customer success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, idx) => (
                <div key={idx} className="text-center bg-slate-50 dark:bg-zinc-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4 hover:border-brand-500/50 transition-all">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-md">
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">{member.name}</h4>
                    <p className="text-xs text-brand-500 dark:text-brand-400 font-black uppercase tracking-wider mt-0.5">{member.role}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-20 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Our Core Principles
              </h2>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                What drives our engineering & product team
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-left">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20">
                    {val.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{val.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
