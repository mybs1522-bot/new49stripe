import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, CheckCircle, Users, X } from 'lucide-react';

export const getDriveUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;

export const RAW_JOINERS = [
  { name: "Emma R.", city: "New York", time: "2 min ago" },
  { name: "Daniel C.", city: "Toronto", time: "5 min ago" },
  { name: "Olivia B.", city: "Sydney", time: "8 min ago" },
  { name: "Marco R.", city: "Milan", time: "12 min ago" },
  { name: "Sophie L.", city: "London", time: "15 min ago" },
  { name: "James C.", city: "Chicago", time: "18 min ago" },
  { name: "Sarah K.", city: "Berlin", time: "22 min ago" },
  { name: "Ryan M.", city: "Dubai", time: "25 min ago" },
  { name: "Chloe P.", city: "Singapore", time: "30 min ago" },
  { name: "Alex D.", city: "Barcelona", time: "33 min ago" },
];

export const PROBLEM_POINTS = [
  { emoji: "⏰", text: "Spending countless frustrating hours on a single 3D view while clients constantly ask for more revisions?" },
  { emoji: "😰", text: "Feeling overwhelmed by complex software, fearing you'll never catch up to the top studios?" },
  { emoji: "🤖", text: "Watching AI generate beautiful designs in seconds and worrying your traditional skills will soon be irrelevant?" }
];

export const TRANSFORMATION_STORIES = [
  { name: "Emma R.", role: "Freelance Designer", before: "Struggling alone with YouTube tutorials. Designs looked fake, took days, and clients wouldn't pay well without arguments.", after: "Joined our community. With 24/7 team support, she mastered V-Ray + D5 Render AI. She now charges premium rates and finishes in a fraction of the time.", emoji: "✨" },
  { name: "Daniel C.", role: "Architecture Student", before: "Terrified of AI taking his future job. Felt his college degree wasn't teaching practical, modern software skills.", after: "We held his hand through the SketchUp → V-Ray → D5 workflow. He now uses AI to generate concepts and renders for final polish. Just landed a massive internship.", emoji: "🎓" }
];

export const PAGE_PREVIEWS_ROW1 = [
  '/renders/RENDER-1.jpg', '/renders/RENDER-2.jpg', '/renders/RENDER-3.jpg',
  '/renders/RENDER-4.jpg', '/renders/RENDER-5.jpg', '/renders/RENDER-6.jpg',
  '/renders/RENDER-7.jpg', '/renders/RENDER-8.jpg', '/renders/RENDER-9.jpg',
  '/renders/RENDER-10.jpg', '/renders/RENDER-11.jpg', '/renders/RENDER-12.jpg',
  '/renders/RENDER-13.jpg',
];
export const PAGE_PREVIEWS_ROW2 = [
  '/renders/RENDER-14.jpg', '/renders/RENDER-15.jpg', '/renders/RENDER-16.jpg',
  '/renders/RENDER-17.jpg', '/renders/RENDER-18.jpg', '/renders/RENDER-19.jpg',
  '/renders/RENDER-20.jpg', '/renders/RENDER-21.jpg', '/renders/RENDER-22.jpg',
  '/renders/RENDER-23.jpg', '/renders/RENDER-24.jpg', '/renders/RENDER-25.jpg',
];

export const FEAR_STATS = [
  { stat: '82%', label: 'of traditional 3D visualization tasks are actively being replaced by AI rendering tools right now.', icon: '📉' },
  { stat: '10x', label: 'faster output when you learn to comfortably partner with AI instead of fearing it.', icon: '🚀' },
  { stat: '24/7', label: 'Support from our team. We hold your hand through every single software hurdle so you never feel alone.', icon: '🤝' },
  { stat: '15 Days', label: 'From feeling stuck and overwhelmed, to creating portfolio-ready designs with total confidence.', icon: '⏳' },
];

/* ─── LOGO ─── */
export const Logo = () => (
  <div className="flex flex-col items-center text-center cursor-pointer group" onClick={() => window.location.href = '/'}>
    <span className="font-display font-bold text-lg tracking-tight leading-none text-slate-900 whitespace-nowrap">Avada</span>
    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-500 whitespace-nowrap mt-1">Design</span>
  </div>
);

/* ─── FLIP CLOCK ─── */
const FlipDigit = ({ value }: { value: string }) => (
  <div className="flip-digit-wrapper"><div className="flip-digit"><span>{value}</span></div></div>
);

