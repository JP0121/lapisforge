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
  // NEW: Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [date, setDate] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [status, setStatus] = useState('');

  const [calendarView, setCalendarView] = useState(new Date());

  // Check if we are already logged in (when the page loads)
  useEffect(() => {
    const savedPass = sessionStorage.getItem('adminPass');
    if (savedPass) {
      setIsLoggedIn(true);
    }
  }, []);

  // NEW: Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Verifying security clearance...');
    
    const res = await fetch('/api/admin/schedule/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput })
    });

    if (res.ok) {
      sessionStorage.setItem('adminPass', passwordInput); // Save for this session
      setIsLoggedIn(true);
      setStatus('');
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
    setTimeSlots([]);
    setStatus('');
  };

  const handleAddTime = (e) => {
    e.preventDefault();
    if (timeInput && !timeSlots.includes(timeInput)) {
      const newSlots = sortTimes([...timeSlots, timeInput]);
      setTimeSlots(newSlots);
      setTimeInput(''); 
    }
  };

  const removeTime = (slotToRemove) => {
    setTimeSlots(timeSlots.filter(slot => slot !== slotToRemove));
  };

  const handleSaveSchedule = async () => {
    if (!date || timeSlots.length === 0) {
      setStatus('❌ Please select a date and at least one time slot.');
      return;
    }
    
    setStatus('💾 Saving to database...');
    
    try {
      // Get the saved password to prove we are allowed to save
      const securePass = sessionStorage.getItem('adminPass');

      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${securePass}` // NEW: Send the password to the backend
        },
        body: JSON.stringify({ date, timeSlots })
      });

      if (res.ok) {
        setStatus('✅ Schedule saved successfully!');
      } else {
        setStatus('❌ Failed to save. Unauthorized or server error.');
      }
    } catch (error) {
      setStatus('❌ Network error occurred.');
    }
  };

  // ------------------------------------------------------------------
  // UI: LOGIN SCREEN
  // ------------------------------------------------------------------
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
            <input 
              type="password" 
              required
              autoFocus
              placeholder="Enter Passcode..." 
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-center text-cyan-400 tracking-[0.5em] text-lg focus:border-cyan-500 outline-none transition-all placeholder:tracking-normal"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
              Authenticate
            </button>
            {status && (
              <div className={`text-center p-3 rounded-lg font-bold text-sm ${status.includes('❌') ? 'text-red-400 bg-red-400/10' : 'text-cyan-400 bg-cyan-400/10 animate-pulse'}`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------
  // UI: COMMAND CENTER (Only shows if logged in)
  // ------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12 font-sans selection:bg-cyan-500">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-cyan-500 hover:text-cyan-400 font-bold uppercase text-xs tracking-tighter">
            ← Back to Garage
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin <span className="text-purple-500">Command Center</span></h1>
            {/* NEW: Logout Button */}
            <button 
              onClick={() => { sessionStorage.removeItem('adminPass'); setIsLoggedIn(false); }}
              className="text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 px-3 py-1 rounded-full transition-all border border-slate-700 hover:border-red-500/50"
            >
              Log Out
            </button>
            <Link 
  href="/admin/waiver" 
  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-bold py-2 px-4 rounded-xl hover:scale-105 transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2 border border-cyan-500/30"
>
  <span>✍️</span> Digital Waivers
</Link>
          </div>
        </div>

        {/* ... The rest of your exact 2-column Calendar/Time layout goes here ... */}
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
                {dayNames.map(day => (
                  <div key={day} className="text-xs font-bold text-slate-500 py-2 uppercase">{day}</div>
                ))}
                
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}

                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;
                  const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                  const formattedDay = String(dayNum).padStart(2, '0');
                  const thisDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                  const isSelected = date === thisDateStr;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => handleDateSelect(dayNum)}
                      className={`p-2 w-full aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold scale-105' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
                      }`}
                    >
                      {dayNum}
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
              <div className="flex-1 flex items-center justify-center text-slate-500 italic text-center p-8 border border-dashed border-slate-700 rounded-2xl">
                Please select a date from the calendar to manage time slots.
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="mb-6 pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase">Managing Date</span>
                  <p className="text-2xl font-extrabold text-cyan-400">{date}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Select Time Slot</label>
                  <form onSubmit={handleAddTime} className="flex gap-4">
                    <select 
                      className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none color-scheme-dark"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                    >
                      <option value="">Choose a Time...</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <button type="submit" disabled={!timeInput} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-colors">
                      Add
                    </button>
                  </form>
                </div>

                <div className="flex-1 mb-8 p-4 bg-slate-950 rounded-xl border border-slate-800 min-h-[150px]">
                  {timeSlots.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center mt-8">No time slots added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {timeSlots.map((slot) => (
                        <div key={slot} className="bg-cyan-900/30 text-cyan-300 border border-cyan-800 px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg">
                          <span className="font-medium tracking-wide">{slot}</span>
                          <button onClick={() => removeTime(slot)} className="text-cyan-600 hover:text-red-400 font-bold text-xl leading-none">&times;</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSaveSchedule}
                  disabled={timeSlots.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
                >
                  Save to Database
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
      </div>
    </main>
  );
}