import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SparklesIcon, CheckCircleIcon, UsersIcon, ShieldCheckIcon, UtensilsIcon } from "../../components/Icons";

export const metadata = {
  title: "About Us | TableMenu.in Restaurant Solutions",
  description: "Learn about the mission, values, and team behind TableMenu.in—the leading cloud-based QR menu and kitchen display operating system for modern restaurants.",
};

export default function About() {
  const stats = [
    { value: "1,200+", label: "Active Restaurants" },
    { value: "5M+", label: "Orders Processed" },
    { value: "$45M+", label: "Sales Routed" },
    { value: "12 min", label: "Saved Per Table Turn" },
  ];

  const values = [
    {
      icon: <UtensilsIcon className="w-6 h-6 text-brand-500" />,
      title: "Gastronomy First",
      desc: "We design software around real kitchen layouts and customer behavior, ensuring that technology supports culinary art rather than disrupting it.",
    },
    {
      icon: <UsersIcon className="w-6 h-6 text-brand-500" />,
      title: "Empowering Staff",
      desc: "We don't replace restaurant workers; we elevate them. By automating repetitive tasks, waiters focus on hospitality and chef teams work in harmony.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-brand-500" />,
      title: "Transparency & Trust",
      desc: "No hidden transaction markups, no locked contracts, and zero guest data harvesting. We offer straight, merchant-owned pricing models.",
    },
  ];

  const team = [
    { name: "Sylvia Chen", role: "Co-Founder & CEO", prev: "Product Lead @ Toast POS" },
    { name: "Vikram Mehta", role: "Co-Founder & CTO", prev: "Infrastructure Lead @ Uber Eats" },
    { name: "Alexandre Dupont", role: "VP of Product", prev: "Design Director @ Airbnb" },
    { name: "Sarah Jenkins", role: "VP of Customer Success", prev: "Operations Director @ Clover POS" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">

        {/* HERO HEADER */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Our Journey
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              About TableMenu.in
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We build technology that helps restaurants eliminate wait times, streamline kitchen operations, and keep diners coming back.
            </p>
          </div>
        </section>

        {/* MISSION & STATISTICS */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Our Mission: Bring digital agility to dining rooms
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  TableMenu.in was born out of frustration. Our founders, veterans of the restaurant POS and delivery aggregator spaces, noticed that while food delivery had digitised rapidly, the dine-in experience remained stuck in the past.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We set out to create a cloud-based system that allows customers to scan, order, and pay instantly, while connecting them directly to the kitchen display screen. Today, we process millions of orders annually, saving waiters steps and saving owners thousands of dollars in print costs and labor optimization.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-zinc-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-inner">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    <p className="text-3xl sm:text-4xl font-extrabold gradient-text leading-tight">{stat.value}</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-20 bg-slate-50 dark:bg-zinc-950 border-t border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Core Values
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                What drives our engineering and product teams
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/30">
                    {val.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{val.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                The Team
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Led by restaurant & SaaS veterans
              </h3>
              <p className="text-slate-500">
                We draw experience from some of the largest systems in food logistics and consumer applications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, idx) => (
                <div key={idx} className="text-center bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
                  {/* Mock headshot placeholder with rich CSS styling */}
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-brand-400 to-red-400 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{member.name}</h4>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{member.role}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium italic">Prev: {member.prev}</p>
                  </div>
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
