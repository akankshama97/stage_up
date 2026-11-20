import React from 'react';
import {
  ArrowRight,
  MapPin,
  Zap,
  CheckCircle2,
  Flame,
  Play,
  ShieldCheck,
  User,
  LogOut,
  Lock,
  Sparkles,
  Check,
  BadgeCheck
} from 'lucide-react';
import recruiterImg from '../assets/recruiter-profile.jpg';

export default function SplashScreen({
  onStart,
  onSelectRole,
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigateToLogin,
  onNavigateToSignup
}) {
  const servicePills = [
    { label: '🎞️ Reel Editing', price: '₹500' },
    { label: '🎨 Thumbnails', price: '₹250' },
    { label: '✍️ 45s Script', price: '₹400' },
    { label: '🎙️ Voiceovers', price: '₹600' },
    { label: '📸 Product Shoots', price: '₹1500' }
  ];

  return (
    <div
      id="splash"
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-100 selection:text-coral relative overflow-x-hidden font-sans"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-rose-500/[0.07] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-32 w-[650px] h-[650px] bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Modern Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: SU StageUp Brand Monogram & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-slate-950 to-slate-800 text-white flex items-center justify-center font-heading font-black text-xs sm:text-sm tracking-tight shadow-md shadow-slate-900/15 shrink-0">
              SU
            </div>
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-1.5">
              StageUp
              <span className="w-2.5 h-2.5 rounded-full bg-coral inline-block shadow-[0_0_8px_#FF385C]"></span>
            </span>
          </div>

          {/* Right: Auth buttons / User Profile + Soft "Verified HR" Tag */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 max-w-[110px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold capitalize">
                  {currentUser.role}
                </span>
                <button
                  onClick={onLogout}
                  className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => onNavigateToLogin ? onNavigateToLogin('recruiter') : onOpenAuth('recruiter')}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-coral transition-colors px-3 py-1.5 cursor-pointer flex items-center gap-1.5"
                  title="Log in to existing account"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onNavigateToSignup ? onNavigateToSignup('recruiter') : onOpenAuth('recruiter')}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  title="Create a new account"
                >
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Soft "Verified HR" Tag */}
            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-semibold shrink-0">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified HR</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Split-Screen Hero Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 w-full items-start">
          
          {/* ======================================================== */}
          {/* 2. LEFT HALF: Punchy Hero Content & Trust Factors         */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7">
            
            {/* Eye-catching pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-coral text-xs font-bold w-fit shadow-xs">
              <Flame className="w-3.5 h-3.5 text-coral fill-coral" />
              <span>Skip the CV • Show Your Skill</span>
            </div>

            {/* High-Contrast Headline with Gradient Accent */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Hire Verified <br />
              <span className="bg-gradient-to-r from-coral via-rose-500 to-indigo-600 bg-clip-text text-transparent">
                Indian Creators.
              </span>
            </h1>

            {/* Breathable Subtitle Description */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl">
              Watch 30-second proof reels of top Indian video editors, thumbnail artists &amp; scriptwriters. Transparent prices, direct WhatsApp chat, zero agency commission.
            </p>

            {/* Modern Service Pill Tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              {servicePills.map((pill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs sm:text-[13px] text-slate-800 font-medium hover:border-coral/50 hover:shadow-md hover:-translate-y-0.5 transition-all shrink-0 cursor-default"
                >
                  <span>{pill.label}</span>
                  <span className="text-coral font-bold font-heading">{pill.price}</span>
                </div>
              ))}
            </div>

            {/* Glassmorphic Highlights Box */}
            <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 p-5 sm:p-6 space-y-3.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-coral" />
                  <span>Transparent Starting Rate</span>
                </span>
                <span className="font-bold text-slate-900 font-heading text-xs sm:text-sm">
                  ₹250 - ₹1500 / gig
                </span>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-coral" />
                  <span>Active Creators in</span>
                </span>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                  Noida • Delhi • Mumbai • BLR
                </span>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                  <span>Average Turnaround</span>
                </span>
                <span className="font-bold text-forest font-heading text-xs sm:text-sm">
                  Under 24 Hours
                </span>
              </div>
            </div>

            {/* Animated Social Proof */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="flex -space-x-2.5 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=120&q=80"
                  alt="Priya Sharma"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover shadow-xs hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                  alt="Arjun Mehta"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover shadow-xs hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Sneha Patel"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover shadow-xs hover:scale-110 transition-transform duration-200"
                />
              </div>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-snug">
                <strong className="text-slate-900 font-bold">450+ creators</strong> uploaded proof reels this week
              </p>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 3. RIGHT HALF: Creative Reels Callout & Interactive Cards */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            
            {/* Call-to-Action Video Card: Cinematic Preview for "Watch Talent Reels" */}
            <div
              onClick={onStart}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800/80 shadow-[0_16px_40px_-6px_rgba(255,56,92,0.25)] hover:shadow-[0_24px_50px_-4px_rgba(255,56,92,0.35)] transition-all duration-300 hover:-translate-y-1 bg-slate-950"
            >
              {/* Cinematic Background Image with rich dark gradient */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                  alt="Video editing timeline proof"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-coral/25 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badges over video */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
                    <span>Live Creator Reels</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-medium">
                    30s Uncut Proof
                  </div>
                </div>

                {/* Big Center Play Button in Radiant Coral */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-coral to-rose-600 group-hover:from-rose-600 group-hover:to-coral text-white flex items-center justify-center shadow-[0_0_35px_rgba(255,56,92,0.6)] group-hover:scale-110 transition-all duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-5 sm:p-6 bg-slate-950 text-white border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2 group-hover:text-rose-300 transition-colors">
                    <span>Watch Talent Reels</span>
                    <ArrowRight className="w-5 h-5 text-coral group-hover:translate-x-1.5 transition-transform" />
                  </h3>
                  <span className="text-xs font-semibold text-coral bg-coral/15 px-3 py-0.5 rounded-full border border-coral/30">
                    Proof-First Feed
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Explore unedited timeline exports, DaVinci color grades &amp; viral hook cuts. Zero CVs, direct WhatsApp contact with top creators.
                </p>
              </div>
            </div>

            {/* Section Heading: "CHOOSE YOUR ROLE" */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                  CHOOSE YOUR ROLE
                </span>
                <span className="text-xs text-coral font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Instant Setup
                </span>
              </div>

              {/* Two Modern High-Contrast Interactive Cards Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                
                {/* Card A: Creator ("Mujhe Kaam Chahiye") */}
                <div
                  onClick={() => onSelectRole('talent')}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-coral hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Creator Image with Badges */}
                    <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&h=800&q=80"
                        alt="Indian Creator editing at desk"
                        className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold py-0.5 px-2 rounded-md">
                        Creator
                      </span>
                      <span className="absolute top-2 right-2 bg-forest text-white text-[9px] font-bold py-0.5 px-2 rounded-md shadow-xs">
                        Open
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-coral transition-colors leading-snug">
                      Mujhe Kaam Chahiye
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Post reels &amp; get direct client orders
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-semibold text-slate-700 group-hover:text-coral transition-colors">
                    <span>Enter as Creator</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card B: Recruiter ("Mujhe Talent Chahiye") */}
                <div
                  onClick={() => onSelectRole('recruiter')}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Recruiter Image with Badges */}
                    <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-3">
                      <img
                        src={recruiterImg}
                        alt="Founder hiring creative talent"
                        className="w-full h-full object-cover object-[50%_0%] contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold py-0.5 px-2 rounded-md">
                        Recruiter
                      </span>
                      <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-bold py-0.5 px-2 rounded-md shadow-xs">
                        Hiring
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      Mujhe Talent Chahiye
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Hire &amp; view proof reels
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    <span>Hire Top Talent</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>

            {/* Modern Footer Trust Bar */}
            <div className="flex items-center justify-center gap-2 text-center pt-1 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Free forever for early listing • 100% Escrow Protection</span>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
