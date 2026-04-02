'use client';
import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', email: '', category: '', brand: '', device: '', modelNumber: '', service: '', message: '' 
  });
  const [status, setStatus] = useState('');

  const data = {
    'Console': {
      brands: ['Sony', 'Microsoft', 'Nintendo', 'Other'],
      devices: ['PS5', 'PS4', 'PS4 Pro', 'Xbox Series X', 'Xbox Series S', 'Xbox One', 'Nintendo Switch OLED', 'Nintendo Switch', 'Nintendo Switch Lite', 'Retro Console', 'Other'],
      services: ['HDMI Port Repair', 'Disc Drive Issue', 'Overheating/Cleaning', 'Controller Drift', 'Custom Shell/Mod', 'No Power', 'Software/Storage']
    },
    'Smartphone': {
      brands: ['Apple', 'Samsung', 'Google', 'Other'],
      devices: ['iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy A54', 'Pixel 8', 'Pixel 7', 'Pixel 6', 'Other Smartphone'],
      services: ['Screen Replacement', 'Battery Swap', 'Charging Port', 'Back Glass', 'Water Damage', 'Camera Repair']
    },
    'PC / Laptop': {
      brands: ['Desktop PC', 'Laptop', 'MacBook', 'Other'],
      devices: ['Gaming Rig', 'Office PC', 'Workstation', 'MacBook Pro', 'MacBook Air', 'Dell XPS', 'HP Pavilion', 'Lenovo ThinkPad', 'Other'],
      services: ['Custom Build Quote', 'SSD Upgrade', 'Virus Removal', 'Laptop Screen/Keyboard', 'Thermal Paste/Cleaning', 'RAM Upgrade']
    }
  };

  const categories = [
    { title: 'Console', icon: '🎮' },
    { title: 'Smartphone', icon: '📱' },
    { title: 'PC / Laptop', icon: '💻' },
    { title: 'Other Tech', icon: '🛠️' }
  ];

  const handleCategorySelect = (title) => {
    setFormData({ ...formData, category: title, brand: '', device: '', service: '' });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('📡 Transmitting to Garage...');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setStatus('✅ Success! Request Received.');
      setTimeout(() => { setStep(1); setStatus(''); }, 3000);
    } else {
      setStatus('❌ Error Sending Request.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-12 font-sans selection:bg-cyan-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Welcome */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 tracking-tight">
            JP's Tech Garage
          </h1>

          {/* NEW TECH ANIMATION: SCANLINE/CIRCUIT PULSE */}
          <div className="relative h-20 w-full max-w-lg mx-auto mb-10 overflow-hidden flex items-center justify-center">
            <svg className="absolute w-full h-full text-slate-800" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 L20,50 L25,45 L35,55 L40,50 L100,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
              <path d="M10,20 L30,20 L35,15 L45,25 L50,20 L90,20" stroke="currentColor" fill="none" strokeWidth="0.5" />
              <path d="M15,80 L35,80 L40,75 L50,85 L55,80 L95,80" stroke="currentColor" fill="none" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scanline opacity-75"></div>
            <svg className="w-8 h-8 text-cyan-500 animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>

          {/* WELCOME SECTION WITH IMAGES */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-5xl mx-auto">
            
            {/* Left Image: Custom PC */}
            <div className="w-full lg:w-1/3 aspect-square relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg shadow-cyan-900/20 group">
              {/* I'm using a high-quality tech placeholder from Unsplash here */}
              <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600" alt="Custom PC Build" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              {/* Subtle cyan overlay to match the theme */}
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none"></div>
            </div>

            {/* Center Text */}
            <div className="w-full lg:w-1/3 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm z-10">
              <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2">Welcome to the Garage</h2>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                With years of experience in precision repairs and custom hardware, I provide high-quality solutions for your most important tech. From <strong>HDMI port replacements</strong> and <strong>Switch shell swaps</strong> to <strong>custom PC builds</strong>, I treat every device like it's my own. Choose your device below to get started.
              </p>
            </div>

            {/* Right Image: Micro-Soldering / Repair */}
            <div className="w-full lg:w-1/3 aspect-square relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg shadow-purple-900/20 group">
               {/* Motherboard/Repair placeholder */}
              <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=600" alt="Precision Tech Repair" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              {/* Subtle purple overlay to match the theme */}
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay pointer-events-none"></div>
            </div>

          </div>
        </header>

        {/* The rest of the Steps (1, 2, 3) are unchanged... */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {categories.map((cat) => (
              <button key={cat.title} onClick={() => handleCategorySelect(cat.title)}
                className="group bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left flex items-center gap-6">
                <span className="text-5xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400">{cat.title}</h3>
                  <p className="text-sm text-slate-500">Start Diagnostic</p>
                </div>
              </button>
            ))}
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
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Brand</label>
                      <select className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 transition-all"
                        value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}>
                        <option value="">Select Brand</option>
                        {data[formData.category].brands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Common Models</label>
                      <select className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 transition-all"
                        value={formData.device} onChange={(e) => setFormData({...formData, device: e.target.value})}>
                        <option value="">Select Model</option>
                        {data[formData.category].devices.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setStep(3)} disabled={!formData.brand || !formData.device} 
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                    Next: Service Details
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
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4">
              <h2 className="text-2xl font-bold text-white mb-2">Finalize Request</h2>
              <p className="text-sm text-slate-500 mb-6 italic">Current Selection: {formData.brand} {formData.device}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Model Number (Ex: CUH-7015B)" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  value={formData.modelNumber} onChange={(e) => setFormData({...formData, modelNumber: e.target.value})} />
                
                <select className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})}>
                  <option value="">Service Needed</option>
                  {data[formData.category]?.services.map(s => <option key={s} value={s}>{s}</option>) || <option value="Repair">General Repair</option>}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Your Name" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="email" required placeholder="Your Email" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <textarea required placeholder="Additional notes or specific symptoms..." rows="4" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none resize-none"
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-all">
                Transmit Request
              </button>
              {status && <div className="text-center p-3 rounded-lg font-bold text-cyan-400 bg-cyan-400/10 animate-pulse">{status}</div>}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}