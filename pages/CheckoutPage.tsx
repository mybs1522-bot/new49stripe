import React, { useState, useEffect } from "react";
import { COURSES } from "../constants";
import { Sparkles, Timer, CheckCircle2, Download, Mail, Lock, Check, X, ArrowLeft } from "lucide-react";
import ModernPaymentForm from "../components/ui/modern-payment-form";
import { useNavigate } from "react-router-dom";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 19, s: 59 });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [studentCount, setStudentCount] = useState(22847);

  useEffect(() => { const t = setInterval(() => setStudentCount(c => c + 1), 4000); return () => clearInterval(t); }, []);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Avada Checkout", value: 49, currency: "USD" });
  }, []);

  useEffect(() => {
    const calc = () => {
      const D = (2 * 3600 + 23 * 60 + 49) * 1000, r = D - (Date.now() % D);
      setTimeLeft({ h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) });
    };
    const t = setInterval(calc, 1000); calc();
    return () => clearInterval(t);
  }, []);

  const f = (v: number) => v.toString().padStart(2, "0");

  const handleSuccess = () => {
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: 49, currency: "USD" });
    setPaymentSuccess(true);
  };

  if (paymentSuccess) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-400" />
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check size={40} className="text-green-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-display font-black text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 text-sm mb-6">Your payment of <strong className="text-gray-900">$49</strong> was received. Welcome to Avada!</p>
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-4 text-left">
          <p className="text-yellow-800 text-sm font-black mb-1">Save this link - it is your only access</p>
          <p className="text-yellow-700 text-xs">This link was also emailed to you. Bookmark it now.</p>
        </div>
        <a href="https://drive.google.com/drive/folders/1CCyv9u82HiYI8jnyULISfBoGMcbcqd9U?usp=drive_link" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl text-center text-sm mb-3 transition-colors">
          Open Google Drive
        </a>
        <button onClick={() => navigator.clipboard.writeText("https://drive.google.com/drive/folders/1CCyv9u82HiYI8jnyULISfBoGMcbcqd9U?usp=drive_link")}
          className="w-full border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-bold py-2.5 rounded-xl text-xs transition-colors">
          Copy Link
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-6 px-4">
      <style>{`.checkout-card{animation:fadeIn 0.3s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div className="w-full max-w-md mb-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
          <ArrowLeft size={14} /> Back to home
        </button>
        <h1 className="text-3xl font-display font-black text-gray-900 mt-3 text-center">Checkout</h1>
      </div>

      <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-md border border-gray-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
        <span className="text-sm font-bold text-gray-900">{studentCount.toLocaleString()}</span>
        <span className="text-xs text-gray-500">students already enrolled</span>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="w-40 aspect-square rounded-xl overflow-hidden shadow-md">
          <video
            src="https://d38b044pevnwc9.cloudfront.net/promeAI/landing/func-video/blender.mp4"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs font-semibold text-gray-600 mt-2 text-center max-w-[160px]">🤖 First ever AI course that uses free tools only.</p>
      </div>

      <div className="checkout-card w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-black text-white px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={11} /> Complete Bundle
            </div>
            <button onClick={() => navigate("/")} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X size={15} className="text-white" />
            </button>
          </div>
          <h3 className="text-xl font-display font-bold mb-1">All {COURSES.length} Courses</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-black">$49</span>
            <span className="text-gray-500 text-sm line-through">$99</span>
            <span className="bg-white/10 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/20">50% OFF</span>
          </div>
        </div>

        <div className="px-6 pt-5 pb-6">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["12 Premium Courses", "10,000+ Textures", "Official Certificate", "24/7 Team Support", "Lifetime Access"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <CheckCircle2 size={12} className="text-gray-500 shrink-0" /> {item}
              </div>
            ))}
            <div className="col-span-2 flex items-center gap-2 text-xs font-bold bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700">
              <Download size={11} className="shrink-0" /> Software Download - All Links Included
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-5 flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-2">
              <Timer size={13} className="text-gray-700 animate-pulse" />
              <span className="text-xs font-bold text-gray-900">Offer ends in:</span>
            </div>
            <div className="font-display font-bold text-sm tabular-nums text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
              {f(timeLeft.h)}:{f(timeLeft.m)}:{f(timeLeft.s)}
            </div>
          </div>

          <label className="block text-xl font-black text-gray-900 mb-2">Email</label>
          <div className="relative mb-1">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              autoFocus
              onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
              className={`w-full pl-10 pr-4 py-3.5 bg-white border-2 ${emailError ? "border-red-500" : "border-gray-900"} rounded-xl text-sm font-medium focus:outline-none transition-all`}
            />
          </div>
          {emailError && <p className="text-red-500 text-[10px] mb-2 font-bold">Enter a valid email address</p>}

          <ModernPaymentForm bare email={email} onSuccess={handleSuccess} />

          <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            <Lock size={9} /> SSL Secured Payment - 7-Day Money-Back Guarantee
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;