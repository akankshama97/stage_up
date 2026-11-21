import React from 'react';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import recruiterImg from '../assets/recruiter-profile.jpg';
import { Button, Card, Badge } from './common';

export default function RoleSelectScreen({
  onSelectRole,
  onBack,
  currentUser,
  onOpenAuth,
  onNavigateToLogin,
  onNavigateToSignup
}) {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between p-5 max-w-md mx-auto font-sans">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="w-9 h-9 p-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <span className="font-heading font-bold text-sm tracking-tight text-text">
              StageUp
            </span>
            <span className="text-[11px] block text-text-muted">
              Step 1 of 2
            </span>
          </div>

          <div className="w-9 h-9 opacity-0"></div>
        </div>

        <div className="mb-6">
          <Badge variant="muted" className="mb-2">
            Choose Your Goal
          </Badge>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-text">
            Aap StageUp pe kis liye aaye ho?
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Choose how you want to use the platform. You can switch anytime.
          </p>
        </div>

        {/* 2 Clean Token-Driven Interactive Cards */}
        <div className="space-y-4">
          {/* Card 1: Mujhe Kaam Chahiye */}
          <Card
            interactive
            onClick={() => onSelectRole('talent')}
            className="p-4"
          >
            <div className="flex gap-4 items-center">
              {/* Creator Photo */}
              <div className="relative w-28 h-32 rounded-btn overflow-hidden flex-shrink-0 bg-surface-muted border border-border">
                <img
                  src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Indian Creator editing at desk"
                  className="w-full h-full object-cover object-[50%_15%]"
                />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-text/80 text-surface text-[9px] font-medium py-0.5 px-1 rounded text-center">
                  Creator
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">
                  For Freelancers
                </div>
                <h3 className="font-heading text-base font-bold text-text leading-tight">
                  Mujhe Kaam Chahiye
                </h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                  Apne video reels, posters aur portfolio post karo. Brands se direct WhatsApp order paao.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1 text-success font-medium">
                    <Check className="w-3.5 h-3.5 text-success" /> Zero CV needed
                  </span>
                  <span>•</span>
                  <span>Set your rate</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs font-medium text-text">
              <span>Create talent card & show skills</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </div>
          </Card>

          {/* Card 2: Mujhe Talent Chahiye (with Recruiter Profile Image) */}
          <Card
            interactive
            onClick={() => onSelectRole('recruiter')}
            className="p-4"
          >
            <div className="flex gap-4 items-center">
              {/* Recruiter Photo */}
              <div className="relative w-28 h-32 rounded-btn overflow-hidden flex-shrink-0 bg-surface-muted border border-border">
                <img
                  src={recruiterImg}
                  alt="Founder hiring creative talent"
                  className="w-full h-full object-cover object-[50%_15%]"
                />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-text/80 text-surface text-[9px] font-medium py-0.5 px-1 rounded text-center">
                  Recruiter
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">
                  For Founders & Brands
                </div>
                <h3 className="font-heading text-base font-bold text-text leading-tight">
                  Mujhe Talent Chahiye
                </h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                  30-second proof reels dekho. Direct work proof, clear price aur instant WhatsApp contact.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1 text-success font-medium">
                    <Check className="w-3.5 h-3.5 text-success" /> Gigs from ₹250
                  </span>
                  <span>•</span>
                  <span>Direct contact</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs font-medium text-text">
              <span>Open reel feed & hire instantly</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </div>
          </Card>
        </div>

        {/* Auth direct shortcut */}
        {!currentUser && (
          <Card className="mt-4 p-3.5 text-center">
            <p className="text-xs text-text-muted mb-2">
              Already have an account, or want to create a private recruiter account?
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onNavigateToLogin
                    ? onNavigateToLogin('recruiter')
                    : onOpenAuth && onOpenAuth('recruiter')
                }
              >
                Recruiter Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  onNavigateToSignup
                    ? onNavigateToSignup('talent')
                    : onOpenAuth && onOpenAuth('talent')
                }
              >
                Creator Sign Up
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Footer Info */}
      <div className="py-4 text-center">
        <p className="text-[11px] text-text-muted">
          Built for creators in Noida, Delhi NCR, Mumbai, Bengaluru & across India
        </p>
      </div>
    </div>
  );
}
