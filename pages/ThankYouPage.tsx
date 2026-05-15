import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Check, CheckCircle2, ExternalLink, Gift, ArrowRight, ShieldCheck,
  Lock, Loader2, X, Mail, BookOpen, Layers, Camera, MessageCircle, Sparkles, Copy, Star
} from "lucide-react";
import {
  FRONT_END_PRICE, FRONT_END_ORIGINAL_PRICE,
  UPSELL_PRICE, UPSELL_ORIGINAL_PRICE,
  UPSELL2_PRICE, UPSELL2_ORIGINAL_PRICE,
} from "../constants";
import { chargeSavedCardUpsell, getAccessLinks } from "../services/stripe";
import { sendStageEmail, type EmailProduct } from "../services/email";
import ModernPaymentForm from "../components/ui/modern-payment-form";

/* ─── Product catalog ─── */
interface ProductDef {
  title: string;
  subtitle: string;
  items: string[];
  price: number;
  originalPrice: number;
  emailProduct: string;
  gradient: string;
  accent: string;
  icon: React.ElementType;
}

const PRODUCT_CATALOG: Record<string, ProductDef> = {
  render: {
    title: "Rendering Bundle",
    subtitle: "SketchUp + V-Ray + D5 Render AI",
    items: [
      "SketchUp Pro — 3D Modeling",
      "V-Ray — Photorealistic Rendering",
      "D5 Render AI — Real-time 4K Walkthroughs",
      "10,000+ Textures & 2,000+ 3D Models",
    ],
    price: FRONT_END_PRICE,
    originalPrice: FRONT_END_ORIGINAL_PRICE,
    emailProduct: "render",
    gradient: "from-blue-600 to-indigo-600",
    accent: "blue",
    icon: Camera,
  },
  full: {
    title: "9-Course Complete Bundle",
    subtitle: "AutoCAD, Revit, 3ds Max, Lumion & More",
    items: [
      "AutoCAD 2D/3D Drafting",
      "Revit BIM Architecture",
      "3ds Max + Corona Rendering",
      "Lumion Cinematic Walkthroughs",
      "Enscape VR Visualization",
      "AI Architecture (Midjourney)",
      "Generative Design (Stable Diffusion)",
      "Unreal Engine 5 Walkthroughs",
      "Photoshop Post-Production",
    ],
    price: UPSELL_PRICE,
    originalPrice: UPSELL_ORIGINAL_PRICE,
    emailProduct: "full",
    gradient: "from-orange-500 to-amber-500",
    accent: "orange",
    icon: Layers,
  },
  books: {
    title: "6 Interior Design Books",
    subtitle: "800+ Pages of Professional Reference",
    items: [
      "Living Room Design (145 pages)",
      "Kitchen Design (180 pages)",
      "Bedroom Design (120 pages)",
      "Washroom Design (95 pages)",
      "Study & Home Office (110 pages)",
      "Elevations & Exteriors (160 pages)",
    ],
    price: UPSELL2_PRICE,
    originalPrice: UPSELL2_ORIGINAL_PRICE,
    emailProduct: "books",
    gradient: "from-emerald-500 to-teal-500",
    accent: "emerald",
    icon: BookOpen,
  },
  downsell: {
    title: "2 Bestselling Design Books",
    subtitle: "Kitchen & Bedroom Interiors",
    items: [
      "Kitchen Design Mastery (180 pages)",
      "Bedroom Interiors Pro (120 pages)",
    ],
    price: 12,
    originalPrice: 36,
    emailProduct: "downsell",
    gradient: "from-emerald-500 to-teal-500",
    accent: "emerald",
    icon: BookOpen,
  },
};