/* ─── CTA WIDGET ─── */
export const CallToActionWidget = ({ timeLeft, onClick, headline, subtext }: { timeLeft: { h: number; m: number; s: number }; onClick: () => void; headline?: string; subtext?: string }) => {
  const f = (v: number) => v.toString().padStart(2, '0');
  const h = f(timeLeft.h), m = f(timeLeft.m), s = f(timeLeft.s);
  return (
    <div className="relative py-12 md:py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="max-w-2xl mx-auto relative z-10 text-center">
        {headline && <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 tracking-tight">{headline}</h3>}
        {subtext && <p className="text-zinc-400 text-sm mb-6">{subtext}</p>}
        {!headline && <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-6">🚨 TIMER IS TICKING. DON'T REGRET MISSING THIS.</p>}
        <div className="flex items-center justify-center gap-1 md:gap-2 mb-6">
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={h[0]} /><FlipDigit value={h[1]} /></div><span className="flip-clock-label">HRS</span></div>
          <span className="text-xl md:text-3xl font-bold text-zinc-600 -mt-4">:</span>
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={m[0]} /><FlipDigit value={m[1]} /></div><span className="flip-clock-label">MIN</span></div>
          <span className="text-xl md:text-3xl font-bold text-zinc-600 -mt-4">:</span>
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={s[0]} /><FlipDigit value={s[1]} /></div><span className="flip-clock-label">SEC</span></div>
        </div>
        <div className="mb-6">
          <p className="text-red-400 font-semibold text-sm mt-2">Special Offer — Don't miss this $9 deal</p>
        </div>
        <div className="w-full max-w-md mx-auto">
          <button onClick={onClick} className="cta-primary w-full text-white px-8 py-4 md:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.03] active:scale-[0.98] premium-stroke" style={{ background: 'linear-gradient(135deg, #f7a440 0%, #f7931e 100%)', boxShadow: '0 6px 20px -4px rgba(247,164,68,0.5), 0 12px 40px -8px rgba(247,147,30,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="text-lg md:text-xl font-display font-bold uppercase tracking-widest relative z-10">Start Your Rendering Career</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-orange-500" /> 7-Day Money-Back</div>
          <div className="w-[1px] h-3 bg-zinc-500"></div>
          <div className="flex items-center gap-1.5"><Zap size={14} className="text-orange-500" /> Instant Access</div>
          <div className="w-[1px] h-3 bg-zinc-500 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-1.5"><Users size={14} className="text-orange-500" /> Free Software Included</div>
        </div>
      </div>
    </div>
  );
};

/* ─── SOCIAL PROOF TOAST ─── */
export const SocialProofToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const show = () => { setVisible(true); setTimeout(() => { setVisible(false); setTimeout(() => setIdx(p => (p + 1) % RAW_JOINERS.length), 400); }, 2500); };
    const t1 = setTimeout(show, 8000);
    const t2 = setInterval(show, 22000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);
  const j = RAW_JOINERS[idx];
  return (
    <div className={`fixed bottom-20 left-3 z-[70] transition-all duration-400 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
        <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap"><span className="font-bold text-slate-800">{j.name}</span> from {j.city} just enrolled</p>
      </div>
    </div>
  );
};

/* ─── CONSTANTS ─── */
export const VALUE_STACK_ITEMS = [
  { name: 'SketchUp 3D Modeling Course', value: 'Included' },
  { name: 'V-Ray Photo-Realism Masterclass', value: 'Included' },
  { name: 'D5 Real-Time AI Rendering', value: 'Included' },
  { name: '10,000+ Premium Texture Library', value: 'Included' },
  { name: '2,000+ Drag-and-Drop 3D Models', value: 'Included' },
  { name: 'Software Installation Hub', value: 'Included' },
  { name: '24/7 Team Access & Portfolio Review', value: 'Included' },
  { name: 'Certified Digital Diploma', value: 'Included' },
];

export const TESTIMONIALS_LANDING = [
  { name: 'Emma R.', role: 'Freelance Designer', location: 'Los Angeles, USA', content: 'I used to cry when V-Ray crashed. Literally. The support team is so incredibly kind and patient. Now I use D5 Render AI so well that I feel completely secure in my career.' },
  { name: 'James C.', role: 'Senior Architect', location: 'New York, USA', content: 'I feared AI would replace my studio. But Avada held my hand through the transition. We now use SketchUp + D5 Render to generate gorgeous concepts for clients in minutes.' },
  { name: 'Sophie L.', role: '3D Visualizer', location: 'London, UK', content: 'The step-by-step guidance is amazing for beginners. Whenever my scene looks dark or weird, I just ask the support team. They are absolute lifesavers.' },
  { name: 'Daniel C.', role: 'Architecture Student', location: 'Toronto, Canada', content: 'I felt so behind in college because they still teach completely outdated methods. Within two weeks here, I gained the confidence to start taking well-paying projects.' },
  { name: 'Olivia B.', role: 'Interior Designer', location: 'Sydney, Australia', content: 'To have someone to actually look at your screen and say "Oh, simply press this button" saves weeks of frustration. Best $9 I ever spent.' },
  { name: 'Marco R.', role: 'Landscape Architect', location: 'Milan, Italy', content: 'The continuous support makes learning stress-free. D5 Render combined with V-Ray is just magical. It took away all my anxiety about falling behind.' },
  { name: 'Sarah K.', role: 'Studio Owner', location: 'Berlin, Germany', content: 'My team of 4 now works with zero stress because we integrated the SketchUp-V-Ray-D5 pipeline. No more late nights before client meetings.' },
  { name: 'Ryan M.', role: 'Freelance Visualizer', location: 'Dubai, UAE', content: 'I almost quit 3D entirely because it felt too overwhelming. The friendly support team here broke it down to be so simple. I owe them my entire successful freelance business.' },
  { name: 'Chloe P.', role: 'Design Student', location: 'Singapore', content: 'Started from absolute zero. I didn\'t even know what SketchUp was. 15 days later, thanks to their constant hand-holding, my portfolio landed me a paid studio gig.' },
  { name: 'Alex D.', role: 'Architect & Educator', location: 'Barcelona, Spain', content: 'I teach at a university, and sadly, we don\'t provide this level of modern, practical support. I genuinely recommend this to all my students to secure their futures.' },
];

export const FAQ_ITEMS_LANDING = [
  { question: "I'm terrified of AI taking my job. Will this help?", answer: "We completely understand that fear! AI is scary if you ignore it, but it's an incredible superpower when you master it. We will hold your hand and teach you exactly how to use D5 Render AI as your personal assistant, making you brilliantly fast and completely irreplaceable." },
  { question: "I am a complete beginner and get overwhelmed easily. Is this for me?", answer: "Yes, this program was built exactly with you in mind. We know learning software can be intimidating. We start from the absolute basics ('how to click here') and our team is always a WhatsApp message away to hold your hand when you feel stuck." },
  { question: "Are you really going to help me, or is this just another course?", answer: "This is a true 24/7 support community. When your render looks weird or your software crashes, you don't have to figure it out alone. You reach out to us, and we patiently help you fix it. Your success is our personal mission." },
  { question: "Is it really just $9? What's the catch?", answer: "No catch! We simply want to make high-quality, supportive design education accessible to everyone. It's a one-time payment of $9 for lifetime access to SketchUp + V-Ray + D5 Render courses and our 24/7 support team." },
  { question: "Do I need to buy expensive software subscriptions?", answer: "Not at all. We will show you exactly how to easily access official free or student versions of the software. We want you earning, not spending unnecessarily on expensive licenses." },
  { question: "What if I feel like it's not working for me?", answer: "We want this to be completely stress-free for you. If you join and feel it's not a comforting and productive fit, just email us within 7 days. We will refund your $9 immediately, no questions asked, and we'll still be rooting for you!" },
  { question: "Can I access the training safely on my mobile?", answer: "Yes! All courses are hosted clearly online and work perfectly on any device — laptop, tablet, or phone. You can learn comfortably at your own pace anywhere." },
];

export const INCOME_TIERS = [
  { label: 'Single Render Charge', before: 'Struggling to ask $20', after: 'Confidently quoting $200+', icon: '🖼️' },
  { label: 'Interior Design Project', before: 'Rejected for poor 3D quality', after: 'Winning $2,000+ contracts', icon: '🏠' },
  { label: 'Time to Finish a Room', before: '3 Frustrating, Sleepless Nights', after: '2 Easy Hours with D5 Render AI', icon: '⏱️' },
  { label: 'Your Career Confidence', before: 'Constantly Anxious & Overwhelmed', after: 'Relaxed, In-Demand Professional', icon: '🌟' },
];

export const COURSES_LANDING = [
  {
    id: '3', title: 'SketchUp 3D', software: 'SketchUp', students: '55k',
    description: 'Struggling to visualize your 2D ideas? Let us guide you through building your first 3D home. It\'s much easier than building blocks when shown correctly.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo',
    learningPoints: ['Overcome the anxiety of a blank 3D screen', 'Organize models safely so they never crash your PC', 'Download beautiful pre-made models effortlessly'],
    workflowImpact: 'See your imagination comfortably come to life instantly.'
  },
  {
    id: '5', title: 'V-Ray Realism', software: 'V-Ray', students: '48k',
    description: 'Are your renders feeling cartoonish or fake looking? We\'ll hold your hand through the scary lighting settings until your images look like real photography.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
    learningPoints: ['Simple lighting setups that always work reliably', 'Creating comforting materials that feel real to touch', 'Gentle editing tricks to make any render pop beautifully'],
    workflowImpact: 'Relax and watch your clients gasp when they see their future home.'
  },
  {
    id: '7', title: 'D5 Render AI', software: 'D5 Render', students: '19k',
    description: 'Hate waiting frustrating hours for a single image to load? We\'ll teach you this AI-powered real-time engine safely so you can see your beautiful changes instantly as you work.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr',
    learningPoints: ['Set up D5 safely without overwhelming your computer', 'Painting comforting lights and materials in real-time', 'Creating cinematic 4K images effortlessly in seconds'],
    workflowImpact: 'Confidently make live design changes while the client watches.'
  },
];
