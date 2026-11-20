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
  Video
} from 'lucide-react';
import { Button, Card, Badge, Container } from './common';

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
    } catch (err) {
      console.warn('Backend login endpoint unavailable, using fallback mock login:', err);
    }

    // Client-side fallback authentication
    const isRecruiter = role === 'recruiter';
    const fallbackUser = {
      _id: isRecruiter ? 'user_recruiter_demo' : 'user_talent_demo',
      name: isRecruiter ? 'Rohit Verma' : 'Priya Sharma',
      email: emailOrPhone.includes('@') ? emailOrPhone.trim() : (isRecruiter ? 'recruiter@stageup.in' : 'talent@stageup.in'),
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+91 98112 43210',
      role: role,
      companyName: isRecruiter ? 'Apex Media Studio' : '',
      isPrivate: isRecruiter,
      skills: isRecruiter ? ['Reel Editors', 'Thumbnail Designers'] : ['Reel Editing', 'Color Grading'],
      avatar: isRecruiter ? '/recruiter-profile.jpg' : 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString()
    };

    if (rememberMe) {
      localStorage.setItem('stageup_auth_user', JSON.stringify(fallbackUser));
      localStorage.setItem('stageup_auth_token', 'mock_jwt_token_' + Date.now());
    }

    setSuccessMsg(`Logged in as ${fallbackUser.name}. Opening feed...`);
    setTimeout(() => {
      onAuthSuccess(fallbackUser, 'mock_jwt_token_' + Date.now());
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between font-sans selection:bg-surface-muted selection:text-accent">
      {/* Top Header */}
      <header className="bg-surface border-b border-border py-3">
        <Container>
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              className="gap-1.5"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>

            {/* SU Monogram + Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-btn bg-text text-surface flex items-center justify-center font-heading font-bold text-xs select-none">
                SU
              </div>
              <span className="font-heading font-bold text-base tracking-tight text-text">
                StageUp
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToSignup(role)}
            >
              Sign up
            </Button>
          </div>
        </Container>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          {/* Switcher Tab */}
          <div className="flex p-1 bg-surface-muted rounded-btn mb-6 border border-border">
            <button
              type="button"
              className="flex-1 py-1.5 text-xs font-medium rounded-btn bg-surface text-text shadow-soft flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log in</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToSignup(role)}
              className="flex-1 py-1.5 text-xs font-medium rounded-btn text-text-muted hover:text-text flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign up</span>
            </button>
          </div>

          <Card className="p-6">
            <div className="mb-5">
              <h1 className="font-heading text-2xl font-bold text-text tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Log in to access your shortlist, escrow orders, and direct creator chats.
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                Log in as
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 px-3 rounded-btn border text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${
                    role === 'recruiter'
                      ? 'bg-text text-surface border-text'
                      : 'bg-surface text-text border-border hover:bg-surface-muted'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Recruiter / Brand</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('talent')}
                  className={`py-2 px-3 rounded-btn border text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${
                    role === 'talent'
                      ? 'bg-text text-surface border-text'
                      : 'bg-surface text-text border-border hover:bg-surface-muted'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Creator / Talent</span>
                </button>
              </div>
            </div>

            {/* 1-Click Demo Strip */}
            <div className="mb-5 p-3 rounded-btn bg-surface-muted border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  1-Click Demo
                </span>
                <span className="text-[10px] text-text-muted">Password: stageup123</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('recruiter')}
                  className={`p-2 rounded-btn border text-left flex items-center gap-2 transition-colors duration-150 cursor-pointer ${
                    role === 'recruiter' && emailOrPhone.includes('recruiter')
                      ? 'bg-surface border-text'
                      : 'bg-surface border-border hover:bg-surface-muted'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text truncate">Recruiter Demo</div>
                    <div className="text-[10px] text-text-muted truncate">recruiter@stageup.in</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('talent')}
                  className={`p-2 rounded-btn border text-left flex items-center gap-2 transition-colors duration-150 cursor-pointer ${
                    role === 'talent' && emailOrPhone.includes('talent')
                      ? 'bg-surface border-text'
                      : 'bg-surface border-border hover:bg-surface-muted'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-text truncate">Creator Demo</div>
                    <div className="text-[10px] text-text-muted truncate">talent@stageup.in</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-btn bg-surface-muted border border-border flex items-start gap-2 text-xs text-accent">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-btn bg-surface-muted border border-border flex items-center gap-2 text-xs text-success">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1.5">
                  Email address or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
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
                        ? 'recruiter@stageup.in or phone'
                        : 'talent@stageup.in or phone'
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors duration-150"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-text">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotTip(!showForgotTip)}
                    className="text-[11px] text-accent hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
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
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors duration-150"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {showForgotTip && (
                  <div className="mt-2 p-2 rounded-btn bg-surface-muted border border-border text-[11px] text-text-muted">
                    Demo Password: <span className="font-mono font-medium text-text">stageup123</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-btn border-border accent-accent"
                  />
                  <span>Keep me logged in</span>
                </label>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-border text-center">
              <p className="text-xs text-text-muted mb-2">
                Don't have an account?
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigateToSignup(role)}
                className="w-full"
              >
                Create an account
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-4 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Escrow Protected
          </span>
          <span>•</span>
          <span>Verified Indian Creators</span>
          <span>•</span>
          <span>Zero Agency Fees</span>
        </div>
      </footer>
    </div>
  );
}
