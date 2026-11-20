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
  Building,
  MapPin,
  Link as LinkIcon
} from 'lucide-react';
import { Button, Card, Badge, Container } from './common';

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
    'Product Shoots - ₹1500'
  ];

  // Hiring interest options for Recruiters
  const hiringOptions = [
    'Reel Editors',
    'YouTube Thumbnails',
    'Scriptwriters',
    'Voiceover Artists',
    'Product Shoot Creators'
  ];

  // Quick 1-Click Demo Auto-fills
  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    setErrorMsg('');
    if (targetRole === 'recruiter') {
      setName('Aarav Mehta');
      setEmailOrPhone('aarav.founder@startup.in');
      setPassword('stageup123');
      setCompanyName('Zenith Media');
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
          setSuccessMsg(`Welcome to StageUp, ${data.user.name.split(' ')[0]}! Setting up your account...`);
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
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+91 98112 43210',
      role,
      companyName: isRecruiter ? (companyName.trim() || 'Brand Studio') : '',
      isPrivate: isRecruiter,
      city,
      skills: isRecruiter ? [hiringInterest] : [skill],
      avatar: isRecruiter ? '/recruiter-profile.jpg' : 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=400&q=80'
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
              onClick={onNavigateToLogin}
            >
              Log in
            </Button>
          </div>
        </Container>
      </header>

      {/* Main Signup Form Container */}
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          {/* Switcher Tab */}
          <div className="flex p-1 bg-surface-muted rounded-btn mb-6 border border-border">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="flex-1 py-1.5 text-xs font-medium rounded-btn text-text-muted hover:text-text flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log in</span>
            </button>
            <button
              type="button"
              className="flex-1 py-1.5 text-xs font-medium rounded-btn bg-surface text-text shadow-soft flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign up</span>
            </button>
          </div>

          <Card className="p-6">
            <div className="mb-5">
              <h1 className="font-heading text-2xl font-bold text-text tracking-tight">
                Create an account
              </h1>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Join verified video editors, designers, and brands across India.
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                I want to
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
                  <span>Hire Talent</span>
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
                  <span>Find Work</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Demo Pre-fill */}
            <div className="mb-4 p-2.5 rounded-btn bg-surface-muted border border-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-text-muted">1-Click Test Fill:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('recruiter')}
                  className="px-2 py-1 rounded-btn bg-surface border border-border text-[11px] text-text hover:bg-surface-muted font-medium"
                >
                  Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('talent')}
                  className="px-2 py-1 rounded-btn bg-surface border border-border text-[11px] text-text hover:bg-surface-muted font-medium"
                >
                  Creator
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
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'recruiter' ? 'e.g. Aarav Mehta' : 'e.g. Priya Sharma'}
                    className="w-full pl-9 pr-3.5 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  Email address or Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="email@domain.com or +91..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors duration-150"
                  />
                </div>
              </div>

              {role === 'recruiter' && (
                <div>
                  <label className="block text-xs font-medium text-text mb-1">
                    Company / Channel Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Zenith Media or YouTube Channel"
                      className="w-full pl-9 pr-3.5 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors duration-150"
                    />
                  </div>
                </div>
              )}

              {role === 'talent' && (
                <div>
                  <label className="block text-xs font-medium text-text mb-1">
                    Primary Skill & Starting Rate
                  </label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text outline-none focus:border-accent transition-colors duration-150"
                  >
                    {skillOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-9 pr-9 py-2 rounded-btn bg-surface border border-border text-xs sm:text-sm text-text placeholder-text-muted outline-none focus:border-accent transition-colors duration-150"
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
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 rounded-btn border-border accent-accent"
                  />
                  <span>I agree to the Terms of Service & Escrow Rules</span>
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
                  <span>Creating account...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span>Create {role === 'recruiter' ? 'Recruiter' : 'Creator'} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-border text-center">
              <p className="text-xs text-text-muted mb-2">
                Already have an account?
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigateToLogin}
                className="w-full"
              >
                Log in instead
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
