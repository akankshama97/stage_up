import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialRole = 'recruiter' }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState(initialRole); // 'recruiter' | 'talent'

  // Form states
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Delhi');
  const [skill, setSkill] = useState('Reel Editing - Rs 500');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Fill quick demo credentials
  const handleQuickFill = (targetRole) => {
    if (targetRole === 'recruiter') {
      setEmailOrPhone('recruiter@stageup.in');
      setPassword('stageup123');
      setRole('recruiter');
      setActiveTab('login');
    } else {
      setEmailOrPhone('talent@stageup.in');
      setPassword('stageup123');
      setRole('talent');
      setActiveTab('login');
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Please enter your email/phone and password.');
      return;
    }

    if (activeTab === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const endpoint = activeTab === 'signup' ? `${apiBase}/api/auth/signup` : `${apiBase}/api/auth/login`;

      const payload = activeTab === 'signup'
        ? {
            name: name.trim(),
            email: emailOrPhone.includes('@') ? emailOrPhone.trim().toLowerCase() : '',
            phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '',
            password,
            role,
            companyName: companyName.trim(),
            city,
            skills: [skill]
          }
        : {
            emailOrPhone: emailOrPhone.trim(),
            password
          };

      const res = await fetch(endpoint, {
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
          onAuthSuccess(data.user, data.token);
          setIsLoading(false);
          onClose();
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
      console.warn('Backend auth unavailable, falling back to local user simulation:', networkErr);
    }

    // Local demo simulation fallback
    const isRecruiter = role === 'recruiter';
    const fallbackUser = {
      _id: `user_${Date.now()}`,
      name: activeTab === 'signup' && name.trim() ? name.trim() : (isRecruiter ? 'Rohit Sharma (Recruiter)' : 'Priya Sharma (Creator)'),
      email: emailOrPhone.includes('@') ? emailOrPhone.trim() : `${role}@stageup.in`,
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+919811243210',
      role,
      companyName: isRecruiter ? (companyName || 'Brand Studio') : '',
      isPrivate: isRecruiter,
      city: city || 'Delhi NCR',
      skills: isRecruiter ? ['Reel Editors'] : [skill],
      avatar: isRecruiter
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    };

    localStorage.setItem('stageup_auth_user', JSON.stringify(fallbackUser));
    localStorage.setItem('stageup_auth_token', `demo_token_${Date.now()}`);
    onAuthSuccess(fallbackUser, `demo_token_${Date.now()}`);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn font-sans">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-900 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 pb-3 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-heading font-extrabold text-xs shadow-xs">
                SU
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 leading-tight">
                  {activeTab === 'login' ? 'Welcome back to StageUp' : 'Create StageUp Account'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeTab === 'login' ? 'Access your orders & saved talent' : 'Skip the CV • Show Your Skill'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector: Login vs Sign Up */}
          <div className="flex p-1 bg-slate-100 rounded-full mt-4 border border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-heading font-bold rounded-full transition ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-coral to-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-heading font-bold rounded-full transition ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-coral to-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials Fill */}
          <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs shadow-2xs">
            <span className="font-heading font-bold text-[10px] uppercase text-slate-400 tracking-wider block mb-1.5">
              ⚡ 1-Click Demo Login (Instant Review)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('recruiter')}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-[11px] flex items-center justify-center gap-1 transition shadow-2xs"
              >
                <Briefcase className="w-3 h-3 text-slate-700" />
                <span>Recruiter Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('talent')}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-coral font-semibold text-[11px] flex items-center justify-center gap-1 transition shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-coral" />
                <span>Creator Demo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* If Sign Up, pick Role */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Choose Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`p-3 rounded-xl border text-left transition ${
                      role === 'recruiter'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Briefcase className="w-4 h-4 text-coral" />
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${role === 'recruiter' ? 'bg-slate-800 text-white' : 'bg-rose-100 text-coral'}`}>
                        Hiring
                      </span>
                    </div>
                    <span className="font-heading font-bold text-xs block">
                      Recruiter / Brand
                    </span>
                    <span className={`text-[10px] block leading-tight mt-0.5 ${role === 'recruiter' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Hire creators, post gigs
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('talent')}
                    className={`p-3 rounded-xl border text-left transition ${
                      role === 'talent'
                        ? 'bg-coral text-white border-coral shadow-sm shadow-rose-500/25'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${role === 'talent' ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-forest'}`}>
                        Creator
                      </span>
                    </div>
                    <span className="font-heading font-bold text-xs block">
                      Creator / Editor
                    </span>
                    <span className={`text-[10px] block leading-tight mt-0.5 ${role === 'talent' ? 'text-rose-100' : 'text-slate-500'}`}>
                      Post reels, get hired
                    </span>
                  </button>
                </div>

                {/* Important Privacy Notice for Recruiter */}
                {role === 'recruiter' && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-forest">100% Private Recruiter Profile</strong>
                      <span>Aapka recruiter account public reel feed me kabhi nahi dikhega. General public ya job seekers aapki profile browse nahi kar sakte.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Name Field (Sign Up only) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'recruiter' ? 'e.g. Kabir Verma' : 'e.g. Priya Sharma'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-coral focus:ring-2 focus:ring-rose-500/10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Company Name (Sign Up as Recruiter only) */}
            {activeTab === 'signup' && role === 'recruiter' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Agency / Brand (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. KeyFlow Studio / Self Creator"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-coral focus:ring-2 focus:ring-rose-500/10"
                  />
                </div>
              </div>
            )}

            {/* Skill and City (Sign Up as Talent only) */}
            {activeTab === 'signup' && role === 'talent' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Skill
                  </label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-coral"
                  >
                    <option value="Reel Editing - Rs 500">🎬 Reel Editing</option>
                    <option value="Thumbnail Design - Rs 250">🎨 Thumbnails</option>
                    <option value="Shorts Scriptwriting - Rs 400">✍️ Scriptwriting</option>
                    <option value="Voiceover & Dubbing - Rs 600">🎙️ Voiceover</option>
                    <option value="Product Shoot & Reels - Rs 1500">📸 Product Shoot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-coral"
                  >
                    <option value="Noida">Noida</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. rahul@example.com or +919811223344"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-coral focus:ring-2 focus:ring-rose-500/10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-coral focus:ring-2 focus:ring-rose-500/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.99] text-white font-heading font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/25 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Log In to StageUp' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Guarantee */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Role-Based Access Control • Recruiter accounts are kept strictly private</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
