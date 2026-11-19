import React from 'react';
import { ArrowRight, MapPin, Zap, CheckCircle2, Flame, Play, ShieldCheck, User, LogOut, Lock } from 'lucide-react';
import recruiterImg from '../assets/recruiter-profile.jpg';

export default function SplashScreen({ onStart, onSelectRole, currentUser, onOpenAuth, onLogout, onNavigateToLogin, onNavigateToSignup }) {
  const servicePills = [
    { label: '🎬 Reel Editing', price: '₹500' },
    { label: '🎨 Thumbnails', price: '₹250' },
    { label: '✍️ 45s Script', price: '₹400' },
    { label: '🎙️ Voiceovers', price: '₹600' },
    { label: '📸 Product Shoots', price: '₹1500' }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col justify-between p-5 sm:p-6 max-w-md mx-auto pb-8 selection:bg-coral-light selection:text-coral overflow-hidden">
      {/* Soft Ambient Glows (tactile subtle aura) */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#FF4D2E]/[0.09] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-[#FF4D2E]/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header: Logo on left, Auth / Badge on right */}
      <header className="flex items-center justify-between gap-3 pt-1 pb-3">
        <div className="flex items-center gap-2.5">
          {/* SU Logo - Soft Black with zero blue */}
          <div className="w-8 h-8 rounded-[10px] bg-[#1A1A1A] text-white flex items-center justify-center font-heading font-extrabold text-xs tracking-tight shadow-sm shrink-0">
            SU
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-[#1A1A1A] flex items-center gap-1">
            StageUp
            <span className="w-2 h-2 rounded-full bg-[#FF4D2E] inline-block"></span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full bg-white border border-neutral-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold text-[#1A1A1A] max-w-[90px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded font-semibold capitalize">
                {currentUser.role}
              </span>
              <button
                onClick={onLogout}
                className="w-5 h-5 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition"
                title="Log out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigateToLogin ? onNavigateToLogin('recruiter') : onOpenAuth('recruiter')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-[#1A1A1A] text-[11px] font-bold transition shadow-xs"
                title="Log in to existing account"
              >
                <Lock className="w-3 h-3 text-neutral-600" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onNavigateToSignup ? onNavigateToSignup('recruiter') : onOpenAuth('recruiter')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[11px] font-bold transition shadow-xs"
                title="Create a new account"
              >
                <User className="w-3 h-3 text-[#FF4D2E]" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Verified Creators IN Badge (fully visible) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E7A4C]/10 border border-[#1E7A4C]/20 text-[#1E7A4C] text-[11px] font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A4C] animate-pulse"></span>
            <span>Verified 🇮🇳</span>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <div className="my-auto py-2">
        {/* Badge: "Skip the CV • Show Your Skill" */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D2E]/10 border border-[#FF4D2E]/20 text-[#FF4D2E] text-xs font-bold mb-3.5 shadow-xs">
          <Flame className="w-3.5 h-3.5 text-[#FF4D2E]" />
          <span>Skip the CV • Show Your Skill</span>
        </div>

        {/* Headline: Bigger, Bolder, Tighter Leading */}
        <h1 className="font-heading text-[32px] sm:text-[38px] font-extrabold tracking-[-0.03em] text-[#1A1A1A] leading-[1.14] mb-3">
          Hire Verified <br />
          Indian <span className="text-[#FF4D2E]">Creators.</span>
        </h1>

        {/* Subtext */}
        <p className="text-neutral-600 text-[13px] sm:text-sm leading-relaxed mb-4 max-w-sm">
          Watch 30-second proof reels of top Indian video editors, thumbnail artists & scriptwriters. Transparent prices, direct WhatsApp chat, zero agency commission.
        </p>

        {/* Horizontally Scrollable Price Pills with Hidden Scrollbar - Smooth edge-to-edge swiping */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-5 -mx-5 px-5 sm:-mx-6 sm:px-6 touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
          {servicePills.map((pill, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs whitespace-nowrap text-[#1A1A1A] font-medium hover:border-[#FF4D2E]/40 transition shrink-0"
            >
              <span>{pill.label}</span>
              <span className="text-[#FF4D2E] font-bold font-heading">{pill.price}</span>
            </div>
          ))}
        </div>

        {/* Info Card: Glass Card with Soft Shadow, Rounded Corners (16px), Grey Left / Bold Black Right */}
        <div className="bg-white/90 backdrop-blur-md rounded-[16px] border border-black/[0.06] p-4 shadow-[0_4px_24px_-4px_rgba(26,26,26,0.06)] mb-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF4D2E]" /> Transparent Starting Rate
            </span>
            <span className="font-bold text-[#1A1A1A] font-heading">₹250 - ₹1500 / gig</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF4D2E]" /> Active Creators In
            </span>
            <span className="font-semibold text-neutral-800">Noida • Delhi • Mumbai • BLR</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E7A4C]" /> Average Turnaround
            </span>
            <span className="font-bold text-[#1E7A4C] font-heading">Under 24 Hours</span>
          </div>
        </div>

        {/* Social Proof: 450+ creators */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=120&q=80"
              alt="Priya Sharma"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
              alt="Arjun Mehta"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Sneha Patel"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs"
            />
          </div>
          <p className="text-xs text-neutral-600">
            <strong className="text-[#1A1A1A] font-semibold">450+ creators</strong> uploaded proof reels this week
          </p>
        </div>
      </div>

      {/* CTA Button & "CHOOSE YOUR ROLE" Section */}
      <div className="space-y-5 pt-3">
        {/* CTA Button: Coral Orange #FF4D2E with White Text, Soft Shadow, 14px radius, hover lift */}
        <button
          onClick={onStart}
          className="w-full bg-[#FF4D2E] hover:bg-[#e53e20] text-white font-heading font-bold text-sm py-3.5 px-5 rounded-[14px] shadow-[0_8px_20px_rgba(255,77,46,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Play className="w-4 h-4 text-white fill-white group-hover:scale-110 transition" />
          <span>Watch Talent Reels</span>
          <ArrowRight className="w-4 h-4 text-white ml-auto group-hover:translate-x-1 transition" />
        </button>

        {/* "CHOOSE YOUR ROLE" Section: Equal Height Cards, 16px Gap, 16px Radius, Badges */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-neutral-500">
              CHOOSE YOUR ROLE
            </span>
            <span className="text-[11px] text-[#FF4D2E] font-semibold">Instant Setup</span>
          </div>

          <div className="grid grid-cols-2 gap-4 items-stretch">
            {/* Card 1: Mujhe Kaam Chahiye */}
            <div
              onClick={() => onSelectRole('talent')}
              className="group cursor-pointer bg-white rounded-[16px] border border-black/[0.06] p-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:border-[#FF4D2E]/60 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative h-40 w-full rounded-[12px] overflow-hidden bg-neutral-100 border border-neutral-100 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&h=800&q=80"
                    alt="Mujhe Kaam Chahiye"
                    className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-[#1A1A1A]/85 text-white text-[9px] font-semibold py-0.5 px-1.5 rounded-[5px]">
                    Creator
                  </span>
                  <span className="absolute top-1.5 right-1.5 bg-[#1E7A4C] text-white text-[8px] font-bold py-0.5 px-1.5 rounded-[5px]">
                    Open
                  </span>
                </div>

                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#FF4D2E] transition-colors leading-snug">
                  Mujhe Kaam Chahiye
                </h4>
              </div>

              <p className="text-[11px] text-neutral-500 mt-1">
                Post reels & get gigs
              </p>
            </div>

            {/* Card 2: Mujhe Talent Chahiye */}
            <div
              onClick={() => onSelectRole('recruiter')}
              className="group cursor-pointer bg-white rounded-[16px] border border-black/[0.06] p-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:border-[#FF4D2E]/60 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative h-40 w-full rounded-[12px] overflow-hidden bg-neutral-100 border border-neutral-100 mb-2.5">
                  <img
                    src={recruiterImg}
                    alt="Mujhe Talent Chahiye"
                    className="w-full h-full object-cover object-[50%_0%] contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-[#1A1A1A]/85 text-white text-[9px] font-semibold py-0.5 px-1.5 rounded-[5px]">
                    Recruiter
                  </span>
                  <span className="absolute top-1.5 right-1.5 bg-[#FF4D2E] text-white text-[8px] font-bold py-0.5 px-1.5 rounded-[5px]">
                    Hiring
                  </span>
                </div>

                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#FF4D2E] transition-colors leading-snug">
                  Mujhe Talent Chahiye
                </h4>
              </div>

              <p className="text-[11px] text-neutral-500 mt-1">
                Hire from proof reels
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Assurance */}
        <div className="flex items-center justify-center gap-1.5 text-center pt-1 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E7A4C]" />
          <span>Free forever for early hiring • Zero platform commission</span>
        </div>
      </div>
    </div>
  );
}
