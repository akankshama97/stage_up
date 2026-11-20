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
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageSquare,
  Video,
  Check
} from 'lucide-react';

export default function LoginPage({
  onBack,
  onNavigateToSignup,
  onAuthSuccess,
  defaultRole = 'recruiter'
}) {
  const [role, setRole] = useState(defaultRole); // 'recruiter' | 'talent'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotTip, setShowForgotTip] = useState(false);

  // Quick 1-Click Demo Logins for instant evaluation
  const handleQuickDemo = (demoRole) => {
    setRole(demoRole);
    setErrorMsg('');
    setShowForgotTip(false);
    if (demoRole === 'recruiter') {
      setEmailOrPhone('recruiter@stageup.in');
      setPassword('stageup123');
    } else {
      setEmailOrPhone('talent@stageup.in');
      setPassword('stageup123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email address or phone number.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
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
            if (data.token) {
              localStorage.setItem('stageup_auth_token', data.token);
            }
          }
          setSuccessMsg(`Welcome back, ${data.user.name.split(' ')[0]}! Redirecting...`);
          setTimeout(() => {
            onAuthSuccess(data.user, data.token);
            setIsLoading(false);
          }, 400);
          return;
        }
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.message) {
          setErrorMsg(err.message);
          setIsLoading(false);
          return;
        }
      }
    } catch (networkErr) {
      console.warn('Backend login unavailable, using robust demo mode:', networkErr);
    }

    // Client-side demo fallback
    const isRecruiter = role === 'recruiter';
    const fallbackUser = {
      _id: isRecruiter ? 'recruiter_demo_user' : 'talent_demo_user',
      name: isRecruiter ? 'Rohit Sharma (Recruiter)' : 'Priya Sharma (Creator)',
      email: emailOrPhone.includes('@') ? emailOrPhone.trim() : `${role}@stageup.in`,
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+919811243210',
      role,
      companyName: isRecruiter ? 'Zenith Creative Studio' : '',
      city: 'Delhi NCR',
      avatar: isRecruiter
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    };

    if (rememberMe) {
      localStorage.setItem('stageup_auth_user', JSON.stringify(fallbackUser));
      localStorage.setItem('stageup_auth_token', `demo_token_${Date.now()}`);
    }

    setSuccessMsg(`Welcome back, ${fallbackUser.name.split(' ')[0]}! Redirecting...`);
    setTimeout(() => {
      onAuthSuccess(fallbackUser, `demo_token_${Date.now()}`);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div
      id="login-page"
      className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:flex-row selection:bg-rose-100 selection:text-coral font-sans overflow-x-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. LEFT HALF: 50% Desktop Width, Centered Login Panel                     */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-screen bg-slate-50 flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto">
        
        {/* Top Header Row with Logo and Create Account Link */}
        <header className="w-full max-w-md mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-200">
          {/* Back button + SU StageUp Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
              aria-label="Back"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-heading font-extrabold text-xs shadow-xs shrink-0">
                SU
              </div>
              <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-1">
                StageUp
                <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block shadow-[0_0_6px_#FF385C]"></span>
              </span>
            </div>
          </div>

          {/* Right: Create Account Link */}
          <button
            onClick={() => onNavigateToSignup(role)}
            className="text-xs sm:text-sm font-heading font-bold text-coral hover:underline cursor-pointer transition-colors"
          >
            Create Account
          </button>
        </header>

        {/* Centered Login Experience Container */}
        <div className="w-full max-w-md mx-auto my-auto py-5 sm:py-7">
          
          {/* Segmented Login / Sign Up Pill Toggle */}
          <div className="flex p-1 bg-slate-200/70 rounded-full mb-6 border border-slate-200">
            <button
              type="button"
              className="flex-1 py-2 text-xs sm:text-[13px] font-heading font-bold rounded-full bg-gradient-to-r from-coral to-rose-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToSignup(role)}
              className="flex-1 py-2 text-xs sm:text-[13px] font-heading font-semibold rounded-full text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Headline & Subtitle */}
          <div className="mb-5 sm:mb-6">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Welcome back to StageUp 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Log in to manage your talent shortlist, escrow orders, and direct client chats.
            </p>
          </div>

          {/* Role Selector: I AM LOGGING IN AS */}
          <div className="mb-4">
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-2">
              I AM LOGGING IN AS
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-[13px] font-heading font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  role === 'recruiter'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Recruiter / Brand</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('talent')}
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-[13px] font-heading font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  role === 'talent'
                    ? 'bg-coral text-white border-coral shadow-sm shadow-rose-500/25'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Creator / Freelancer</span>
              </button>
            </div>
          </div>

          {/* Compact Instant 1-Click Demo Strip */}
          <div className="mb-5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                ⚡ Instant 1-Click Demo
              </span>
              <span className="text-[10px] text-slate-400">Password: stageup123</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                  role === 'recruiter' && emailOrPhone.includes('recruiter')
                    ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Recruiter Demo</div>
                  <div className="text-[10px] text-slate-500 truncate">recruiter@stageup.in</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('talent')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                  role === 'talent' && emailOrPhone.includes('talent')
                    ? 'bg-rose-50 border-coral/40 ring-1 ring-coral/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center text-coral shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Creator Demo</div>
                  <div className="text-[10px] text-slate-500 truncate">talent@stageup.in</div>
                </div>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            
            {/* Email or Phone Input */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                Email address or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-heading font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotTip(!showForgotTip)}
                  className="text-[11px] text-coral hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {showForgotTip && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 animate-fadeIn">
                  💡 <strong>Demo Password Tip:</strong> Use <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">stageup123</code> for all demo recruiter and creator accounts, or click the 1-Click Demo buttons above!
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-coral focus:ring-coral/20 accent-coral"
                />
                <span>Keep me logged in on this device</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.99] text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/25 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to StageUp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sign Up Banner */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-600">
              Don't have a StageUp account yet?
            </p>
            <button
              type="button"
              onClick={() => onNavigateToSignup(role)}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-coral font-heading font-bold text-xs border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-coral" />
              <span>Create a Free Account (Recruiter / Creator)</span>
            </button>
          </div>

        </div>

        {/* Clean Trust Row Footer */}
        <footer className="w-full max-w-md mx-auto pt-4 pb-2 border-t border-slate-200">
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-600 mb-1.5 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              100% Escrow Protected
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 font-medium">
              <span>🇮🇳</span>
              Verified Indian Talent
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-600">Zero Agency Fee</span>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            StageUp — Skip the CV, Show Your Skill. Built for Indian Creators &amp; Modern Brands.
          </p>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT HALF: 50% Desktop Width, Full-Bleed Creative Showcase             */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen overflow-hidden bg-slate-950 text-white">
        
        {/* Full-Height Photographic Visual */}
        <img
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80"
          alt="Film production set with creative crew and lighting"
          className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.06] brightness-[0.88]"
        />

        {/* Dark Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-slate-950/60 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-coral/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Showcase Content Overlay Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 sm:p-10 xl:p-12">
          
          {/* Top Translucent Glass Highlight Cards */}
          <div className="space-y-3.5 max-w-lg">
            
            {/* Highlight Card 1: StageUp for Recruiter / Brand */}
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral to-rose-600 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold font-heading text-white tracking-tight flex items-center gap-1.5">
                    <span>StageUp for Recruiter / Brand</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Hire verified video editors, thumbnail designers &amp; writers
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/20 shrink-0">
                PRO
              </span>
            </div>

            {/* Highlight Card 2: Hire Verified Top Talent */}
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold font-heading text-white">Hire Verified Top Talent</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Under 24h Delivery
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=120&q=80"
                      alt="Creator Priya"
                      className="w-7 h-7 rounded-full border-2 border-black/40 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                      alt="Creator Arjun"
                      className="w-7 h-7 rounded-full border-2 border-black/40 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Creator Sneha"
                      className="w-7 h-7 rounded-full border-2 border-black/40 object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-slate-300">
                    <strong className="text-white font-bold">450+</strong> creators active
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-300">⭐ 4.9/5 Rating</span>
              </div>
            </div>

          </div>

          {/* Bottom Translucent Glass Callout Card */}
          <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-5 xl:p-6 shadow-2xl space-y-4 max-w-lg mt-auto">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold w-fit">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Verified Creative Production Network</span>
            </div>

            <h3 className="font-heading font-extrabold text-lg sm:text-xl xl:text-2xl text-white tracking-tight leading-snug">
              Elevate your next project with top-tier Indian creative talent.
            </h3>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-coral/20 flex items-center justify-center text-rose-300 shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Direct Chats</div>
                  <div className="text-[10px] text-slate-300 truncate">WhatsApp sync</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Secure Escrow</div>
                  <div className="text-[10px] text-slate-300 truncate">100% protected</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Curated Portfolios</div>
                  <div className="text-[10px] text-slate-300 truncate">30s proof reels</div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
