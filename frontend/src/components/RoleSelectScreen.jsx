import React from 'react';
import { ArrowLeft, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import recruiterImg from '../assets/recruiter-profile.jpg';

export default function RoleSelectScreen({ onSelectRole, onBack, currentUser, onOpenAuth, onNavigateToLogin, onNavigateToSignup }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-5 max-w-md mx-auto selection:bg-rose-100 selection:text-coral font-sans">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="font-heading font-extrabold text-sm tracking-tight text-slate-900">StageUp</span>
            <span className="text-[11px] block text-slate-500 font-medium">Step 1 of 2</span>
          </div>

          <div className="w-9 h-9 opacity-0"></div>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-coral text-[11px] font-bold mb-2">
            <Sparkles className="w-3 h-3 text-coral" />
            <span>Choose Your Goal</span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
            Aap StageUp pe kis liye aaye ho?
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Choose how you want to use the platform. You can always switch later.
          </p>
        </div>

        {/* 2 Simple High-Contrast Interactive Cards */}
        <div className="space-y-4">
          {/* Card 1: Mujhe Kaam Chahiye */}
          <div
            onClick={() => onSelectRole('talent')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-coral hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex gap-4 items-center">
              {/* Photo with subtle rounded borders */}
              <div className="relative w-28 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Indian Creator editing at desk"
                  className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-900/85 text-white text-[9px] font-semibold py-0.5 px-1 rounded text-center backdrop-blur-xs">
                  Creator
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-coral font-heading text-[10px] font-bold uppercase tracking-wider mb-1">
                  For Freelancers
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 leading-tight group-hover:text-coral transition-colors">
                  Mujhe Kaam Chahiye
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  Apne video reels, posters aur portfolio post karo. Brands se direct WhatsApp order paao.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-forest font-semibold">
                    <Check className="w-3.5 h-3.5 text-forest" /> Zero CV needed
                  </span>
                  <span>•</span>
                  <span>Set your rate</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-semibold text-slate-800 group-hover:text-coral transition-colors">
              <span>Create talent card & show skills</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Mujhe Talent Chahiye */}
          <div
            onClick={() => onSelectRole('recruiter')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex gap-4 items-center">
              {/* User's Photo for Recruiter */}
              <div className="relative w-28 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                <img
                  src={recruiterImg}
                  alt="Founder hiring creative talent"
                  className="w-full h-full object-cover object-[50%_0%] contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-900/85 text-white text-[9px] font-semibold py-0.5 px-1 rounded text-center backdrop-blur-xs">
                  Hiring
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-heading text-[10px] font-bold uppercase tracking-wider mb-1">
                  For Founders & Brands
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  Mujhe Talent Chahiye
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  Instagram reels jaisa vertical feed dekho. Direct work proof, clear price aur instant WhatsApp contact.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-forest font-semibold">
                    <Check className="w-3.5 h-3.5 text-forest" /> Gigs from ₹300
                  </span>
                  <span>•</span>
                  <span>No agency delay</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
              <span>Open reel feed & hire instantly</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Auth direct shortcut */}
        {!currentUser && (
          <div className="mt-4 p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
            <p className="text-xs text-slate-600 mb-2">
              Already have an account, or want to create a private recruiter account?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onNavigateToLogin ? onNavigateToLogin('recruiter') : onOpenAuth && onOpenAuth('recruiter')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs border border-slate-200 transition"
              >
                💼 Recruiter Login
              </button>
              <button
                onClick={() => onNavigateToSignup ? onNavigateToSignup('talent') : onOpenAuth && onOpenAuth('talent')}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-coral font-heading font-bold text-xs border border-rose-200 transition"
              >
                🎬 Creator Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="py-4 text-center">
        <p className="text-[11px] text-slate-500">
          Built for creators in Noida, Delhi NCR, Mumbai, Bengaluru & across India 🇮🇳
        </p>
      </div>
    </div>
  );
}
