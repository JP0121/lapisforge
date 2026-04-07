'use client';
import { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Link from 'next/link';

export default function DigitalWaiver() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [status, setStatus] = useState('');
  
  const sigCanvas = useRef({});

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments.filter(a => !a.signature));
      }
    } catch (err) {
      console.error("Failed to fetch jobs.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password) {
      setIsAuthorized(true);
      fetchAppointments();
    }
  };

  const clearSignature = (e) => {
    e.preventDefault();
    sigCanvas.current.clear();
  };

  const saveSignature = async (e) => {
    e.preventDefault();
    if (sigCanvas.current.isEmpty()) {
      setStatus('❌ Please sign before saving.');
      return;
    }

    setStatus('🔄 Encrypting Signature...');
    
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

    // NOTE: This now matches your new path inside the schedule folder!
    const res = await fetch('/api/admin/schedule/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}`
      },
      body: JSON.stringify({ id: selectedAppt._id, signature: signatureData })
    });

    if (res.ok) {
      setStatus('✅ Signature Locked & Saved to Database!');
      setTimeout(() => {
        setStatus('');
        setSelectedAppt(null);
        fetchAppointments(); 
      }, 3000);
    } else {
      setStatus('❌ Failed to save.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center max-w-sm w-full shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Waiver Access</h2>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin Password"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 mb-6 text-center tracking-widest" />
          <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-500 transition-colors">Unlock Panel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8 font-sans selection:bg-cyan-500">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-purple-500">✍️</span> Digital Waiver Terminal
          </h1>
          <Link href="/admin" className="text-cyan-500 font-bold hover:underline text-sm bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            Back to Admin
          </Link>
        </div>

        {!selectedAppt ? (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
            <h2 className="text-white font-bold mb-6 text-lg">Select Completed Job for Sign-Off:</h2>
            {appointments.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl">
                <p className="text-slate-500 italic">No unsigned jobs pending.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map(appt => (
                  <button key={appt._id} onClick={() => setSelectedAppt(appt)}
                    className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-left hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    
                    {/* NEW: Better organized list item with Date & Time clearly visible */}
                    <div className="w-full">
                      <div className="flex justify-between items-start mb-2 w-full">
                        <div className="text-white font-bold text-lg">{appt.name}</div>
                        <div className="text-xs font-bold text-cyan-400 bg-cyan-900/30 border border-cyan-800/50 px-3 py-1 rounded-full whitespace-nowrap">
                          {appt.bookingDate} @ {appt.bookingTime}
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">
                        <span className="text-slate-300 font-medium">{appt.brand} {appt.device}</span> — {appt.service}
                      </div>
                    </div>

                    <span className="text-cyan-500 text-sm font-bold bg-cyan-950 border border-cyan-900 px-4 py-2 rounded-xl whitespace-nowrap w-full md:w-auto text-center mt-2 md:mt-0">
                      Sign Waiver ➔
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedAppt(null)} className="text-cyan-500 text-sm hover:text-cyan-400 mb-6 font-bold uppercase tracking-wider">← Back to List</button>
            
            <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <h2 className="text-xl font-bold text-white mb-4 text-center">Post-Repair Service Agreement</h2>
              <div className="text-xs md:text-sm text-slate-400 leading-relaxed space-y-4 text-justify h-48 overflow-y-auto pr-4 custom-scrollbar">
                <p><strong>1. Limited Warranty:</strong> JP's Tech Garage provides a 30-Day limited warranty on all parts replaced and the specific labor performed during this repair. This warranty covers <em>defective parts</em> and <em>workmanship</em> only.</p>
                <p><strong>2. Warranty Exclusions:</strong> This warranty is strictly void if the device shows any signs of post-repair physical damage (e.g., dropped, cracked, or bent), liquid damage, or tampering by the user or another third-party repair service.</p>
                <p><strong>3. Pre-Existing Conditions:</strong> JP's Tech Garage is not responsible for pre-existing issues, hidden damage, or motherboard failures that were not apparent prior to the repair, or that occur naturally over time.</p>
                <p><strong>4. Device Acknowledgment:</strong> By signing below, I acknowledge that my device ({selectedAppt.brand} {selectedAppt.device}) has been returned to me in working condition regarding the requested repair, and I accept the terms of this limited warranty.</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Customer Signature: <span className="text-cyan-400 border-b border-dashed border-cyan-800 pb-1">{selectedAppt.name}</span>
            </h3>
            
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-700 focus-within:border-cyan-500 transition-colors mb-6 shadow-inner">
              <SignatureCanvas 
                ref={sigCanvas} 
                penColor="#0f172a" // Slate-900 color for a realistic ink look
                canvasProps={{ className: "w-full h-48 md:h-64 cursor-crosshair touch-none" }} 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={clearSignature} className="flex-1 py-4 font-bold rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
                Clear Pad
              </button>
              <button onClick={saveSignature} className="flex-1 py-4 font-bold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-900/50">
                Lock In Signature
              </button>
            </div>
            
            {status && <div className="mt-6 text-center font-bold text-cyan-400 bg-cyan-900/20 py-4 rounded-xl border border-cyan-800/50 animate-pulse">{status}</div>}
          </div>
        )}
      </div>
    </div>
  );
}