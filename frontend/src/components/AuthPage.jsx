import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  Video,
  Sparkles,
  Check,
  TrendingDown,
  Building,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthPage({
  initialMode = 'login', // 'login' | 'signup'
  defaultRole = 'recruiter', // 'recruiter' | 'talent'
  onBack,
  onNavigateToLogin,
  onNavigateToSignup,
  onAuthSuccess
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [role, setRole] = useState(defaultRole); // 'recruiter' | 'talent'

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotTip, setShowForgotTip] = useState(false);

  // Interactive Live Escrow Card State
  const [escrowReleased, setEscrowReleased] = useState(false);

  const handleToggleMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (newMode === 'login' && onNavigateToLogin) {
      onNavigateToLogin();
    } else if (newMode === 'signup' && onNavigateToSignup) {
      onNavigateToSignup();
    }
  };

  // 1-Click Instant Demo Autofill
  const handleQuickDemo = (demoRole) => {
    setRole(demoRole);
    setErrorMsg('');
    setShowForgotTip(false);

    if (demoRole === 'recruiter') {
      if (mode === 'signup') setName('Akanksha (Brand Lead)');
      setEmailOrPhone('recruiter@stageup.in');
      setPassword('stageup123');
      setSuccessMsg('Recruiter credentials filled! Ready to sign in.');
    } else {
      if (mode === 'signup') setName('Priya Sharma (Creator)');
      setEmailOrPhone('talent@stageup.in');
      setPassword('stageup123');
      setSuccessMsg('Creator credentials filled! Ready to sign in.');
    }

    setTimeout(() => setSuccessMsg(''), 2500);
  };

  // Simulate Escrow Milestone Interactive Release
  const handleSimulateMilestone = () => {
    setEscrowReleased(prev => {
      const next = !prev;
      if (next) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6, x: 0.3 },
          colors: ['#10B981', '#E8472B', '#F59E0B']
        });
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name or brand name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email address or mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    const apiBase = import.meta.env.VITE_API_URL || '';
    const cleanEmail = emailOrPhone.includes('@') ? emailOrPhone.trim().toLowerCase() : '';
    const cleanPhone = !emailOrPhone.includes('@') ? emailOrPhone.trim() : '';

    if (mode === 'signup') {
      try {
        const payload = {
          name: name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          emailOrPhone: emailOrPhone.trim(),
          password,
          role,
          companyName: role === 'recruiter' ? (name.trim() || 'Brand Studio') : '',
          city: 'Delhi NCR',
          skills: role === 'recruiter' ? ['Reel Editors', 'Thumbnail Designers'] : ['Reel Editing - ₹500']
        };

        const res = await fetch(`${apiBase}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            if (rememberMe) {
              localStorage.setItem('stageup_auth_user', JSON.stringify(data.user));
              if (data.token) localStorage.setItem('stageup_auth_token', data.token);
            }
            setSuccessMsg(`Welcome to StageUp, ${data.user.name.split(' ')[0]}! Setting up your workspace...`);
            setTimeout(() => {
              onAuthSuccess(data.user, data.token);
              setIsLoading(false);
            }, 400);
            return;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          if (errData.error || errData.message) {
            setErrorMsg(errData.error || errData.message);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend signup unavailable, falling back to local demo account:', err);
      }
    } else {
      // Login Mode
      try {
        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailOrPhone: emailOrPhone.trim(),
            password
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            if (rememberMe) {
              localStorage.setItem('stageup_auth_user', JSON.stringify(data.user));
              if (data.token) localStorage.setItem('stageup_auth_token', data.token);
            }
            setSuccessMsg(`Welcome back, ${data.user.name.split(' ')[0]}! Opening feed...`);
            setTimeout(() => {
              onAuthSuccess(data.user, data.token);
              setIsLoading(false);
            }, 400);
            return;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          if (errData.error || errData.message) {
            setErrorMsg(errData.error || errData.message);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend login unavailable, falling back to local demo authentication:', err);
      }
    }

    // Client-side fallback authentication
    const isRecruiter = role === 'recruiter';
    const fallbackUser = {
      _id: `user_demo_${Date.now()}`,
      name: name.trim() || (isRecruiter ? 'Akanksha (Recruiter)' : 'Priya Sharma'),
      email: cleanEmail || (isRecruiter ? 'recruiter@stageup.in' : 'talent@stageup.in'),
      phone: cleanPhone || '+91 98112 43210',
      role,
      companyName: isRecruiter ? 'Apex Media Studio' : '',
      isPrivate: isRecruiter,
      skills: isRecruiter ? ['Reel Editors', 'Thumbnail Designers'] : ['Reel Editing', 'Color Grading'],
      avatar: isRecruiter
        ? '/recruiter-profile.jpg'
        : 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString()
    };

    if (rememberMe) {
      localStorage.setItem('stageup_auth_user', JSON.stringify(fallbackUser));
      localStorage.setItem('stageup_auth_token', `mock_token_${Date.now()}`);
    }

    setSuccessMsg(
      mode === 'signup'
        ? `Account created! Welcome, ${fallbackUser.name.split(' ')[0]}!`
        : `Signed in as ${fallbackUser.name}. Opening feed...`
    );

    setTimeout(() => {
      onAuthSuccess(fallbackUser, `mock_token_${Date.now()}`);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FFF7ED] to-[#F2FBF7] text-[#1A1A1A] font-sans selection:bg-orange-100 selection:text-[#E8472B] relative overflow-x-hidden flex flex-col justify-between">
      
      {/* Sunlit Soft Tinted Ambient Glows */}
      <div className="absolute top-0 -left-20 w-[550px] h-[550px] bg-amber-300/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-orange-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 right-0 w-[550px] h-[550px] bg-sky-300/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 1. TOP BAR                                                */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E7E0D3]/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          
          {/* Left: Back Link */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 border border-[#E7E0D3] text-sm font-medium text-[#5F5A50] hover:text-[#1A1A1A] hover:bg-orange-50/50 hover:border-orange-200 transition duration-150 cursor-pointer shadow-xs"
            aria-label="Back to marketplace"
          >
            <ArrowLeft className="w-4 h-4 text-[#E8472B]" />
            <span className="hidden sm:inline">Back to Marketplace</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Center: StageUp Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E8472B] via-[#F97316] to-[#FB923C] text-white flex items-center justify-center font-heading font-black text-xs shadow-md shadow-orange-500/20 select-none">
              SU
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#1A1A1A] flex items-center gap-1">
              StageUp
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            </span>
          </div>

          {/* Right: Mode Toggle Button */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="hidden md:inline text-[#5F5A50]">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => handleToggleMode(mode === 'login' ? 'signup' : 'login')}
              className="px-3.5 py-1.5 rounded-lg bg-white font-heading font-bold text-xs sm:text-sm text-[#E8472B] border border-orange-200 hover:bg-orange-50 transition duration-150 shadow-xs cursor-pointer"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT: DESKTOP SPLIT LAYOUT                     */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">

          {/* ------------------------------------------------------- */}
          {/* LEFT COLUMN: COLORFUL SHOWCASE & INTERACTIVE ESCROW     */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7">
            
            {/* Lively Trust Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-100 via-amber-100 to-emerald-100 border border-orange-200/80 text-xs font-semibold text-[#1A1A1A] w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[#C93A21] font-bold">100% Escrow Protected</span>
              <span className="text-gray-400">•</span>
              <span className="text-emerald-700 font-semibold">Zero Agency Markups</span>
            </div>

            {/* Core Value Headline */}
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1A1A1A] leading-[1.12]">
                Hire verified Indian creators{' '}
                <span className="relative whitespace-nowrap text-[#E8472B]">
                  without agency markups.
                  <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-orange-400/60" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="mt-3.5 text-sm sm:text-base text-[#5F5A50] leading-relaxed max-w-xl">
                Watch 30-second proof reels from top video editors, thumbnail designers and scriptwriters. Pay transparent rates directly through milestone escrow.
              </p>
            </div>

            {/* ----------------------------------------------------- */}
            {/* INTERACTIVE LIVE ESCROW DEAL PREVIEW CARD             */}
            {/* ----------------------------------------------------- */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E0D3] p-5 sm:p-6 shadow-[0_12px_36px_-6px_rgba(232,71,43,0.08),0_4px_16px_-2px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-200 hover:border-orange-300">
              
              {/* Card Header: Creator & Verification */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E0D3]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=120&q=80"
                      alt="Priya Sharma"
                      className="w-11 h-11 rounded-xl object-cover border-2 border-orange-200"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Verified Creator">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-sm text-[#1A1A1A]">Priya Sharma</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified Creator
                      </span>
                    </div>
                    <div className="text-xs text-[#5F5A50] mt-0.5">
                      DaVinci Resolve Colorist &bull; Sector 62, Noida
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#5F5A50] block">Deal Budget</span>
                  <span className="font-heading font-extrabold text-lg sm:text-xl text-[#1A1A1A]">
                    ₹12,500
                  </span>
                </div>
              </div>

              {/* Price Transparency Strip */}
              <div className="grid grid-cols-2 gap-2 my-3.5 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5F5A50] block">Agency Markup</span>
                    <span className="text-xs font-bold text-emerald-700">₹0 (Zero Fees)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-orange-200/60 pl-3">
                  <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-[#E8472B]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5F5A50] block">Payment State</span>
                    <span className="text-xs font-bold text-[#E8472B]">
                      {escrowReleased ? 'Milestone Payout Released' : 'Locked in Escrow'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1A1A1A] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E8472B]" />
                    <span>Project Milestone Status</span>
                  </span>
                  <span className="font-semibold text-emerald-700 text-[11px]">
                    {escrowReleased ? 'All Milestones Approved (100%)' : 'Milestone 2 of 3 Completed'}
                  </span>
                </div>

                {/* Step Indicators */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Script & Hook</span>
                    </div>
                    <span className="text-[10px] text-emerald-600">₹4,000 Approved</span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Rough Cut</span>
                    </div>
                    <span className="text-[10px] text-emerald-600">₹4,500 Approved</span>
                  </div>

                  <div className={`p-2 rounded-lg text-center transition-all duration-200 ${
                    escrowReleased
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-amber-50/80 border border-amber-200'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-800">
                      {escrowReleased ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">4K Color Grade</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                          <span>4K Color Grade</span>
                        </>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${escrowReleased ? 'text-emerald-600' : 'text-amber-700'}`}>
                      {escrowReleased ? '₹4,000 Released' : '₹4,000 in Escrow'}
                    </span>
                  </div>
                </div>

                {/* Interactive Simulation Button */}
                <button
                  type="button"
                  onClick={handleSimulateMilestone}
                  className="mt-2.5 w-full py-2 px-3 rounded-lg bg-white hover:bg-orange-50/80 border border-orange-200 text-xs font-semibold text-[#E8472B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {escrowReleased
                      ? 'Reset Escrow Simulation'
                      : 'Test Escrow Release (Click to Simulate)'}
                  </span>
                </button>
              </div>

            </div>

            {/* Trust Metrics Pill Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white/80 border border-[#E7E0D3] shadow-xs text-center">
                <span className="block font-heading font-extrabold text-base text-[#1A1A1A]">₹0</span>
                <span className="text-[11px] text-[#5F5A50]">Agency Markup</span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#E7E0D3] shadow-xs text-center">
                <span className="block font-heading font-extrabold text-base text-emerald-700">100%</span>
                <span className="text-[11px] text-[#5F5A50]">Escrow Payouts</span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#E7E0D3] shadow-xs text-center">
                <span className="block font-heading font-extrabold text-base text-orange-600">&lt; 24h</span>
                <span className="text-[11px] text-[#5F5A50]">Fast Turnaround</span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#E7E0D3] shadow-xs text-center">
                <span className="block font-heading font-extrabold text-base text-[#1A1A1A]">450+</span>
                <span className="text-[11px] text-[#5F5A50]">Verified Creators</span>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT COLUMN: CLEAN AUTHENTICATION CARD                 */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[460px] bg-white rounded-2xl border border-[#E7E0D3] shadow-[0_16px_40px_-8px_rgba(232,71,43,0.1),0_4px_16px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative">
              
              {/* 1. Mode Switcher (Log in vs Sign up) */}
              <div className="flex p-1 bg-[#F3EEE6] rounded-xl mb-5 border border-[#E7E0D3]">
                <button
                  type="button"
                  onClick={() => handleToggleMode('login')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-heading font-bold rounded-lg transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'login'
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-[#5F5A50] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#E8472B]" />
                  <span>Log in</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMode('signup')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-heading font-bold rounded-lg transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'signup'
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-[#5F5A50] hover:text-[#1A1A1A]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#E8472B]" />
                  <span>Sign up</span>
                </button>
              </div>

              {/* Card Heading */}
              <div className="mb-4">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
                  {mode === 'login' ? 'Welcome back to StageUp' : 'Create your StageUp account'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5F5A50] mt-1">
                  {mode === 'login'
                    ? 'Log in to view shortlisted reels, escrow deals and messages.'
                    : 'Join top creators and brands across India with direct escrow hiring.'}
                </p>
              </div>

              {/* 2. Role Selector Pills */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5F5A50] mb-1.5">
                  I AM A
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`py-2 px-3 rounded-xl border text-xs sm:text-[13px] font-heading font-bold flex items-center justify-center gap-2 transition duration-150 cursor-pointer ${
                      role === 'recruiter'
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-[#C93A21] border-[#E8472B] shadow-xs'
                        : 'bg-white text-[#5F5A50] border-[#E7E0D3] hover:bg-orange-50/40'
                    }`}
                  >
                    <Briefcase className={`w-3.5 h-3.5 ${role === 'recruiter' ? 'text-[#E8472B]' : 'text-gray-400'}`} />
                    <span>Recruiter / Brand</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('talent')}
                    className={`py-2 px-3 rounded-xl border text-xs sm:text-[13px] font-heading font-bold flex items-center justify-center gap-2 transition duration-150 cursor-pointer ${
                      role === 'talent'
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-[#C93A21] border-[#E8472B] shadow-xs'
                        : 'bg-white text-[#5F5A50] border-[#E7E0D3] hover:bg-orange-50/40'
                    }`}
                  >
                    <Video className={`w-3.5 h-3.5 ${role === 'talent' ? 'text-[#E8472B]' : 'text-gray-400'}`} />
                    <span>Creator / Talent</span>
                  </button>
                </div>
              </div>

              {/* 3. Compact 1-Click Demo Box */}
              <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/50 border border-orange-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E8472B]" />
                    <span>1-Click Instant Demo</span>
                  </span>
                  <span className="text-[10px] text-[#5F5A50] font-mono">Password: stageup123</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('recruiter')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      role === 'recruiter' && emailOrPhone.includes('recruiter')
                        ? 'bg-white border-[#E8472B] ring-1 ring-orange-200'
                        : 'bg-white/90 hover:bg-white border-orange-200/80'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-[#E8472B] shrink-0 font-bold text-[10px]">
                      HR
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#1A1A1A] truncate">Recruiter Demo</div>
                      <div className="text-[9px] text-[#5F5A50] truncate">recruiter@stageup.in</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('talent')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      role === 'talent' && emailOrPhone.includes('talent')
                        ? 'bg-white border-[#E8472B] ring-1 ring-orange-200'
                        : 'bg-white/90 hover:bg-white border-orange-200/80'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-bold text-[10px]">
                      CR
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#1A1A1A] truncate">Creator Demo</div>
                      <div className="text-[9px] text-[#5F5A50] truncate">talent@stageup.in</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}

              {/* 4. Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name / Brand Name when Sign up is selected */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#1A1A1A] mb-1">
                      {role === 'recruiter' ? 'Brand / Recruiter Name' : 'Creator Full Name'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        {role === 'recruiter' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'recruiter' ? 'e.g. Aarav Mehta (Zenith Media)' : 'e.g. Priya Sharma'}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-orange-50/20 border border-[#E7E0D3] focus:bg-white focus:border-[#E8472B] focus:ring-3 focus:ring-orange-500/15 text-xs sm:text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition"
                        required={mode === 'signup'}
                      />
                    </div>
                  </div>
                )}

                {/* Email or Phone Input */}
                <div>
                  <label className="block text-xs font-heading font-bold text-[#1A1A1A] mb-1">
                    Email address or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      {emailOrPhone.includes('@') ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => {
                        setEmailOrPhone(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder={
                        role === 'recruiter'
                          ? 'e.g. recruiter@stageup.in or 9811223344'
                          : 'e.g. talent@stageup.in or 9811243210'
                      }
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-orange-50/20 border border-[#E7E0D3] focus:bg-white focus:border-[#E8472B] focus:ring-3 focus:ring-orange-500/15 text-xs sm:text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-heading font-bold text-[#1A1A1A]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotTip(!showForgotTip)}
                      className="text-[11px] text-[#E8472B] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Enter password (min 6 characters)"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-orange-50/20 border border-[#E7E0D3] focus:bg-white focus:border-[#E8472B] focus:ring-3 focus:ring-orange-500/15 text-xs sm:text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {showForgotTip && (
                    <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      💡 <strong>Demo Password Tip:</strong> Use <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">stageup123</code> for all demo recruiter and creator accounts, or click the 1-Click Demo buttons above!
                    </div>
                  )}
                </div>

                {/* Keep Me Logged In */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5F5A50]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#E7E0D3] text-[#E8472B] accent-[#E8472B] focus:ring-orange-400"
                    />
                    <span>Keep me logged in on this device</span>
                  </label>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E8472B] via-[#F97316] to-[#EA580C] hover:from-[#C93A21] hover:to-[#C93A21] active:scale-[0.99] text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign in to StageUp' : 'Create StageUp Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 5. Subtle Bottom Trust Tags */}
              <div className="mt-6 pt-4 border-t border-[#E7E0D3] text-center">
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] text-[#5F5A50] flex-wrap font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Escrow Protected</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <span>🇮🇳</span>
                    <span>Verified Indian Creators</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-[#C93A21]">
                    <span>Zero Agency Fees</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E7E0D3]/80 bg-white/60 backdrop-blur-xs py-3.5 text-center px-4 space-y-1">
        <p className="text-xs text-[#5F5A50]">
          StageUp &bull; Direct Creator-to-Brand Marketplace India &bull; 100% Escrow Protection
        </p>
        <p className="text-[11px] font-semibold text-[#1A1A1A] flex items-center justify-center gap-1">
          Made by Akanksha Maurya <span className="text-red-500 animate-pulse">❤️</span>
        </p>
      </footer>

    </div>
  );
}
