import React, { useState, useEffect } from "react";
import { UPSELL_COURSES, UPSELL_PRICE, UPSELL_ORIGINAL_PRICE } from "../constants";
import { Sparkles, Timer, CheckCircle2, Download, Mail, Lock, Check, X, ArrowRight, Gift, Zap, Star, ShieldCheck } from "lucide-react";
import ModernPaymentForm from "../components/ui/modern-payment-form";
import { useNavigate, useLocation } from "react-router-dom";
import { chargeSavedCardUpsell } from "../services/stripe";
import { sendStageEmail } from "../services/email";
import FunnelProgressBar from "../components/FunnelProgressBar";

const OnetimePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId;
  const emailFromState = location.state?.email ?? '';
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
  const [email, setEmail] = useState(emailFromState);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingUpSell, setIsProcessingUpSell] = useState(false);
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Avada Upsell", value: UPSELL_PRICE, currency: "USD" });
  }, []);

  // 15-minute countdown timer (resets on page load)
  useEffect(() => {
    const start = Date.now();
    const duration = 15 * 60 * 1000; // 15 minutes
    const calc = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft({
        m: Math.floor((remaining / 60000) % 60),
        s: Math.floor((remaining / 1000) % 60),
      });
    };
    const t = setInterval(calc, 1000);
    calc();
    return () => clearInterval(t);
  }, []);

  const f = (v: number) => v.toString().padStart(2, "0");

  const handleSuccess = () => {
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: UPSELL_PRICE, currency: "USD" });
    sendStageEmail(email, 'full');
    navigate("/offer", { state: { customerId, email } });
  };

  // Removed Success Screen since it redirects to /offer instead

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .upsell-fade { animation: fadeIn 0.6s ease-out both; }
      `}</style>

      {/* ─── FUNNEL PROGRESS BAR ─── */}
      <FunnelProgressBar step={2} />

      {/* ─── URGENCY TOP BAR ─── */}
      <div className="bg-orange-500 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-bold">
          <Timer size={14} className="animate-pulse" />
          <span>WAIT! One-Time Exclusive Offer — Expires in {f(timeLeft.m)}:{f(timeLeft.s)}</span>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">

        {/* ─── HEADER ─── */}
        <div className="text-center mb-8 upsell-fade">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4">
            <Gift size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">One-Time Upgrade</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black mb-3 leading-tight text-gray-900">
            We have added all the programs you need for your <span className="text-orange-500">Interior Design</span> and Architecture career.
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto">
            You may need <strong className="text-gray-900">AutoCAD</strong> or maybe <strong className="text-gray-900">3DS Max</strong> at times, why not take all at this amazing one time price.
          </p>
        </div>

        {/* ─── PRICE CARD ─── */}
        <div className="upsell-fade bg-white shadow-xl shadow-gray-200/50 border border-gray-200 rounded-2xl p-6 mb-8 relative overflow-hidden" style={{ animationDelay: '0.15s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Complete Bundle Upgrade</p>
                <p className="text-gray-500 text-sm">9 Additional Premium Courses</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-lg line-through mr-2">${UPSELL_ORIGINAL_PRICE}</span>
                <span className="text-4xl font-display font-black text-gray-900">${UPSELL_PRICE}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <Zap size={14} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">You save ${UPSELL_ORIGINAL_PRICE - UPSELL_PRICE} — that's 86% off!</span>
            </div>
          </div>
        </div>

        {/* ─── COURSES GRID ─── */}
        <div className="upsell-fade mb-8" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" /> What You'll Unlock:
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {UPSELL_COURSES.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:border-orange-500/40 transition-all group">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-1 right-1 bg-black/70 text-white text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full">{course.software}</div>
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-gray-900 text-[10px] md:text-xs line-clamp-1">{course.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={8} className="fill-orange-400 text-orange-400" />
                    <span className="text-[9px] text-gray-500">{course.students} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── WHAT'S INCLUDED ─── */}
        <div className="upsell-fade bg-white shadow-sm border border-gray-200 rounded-2xl p-5 mb-8" style={{ animationDelay: '0.45s' }}>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Also Included with Upgrade:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "AutoCAD Precision Drafting",
              "BIM with Revit",
              "3ds Max Advanced Modeling",
              "Lumion Cinematic Walkthroughs",
              "Enscape VR Visualization",
              "AI Architecture (Midjourney)",
              "Generative Design (Stable Diffusion)",
              "Unreal Engine 5 Walkthroughs",
              "Photoshop Post-Production",
              "Freelancing Pricing Playbook",
              "10,000+ Additional Textures",
              "2,000+ Extra 3D Models",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA SECTION ─── */}
        <div className="upsell-fade" style={{ animationDelay: '0.6s' }}>
          {!showPayment ? (
            <div className="space-y-3">
              {/* Primary CTA */}
              <button
                disabled={isProcessingUpSell}
                onClick={async () => {
                  if (customerId) {
                    setIsProcessingUpSell(true);
                    try {
                      await chargeSavedCardUpsell(customerId, `$${UPSELL_PRICE}`);
                      handleSuccess();
                    } catch (err) {
                      console.error("One-click upsell failed", err);
                      // Fallback to manual checkout
                      setShowPayment(true);
                      setIsProcessingUpSell(false);
                    }
                  } else {
                    setShowPayment(true);
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl shadow-orange-500/20 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
              >
                <Gift size={20} />
                {isProcessingUpSell ? "Processing Upgrade..." : "Yes! I want it."}
                {!isProcessingUpSell && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-4 text-center mt-6 shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Imagine being able to confidently say <strong>'Yes'</strong> to any architectural or interior design project. Whether your client needs precise 2D floor plans in AutoCAD, fully detailed BIM models in Revit, cinematic walkthroughs in Lumion, or cutting-edge VR presentations in Enscape. This one upgrade gives you the <strong className="text-orange-600">complete arsenal of tools used by top international studios</strong> to command premium fees.
                </p>
              </div>

              {/* Secondary — Skip / Confirm State */}
              {isConfirmingSkip ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300 mt-6">
                  <h4 className="text-red-700 font-bold text-lg mb-2">Are you sure?</h4>
                  <p className="text-gray-700 text-sm mb-5">
                    This discount will not be available again. You can still buy this later, but it will be at the full regular price (${UPSELL_ORIGINAL_PRICE}).
                  </p>
                  <div className="space-y-3">
                    <button
                      disabled={isProcessingUpSell}
                      onClick={async () => {
                        if (customerId) {
                          setIsProcessingUpSell(true);
                          try {
                            await chargeSavedCardUpsell(customerId, `$${UPSELL_PRICE}`);
                            handleSuccess();
                          } catch (err) {
                            setShowPayment(true);
                            setIsProcessingUpSell(false);
                          }
                        } else {
                          setShowPayment(true);
                        }
                      }}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold rounded-xl transition-all"
                    >
                      {isProcessingUpSell ? "Processing..." : "Yes, I want the discount"}
                    </button>
                    <button
                      disabled={isProcessingUpSell}
                      onClick={() => navigate("/offer", { state: { customerId, email } })}
                      className="block w-full py-3 text-center text-red-500 hover:text-red-700 text-sm font-bold transition-colors underline underline-offset-4 decoration-red-200"
                    >
                      Cancel, I don't want it
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingSkip(true)}
                  className="block w-full py-3 text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors underline underline-offset-4 decoration-gray-300 disabled:opacity-50"
                >
                  No thanks, I'll stick with my 3 courses →
                </button>
              )}

              {/* Refunds Badge */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-2">
                <span className="flex items-center gap-1"><ShieldCheck size={10} /> 7-Day Refund</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Lock size={10} /> Secured</span>
                <span>•</span>
                <span>One-time charge</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Complete Your Upgrade</h3>
                <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">${UPSELL_PRICE}</div>
              </div>

              <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
              <div className="relative mb-3">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none transition-all"
                />
              </div>

              <ModernPaymentForm bare email={email} onSuccess={handleSuccess} amount={`$${UPSELL_PRICE}`} />

              <button
                onClick={() => setShowPayment(false)}
                className="w-full mt-3 py-2 text-center text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors"
              >
                ← Go back
              </button>
            </div>
          )}
        </div>

        {/* ─── SOCIAL PROOF ─── */}
        <div className="upsell-fade mt-10 text-center" style={{ animationDelay: '0.75s' }}>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
          </div>
          <p className="text-gray-600 text-sm italic">"I almost skipped this offer and I'm SO glad I didn't. The full bundle is worth 10x what I paid."</p>
          <p className="text-gray-500 text-xs mt-2 font-bold">— Sarah K., Studio Owner, Berlin</p>
        </div>

      </div>
    </div>
  );
};

export default OnetimePage;
