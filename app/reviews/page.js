'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SubmitReviewPage() {
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('🔄 Submitting your review...');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('✅ Thank you! Your review has been posted.');
        setFormData({ name: '', rating: 5, text: '' });
      } else {
        setStatus('❌ Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('❌ Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 flex flex-col items-center justify-center font-sans selection:bg-cyan-500">
      <Link href="/" className="absolute top-8 left-8 text-cyan-500 font-bold text-sm hover:underline">← Back to Garage</Link>
      
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Leave a Review</h1>
          <p className="text-slate-500 text-sm">How was your repair experience?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interactive Star Rating */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <span className={star <= (hoveredStar || formData.rating) ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-slate-700"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">
              {formData.rating} out of 5 Stars
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Your Name (or Initials)</label>
            <input type="text" required maxLength="30"
              className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Your Review</label>
            <textarea required rows="4" placeholder="Fast repair, reasonable price..."
              className="w-full p-4 mt-1 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 resize-none"
              value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} 
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
            Submit Review
          </button>

          {status && <div className="text-center p-3 rounded-lg font-bold text-cyan-400 bg-cyan-900/20 animate-pulse">{status}</div>}
        </form>
      </div>
    </div>
  );
}