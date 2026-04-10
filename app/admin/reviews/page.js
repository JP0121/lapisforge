'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminReviewModeration() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch reviews");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password) {
      setIsAuthorized(true);
      fetchReviews();
    }
  };

  const handleApprove = async (id) => {
    setStatusMsg('🔄 Approving...');
    const res = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}`
      },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      setStatusMsg('✅ Review Approved & Live!');
      fetchReviews();
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setStatusMsg('🗑️ Deleting...');
    const res = await fetch(`/api/admin/reviews?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${password}` }
    });

    if (res.ok) {
      setStatusMsg('✅ Review Deleted.');
      fetchReviews();
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center max-w-sm w-full shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Review Moderation</h2>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin Password"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 mb-6 text-center tracking-widest" />
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">Unlock Panel</button>
        </form>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => r.status === 'Pending');
  const approvedReviews = reviews.filter(r => r.status === 'Approved');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8 font-sans selection:bg-cyan-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-yellow-400">⭐</span> Review Moderation
          </h1>
          <Link href="/admin" className="text-cyan-500 font-bold hover:underline text-sm bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            Back to Admin
          </Link>
        </div>

        {statusMsg && <div className="mb-6 text-center font-bold text-cyan-400 bg-cyan-900/20 py-3 rounded-xl border border-cyan-800/50 animate-pulse">{statusMsg}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PENDING REVIEWS COLUMN */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <span className="text-orange-400">⏳</span> Needs Approval ({pendingReviews.length})
            </h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingReviews.length === 0 ? (
                <p className="text-slate-500 italic text-center p-8 border border-dashed border-slate-800 rounded-xl">No pending reviews.</p>
              ) : (
                pendingReviews.map(review => (
                  <div key={review._id} className="bg-slate-950 border border-orange-900/50 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <div className="text-yellow-400 text-sm tracking-widest mb-2">{"★".repeat(review.rating)}</div>
                    <p className="text-slate-300 italic text-sm mb-3">"{review.text}"</p>
                    <p className="text-white font-bold text-xs">— {review.name}</p>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                      <button onClick={() => handleApprove(review._id)} className="flex-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-800/50 text-xs font-bold py-2 rounded-lg transition-colors">
                        Approve
                      </button>
                      <button onClick={() => handleDelete(review._id)} className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-800/50 text-xs font-bold py-2 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* APPROVED REVIEWS COLUMN */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <span className="text-emerald-400">✅</span> Live on Site ({approvedReviews.length})
            </h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {approvedReviews.length === 0 ? (
                <p className="text-slate-500 italic text-center p-8 border border-dashed border-slate-800 rounded-xl">No approved reviews yet.</p>
              ) : (
                approvedReviews.map(review => (
                  <div key={review._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                    <div>
                      <div className="text-yellow-400 text-xs tracking-widest mb-1">{"★".repeat(review.rating)}</div>
                      <p className="text-slate-400 italic text-xs mb-1 line-clamp-2">"{review.text}"</p>
                      <p className="text-slate-500 font-bold text-[10px] uppercase">— {review.name}</p>
                    </div>
                    <button onClick={() => handleDelete(review._id)} className="text-slate-600 hover:text-red-400 transition-colors p-2" title="Delete Review">
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}