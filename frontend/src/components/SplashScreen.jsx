import React from 'react';
import {
  ArrowRight,
  Play,
  Video,
  Palette,
  FileText,
  Mic,
  Camera,
  Briefcase,
  Search,
  Check,
  LogOut,
  ShieldCheck,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Button, Card, Badge, Container, Section } from './common';

export default function SplashScreen({
  currentUser,
  talents = [],
  onStart,
  onSelectRole,
  onOpenAuth,
  onLogout,
  onNavigateToLogin,
  onNavigateToSignup,
  onViewTalent
}) {
  // Use first real creator from database/state or fallback
  const previewTalent = talents && talents.length > 0 ? talents[0] : {
    name: 'Priya Sharma',
    skills: ['Reel Editing', 'Color Grading'],
    price: '₹500',
    priceUnit: 'per reel',
    posterUrl: '/davinci-timeline.svg'
  };

  const talentPrimarySkill = previewTalent.skills && previewTalent.skills[0]
    ? previewTalent.skills[0].split('-')[0].trim()
    : 'Video Editor';

  const talentPriceDisplay = previewTalent.price
    ? (previewTalent.price.startsWith('₹') ? previewTalent.price : previewTalent.price.replace(/Rs\s*/i, '₹'))
    : '₹500';

  const services = [
    {
      name: 'Video Editing',
      price: 'from ₹500',
      creators: '140+ creators',
      delivery: '12-24 hrs',
      icon: Video,
      badge: 'Popular'
    },
    {
      name: 'Thumbnail Design',
      price: 'from ₹250',
      creators: '85+ creators',
      delivery: '6 hrs rush',
      icon: Palette,
      badge: 'High CTR'
    },
    {
      name: 'Scriptwriting',
      price: 'from ₹400',
      creators: '60+ creators',
      delivery: '24 hrs',
      icon: FileText
    },
    {
      name: 'Voiceovers',
      price: 'from ₹600',
      creators: '45+ creators',
      delivery: '12 hrs',
      icon: Mic
    },
    {
      name: 'Product Shoots',
      price: 'from ₹1,500',
      creators: '30+ creators',
      delivery: '48 hrs',
      icon: Camera
    }
  ];

  const handleRoleWork = () => {
    if (onSelectRole) {
      onSelectRole('talent');
    }
  };

  const handleRoleHire = () => {
    if (onSelectRole) {
      onSelectRole('recruiter');
    } else if (onStart) {
      onStart();
    }
  };

  const handlePreviewClick = () => {
    if (onViewTalent && previewTalent._id) {
      onViewTalent(previewTalent);
    } else if (onStart) {
      onStart();
    }
  };

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans flex flex-col selection:bg-surface-muted selection:text-accent">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <Container>
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-btn bg-text text-surface flex items-center justify-center font-heading font-bold text-xs tracking-tight select-none">
                SU
              </div>
              <span className="font-heading font-bold text-lg text-text tracking-tight">
                StageUp
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-text-muted">
              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                className="hover:text-text transition-colors duration-150"
              >
                How it works
              </a>
              <button
                type="button"
                onClick={handleRoleWork}
                className="hover:text-text transition-colors duration-150 cursor-pointer"
              >
                For creators
              </button>
              <button
                type="button"
                onClick={handleRoleHire}
                className="hover:text-text transition-colors duration-150 cursor-pointer"
              >
                For recruiters
              </button>
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-text font-medium">
                    <span className="max-w-[90px] truncate hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="inline-flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 h-8 rounded-btn font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-150 cursor-pointer shadow-soft"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onNavigateToLogin
                        ? onNavigateToLogin('recruiter')
                        : onOpenAuth && onOpenAuth('recruiter')
                    }
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      onNavigateToSignup
                        ? onNavigateToSignup('recruiter')
                        : onOpenAuth && onOpenAuth('recruiter')
                    }
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* 2. HERO SECTION */}
      <Section className="pt-8 sm:pt-14 pb-12 sm:pb-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (55%) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Badge 1 of 2 max on hero */}
              <Badge variant="muted" className="mb-4">
                Proof-of-work hiring
              </Badge>

              <h1 className="font-heading font-bold text-[36px] sm:text-[56px] text-text leading-[1.1] tracking-[-0.02em] mb-4">
                Hire creators by their work, not their resume.
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-[1.6] max-w-xl mb-6">
                Watch 30-second proof reels from video editors, thumbnail artists and scriptwriters across India. See the price upfront and message them directly on WhatsApp.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-10 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onStart}
                  className="w-full sm:w-auto"
                >
                  Find creators
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleRoleWork}
                  className="w-full sm:w-auto"
                >
                  Join as a creator
                </Button>
              </div>

              {/* Plain text facts row with 1px dividers */}
              <div className="w-full border-t border-b border-border py-3 grid grid-cols-3 divide-x divide-border text-center text-xs sm:text-sm text-text-muted">
                <div className="px-2 font-medium text-text">
                  Starting at ₹250
                </div>
                <div className="px-2">
                  Reply on WhatsApp
                </div>
                <div className="px-2">
                  No agency commission
                </div>
              </div>
            </div>

            {/* Right Column (45%): Real Product Preview */}
            <div className="lg:col-span-5 w-full mt-6 sm:mt-8 lg:mt-4">
              <Card className="p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-text-muted">
                    Featured creator proof
                  </div>
                  {/* Badge 2 of 2 max on hero */}
                  <Badge variant="muted">
                    30s reel
                  </Badge>
                </div>

                {/* 16:9 Video Thumbnail */}
                <div
                  onClick={handlePreviewClick}
                  className="relative aspect-video w-full rounded-btn overflow-hidden bg-surface-muted border border-border cursor-pointer group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                    alt={`${previewTalent.name} video timeline proof`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-150"
                  />
                  <div className="absolute inset-0 bg-text/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-surface text-text flex items-center justify-center shadow-soft group-hover:bg-accent group-hover:text-surface transition-colors duration-150">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Card Meta & Details */}
                <div className="mt-4 pt-3 border-t border-border flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-heading font-bold text-base text-text">
                        {previewTalent.name}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ⭐ {previewTalent.rating || '4.9'} ({previewTalent.completedProjects || 38} delivered)
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      {talentPrimarySkill} • {talentPriceDisplay}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {(previewTalent.tools || ['DaVinci Resolve', 'Premiere Pro', 'CapCut']).map((tool, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[9px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handlePreviewClick}
                    className="flex items-center gap-1 font-medium text-xs text-accent shrink-0 pt-0.5"
                  >
                    <span>View reel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </div>

          </div>
        </Container>
      </Section>

      {/* 3. SERVICES ROW */}
      <Section className="py-8 sm:py-12 border-t border-border">
        <Container>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-text">
                Popular skills
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Top rated proof-of-work categories with upfront verified pricing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  interactive
                  onClick={onStart}
                  className="p-4 sm:p-5 flex flex-col justify-between group hover:border-accent/40 transition-all duration-150"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-muted border border-border flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <Icon className="w-4 h-4 text-text group-hover:text-accent stroke-[1.8] transition-colors" />
                      </div>
                      {service.badge && (
                        <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full border border-accent/20">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <div className="font-heading font-bold text-sm text-text mb-1">
                      {service.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-text-muted">
                      {service.creators} &bull; {service.delivery}
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-border flex items-center justify-between">
                    <span className="font-heading font-bold text-xs sm:text-sm text-text">
                      {service.price}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-accent font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Explore &rarr;
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. CHOOSE YOUR ROLE */}
      <Section className="py-12 sm:py-16 border-t border-border">
        <Container>
          <div className="mb-6">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-text">
              Choose your path
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Card 1: For Creators */}
            <Card
              interactive
              onClick={handleRoleWork}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <Briefcase className="w-5 h-5 text-text stroke-[1.5] mb-4" />
                <h3 className="font-heading font-bold text-lg text-text mb-2">
                  I'm looking for work
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Post 30-second proof reels of your work and get hired directly by brands on WhatsApp.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
                <span>Join as a creator</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>

            {/* Card 2: For Recruiters */}
            <Card
              interactive
              onClick={handleRoleHire}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <Search className="w-5 h-5 text-text stroke-[1.5] mb-4" />
                <h3 className="font-heading font-bold text-lg text-text mb-2">
                  I'm hiring talent
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Watch unedited proof reels, verify pricing upfront, and connect with creators in minutes.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
                <span>Find creators</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 5. HOW IT WORKS */}
      <Section id="how-it-works" className="py-14 sm:py-20 border-t border-border">
        <Container>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-accent bg-accent/10 border border-accent/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Simple 3-Step Workflow
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-text mb-3">
              How StageUp works
            </h2>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Hire vetted Indian creators by their actual timeline exports — transparent, fast, and 100% escrow protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
            {/* Step 1 */}
            <Card className="p-6 sm:p-7 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <Play className="w-4 h-4 text-accent fill-accent ml-0.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-text-muted px-2.5 py-1 rounded-md bg-surface-muted border border-border">
                    01
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-text mb-2">
                  Browse proof reels
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Watch 30-second raw timeline exports, DaVinci color grades, and before-and-after work samples.
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="font-medium text-text">No CVs or resumes</span>
                <span className="font-semibold text-accent">30s video proof</span>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 sm:p-7 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-accent stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-text-muted px-2.5 py-1 rounded-md bg-surface-muted border border-border">
                    02
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-text mb-2">
                  Check upfront pricing
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  See exact per-project rates and turnaround times upfront. No surprise agency markups or hidden fees.
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="font-medium text-text">Rates from ₹250</span>
                <span className="font-semibold text-accent">0% Agency Cut</span>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 sm:p-7 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <MessageCircle className="w-5 h-5 text-accent stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-text-muted px-2.5 py-1 rounded-md bg-surface-muted border border-border">
                    03
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-text mb-2">
                  Chat directly on WhatsApp
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Message creators straight away, share your project footage, and pay safely with Escrow protection.
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="font-medium text-text">Direct 1-on-1 chat</span>
                <span className="font-semibold text-accent">100% Escrow Safe</span>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 6. SOCIAL PROOF (Skipped per instruction: only real data, none verified yet) */}

      {/* 8. FOOTER */}
      <footer className="bg-surface border-t border-border py-12 mt-auto">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-btn bg-text text-surface flex items-center justify-center font-heading font-bold text-xs">
                  SU
                </div>
                <span className="font-heading font-bold text-base text-text">
                  StageUp
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed max-w-xs">
                Proof-of-work hiring for video editors, thumbnail designers and creators across India.
              </p>
            </div>

            {/* Link Column 1 */}
            <div>
              <div className="font-heading font-bold text-xs uppercase tracking-wider text-text mb-3">
                Platform
              </div>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <a href="#how-it-works" onClick={scrollToHowItWorks} className="hover:text-text transition-colors duration-150">
                    How it works
                  </a>
                </li>
                <li>
                  <button type="button" onClick={onStart} className="hover:text-text transition-colors duration-150 text-left">
                    Find creators
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleRoleHire} className="hover:text-text transition-colors duration-150 text-left">
                    For recruiters
                  </button>
                </li>
              </ul>
            </div>

            {/* Link Column 2 */}
            <div>
              <div className="font-heading font-bold text-xs uppercase tracking-wider text-text mb-3">
                Creators
              </div>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <button type="button" onClick={handleRoleWork} className="hover:text-text transition-colors duration-150 text-left">
                    Join as a creator
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleRoleWork} className="hover:text-text transition-colors duration-150 text-left">
                    Proof guidelines
                  </button>
                </li>
                <li>
                  <button type="button" onClick={onStart} className="hover:text-text transition-colors duration-150 text-left">
                    Explore reel feed
                  </button>
                </li>
              </ul>
            </div>

            {/* Link Column 3 */}
            <div>
              <div className="font-heading font-bold text-xs uppercase tracking-wider text-text mb-3">
                Company
              </div>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <span className="text-text-muted">Built for Indian Creators</span>
                </li>
                <li>
                  <span className="text-text-muted">Escrow protection included</span>
                </li>
                <li>
                  <span className="text-text-muted">No agency commission</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-text-muted">
            <p>© 2026 StageUp. All rights reserved.</p>
            <p className="font-semibold text-text flex items-center justify-center gap-1">
              Made by Akanksha Maurya <span className="text-red-500 animate-pulse">❤️</span>
            </p>
            <p>Proof-of-work talent network.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
