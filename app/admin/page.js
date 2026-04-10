'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const ampm = i < 12 ? 'AM' : 'PM';
      const minute = j === 0 ? '00' : j;
      times.push(`${hour}:${minute} ${ampm}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const sortTimes = (timesArray) => {
  return [...timesArray].sort((a, b) => {
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };
    return parseTime(a) - parseTime(b);
  });
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [status, setStatus] = useState('');
  
  // NEW: State to hold the live schedule data
  const [liveSchedules, setLiveSchedules] = useState([]);

  const [calendarView, setCalendarView] = useState(new Date());

  // NEW: Fetch live availability from the database
  const fetchLiveSchedules = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.success) {
        setLiveSchedules(data.schedules);
      }
    } catch (err) {
      console.error("Failed to fetch live schedules", err);
    }
  };

  useEffect(() => {
    const savedPass = sessionStorage.getItem('adminPass');
    if (savedPass) {
      setIsLoggedIn(true);
      fetchLiveSchedules(); // Fetch data if already logged in
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Verifying security clearance...');
    
    const res = await fetch('/api/admin/schedule/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput })
    });

    if (res.ok) {
      sessionStorage.setItem('adminPass', passwordInput); 
      setIsLoggedIn(true);
      setStatus('');
      fetchLiveSchedules(); // Fetch data upon fresh login
    } else {
      setStatus('❌ Access Denied: Invalid Passcode');
      setPasswordInput('');
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = calendarView.getFullYear();
  const currentMonth = calendarView.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => setCalendarView(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCalendarView(new Date(currentYear, currentMonth + 1, 1));

  const handleDateSelect = (day) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    
    setDate(selectedDateStr);
    
    // NEW: Check if this date already has times scheduled. If so, load them!
    const existingSchedule = liveSchedules.find(s => s.date === selectedDateStr);
    if (existingSchedule && existingSchedule.timeSlots) {
      setTimeSlots(existingSchedule.timeSlots);
    } else {
      setTimeSlots([]);
    }
    
    setStatus('');
  };

  const toggleTimeSlot = (time) => {
    if (timeSlots.includes(time)) {
      setTimeSlots(timeSlots.filter(t => t !== time));
    } else {
      setTimeSlots(sortTimes([...timeSlots, time]));
    }
  };

  const handleSaveSchedule = async () => {
    if (!date) {
      setStatus('❌ Please select a date.');
      return;
    }
    
    setStatus('💾 Saving to database...');
    
    try {
      const securePass = sessionStorage.getItem('adminPass');

      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${securePass}` 
        },
        body: JSON.stringify({ date, timeSlots }) // Saving an empty array will clear the day out completely!
      });

      if (res.ok) {
        setStatus('✅ Schedule updated successfully!');
        fetchLiveSchedules(); // Refresh the dots and overview!
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('❌ Failed to save. Unauthorized or server error.');
      }
    } catch (error) {
      setStatus('❌ Network error occurred.');
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-cyan-500">
        <Link href="/" className="absolute top-8 left-8 text-cyan-500 hover:text-cyan-400 font-bold uppercase text-xs tracking-tighter">
          ← Return to Garage
        </Link>
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scanline"></div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Restricted Area</h1>
          <p className="text-slate-500 text-center text-sm mb-8">Enter administrative passcode to continue.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" required autoFocus placeholder="Enter Passcode..." 
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-center text-cyan-400 tracking-[0.5em] text-lg focus:border-cyan-500 outline-none transition-all placeholder:tracking-normal"
              value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
              Authenticate
            </button>
            {status && <div className={`text-center p-3 rounded-lg font-bold text-sm ${status.includes('❌') ? 'text-red-400 bg-red-400/10' : 'text-cyan-400 bg-cyan-400/10 animate-pulse'}`}>{status}</div>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12 font-sans selection:bg-cyan-500">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <Link href="/" className="text-cyan-500 hover:text-cyan-400 font-bold uppercase text-xs tracking-tighter">
            ← Back to Garage
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight mr-2">Admin <span className="text-purple-500">Command Center</span></h1>
            <button onClick={() => { sessionStorage.removeItem('adminPass'); setIsLoggedIn(false); }} className="text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 px-3 py-1.5 rounded-full transition-all border border-slate-700 hover:border-red-500/50">Log Out</button>
            <Link href="/admin/waiver" className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-1.5 border border-cyan-500/30">
              <span>✍️</span> Waivers
            </Link>
            <Link href="/admin/booking" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-teal-900/20 flex items-center gap-1.5 border border-teal-500/30">
              <span>⚡</span> Manual Bookings
            </Link>
            <Link 
  href="/admin/reviews" 
  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-orange-900/20 flex items-center gap-1.5 border border-orange-500/30"
>
  <span>⭐</span> Reviews
</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-cyan-400">📅</span> Select Work Date
            </h2>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4">
              <div className="flex justify-between items-center mb-4 px-2">
                <button onClick={prevMonth} className="text-slate-400 hover:text-cyan-400 font-bold p-2 transition-colors">&lt;</button>
                <h3 className="text-white font-bold tracking-wide">{monthNames[currentMonth]} {currentYear}</h3>
                <button onClick={nextMonth} className="text-slate-400 hover:text-cyan-400 font-bold p-2 transition-colors">&gt;</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {dayNames.map(day => <div key={day} className="text-xs font-bold text-slate-500 py-2 uppercase">{day}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}

                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;
                  const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                  const formattedDay = String(dayNum).padStart(2, '0');
                  const thisDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                  
                  const isSelected = date === thisDateStr;
                  
                  // NEW: Does this date have active slots in the database?
                  const hasActiveSlots = liveSchedules.some(s => s.date === thisDateStr && s.timeSlots.length > 0);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => handleDateSelect(dayNum)}
                      className={`relative p-2 w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold scale-105' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {/* NEW: Green dot indicator for dates with availability */}
                      {hasActiveSlots && !isSelected && (
                        <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-purple-400">⏱️</span> Availability Settings
            </h2>

            {!date ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic text-center p-8 border border-dashed border-slate-700 rounded-2xl">
                <p className="mb-2">Select a date from the calendar to manage time slots.</p>
                <p className="text-xs text-slate-600">(Dates with a green dot already have times set)</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="mb-4 pb-4 border-b border-slate-800 flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Managing Date</span>
                    <p className="text-2xl font-extrabold text-cyan-400">{date}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-400 mb-1">Selected Slots: <strong className="text-white">{timeSlots.length}</strong></span>
                    {/* Hitting Clear All saves an empty array, removing the day completely */}
                    <button onClick={() => setTimeSlots([])} className="text-xs font-bold text-red-400 hover:text-red-300 underline">Clear All</button>
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Select Available Times</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                    {timeOptions.map((time) => {
                      const isSelected = timeSlots.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => toggleTimeSlot(time)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border ${
                            isSelected 
                              ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)] scale-105'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={handleSaveSchedule}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
                >
                  {timeSlots.length === 0 ? 'Save & Clear Day' : 'Save to Database'}
                </button>
                {status && (
                  <div className="text-center mt-4 p-3 rounded-lg font-bold text-cyan-400 bg-cyan-400/10 animate-pulse">
                    {status}
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
        
        {/* NEW: Live Availability Overview Section */}
        <div className="mt-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-emerald-400">📋</span> Upcoming Availability Overview
          </h2>
          
          {liveSchedules.filter(s => s.timeSlots.length > 0).length === 0 ? (
             <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl text-slate-500 italic">
               You currently have zero available times set in the database.
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveSchedules
                .filter(s => s.timeSlots.length > 0)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((schedule) => (
                <div key={schedule._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col">
                  <div className="text-cyan-400 font-bold mb-3 border-b border-slate-800 pb-2 flex justify-between">
                    <span>{schedule.date}</span>
                    <span className="text-slate-500 text-xs">{schedule.timeSlots.length} slots</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                    {schedule.timeSlots.map(time => (
                      <span key={time} className="bg-slate-800 px-2 py-1 rounded-md">{time}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}