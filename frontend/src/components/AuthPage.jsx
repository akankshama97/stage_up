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
  Building
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
            setSuccessMsg(`Welcome to StageUp, ${data.user.name.split(' ')[0]}! Opening workspace...`);
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
    <div className="min-h-screen bg-bg text-text font-sans flex flex-col justify-between selection:bg-surface-muted selection:text-accent">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Back to Home Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-btn bg-surface border border-border text-xs sm:text-sm font-medium text-text-muted hover:text-text hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Home</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-btn bg-text text-surface flex items-center justify-center font-heading font-bold text-xs select-none">
              SU
            </div>
            <span className="font-heading font-bold text-base sm:text-lg text-text tracking-tight">
              StageUp
            </span>
          </div>

          {/* Switch Mode Shortcut */}
          <button
            onClick={() => handleToggleMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs sm:text-sm font-medium text-accent hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTERED AUTH CARD (Clean, Simple, Zero Clutter) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] bg-surface border border-border rounded-card p-6 sm:p-8 shadow-soft">
          
          {/* Title & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="font-heading font-bold text-2xl text-text tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5">
              {mode === 'login'
                ? 'Sign in to access your talent feed and orders'
                : 'Join StageUp to hire creators or find client projects'}
            </p>
          </div>

          {/* Mode Switcher Pills (Log in vs Sign up) */}
          <div className="flex p-1 bg-surface-muted rounded-btn mb-5 border border-border">
            <button
              type="button"
              onClick={() => handleToggleMode('login')}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-btn transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-surface text-text shadow-soft font-bold'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode('signup')}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-btn transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-surface text-text shadow-soft font-bold'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Role Picker (Recruiter vs Creator) */}
          <div className="mb-5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-text-muted mb-2">
              I want to
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2 px-3 rounded-btn border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  role === 'recruiter'
                    ? 'border-accent bg-accent/5 text-accent font-bold'
                    : 'border-border bg-surface text-text-muted hover:text-text hover:bg-surface-muted'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Hire Creators</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('talent')}
                className={`py-2 px-3 rounded-btn border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  role === 'talent'
                    ? 'border-accent bg-accent/5 text-accent font-bold'
                    : 'border-border bg-surface text-text-muted hover:text-text hover:bg-surface-muted'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Work as Creator</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-btn bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-btn bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  {role === 'recruiter' ? 'Brand / Recruiter Name' : 'Creator Full Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    {role === 'recruiter' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'recruiter' ? 'e.g. Zenith Media' : 'e.g. Priya Sharma'}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-btn bg-surface border border-border focus:border-accent focus:outline-none text-text placeholder:text-text-muted transition-colors"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-medium text-text mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  {emailOrPhone.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="name@example.com or mobile"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-btn bg-surface border border-border focus:border-accent focus:outline-none text-text placeholder:text-text-muted transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-text">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotTip(!showForgotTip)}
                    className="text-[11px] text-text-muted hover:text-accent transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
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
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-btn bg-surface border border-border focus:border-accent focus:outline-none text-text placeholder:text-text-muted transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {showForgotTip && (
                <p className="text-[11px] text-accent mt-1 bg-accent/5 p-2 rounded-btn border border-accent/20">
                  Tip: For instant demo testing, click one of the quick autofill links below or use password <code className="font-mono font-bold">stageup123</code>.
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-text-muted pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border accent-accent cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-btn font-heading font-bold text-sm bg-accent text-surface hover:bg-accent-hover transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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

          {/* Quick Demo Autofill (Clean, minimal 1-line helper) */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
            <span>Quick Demo:</span>
            <div className="flex items-center gap-2 font-medium">
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="hover:text-accent transition-colors underline cursor-pointer"
              >
                Recruiter
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleQuickDemo('talent')}
                className="hover:text-accent transition-colors underline cursor-pointer"
              >
                Creator
              </button>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Escrow Protected &bull; Zero Agency Fees</span>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full border-t border-border bg-surface py-3.5 text-center px-4 space-y-1">
        <p className="text-xs text-text-muted">
          StageUp &bull; Direct Creator-to-Brand Marketplace India &bull; 100% Escrow Protection
        </p>
        <p className="text-[11px] font-semibold text-text flex items-center justify-center gap-1">
          Made by Akanksha Maurya <span className="text-red-500 animate-pulse">❤️</span>
        </p>
      </footer>

    </div>
  );
}
