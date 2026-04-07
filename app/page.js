'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Custom SVG Icons
const FacebookIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TelegramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', email: '', category: '', brand: '', device: '', modelNumber: '', service: '', message: '',
    bookingDate: '', bookingTime: '', 
    locationType: 'dropoff', address: '' 
  });
  const [status, setStatus] = useState('');
  
  const [availableSchedules, setAvailableSchedules] = useState([]);

  const [calendarView, setCalendarView] = useState(new Date());

  const currentYear = calendarView.getFullYear();
  const currentMonth = calendarView.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = (e) => { e.preventDefault(); setCalendarView(new Date(currentYear, currentMonth - 1, 1)); };
  const nextMonth = (e) => { e.preventDefault(); setCalendarView(new Date(currentYear, currentMonth + 1, 1)); };

  const isDateAvailable = (dateStr) => {
    return availableSchedules.some(schedule => schedule.date === dateStr);
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.success) setAvailableSchedules(data.schedules);
    } catch (err) {
      console.error("Failed to load schedules", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const data = {
    'Console': {
      brands: ['Sony', 'Microsoft', 'Nintendo', 'Retro Console', 'Other'],
      devices: {
        'Sony': ['PS5', 'PS4 Pro', 'PS4', 'PS3', 'Other Sony Console'],
        'Microsoft': ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S', 'Xbox One', 'Xbox 360', 'Other Xbox'],
        'Nintendo': ['Nintendo Switch OLED', 'Nintendo Switch', 'Nintendo Switch Lite', 'Wii U', 'Wii', 'Other Nintendo'],
        'Retro Console': ['N64', 'PS1', 'Dreamcast', 'Other Retro'],
        'Other': ['Other Console']
      },
      services: ['HDMI Port Repair', 'Disc Drive Issue', 'Overheating/Cleaning', 'Controller Drift', 'Custom Shell/Mod', 'No Power', 'Software/Storage']
    },
    'Smartphone': {
      brands: ['Apple', 'Samsung', 'Google', 'Other'],
      devices: {
        'Apple': ['iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'Other iPhone'],
        'Samsung': ['Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy A54', 'Other Galaxy'],
        'Google': ['Pixel 8', 'Pixel 7', 'Pixel 6', 'Other Pixel'],
        'Other': ['Other Smartphone']
      },
      services: ['Screen Replacement', 'Battery Swap', 'Charging Port', 'Back Glass', 'Water Damage', 'Camera Repair']
    },
    'Tablet': {
      brands: ['Apple', 'Samsung', 'Amazon', 'Microsoft', 'Other'],
      devices: {
        'Apple': ['iPad Pro', 'iPad Air', 'iPad Mini', 'iPad (Standard)', 'Other iPad'],
        'Samsung': ['Galaxy Tab S', 'Galaxy Tab A', 'Other Galaxy Tab'],
        'Amazon': ['Fire HD', 'Other Fire Tablet'],
        'Microsoft': ['Surface Pro', 'Other Surface Tablet'],
        'Other': ['Other Tablet']
      },
      services: ['Screen Replacement', 'Battery Swap', 'Charging Port', 'Software Issue', 'No Power', 'Other Repair']
    },
    'PC / Laptop': {
      brands: ['Desktop PC', 'Laptop', 'MacBook', 'Other'],
      devices: {
        'Desktop PC': ['Gaming Rig', 'Office PC', 'Workstation', 'Other Desktop'],
        'Laptop': ['Dell XPS', 'HP Pavilion', 'Lenovo ThinkPad', 'Gaming Laptop', 'Other Laptop'],
        'MacBook': ['MacBook Pro', 'MacBook Air', 'Other MacBook'],
        'Other': ['Other Computer']
      },
      services: ['Diagnostic / Repair', 'SSD Upgrade', 'Virus Removal', 'Laptop Screen/Keyboard', 'Thermal Paste/Cleaning', 'RAM Upgrade']
    },
    'Custom Build': {
      brands: ['Full Custom Build', 'Pre-Built PC Upgrade', 'Other'],
      devices: {
        'Full Custom Build': ['Gaming PC', 'Workstation', 'Home/Office PC', 'Streaming Setup', 'Water Cooled PC'],
        'Pre-Built PC Upgrade': ['Upgrade GPU', 'Upgrade CPU/Motherboard', 'Upgrade RAM/SSD', 'Aesthetic Upgrade'],
        'Other': ['Other Custom Project']
      },
      services: ['Full Assembly & Setup', 'Component Upgrade (GPU/CPU)', 'Cable Management/Aesthetics', 'Water Cooling Setup', 'Consultation & Quote']
    }
  };

  const categories = [
    { title: 'Console', icon: '🎮' },
    { title: 'Smartphone', icon: '📱' },
    { title: 'Tablet', icon: '📟' },
    { title: 'PC / Laptop', icon: '💻' },
    { title: 'Custom Build', icon: '🖥️' },
    { title: 'Other Tech', icon: '🛠️' }
  ];

  const handleCategorySelect = (title) => {
    setFormData({ ...formData, category: title, brand: '', device: '', service: '' });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('🔄 Securing Time Slot & Routing to Checkout...');
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStatus('❌ Error routing to payment gateway.');
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setStatus('❌ Network error occurred.');
    }
  };

  const selectedDateObject = availableSchedules.find(s => s.date === formData.bookingDate);
  const availableTimes = selectedDateObject ? selectedDateObject.timeSlots : [];

  const isLocationValid = formData.locationType === 'dropoff' || (formData.locationType === 'mobile' && formData.address.trim() !== '');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500 flex flex-col">
      <main className="flex-grow p-4 md:p-12">
        <div className="absolute top-4 right-4 z-50">
          <Link href="/admin" className="text-xs font-bold text-slate-600 hover:text-cyan-400 transition-colors uppercase tracking-widest border border-slate-800 hover:border-cyan-500/50 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-sm">
            Admin
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 tracking-tight">
              JP's Tech Garage
            </h1>

            <div className="relative h-20 w-full max-w-lg mx-auto mb-10 overflow-hidden flex items-center justify-center">
              <svg className="absolute w-full h-full text-slate-800" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 L20,50 L25,45 L35,55 L40,50 L100,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M10,20 L30,20 L35,15 L45,25 L50,20 L90,20" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M15,80 L35,80 L40,75 L50,85 L55,80 L95,80" stroke="currentColor" fill="none" strokeWidth="0.5" />
              </svg>
              <div className="absolute inset-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scanline opacity-75"></div>
              <svg className="w-8 h-8 text-cyan-500 animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-5xl mx-auto">
              <div className="w-full lg:w-1/3 aspect-square relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg shadow-cyan-900/20 group">
                <img src="/phoneRepair.jpg" alt="Precision Phone Repair" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none"></div>
              </div>

              <div className="w-full lg:w-1/3 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm z-10">
                <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2">Welcome to the Garage</h2>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  With years of experience in precision repairs and custom hardware, I provide high-quality solutions for your most important tech. From <strong>HDMI port replacements</strong> and <strong>Switch shell swaps</strong> to <strong>custom PC builds</strong>, I treat every device like it's my own. Choose your device below to get started.
                </p>
              </div>

              <div className="w-full lg:w-1/3 aspect-square relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg shadow-purple-900/20 group">
                <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=600" alt="Precision Tech Repair" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </div>
          </header>

          {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 tracking-wide">
              Select a service below <span className="text-cyan-500 animate-pulse">_</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button key={cat.title} onClick={() => handleCategorySelect(cat.title)}
                  // THE FIX: Removed the mobile stacking, forced flex-row and items-center everywhere
                  className="group bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left flex items-center gap-5 w-full">
                  <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform flex-shrink-0">{cat.icon}</span>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-cyan-400">{cat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Start Diagnostic</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <button onClick={() => setStep(1)} className="text-cyan-500 mb-6 font-bold uppercase text-xs tracking-tighter">← Change Category</button>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
                <h2 className="text-2xl font-bold text-white">Device Information</h2>
                
                {data[formData.category] ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Brand / Setup Type</label>
                        <select required className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 transition-all"
                          value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value, device: ''})}>
                          <option value="">Select Brand</option>
                          {data[formData.category].brands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Device Model</label>
                        <select required disabled={!formData.brand} className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 transition-all disabled:opacity-50"
                          value={formData.device} onChange={(e) => setFormData({...formData, device: e.target.value})}>
                          
                          {!formData.brand ? (
                            <option value="">Select a Brand First</option>
                          ) : (
                            <>
                              <option value="">Select Model</option>
                              {data[formData.category].devices[formData.brand].map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                    <button onClick={() => setStep(3)} disabled={!formData.brand || !formData.device} 
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                      Next: Service & Scheduling
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-4 text-slate-400">For miscellaneous tech, let's jump straight to details.</p>
                    <button onClick={() => setStep(3)} className="w-full bg-cyan-600 py-4 rounded-xl font-bold">Continue</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <button onClick={() => setStep(2)} className="text-cyan-500 mb-6 font-bold uppercase text-xs tracking-tighter">← Back</button>
              <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Finalize Request</h2>
                <p className="text-sm text-slate-500 mb-6 italic">Current Selection: {formData.brand} {formData.device}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Model Number (Ex: CUH-7015B)" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    value={formData.modelNumber} onChange={(e) => setFormData({...formData, modelNumber: e.target.value})} />
                  
                  <select required className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})}>
                    <option value="">Service Needed</option>
                    {data[formData.category]?.services.map(s => <option key={s} value={s}>{s}</option>) || <option value="Repair">General Repair</option>}
                  </select>
                </div>

                <div className="border-t border-slate-800 pt-6 mt-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <span className="text-cyan-500">📍</span> Service Location
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, locationType: 'dropoff', address: ''})}
                      className={`p-4 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-2 ${
                        formData.locationType === 'dropoff'
                          ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300'
                      }`}
                    >
                      🏢 Drop-off at Garage
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, locationType: 'mobile'})}
                      className={`p-4 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-2 ${
                        formData.locationType === 'mobile'
                          ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-purple-500/50 hover:text-purple-300'
                      }`}
                    >
                      🚗 We Come To You (Free)
                    </button>
                  </div>

                  {formData.locationType === 'mobile' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your street address, city, and zip..." 
                        className="w-full p-4 rounded-xl bg-slate-950 border border-purple-500/50 text-white focus:border-purple-500 outline-none shadow-[0_0_10px_rgba(147,51,234,0.1)]"
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-6 mt-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <span className="text-cyan-500">📅</span> {formData.locationType === 'mobile' ? 'Select Arrival Time' : 'Select Drop-off Time'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4">
                      <div className="flex justify-between items-center mb-4 px-2">
                        <button type="button" onClick={prevMonth} className="text-slate-400 hover:text-cyan-400 font-bold p-2 transition-colors">&lt;</button>
                        <h3 className="text-white font-bold tracking-wide">{monthNames[currentMonth]} {currentYear}</h3>
                        <button type="button" onClick={nextMonth} className="text-slate-400 hover:text-cyan-400 font-bold p-2 transition-colors">&gt;</button>
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
                          
                          const available = isDateAvailable(thisDateStr);
                          const isSelected = formData.bookingDate === thisDateStr;

                          return (
                            <button
                              key={dayNum}
                              type="button"
                              disabled={!available}
                              onClick={() => setFormData({...formData, bookingDate: thisDateStr, bookingTime: ''})}
                              className={`p-2 w-full aspect-square flex items-center justify-center rounded-xl text-sm transition-all ${
                                isSelected 
                                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold scale-105' 
                                  : available
                                    ? 'text-cyan-300 bg-cyan-900/20 hover:bg-cyan-800/40 hover:text-cyan-200 font-medium border border-cyan-800/50'
                                    : 'text-slate-600 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col">
                      <h3 className="text-white font-bold tracking-wide mb-4 text-center mt-2">
                        {formData.bookingDate ? 'Available Times' : 'Select a Date First'}
                      </h3>
                      
                      {!formData.bookingDate ? (
                        <div className="flex-1 flex items-center justify-center text-slate-600 italic text-sm text-center p-4 border border-dashed border-slate-800 rounded-xl">
                          Waiting for date selection...
                        </div>
                      ) : availableTimes.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm text-center p-4 border border-dashed border-slate-800 rounded-xl">
                          No times available for this date.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 content-start overflow-y-auto max-h-[220px] pr-1">
                          {availableTimes.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setFormData({...formData, bookingTime: time})}
                              className={`py-3 px-2 rounded-xl text-sm font-bold transition-all text-center border ${
                                formData.bookingTime === time
                                  ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] scale-105'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-purple-500/50 hover:text-purple-300'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-6 mt-6">
                  <input type="text" required placeholder="Your Name" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <input type="email" required placeholder="Your Email" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                
                <textarea required placeholder="Additional notes or specific symptoms..." rows="3" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none resize-none"
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                
                <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <span className="text-purple-500">⚠️</span> Service Agreement & Deposit Policy
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    A $25 non-refundable deposit is required to secure your appointment. This fee covers the initial teardown and diagnostic of your device and will be <strong>fully credited toward the final cost of your repair/build</strong>. By continuing, you acknowledge that this deposit is non-refundable, including instances where the device is deemed unrepairable due to severe hardware/liquid damage, or if you elect not to proceed with the quoted repair.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={!formData.bookingDate || !formData.bookingTime || !isLocationValid}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Transmit Request (Payment Next)
                </button>

                {status && <div className="text-center p-3 rounded-lg font-bold text-cyan-400 bg-cyan-400/10 animate-pulse">{status}</div>}
              </form>
            </div>
          )}
        </div>
      </main>

      {/* --- OFFICIAL COMPANY FOOTER --- */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg tracking-tight mb-1">JP's Tech Garage LLC</h3>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-medium mb-4">Precision Tech Repair & Custom Builds</p>
            <p className="text-slate-600 text-[10px] leading-relaxed max-w-xs mx-auto md:mx-0">
              © {new Date().getFullYear()} JP's Tech Garage LLC. All rights reserved. Registered in the State of Michigan.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Follow the Garage</span>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com/JPsTechGarage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 flex items-center justify-center"
              >
                <FacebookIcon size={20} />
              </a>
              <a 
                href="https://t.me/ThatCellPhoneRepairGuy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 flex items-center justify-center"
              >
                <TelegramIcon size={20} />
              </a>
            </div>
          </div>

        </div>
        
        {/* Bottom Decorative Line */}
        <div className="max-w-lg mx-auto h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mt-10"></div>
      </footer>
    </div>
  );
}