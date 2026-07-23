"use client";

import React, { useState } from "react";
import { CalendarIcon, ClockIcon, CheckCircleIcon, UsersIcon, ShieldCheckIcon } from "./Icons";

export default function DemoScheduler() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    restaurantName: "",
    fullName: "",
    email: "",
    phone: "",
    outlets: "1",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = ["10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM", "04:30 PM"];

  // Mock next 5 business days starting today
  const getNextBusinessDays = () => {
    const days = [];
    let current = new Date();
    // Move to tomorrow if it's past 5 PM
    if (current.getHours() >= 17) {
      current.setDate(current.getDate() + 1);
    }
    
    while (days.length < 5) {
      // 0 = Sunday, 6 = Saturday
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const dates = getNextBusinessDays();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (form.restaurantName && form.fullName && form.email && form.phone) {
      setStep(2);
    }
  };

  const handleBookDemo = () => {
    if (selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl max-w-xl mx-auto transition-all duration-300">
      
      {/* Progress header */}
      {step < 3 && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              step === 1 ? "bg-brand-500 text-white" : "bg-emerald-500 text-white"
            }`}>
              {step > 1 ? "✓" : "1"}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Restaurant Details</span>
          </div>
          <div className="h-[2px] bg-slate-200 dark:bg-slate-800 flex-1 mx-3"></div>
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              step === 2 ? "bg-brand-500 text-white" : "bg-slate-200 dark:bg-zinc-800 text-slate-500"
            }`}>
              2
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select Date & Time</span>
          </div>
        </div>
      )}

      {/* Step 1: Restaurant info form */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-5">
          <div className="text-center md:text-left space-y-1 mb-6">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Book a 15-Min Live Demo</h4>
            <p className="text-sm text-slate-500">Let our specialists show you how TableMenu.in can double your table orders.</p>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              required
              value={form.restaurantName}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g. Royal Dining Cafe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Number of Outlets</label>
              <select
                name="outlets"
                value={form.outlets}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-slate-300"
              >
                <option value="1">1 Outlet</option>
                <option value="2-5">2 to 5 Outlets</option>
                <option value="6-10">6 to 10 Outlets</option>
                <option value="11+">11+ Outlets (Enterprise)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Work Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="john@restaurant.com"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-600 active:scale-98 transition-all cursor-pointer"
          >
            Continue to Calendar
          </button>
        </form>
      )}

      {/* Step 2: Calendar scheduling grid */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-500"
            >
              ← Back to Details
            </button>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Select Date & Time</h4>
            <p className="text-sm text-slate-500">Pick a convenient slot for your product walk-through.</p>
          </div>

          {/* Dates picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-left">
              Available Dates
            </label>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((date, idx) => {
                const dateStr = date.toISOString().split("T")[0];
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold leading-tight opacity-80">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-base font-extrabold mt-0.5 leading-none">
                      {date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="space-y-2 animate-fade-in text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Available Times (EST)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((time, idx) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`inline-flex items-center justify-center rounded-xl py-2 px-3 border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 text-white shadow-sm"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100"
                      }`}
                    >
                      <ClockIcon className="w-4 h-4 mr-1.5 opacity-60" /> {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleBookDemo}
            disabled={!selectedDate || !selectedTime}
            className="w-full inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>
      )}

      {/* Step 3: Success Confirmation screen */}
      {step === 3 && (
        <div className="text-center py-8 space-y-6 animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">Demo Scheduled!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Hi <span className="font-semibold text-slate-900 dark:text-white">{form.fullName}</span>, we are excited to showcase TableMenu.in to <span className="font-semibold text-slate-900 dark:text-white">{form.restaurantName}</span>.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 max-w-sm mx-auto text-left space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CalendarIcon className="w-5 h-5 text-brand-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatDate(selectedDate)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ClockIcon className="w-5 h-5 text-brand-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {selectedTime} EST (15 mins)
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <UsersIcon className="w-5 h-5 text-brand-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Outlets: <span className="font-semibold text-slate-800 dark:text-slate-200">{form.outlets}</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            A confirmation email along with a Google Meet link has been sent to <span className="font-medium text-slate-600 dark:text-slate-300">{form.email}</span>.
          </p>

          <button
            onClick={() => {
              setStep(1);
              setSelectedDate("");
              setSelectedTime("");
            }}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 cursor-pointer"
          >
            Schedule Another Slot
          </button>
        </div>
      )}
    </div>
  );
}
