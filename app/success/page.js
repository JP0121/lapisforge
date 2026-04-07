import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-cyan-500">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scanline"></div>
        
        <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <span className="text-4xl">✅</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Deposit Secured</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Your $25 diagnostic deposit has been successfully processed. I have received your device details and locked in your time slot. Check your email for confirmation!
        </p>

        <div className="space-y-4">
          <Link href="/" className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
            Return to Garage
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <a href="https://facebook.com/JPsTechGarage" target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all text-sm">
              Facebook
            </a>
            <a href="https://t.me/ThatCellPhoneRepairGuy" target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all text-sm">
              Telegram
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}