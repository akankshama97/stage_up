import React, { useState, useEffect } from 'react';
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
  Building,
  Sparkles,
  Check,
  Star
} from 'lucide-react';

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

  // Form Fields - Always start completely empty
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

  // Reset all fields on mount or mode switch
  useEffect(() => {
    setName('');
    setEmailOrPhone('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setShowForgotTip(false);
  }, [mode]);

  const handleToggleMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'login' && onNavigateToLogin) {
      onNavigateToLogin();
    } else if (newMode === 'signup' && onNavigateToSignup) {
      onNavigateToSignup();
    }
  };

  // Quick Demo Helper
  const handleQuickDemo = (demoRole) => {
    setRole(demoRole);
    setErrorMsg('');
    setShowForgotTip(false);

    if (demoRole === 'recruiter') {
      if (mode === 'signup') setName('Akanksha (Brand Lead)');
      setEmailOrPhone('recruiter@stageup.in');
      setPassword('stageup123');
      setSuccessMsg('Recruiter demo credentials filled!');
    } else {
      if (mode === 'signup') setName('Priya Sharma (Creator)');
      setEmailOrPhone('talent@stageup.in');
      setPassword('stageup123');
      setSuccessMsg('Creator demo credentials filled!');
    }

    setTimeout(() => setSuccessMsg(''), 2500);
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
            setSuccessMsg(`Welcome to StageUp, ${data.user.name.split(' ')[0]}!`);
            setTimeout(() => {
              onAuthSuccess(data.user, data.token);
              setIsLoading(false);
            }, 300);
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
            setSuccessMsg(`Welcome back, ${data.user.name.split(' ')[0]}!`);
            setTimeout(() => {
              onAuthSuccess(data.user, data.token);
              setIsLoading(false);
            }, 300);
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
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-gray-900 font-sans antialiased selection:bg-red-100 selection:text-[#E53935] flex flex-col justify-between p-3 sm:p-5 lg:p-6">
      
      {/* Outer Shell: Connects both sides inside one harmonious container */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN (7 Cols / ~55%): AESTHETIC STUDIO SHOWCASE    */}
        {/* ========================================================= */}
        <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 relative rounded-[28px] overflow-hidden shadow-xl border border-gray-900/10 flex-col justify-between p-8 xl:p-10 select-none bg-slate-950 min-h-[640px]">
          
          {/* Aesthetic Studio Background Image */}
          <img
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80"
            alt="DaVinci Resolve video editor studio with cinema timeline"
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.03] filter brightness-[0.88] contrast-[1.05]"
          />

          {/* Warm Cinematic Studio Overlay (Deep Charcoal to Warm Amber/Red) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E53935]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Branded StageUp Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
              <div className="w-6 h-6 rounded-lg bg-[#E53935] text-white flex items-center justify-center font-heading font-black text-xs shadow-md shadow-red-500/30">
                S
              </div>
              <span className="font-heading font-bold text-sm text-white tracking-tight">
                StageUp
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-white/80 font-medium">
                Creator Network
              </span>
            </div>

            <div className="text-xs text-white/80 font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              Proof-of-work hiring
            </div>
          </div>

          {/* Center/Bottom Showcase Content */}
          <div className="relative z-10 flex flex-col space-y-5 pt-20">
            
            {/* Floating Verified Creator Proof Widget (Visually connects to StageUp feed) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/25 text-white shadow-2xl flex items-center gap-3.5 max-w-md animate-fadeIn">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=150&q=80"
                  alt="Priya Sharma"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-heading font-bold text-sm text-white truncate">Priya Sharma</span>
                  <span className="text-[10px] bg-emerald-500/80 text-white px-2 py-0.2 rounded-full font-semibold">
                    Verified Editor
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-0.5">
                  <span>DaVinci Resolve</span>
                  <span>&bull;</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    4.9 (38 delivered)
                  </span>
                </div>
              </div>

              <div className="text-right pl-3 border-l border-white/15 shrink-0">
                <span className="text-[10px] text-white/70 block uppercase tracking-wider font-medium">Starts at</span>
                <span className="font-heading font-extrabold text-base text-white">₹500</span>
              </div>
            </div>

            {/* White Headline */}
            <h1 className="font-heading font-extrabold text-3xl xl:text-4xl 2xl:text-[40px] text-white leading-[1.16] tracking-tight max-w-xl">
              Hire verified Indian creators without agency markups.
            </h1>

            {/* 3 Glass Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>450+ Verified Creators</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>100% Escrow Protected</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-rose-300 stroke-[3]" />
                <span>Zero Agency Fees</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN (5 Cols / ~45%): COHESIVE CENTERED CARD      */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between rounded-[28px] bg-white border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 lg:p-10 xl:p-12 relative">
          
          {/* Top Bar: Back Link */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Back to marketplace</span>
            </button>
            
            <button
              onClick={() => handleToggleMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-semibold text-[#E53935] hover:underline cursor-pointer"
            >
              {mode === 'login' ? 'Create an account' : 'Already registered?'}
            </button>
          </div>

          {/* Form Container */}
          <div className="w-full my-auto py-2">
            
            {/* Logo Badge (Matching Left Column) */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#E53935] text-white flex items-center justify-center font-heading font-black text-lg shadow-md shadow-red-500/25 select-none">
                S
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-gray-900">
                StageUp
              </span>
            </div>

            {/* Heading & Subtext */}
            <div className="mb-5">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 tracking-tight leading-tight">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                {mode === 'login'
                  ? 'Sign in to access your talent feed, reels and orders'
                  : 'Join top creators and brands across India with zero agency markups'}
              </p>
            </div>

            {/* Tabs: Log in | Sign up */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-4 border border-gray-200">
              <button
                type="button"
                onClick={() => handleToggleMode('login')}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-heading font-bold rounded-lg transition duration-150 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('signup')}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-heading font-bold rounded-lg transition duration-150 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Label: I WANT TO with 2 buttons */}
            <div className="mb-4">
              <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                I WANT TO
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-[13px] font-heading font-bold flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer ${
                    role === 'recruiter'
                      ? 'border-[#E53935] text-[#E53935] bg-red-50/70 shadow-xs ring-1 ring-[#E53935]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className={`w-3.5 h-3.5 ${role === 'recruiter' ? 'text-[#E53935]' : 'text-gray-400'}`} />
                  <span>Hire Creators</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('talent')}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-[13px] font-heading font-bold flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer ${
                    role === 'talent'
                      ? 'border-[#E53935] text-[#E53935] bg-red-50/70 shadow-xs ring-1 ring-[#E53935]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Video className={`w-3.5 h-3.5 ${role === 'talent' ? 'text-[#E53935]' : 'text-gray-400'}`} />
                  <span>Work as Creator</span>
                </button>
              </div>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
              
              {/* Full Name (Sign up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-heading font-bold text-gray-800 mb-1">
                    {role === 'recruiter' ? 'Brand / Recruiter Name' : 'Creator Full Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {role === 'recruiter' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      name="stageup_full_name"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'recruiter' ? 'e.g. Zenith Media' : 'e.g. Priya Sharma'}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#E53935] focus:ring-2 focus:ring-red-500/15 text-gray-900 placeholder:text-gray-400 outline-none transition"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Input: Email or Mobile Number */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-800 mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {emailOrPhone.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    name="stageup_identifier"
                    autoComplete="off"
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter email or mobile number"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#E53935] focus:ring-2 focus:ring-red-500/15 text-gray-900 placeholder:text-gray-400 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Input: Password with Forgot password? */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-heading font-bold text-gray-800">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotTip(!showForgotTip)}
                      className="text-xs text-gray-500 hover:text-[#E53935] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="stageup_user_password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter password (min 6 characters)"
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#E53935] focus:ring-2 focus:ring-red-500/15 text-gray-900 placeholder:text-gray-400 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {showForgotTip && (
                  <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-center justify-between">
                    <span>Use demo password: <strong className="font-mono">stageup123</strong></span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo(role)}
                      className="font-bold underline"
                    >
                      Fill Demo
                    </button>
                  </div>
                )}
              </div>

              {/* Checkbox: Remember me on this device */}
              <div className="flex items-center justify-between text-xs text-gray-600 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#E53935] cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Solid Red Button: Log in */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-heading font-bold text-sm bg-[#E53935] hover:bg-[#D32F2F] text-white shadow-md shadow-red-500/25 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Please wait...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Log in' : 'Create account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom: Quick Demo: Recruiter - Creator */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">Quick Demo:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('recruiter')}
                  className="font-semibold text-gray-700 hover:text-[#E53935] transition-colors cursor-pointer hover:underline"
                >
                  Recruiter
                </button>
                <span className="text-gray-300">-</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('talent')}
                  className="font-semibold text-gray-700 hover:text-[#E53935] transition-colors cursor-pointer hover:underline"
                >
                  Creator
                </button>
              </div>
            </div>

          </div>

          {/* Footer: 100% Escrow Protected - Zero Agency Fees */}
          <div className="w-full pt-3 border-t border-gray-100 text-center space-y-1">
            <p className="text-xs text-gray-500 font-medium">
              100% Escrow Protected &bull; Zero Agency Fees
            </p>
            <p className="text-[11px] font-semibold text-gray-800 flex items-center justify-center gap-1">
              Made by Akanksha Maurya <span className="text-red-500 animate-pulse">❤️</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
