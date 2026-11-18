import React from 'react';
import { ArrowLeft, Check, Sparkles, ArrowRight } from 'lucide-react';
import recruiterImg from '../assets/recruiter-profile.jpg';

export default function RoleSelectScreen({ onSelectRole, onBack, currentUser, onOpenAuth }) {
  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-human bg-white border border-cream-border flex items-center justify-center text-ink hover:bg-cream-muted transition shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="font-heading font-bold text-sm tracking-tight text-ink">StageUp</span>
            <span className="text-[11px] block text-ink-muted">Step 1 of 2</span>
          </div>

          <div className="w-9 h-9 opacity-0"></div>
        </div>

        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-ink">
            Aap StageUp pe kis liye aaye ho?
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            Choose how you want to use the platform. You can always switch later.
          </p>
        </div>

        {/* 2 Simple Cards with Real Photos (NOT Icons!) */}
        <div className="space-y-4">
          {/* Card 1: Mujhe Kaam Chahiye */}
          <div
            onClick={() => onSelectRole('talent')}
            className="group cursor-pointer bg-white rounded-human border border-cream-border p-4 shadow-paper hover:border-coral transition duration-200 relative overflow-hidden"
          >
            <div className="flex gap-4 items-center">
              {/* Photo adjusted so face is completely in frame */}
              <div className="relative w-28 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-cream-border">
                <img
                  src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Indian Creator editing at desk"
                  className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1 left-1 right-1 bg-ink/80 text-cream text-[9px] font-medium py-0.5 px-1 rounded text-center backdrop-blur-none">
                  Creator
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 rounded bg-coral-light text-coral font-heading text-[10px] font-bold uppercase tracking-wider mb-1">
                  For Freelancers
                </div>
                <h3 className="font-heading text-lg font-bold text-ink leading-tight group-hover:text-coral transition">
                  Mujhe Kaam Chahiye
                </h3>
                <p className="text-xs text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                  Apne video reels, posters aur portfolio post karo. Brands se direct WhatsApp order paao.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1 text-forest font-medium">
                    <Check className="w-3 h-3 text-forest" /> Zero CV needed
                  </span>
                  <span>•</span>
                  <span>Set your own rate</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-cream-muted flex items-center justify-between text-xs font-heading font-semibold text-ink group-hover:text-coral">
              <span>Create talent card & show skills</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Mujhe Talent Chahiye */}
          <div
            onClick={() => onSelectRole('recruiter')}
            className="group cursor-pointer bg-white rounded-human border border-cream-border p-4 shadow-paper hover:border-coral transition duration-200 relative overflow-hidden"
          >
            <div className="flex gap-4 items-center">
              {/* User's Photo for Recruiter (Adjusted upwards so face is centered) */}
              <div className="relative w-28 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-cream-border">
                <img
                  src={recruiterImg}
                  alt="Founder hiring creative talent"
                  className="w-full h-full object-cover object-[50%_0%] contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1 left-1 right-1 bg-ink/80 text-cream text-[9px] font-medium py-0.5 px-1 rounded text-center backdrop-blur-none">
                  Hiring
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 rounded bg-forest-light text-forest font-heading text-[10px] font-bold uppercase tracking-wider mb-1">
                  For Founders & Brands
                </div>
                <h3 className="font-heading text-lg font-bold text-ink leading-tight group-hover:text-coral transition">
                  Mujhe Talent Chahiye
                </h3>
                <p className="text-xs text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                  Instagram reels jaisa vertical feed dekho. Direct work proof, clear price aur instant WhatsApp contact.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1 text-forest font-medium">
                    <Check className="w-3 h-3 text-forest" /> Gigs from ₹300
                  </span>
                  <span>•</span>
                  <span>No agency delay</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-cream-muted flex items-center justify-between text-xs font-heading font-semibold text-ink group-hover:text-coral">
              <span>Open reel feed & hire instantly</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* Auth direct shortcut */}
        {onOpenAuth && !currentUser && (
          <div className="mt-4 p-3 bg-white rounded-human border border-cream-border text-center shadow-xs">
            <p className="text-xs text-ink-secondary mb-2">
              Already have an account, or want to create a private recruiter account?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onOpenAuth('recruiter')}
                className="px-3 py-1.5 rounded-human bg-cream hover:bg-cream-muted text-ink font-heading font-bold text-xs border border-cream-border transition"
              >
                💼 Recruiter Login
              </button>
              <button
                onClick={() => onOpenAuth('talent')}
                className="px-3 py-1.5 rounded-human bg-coral-light hover:bg-coral-light/80 text-coral font-heading font-bold text-xs border border-coral/30 transition"
              >
                🎬 Creator Login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="py-4 text-center">
        <p className="text-[11px] text-ink-light">
          Built for creators in Noida, Delhi NCR, Mumbai, Bengaluru & across India 🇮🇳
        </p>
      </div>
    </div>
  );
}