/* ─── Component ─── */
const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const {
    customerId,
    paymentMethodId,
    paymentIntentId,
    email: emailFromState,
    purchased: initialPurchased,
  } = location.state ?? {};

  const [purchased, setPurchased] = useState<string[]>(initialPurchased ?? ["render"]);
  const [accessLinks, setAccessLinks] = useState<Record<string, string>>({});
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [email] = useState(emailFromState ?? "");
  const [buyingProduct, setBuyingProduct] = useState<string | null>(null);
  const [showPaymentFor, setShowPaymentFor] = useState<string | false>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [justPurchased, setJustPurchased] = useState<string | null>(null);

  // Fetch access links on load and when purchases change
  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).fbq) (window as any).fbq("track", "ViewContent", { content_name: "Avada Thank You" });
  }, []);

  useEffect(() => {
    setLoadingLinks(true);
    getAccessLinks(purchased)
      .then((links) => setAccessLinks((prev) => ({ ...prev, ...links })))
      .catch(() => {})
      .finally(() => setLoadingLinks(false));
  }, [purchased]);

  /* ── Buy Now handler ── */
  const handleBuyNow = async (product: string) => {
    const info = PRODUCT_CATALOG[product];
    if (!info) return;

    if (customerId) {
      setBuyingProduct(product);
      setIsProcessing(true);
      try {
        await chargeSavedCardUpsell(customerId, `$${info.price}`, paymentMethodId, paymentIntentId);
        completePurchase(product);
      } catch {
        setIsProcessing(false);
        setBuyingProduct(null);
        setShowPaymentFor(product);
      }
    } else {
      setShowPaymentFor(product);
    }
  };

  const completePurchase = (product: string) => {
    const info = PRODUCT_CATALOG[product];
    if (info) sendStageEmail(email, info.emailProduct as EmailProduct);
    if ((window as any).fbq) (window as any).fbq("track", "Purchase", { value: info?.price ?? 0, currency: "USD" });
    setPurchased((prev) => [...prev, product]);
    setJustPurchased(product);
    setTimeout(() => setJustPurchased(null), 3000);
    setIsProcessing(false);
    setBuyingProduct(null);
    setShowPaymentFor(false);
  };

  const copyLink = (product: string, link: string) => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopiedLink(product);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  /* ── Derived state ── */
  const buyableProducts = Object.keys(PRODUCT_CATALOG).filter(
    (k) => !purchased.includes(k) && k !== "downsell"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes confetti { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(80px) rotate(360deg); } }
        .ty-fade { animation: fadeIn 0.5s ease-out both; }
        .ty-scale { animation: scaleIn 0.4s ease-out both; }
        .ty-just-bought { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3); }
      `}</style>

      {/* ─── WHATSAPP TOP BAR ─── */}
      <div className="bg-emerald-600 text-white py-2.5 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2">
          <MessageCircle size={14} />
          <span className="text-xs font-semibold">Need help?</span>
          <a
            href="https://wa.me/919198747810"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-1 rounded-full transition-colors"
          >
            Chat on WhatsApp →
          </a>
        </div>
      </div>

      {/* ─── SUCCESS HEADER ─── */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-10 md:py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confetti ${2 + Math.random() * 3}s ease-out ${Math.random() * 2}s infinite`,
              }}
            />
          ))}
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="ty-scale w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-white/30">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-2 ty-fade">Payment Confirmed!</h1>
          <p className="text-emerald-100 text-base md:text-lg ty-fade" style={{ animationDelay: "0.1s" }}>
            Your order is complete. Access everything below.
          </p>
          <p className="ty-fade mt-2" style={{ animationDelay: "0.15s" }}>
            <span className="bg-white/20 backdrop-blur-sm text-white font-bold text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
              If link not received — <a href="https://wa.me/919198747810" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-black">WhatsApp at +91 91987 47810</a>
            </span>
          </p>
          {email && (
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mt-4 ty-fade" style={{ animationDelay: "0.2s" }}>
              <Mail size={14} />
              <span className="text-sm font-semibold">Confirmation sent to {email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">

        {/* ─── YOUR PURCHASES ─── */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-500" /> Your Purchases
          </h2>

          <div className="space-y-4">
            {purchased.map((key, idx) => {
              const info = PRODUCT_CATALOG[key];
              if (!info) return null;
              const link = accessLinks[key];
              const isNew = justPurchased === key;
              const Icon = info.icon;

              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border shadow-lg overflow-hidden ty-fade ${
                    isNew ? "ty-just-bought border-emerald-300" : "border-gray-100"
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Card header */}
                  <div className={`bg-gradient-to-r ${info.gradient} px-5 py-3 flex items-center gap-3`}>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{info.title}</h3>
                      <p className="text-white/70 text-xs">{info.subtitle}</p>
                    </div>
                    {isNew && (
                      <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Just Added!</span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                      {info.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> {item}
                        </div>
                      ))}
                    </div>

                    {/* Access link display */}
                    {loadingLinks && !link ? (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 size={14} className="animate-spin" /> Loading your access link…
                      </div>
                    ) : link ? (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Your Access Link:</p>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 group">
                          <ExternalLink size={13} className="text-gray-400 shrink-0" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-blue-600 hover:text-blue-800 text-xs font-medium truncate underline underline-offset-2"
                          >
                            {link}
                          </a>
                          <button
                            onClick={() => copyLink(key, link)}
                            className="shrink-0 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg transition-colors text-[11px] font-bold flex items-center gap-1.5"
                          >
                            {copiedLink === key ? <><Check size={11} className="text-emerald-300" /> Copied!</> : <><Copy size={11} /> Copy</>}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-medium">
                        📧 Access link sent to your email. Check your inbox (and spam folder). If not received, contact us on WhatsApp.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── BUY NOW SECTION ─── */}
        {buyableProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Gift size={14} className="text-orange-500" /> Complete Your Library
            </h2>

            <div className="space-y-4">
              {buyableProducts.map((key, idx) => {
                const info = PRODUCT_CATALOG[key];
                if (!info) return null;
                const Icon = info.icon;
                const isBuying = buyingProduct === key;

                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden ty-fade hover:border-orange-200 transition-colors"
                    style={{ animationDelay: `${(purchased.length + idx) * 0.1}s` }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{info.title}</h3>
                            <p className="text-gray-500 text-xs">{info.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-sm line-through">${info.originalPrice}</span>
                          <span className="text-2xl font-display font-black text-gray-900 ml-1">${info.price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 mb-4">
                        {info.items.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <CheckCircle2 size={10} className="text-gray-300 shrink-0" /> {item}
                          </div>
                        ))}
                        {info.items.length > 4 && (
                          <div className="text-[11px] text-gray-400 italic">+{info.items.length - 4} more</div>
                        )}
                      </div>

                      <button
                        disabled={isBuying}
                        onClick={() => handleBuyNow(key)}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                      >
                        {isBuying ? (
                          <><Loader2 size={16} className="animate-spin" /> Processing…</>
                        ) : (
                          <><Gift size={16} /> Add to My Library — ${info.price} <ArrowRight size={16} /></>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-3 text-[9px] text-gray-400 font-medium uppercase tracking-wide mt-2.5">
                        <span className="flex items-center gap-1"><ShieldCheck size={9} /> 7-Day Refund</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Lock size={9} /> Secured</span>
                        <span>•</span>
                        <span>One-time</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── BOOKMARK REMINDER ─── */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-center ty-fade" style={{ animationDelay: "0.5s" }}>
          <p className="text-blue-800 font-bold text-sm mb-1">📌 Bookmark This Page</p>
          <p className="text-blue-700 text-xs leading-relaxed">
            Save this page so you can come back to your access links anytime.
            <br />Press <kbd className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">Ctrl+D</kbd> (or <kbd className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">⌘+D</kbd> on Mac) to bookmark.
          </p>
        </div>

        {/* ─── SUPPORT ─── */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 ty-fade" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-emerald-800 text-sm mb-1">Need Help? We're Here 24/7</p>
              <p className="text-emerald-700 text-xs leading-relaxed mb-3">
                Didn't receive the email? Can't access a link? Take a screenshot of this page and send it to us.
              </p>
              <a
                href="https://wa.me/919198747810"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ─── EMAIL FALLBACK ─── */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-xs text-gray-500 ty-fade" style={{ animationDelay: "0.7s" }}>
          <p className="mb-2 font-medium">All access links were also sent to <strong className="text-gray-700">{email}</strong></p>
          <button
            onClick={() => window.location.href = "mailto:"}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white font-bold px-4 py-2 rounded-lg transition-colors text-xs"
          >
            <Mail size={12} /> Open Email App
          </button>
        </div>

        {/* ─── SOCIAL PROOF ─── */}
        <div className="mt-10 text-center ty-fade" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
          </div>
          <p className="text-gray-500 text-xs italic">"Best $9 I've ever spent. The full bundle upgrade was a no-brainer too."</p>
          <p className="text-gray-400 text-[10px] mt-1 font-bold">— 50,000+ students worldwide</p>
        </div>
      </div>

      {/* ─── PAYMENT MODAL ─── */}
      {showPaymentFor && PRODUCT_CATALOG[showPaymentFor] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowPaymentFor(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-lg font-bold text-gray-900">{PRODUCT_CATALOG[showPaymentFor].title}</h3>
              <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                ${PRODUCT_CATALOG[showPaymentFor].price}
              </div>
            </div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
            <div className="relative mb-3">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none"
              />
            </div>
            <ModernPaymentForm
              bare
              email={email}
              onSuccess={() => completePurchase(showPaymentFor)}
              amount={`$${PRODUCT_CATALOG[showPaymentFor].price}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYouPage;
