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
  Star,
  Users
} from 'lucide-react';

// 5 Indian Creator Avatars matching the verified talent roster
const creatorAvatars = [
  { name: 'Priya Sharma', src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { name: 'Arjun Verma', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Ananya Roy', src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=150&q=80' },
  { name: 'Rohan Mehta', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { name: 'Sneha Rao', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
];

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
    <div className="min-h-screen w-full bg-[#FAF7F2] text-stone-900 font-sans antialiased selection:bg-orange-100 selection:text-[#E8472B] flex flex-col justify-between p-3 sm:p-5 lg:p-6">
      
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
        {/* RIGHT COLUMN (5 Cols / ~45%): CARD AS IN USER REFERENCE  */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between items-center py-1 sm:py-2 relative">
          
          {/* Top Bar Navigation */}
          <div className="w-full max-w-[480px] flex items-center justify-between px-1 mb-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E8472B]" />
              <span>Back to marketplace</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs font-semibold text-[#E8472B] hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
              <span className="text-stone-300">|</span>
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Need help? Reach out at support@stageup.in or click Quick Demo below.');
                }}
                className="text-xs font-medium text-stone-400 hover:text-stone-700 transition"
              >
                Help
              </a>
            </div>
          </div>

          {/* Centered White Card (Exact layout from user reference image) */}
          <div className="w-full max-w-[480px] bg-white rounded-[28px] border border-[#E7E0D3] shadow-[0_10px_35px_rgba(0,0,0,0.05)] p-6 sm:p-8 text-center transition-all">
            
            {/* 1. Pill Tag */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#E8472B] text-white text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs mb-3">
              India's Proof-of-Work Creator Network
            </div>

            {/* 2. Heading */}
            <h2 className="font-heading font-extrabold text-2xl sm:text-[28px] text-[#1A1A1A] tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome back to StageUp' : 'Join StageUp Network'}
            </h2>

            {/* 3. Subtitle */}
            <p className="text-xs sm:text-sm text-[#5F5A50] mt-1.5">
              Hire verified Indian creators or get hired.
            </p>

            {/* 4. Row of 5 Creator Avatars */}
            <div className="flex items-center justify-center gap-2.5 my-4 sm:my-5">
              {creatorAvatars.map((c, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={c.src}
                    alt={c.name}
                    title={c.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-black/5 hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>

            {/* Role switch pills if in signup mode */}
            {mode === 'signup' && (
              <div className="mb-4">
                <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-[#5F5A50] mb-1.5 text-left">
                  I WANT TO
                </label>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`py-2 px-3 rounded-xl border text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer ${
                      role === 'recruiter'
                        ? 'border-[#E8472B] text-[#E8472B] bg-orange-50/70 shadow-xs ring-1 ring-[#E8472B]'
                        : 'border-[#E7E0D3] bg-white text-[#5F5A50] hover:border-stone-400'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Hire Creators</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('talent')}
                    className={`py-2 px-3 rounded-xl border text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer ${
                      role === 'talent'
                        ? 'border-[#E8472B] text-[#E8472B] bg-orange-50/70 shadow-xs ring-1 ring-[#E8472B]'
                        : 'border-[#E7E0D3] bg-white text-[#5F5A50] hover:border-stone-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Work as Creator</span>
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 text-left">
                <AlertCircle className="w-4 h-4 text-[#E8472B] shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
              
              {/* Full Name (Sign up only) */}
              {mode === 'signup' && (
                <div className="text-left">
                  <label className="block text-xs font-heading font-semibold text-[#1A1A1A] mb-1">
                    {role === 'recruiter' ? 'Brand / Recruiter Name' : 'Creator Full Name'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="stageup_full_name"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'recruiter' ? 'e.g. Zenith Media' : 'e.g. Priya Sharma'}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E7E0D3] focus:border-[#E8472B] focus:ring-2 focus:ring-[#E8472B]/10 text-[#1A1A1A] placeholder:text-stone-400 outline-none transition"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Side-by-side Inputs (Email & Password as in Reference Image) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-heading font-semibold text-[#1A1A1A] mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    name="stageup_identifier"
                    autoComplete="off"
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E7E0D3] focus:border-[#E8472B] focus:ring-2 focus:ring-[#E8472B]/10 text-[#1A1A1A] placeholder:text-stone-400 outline-none transition"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-heading font-semibold text-[#1A1A1A] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="stageup_user_password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-9 py-2.5 text-sm rounded-xl bg-white border border-[#E7E0D3] focus:border-[#E8472B] focus:ring-2 focus:ring-[#E8472B]/10 text-[#1A1A1A] placeholder:text-stone-400 outline-none transition font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember me & Forgot password? */}
              <div className="flex items-center justify-between text-xs text-[#5F5A50] pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E7E0D3] accent-[#E8472B] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotTip(!showForgotTip)}
                    className="text-[#E8472B] hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Forgot password tip box */}
              {showForgotTip && (
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#E8472B] flex items-center justify-between text-left">
                  <span>Demo password: <strong className="font-mono">stageup123</strong></span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo(role)}
                    className="font-bold underline cursor-pointer"
                  >
                    Auto Fill
                  </button>
                </div>
              )}

              {/* Solid Orange/Red Button: Log in */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-heading font-bold text-sm bg-[#E8472B] hover:bg-[#C93A21] text-white shadow-md shadow-orange-500/20 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Please wait...</span>
                ) : (
                  <span>{mode === 'login' ? 'Log in' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Divider: Or continue with Google */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7E0D3]"></div>
              </div>
              <span className="relative px-3 bg-white text-xs text-[#5F5A50] font-medium">
                Or continue with Google
              </span>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={() => handleQuickDemo(role)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E7E0D3] bg-white hover:bg-stone-50/80 text-xs font-semibold text-[#1A1A1A] transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom 3-Column Stats inside card */}
            <div className="border-t border-[#E7E0D3] pt-4 mt-5 grid grid-cols-3 divide-x divide-[#E7E0D3] text-center">
              <div>
                <div className="flex items-center justify-center gap-1.5 font-heading font-extrabold text-sm text-[#1A1A1A]">
                  <Users className="w-3.5 h-3.5 text-[#5F5A50]" />
                  <span>12,400+</span>
                </div>
                <div className="text-[11px] text-[#5F5A50] mt-0.5">Creators</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 font-heading font-extrabold text-sm text-[#1A1A1A]">
                  <Briefcase className="w-3.5 h-3.5 text-[#5F5A50]" />
                  <span>850+</span>
                </div>
                <div className="text-[11px] text-[#5F5A50] mt-0.5">Brands</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 font-heading font-extrabold text-sm text-[#1A1A1A]">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>4.9</span>
                </div>
                <div className="text-[11px] text-[#5F5A50] mt-0.5">Average rating</div>
              </div>
            </div>

          </div>

          {/* Under Card: Brand Logos (SWIGGY, zomato, NYKAA, DREAM11, Razorpay) */}
          <div className="w-full max-w-[480px] mt-4 flex items-center justify-between px-3 text-[#5F5A50] opacity-80">
            {/* Swiggy */}
            <div className="flex items-center gap-1 font-heading font-black tracking-tighter text-xs">
              <span className="w-4 h-4 rounded-full bg-[#FC8019] text-white flex items-center justify-center text-[9px] font-bold">S</span>
              <span className="tracking-wider uppercase text-[11px] font-bold">SWIGGY</span>
            </div>
            {/* Zomato */}
            <div className="font-heading font-black italic text-xs tracking-tight text-rose-600">
              zomato
            </div>
            {/* Nykaa */}
            <div className="font-heading font-bold text-xs tracking-wider text-pink-600">
              NYKAA
            </div>
            {/* Dream11 */}
            <div className="font-heading font-extrabold text-[11px] tracking-tight text-red-600 flex items-center gap-0.5">
              <span>DREAM11</span>
            </div>
            {/* Razorpay */}
            <div className="font-heading font-extrabold text-xs tracking-tight text-blue-600 flex items-center gap-0.5">
              <span>Razorpay</span>
            </div>
          </div>

          {/* Demo Pills & Akanksha Credit */}
          <div className="w-full max-w-[480px] mt-3 pt-2 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs text-[#5F5A50]">
              <span className="font-medium">Quick Demo:</span>
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="font-semibold text-[#1A1A1A] hover:text-[#E8472B] hover:underline cursor-pointer"
              >
                Recruiter
              </button>
              <span className="text-stone-300">-</span>
              <button
                type="button"
                onClick={() => handleQuickDemo('talent')}
                className="font-semibold text-[#1A1A1A] hover:text-[#E8472B] hover:underline cursor-pointer"
              >
                Creator
              </button>
            </div>
            <p className="text-[11px] font-semibold text-[#1A1A1A] flex items-center justify-center gap-1 pt-1">
              Made by Akanksha Maurya <span className="text-red-500 animate-pulse">❤️</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
