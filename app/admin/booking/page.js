'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminManualBooking() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [status, setStatus] = useState('');
  
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', device: '', service: '', bookingDate: '', bookingTime: '', depositStatus: 'Paid - Cash'
  });

  // NEW: Calendar State
  const [calendarView, setCalendarView] = useState(new Date());

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.success) setAvailableSchedules(data.schedules);
    } catch (err) {
      console.error("Failed to load schedules");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password) {
      setIsAuthorized(true);
      fetchSchedules();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('🔄 Processing Override...');

    try {
      // PATH 1: STRIPE CARD PAYMENT
      if (formData.depositStatus === 'Card Payment') {
        setStatus('💳 Routing to Stripe Checkout...');
        
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            category: 'Manual/In-Person', 
            brand: 'Admin Entry',
            modelNumber: 'N/A',
            locationType: 'dropoff',
            address: 'In-Store'
          }),
        });
        
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          setStatus('❌ Error routing to payment gateway.');
        }
        return; 
      }

      // PATH 2: CASH, WAIVED, OR INVOICE
      const res = await fetch('/api/admin/appointments/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('✅ Success! Appointment locked & slot removed from live site.');
        setFormData({ name: '', email: '', device: '', service: '', bookingDate: '', bookingTime: '', depositStatus: 'Paid - Cash' });
        fetchSchedules(); // Refresh available times
        setTimeout(() => setStatus(''), 4000);
      } else {
        setStatus('❌ Error creating booking in database.');
      }
    } catch (error) {
      console.error("Manual booking error:", error);
      setStatus('❌ Network error occurred.');
    }
  };

  // --- CALENDAR LOGIC ---
  const currentYear = calendarView.getFullYear();
  const currentMonth = calendarView.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => setCalendarView(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCalendarView(new Date(currentYear, currentMonth + 1, 1));

  const handleDateSelect = (day, isAvailable) => {
    if (!isAvailable) return; // Stop if the day has no slots
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    
    // Set the date and reset the time slot so they have to pick a new one
    setFormData({...formData, bookingDate: selectedDateStr, bookingTime: ''});
  };

  // Find available times for the date the admin selected on the calendar
  const selectedDateObject = availableSchedules.find(s => s.date === formData.bookingDate);
  const availableTimes = selectedDateObject ? selectedDateObject.timeSlots : [];

  // --- LOGIN UI ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center max-w-sm w-full shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Manual Override</h2>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin Password"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 mb-6 text-center tracking-widest" />
          <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-500 transition-colors">Access Terminal</button>
        </form>
      </div>
    );
  }

  // --- BOOKING TERMINAL UI ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8 font-sans selection:bg-cyan-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-500">⚡</span> Manual Booking
          </h1>
          <Link href="/admin" className="text-cyan-500 font-bold hover:underline text-sm bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            Back to Admin
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Customer Info */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2 border-b border-slate-800 pb-4">
              <span className="text-purple-400">👤</span> Customer Details
            </h2>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Customer Name</label>
                <input type="text" required className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Customer Email</label>
                <input type="email" required className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                  <input type="tel" required className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Device (e.g., PS5, iPhone 15)</label>
                <input type="text" required className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                  value={formData.device} onChange={(e) => setFormData({...formData, device: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Service (e.g., HDMI Port)</label>
                <input type="text" required className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                  value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Deposit & Payment Status</label>
              <select className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-bold outline-none focus:border-cyan-500"
                value={formData.depositStatus} onChange={(e) => setFormData({...formData, depositStatus: e.target.value})}>
                <option value="Paid - Cash">💵 Paid Deposit in Cash</option>
                <option value="Card Payment">💳 Card Payment ($25 via Stripe)</option>
                <option value="Waived - Pay Later">🤝 Deposit Waived (Pay Total Later)</option>
                <option value="Pending - Send Invoice">🧾 Pending (Will Email Invoice)</option>
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN: Calendar & Submission */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col h-full">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2 border-b border-slate-800 pb-4">
              <span className="text-emerald-400">📅</span> Select Date & Time
            </h2>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 mb-6 mt-4">
              <div className="flex justify-between items-center mb-4 px-2">
                <button type="button" onClick={prevMonth} className="text-slate-400 hover:text-cyan-400 font-bold p-2 transition-colors">&lt;</button>
                <h3 className="text-white font-bold tracking-wide">{monthNames[currentMonth]} {currentYear}</h3>
                <button type="button" onClick={nextMonth} className="text-slate-400 hover:text-cyan-400 font-bold p-2 transition-colors">&gt;</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {dayNames.map(day => <div key={day} className="text-xs font-bold text-slate-500 py-2 uppercase">{day}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}

                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;
                  const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                  const formattedDay = String(dayNum).padStart(2, '0');
                  const thisDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                  
                  const isSelected = formData.bookingDate === thisDateStr;
                  const isAvailable = availableSchedules.some(s => s.date === thisDateStr && s.timeSlots && s.timeSlots.length > 0);

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => handleDateSelect(dayNum, isAvailable)}
                      disabled={!isAvailable}
                      className={`relative p-2 w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold scale-105' 
                          : isAvailable
                            ? 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
                            : 'text-slate-700 opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isAvailable && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-500 opacity-50"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Select Time Slot</label>
              <select required disabled={!formData.bookingDate || availableTimes.length === 0} className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 disabled:opacity-50"
                value={formData.bookingTime} onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}>
                <option value="">{formData.bookingDate ? 'Choose Time...' : 'Select a date first'}</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={!formData.bookingTime} className="mt-auto w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-teal-900/20">
              Lock In Appointment
            </button>

            {status && <div className="text-center mt-4 p-4 rounded-xl font-bold text-cyan-400 bg-cyan-900/20 border border-cyan-800/50 animate-pulse">{status}</div>}
          </div>

        </form>
      </div>
    </div>
  );
}