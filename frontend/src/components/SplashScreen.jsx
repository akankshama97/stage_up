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
      className="min-h-screen bg-[#FAF8F6] text-[#1A1A1A] flex flex-col selection:bg-[#D45A3E]/15 selection:text-[#D45A3E] relative overflow-x-hidden font-sans"
    >
      {/* Subtle Warm Ambient Backdrop Glows */}
      <div className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-[#D45A3E]/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-[#D45A3E]/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-[#D45A3E]/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Navigation Bar (Full-width, sticky, subtle backdrop blur) */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FAF8F6]/85 border-b border-black/[0.05] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: SU StageUp Logo & Name in Bold Deep Charcoal */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-[#161616] text-white flex items-center justify-center font-heading font-extrabold text-xs sm:text-sm tracking-tight shadow-sm shrink-0">
              SU
            </div>
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#161616] flex items-center gap-1.5">
              StageUp
              <span className="w-2.5 h-2.5 rounded-full bg-[#D45A3E] inline-block shadow-xs"></span>
            </span>
          </div>

          {/* Right: Auth buttons / User Profile + Soft "Verified HR" Tag */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs sm:text-sm font-bold text-[#161616] max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-semibold capitalize">
                  {currentUser.role}
                </span>
                <button
                  onClick={onLogout}
                  className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => onNavigateToLogin ? onNavigateToLogin('recruiter') : onOpenAuth('recruiter')}
                  className="text-xs sm:text-sm font-semibold text-[#161616] hover:text-[#D45A3E] transition-colors px-2.5 py-1.5 cursor-pointer flex items-center gap-1"
                  title="Log in to existing account"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onNavigateToSignup ? onNavigateToSignup('recruiter') : onOpenAuth('recruiter')}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#D45A3E] hover:bg-[#b8482f] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#D45A3E]/25 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  title="Create a new account"
                >
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Soft "Verified HR" Tag */}
            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E7A4C]/10 border border-[#1E7A4C]/20 text-[#1E7A4C] text-[11px] sm:text-xs font-semibold shrink-0">
              <BadgeCheck className="w-3.5 h-3.5 text-[#1E7A4C]" />
              <span>Verified HR</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main 50/50 Split-Screen Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 w-full items-start">
          
          {/* ======================================================== */}
          {/* 2. LEFT HALF: Punchy Hero Content & Trust Factors         */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7">
            
            {/* Eye-catching pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D45A3E]/10 border border-[#D45A3E]/25 text-[#D45A3E] text-xs font-bold w-fit shadow-xs">
              <Flame className="w-3.5 h-3.5 text-[#D45A3E]" />
              <span>Skip the CV • Show Your Skill</span>
            </div>

            {/* Massive, High-Contrast Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[52px] xl:text-[58px] font-extrabold tracking-[-0.035em] text-[#161616] leading-[1.08]">
              Hire Verified <br />
              <span className="text-[#D45A3E]">Indian Creators.</span>
            </h1>

            {/* Clean, Breathable Description */}
            <p className="text-neutral-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl">
              Watch 30-second proof reels of top Indian video editors, thumbnail artists &amp; scriptwriters. Transparent prices, direct WhatsApp chat, zero agency commission.
            </p>

            {/* Spaced Service Pill Tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              {servicePills.map((pill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs sm:text-[13px] text-[#161616] font-medium hover:border-[#D45A3E]/50 hover:shadow-xs transition-all shrink-0"
                >
                  <span>{pill.label}</span>
                  <span className="text-[#D45A3E] font-bold font-heading">{pill.price}</span>
                </div>
              ))}
            </div>

            {/* Glassmorphic Highlights Box (translucent card with white/light border) */}
            <div className="w-full bg-white/75 backdrop-blur-md rounded-[20px] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-5 sm:p-6 space-y-3.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-600 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D45A3E]" />
                  <span>Transparent Starting Rate</span>
                </span>
                <span className="font-bold text-[#161616] font-heading text-xs sm:text-sm">
                  ₹250 - ₹1500 / gig
                </span>
              </div>

              <div className="h-px bg-neutral-200/70" />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-600 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D45A3E]" />
                  <span>Active Creators in</span>
                </span>
                <span className="font-semibold text-neutral-800 text-xs sm:text-sm">
                  Noida • Delhi • Mumbai • BLR
                </span>
              </div>

              <div className="h-px bg-neutral-200/70" />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-600 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E7A4C]" />
                  <span>Average Turnaround</span>
                </span>
                <span className="font-bold text-[#1E7A4C] font-heading text-xs sm:text-sm">
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
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#FAF8F6] object-cover shadow-xs hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                  alt="Arjun Mehta"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#FAF8F6] object-cover shadow-xs hover:scale-110 transition-transform duration-200"
                />
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Sneha Patel"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#FAF8F6] object-cover shadow-xs hover:scale-110 transition-transform duration-200"
                />
              </div>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-snug">
                <strong className="text-[#161616] font-bold">450+ creators</strong> uploaded proof reels this week
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
              className="group relative cursor-pointer overflow-hidden rounded-[22px] border border-black/[0.08] shadow-[0_14px_36px_-6px_rgba(212,90,62,0.20)] hover:shadow-[0_20px_48px_-4px_rgba(212,90,62,0.30)] transition-all duration-300 hover:-translate-y-1 bg-[#161616]"
            >
              {/* Cinematic Background Image with rich dark gradient */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                  alt="Video editing timeline proof"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/60 to-black/35" />
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#D45A3E]/30 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badges over video */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#D45A3E] animate-ping" />
                    <span>Live Creator Reels</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium">
                    30s Uncut Proof
                  </div>
                </div>

                {/* Big Center Play Button in Warm Terracotta */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#D45A3E] group-hover:bg-[#b8482f] text-white flex items-center justify-center shadow-[0_0_28px_rgba(212,90,62,0.65)] group-hover:scale-110 transition-all duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-5 sm:p-6 bg-[#161616] text-white">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2 group-hover:text-[#FFA08C] transition-colors">
                    <span>Watch Talent Reels</span>
                    <ArrowRight className="w-5 h-5 text-[#D45A3E] group-hover:translate-x-1.5 transition-transform" />
                  </h3>
                  <span className="text-xs font-semibold text-[#D45A3E] bg-[#D45A3E]/15 px-2.5 py-0.5 rounded-full border border-[#D45A3E]/30">
                    Proof-First Feed
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Explore unedited timeline exports, DaVinci color grades &amp; viral hook cuts. Zero CVs, direct WhatsApp contact with top creators.
                </p>
              </div>
            </div>

            {/* Section Heading: "CHOOSE YOUR ROLE" (subtitle: "Instant Setup") */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-500">
                  CHOOSE YOUR ROLE
                </span>
                <span className="text-xs text-[#D45A3E] font-semibold bg-[#D45A3E]/10 px-2.5 py-0.5 rounded-full border border-[#D45A3E]/20">
                  Instant Setup
                </span>
              </div>

              {/* Two Modern, High-Contrast Interactive Cards Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                
                {/* Card A: Creator ("Mujhe Kaam Chahiye") */}
                <div
                  onClick={() => onSelectRole('talent')}
                  className="group cursor-pointer bg-white rounded-[20px] border border-black/[0.08] p-3.5 sm:p-4 shadow-[0_2px_14px_-2px_rgba(0,0,0,0.05)] hover:border-[#D45A3E] hover:shadow-[0_12px_28px_-4px_rgba(212,90,62,0.18)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Creator Image with Badges */}
                    <div className="relative h-44 sm:h-48 w-full rounded-[14px] overflow-hidden bg-neutral-100 border border-neutral-100 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&h=800&q=80"
                        alt="Indian Creator editing at desk"
                        className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-[#161616]/85 backdrop-blur-xs text-white text-[10px] font-semibold py-0.5 px-2 rounded-[6px]">
                        Creator
                      </span>
                      <span className="absolute top-2 right-2 bg-[#1E7A4C] text-white text-[9px] font-bold py-0.5 px-2 rounded-[6px] shadow-xs">
                        Open
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-[#161616] group-hover:text-[#D45A3E] transition-colors leading-snug">
                      Mujhe Kaam Chahiye
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Post reels &amp; get gigs
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-heading font-semibold text-neutral-700 group-hover:text-[#D45A3E] transition-colors">
                    <span>Enter as Creator</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card B: Recruiter ("Mujhe Talent Chahiye") */}
                <div
                  onClick={() => onSelectRole('recruiter')}
                  className="group cursor-pointer bg-white rounded-[20px] border border-black/[0.08] p-3.5 sm:p-4 shadow-[0_2px_14px_-2px_rgba(0,0,0,0.05)] hover:border-[#D45A3E] hover:shadow-[0_12px_28px_-4px_rgba(212,90,62,0.18)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Recruiter Image with Badges */}
                    <div className="relative h-44 sm:h-48 w-full rounded-[14px] overflow-hidden bg-neutral-100 border border-neutral-100 mb-3">
                      <img
                        src={recruiterImg}
                        alt="Founder hiring creative talent"
                        className="w-full h-full object-cover object-[50%_0%] contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-[#161616]/85 backdrop-blur-xs text-white text-[10px] font-semibold py-0.5 px-2 rounded-[6px]">
                        Recruiter
                      </span>
                      <span className="absolute top-2 right-2 bg-[#D45A3E] text-white text-[9px] font-bold py-0.5 px-2 rounded-[6px] shadow-xs">
                        Hiring
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-[#161616] group-hover:text-[#D45A3E] transition-colors leading-snug">
                      Mujhe Talent Chahiye
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Hire &amp; view proof reels
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-heading font-semibold text-neutral-700 group-hover:text-[#D45A3E] transition-colors">
                    <span>Hire Top Talent</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle Footer Highlight */}
            <div className="flex items-center justify-center gap-1.5 text-center pt-1 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-[#1E7A4C]" />
              <span>Free forever for early listing • Zero platform commission</span>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
