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
  Building2,
  MapPin,
  Link as LinkIcon,
  Check
} from 'lucide-react';

export default function SignupPage({
  onBack,
  onNavigateToLogin,
  onAuthSuccess,
  defaultRole = 'recruiter'
}) {
  const [role, setRole] = useState(defaultRole); // 'recruiter' | 'talent'

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [skill, setSkill] = useState('Reel Editing - ₹500');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [hiringInterest, setHiringInterest] = useState('Reel Editors');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Skill Options for Creators
  const skillOptions = [
    'Reel Editing - ₹500',
    'YouTube Thumbnails - ₹250',
    '45s Scriptwriting - ₹400',
    'Voiceover & Dubbing - ₹600',
    'Color Grading & DaVinci - ₹750',
    'Motion Graphics & 3D - ₹1200'
  ];

  // Hiring interest options for Recruiters
  const hiringOptions = [
    'Reel Editors',
    'YouTube Thumbnails',
    'Scriptwriters',
    'Voiceover Artists',
    'Full-Stack Creator'
  ];

  // Quick 1-Click Demo Auto-fills
  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    setErrorMsg('');
    if (targetRole === 'recruiter') {
      setName('Aarav Mehta');
      setEmailOrPhone('aarav.founder@startup.in');
      setPassword('stageup123');
      setCompanyName('Zenith Media D2C');
      setCity('Bengaluru');
      setHiringInterest('Reel Editors');
    } else {
      setName('Rohit Verma');
      setEmailOrPhone('rohit.editor@gmail.com');
      setPassword('stageup123');
      setSkill('Reel Editing - ₹500');
      setCity('Noida');
      setPortfolioLink('https://instagram.com/rohit.edits');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please agree to the terms to continue.');
      return;
    }

    setIsLoading(true);

    const isRecruiter = role === 'recruiter';
    const payload = {
      name: name.trim(),
      emailOrPhone: emailOrPhone.trim(),
      password,
      role,
      companyName: isRecruiter ? companyName.trim() : '',
      city: city.trim() || 'Delhi NCR',
      skills: isRecruiter ? [hiringInterest] : [skill],
      portfolioLink: !isRecruiter ? portfolioLink.trim() : ''
    };

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem('stageup_auth_user', JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem('stageup_auth_token', data.token);
          }
          setSuccessMsg(`Welcome to StageUp, ${data.user.name.split(' ')[0]}! Setting up your workspace...`);
          setTimeout(() => {
            onAuthSuccess(data.user, data.token);
            setIsLoading(false);
          }, 450);
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
      console.warn('Backend register unavailable, using local demo account creation:', networkErr);
    }

    // Client-side demo fallback
    const fallbackUser = {
      _id: `user_registered_${Date.now()}`,
      name: name.trim(),
      email: emailOrPhone.includes('@') ? emailOrPhone.trim() : `${name.toLowerCase().replace(/\s+/g, '')}@stageup.in`,
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+919811243210',
      role,
      companyName: isRecruiter ? (companyName.trim() || 'Brand / Studio') : '',
      isPrivate: isRecruiter,
      city,
      skills: isRecruiter ? [hiringInterest] : [skill],
      avatar: isRecruiter
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    };

    localStorage.setItem('stageup_auth_user', JSON.stringify(fallbackUser));
    localStorage.setItem('stageup_auth_token', `demo_token_${Date.now()}`);

    setSuccessMsg(`Account created successfully! Welcome, ${fallbackUser.name.split(' ')[0]}!`);
    setTimeout(() => {
      onAuthSuccess(fallbackUser, `demo_token_${Date.now()}`);
      setIsLoading(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto selection:bg-rose-100 selection:text-coral animate-fadeIn font-sans">
      {/* Top Header */}
      <div>
        <header className="flex items-center justify-between pt-2 pb-5 border-b border-slate-200">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-xs font-semibold shadow-2xs"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-heading font-extrabold text-xs">
              SU
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-slate-900">
              StageUp
              <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block ml-0.5 shadow-[0_0_6px_#FF385C]"></span>
            </span>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="text-xs font-heading font-bold text-coral hover:underline"
          >
            Log In
          </button>
        </header>

        {/* Page Switcher Tabs: Log In vs Sign Up */}
        <div className="flex p-1 bg-slate-200/70 rounded-full mt-5 mb-5 border border-slate-200">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="flex-1 py-2 text-xs font-heading font-bold rounded-full text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-xs font-heading font-bold rounded-full bg-gradient-to-r from-coral to-rose-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Hero Title */}
        <div className="mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Join StageUp 🚀
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Skip the CV. Show real video proof reels, chat directly on WhatsApp, and book with 100% Escrow security.
          </p>
        </div>

        {/* Quick Demo Pre-fill Bar */}
        <div className="mb-5 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500">
              ⚡ Quick Fill Form (1-Click Test)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('recruiter')}
              className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-700" />
              <span>Fill as Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('talent')}
              className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-coral font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <span>Fill as Creator</span>
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

        {/* Main Sign Up Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          {/* Step 1: Choose Account Role */}
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-3 rounded-xl border text-left transition ${
                  role === 'recruiter'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${role === 'recruiter' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  {role === 'recruiter' && (
                    <span className="w-4 h-4 rounded-full bg-coral text-white flex items-center justify-center text-[10px]">✓</span>
                  )}
                </div>
                <div className="font-heading font-bold text-xs">Mujhe Talent Chahiye</div>
                <div className={`text-[10px] mt-0.5 ${role === 'recruiter' ? 'text-slate-300' : 'text-slate-500'}`}>Founders, Brands &amp; Channels</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('talent')}
                className={`p-3 rounded-xl border text-left transition ${
                  role === 'talent'
                    ? 'bg-coral text-white border-coral shadow-sm shadow-rose-500/25'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${role === 'talent' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-coral'}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  {role === 'talent' && (
                    <span className="w-4 h-4 rounded-full bg-white text-coral flex items-center justify-center text-[10px] font-black">✓</span>
                  )}
                </div>
                <div className="font-heading font-bold text-xs">Mujhe Kaam Chahiye</div>
                <div className={`text-[10px] mt-0.5 ${role === 'talent' ? 'text-rose-100' : 'text-slate-500'}`}>Editors, Designers &amp; Writers</div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. Aarav Mehta"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* Email or Phone */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
              {role === 'talent' ? 'WhatsApp Mobile Number or Email (for Client Orders)' : 'Work Email or Mobile Number'}
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
                placeholder={role === 'talent' ? '+91 98112 43210 or yourname@gmail.com' : 'aarav@company.com or +91 98112 23344'}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
              Create Password
            </label>
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
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === 'recruiter' ? (
            <>
              {/* Company / Brand Name */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Company / Brand Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. D2C Brand, YouTube Agency, Personal Studio"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>

              {/* Looking to Hire */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  What are you looking to hire first?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {hiringOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHiringInterest(opt)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                        hiringInterest === opt
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Primary Creative Skill */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Primary Creative Skill &amp; Starting Rate
                </label>
                <select
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 outline-none transition font-medium"
                >
                  {skillOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Instagram / Drive / YouTube Portfolio <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://instagram.com/yourhandle or drive link"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* City / Location */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
              Location / City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Noida, Delhi NCR, Mumbai, Bengaluru"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-coral focus:ring-4 focus:ring-rose-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-coral focus:ring-coral/20 accent-coral"
              />
              <span>
                I agree to StageUp's Escrow Protection Policy, Zero-Spam Direct WhatsApp contact, and Terms of Use.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/25 disabled:opacity-60 text-white bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create {role === 'recruiter' ? 'Recruiter' : 'Creator'} Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Already have an account */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
          <p className="text-xs text-slate-600">
            Already have a StageUp account?
          </p>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="mt-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs border border-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-coral" />
            <span>Log In to Existing Account</span>
          </button>
        </div>
      </div>

      {/* Trust Badges Footer */}
      <footer className="pt-6 pb-2">
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mb-2 flex-wrap">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            100% Escrow Protected
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span>🇮🇳</span>
            Pan-India Creator Network
          </span>
          <span>•</span>
          <span>Direct WhatsApp Orders</span>
        </div>
        <p className="text-[10px] text-slate-400 text-center">
          StageUp — Skip the CV, Show Your Skill. Built for Indian Creators &amp; Modern Founders.
        </p>
      </footer>
    </div>
  );
}
