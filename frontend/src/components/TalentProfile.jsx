import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  MessageCircle,
  Heart,
  Share2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Phone,
  Lock,
  ArrowRight,
  FileText,
  Sliders,
  Mic,
  QrCode,
  Award,
  LogOut,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SkillPassport from './SkillPassport';

export default function TalentProfile({
  talent,
  currentUser,
  onLogout,
  onBack,
  isShortlisted,
  onToggleShortlist,
  onOpenChat,
  onBookEscrow,
  onOpenProof,
  onOpenRateCard,
  onOpenVoiceStudio,
  isLiveTested = false,
  onOpenSkillTest
}) {
  const [copied, setCopied] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  if (!talent) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHireProject = (project) => {
    setSelectedProject(project);
    onOpenChat(talent, project);
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-24 font-sans selection:bg-surface-muted selection:text-accent">
      {/* Top Sticky Bar */}
      <div className="sticky top-0 z-30 bg-surface/95 border-b border-border backdrop-blur-md px-4 py-3 max-w-lg mx-auto flex items-center justify-between shadow-soft">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-btn bg-surface border border-border flex items-center justify-center text-text hover:bg-surface-muted transition-colors duration-150"
          aria-label="Back to feed"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="font-heading font-bold text-sm tracking-tight text-text block">
            {talent.name}
          </span>
          <span className="text-[11px] text-text-muted">Talent Profile</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onToggleShortlist(talent);
              if (!isShortlisted) {
                confetti({
                  particleCount: 20,
                  spread: 50,
                  origin: { y: 0.1, x: 0.9 },
                  colors: ['#E8472B', '#1E7A4C']
                });
              }
            }}
            className={`w-9 h-9 rounded-btn border flex items-center justify-center transition-colors duration-150 ${
              isShortlisted
                ? 'bg-accent border-accent text-surface'
                : 'bg-surface border-border text-text hover:bg-surface-muted'
            }`}
            title="Shortlist talent"
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-btn bg-surface border border-border flex items-center justify-center text-text hover:bg-surface-muted transition-colors duration-150"
            title="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-lg mx-auto p-4 sm:p-5 space-y-4">
        {/* Profile Card Header */}
        <div className="bg-surface rounded-card border border-border p-5 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={talent.avatar}
                alt={talent.name}
                className="w-20 h-20 rounded-card object-cover border border-border shadow-soft"
              />
              <span className="absolute -bottom-1 -right-1 bg-success text-surface text-[10px] font-medium px-2 py-0.5 rounded-tag border border-surface flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-heading text-xl font-extrabold text-slate-900 leading-tight">
                  {talent.name}
                </h1>
                {isLiveTested && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-heading font-extrabold text-[10px] shadow-2xs">
                    <Award className="w-3 h-3 text-amber-900" />
                    <span>Live Tested</span>
                  </span>
                )}
                {/* ⭐ Client Rating Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{talent.rating || '4.9'} ({talent.completedProjects || 28} projects delivered)</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-0.5 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-coral" /> {talent.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-forest font-semibold">
                  <Clock className="w-3.5 h-3.5" /> {talent.turnaroundTime || '24 hrs'}
                </span>
              </div>

              {/* Price Tag */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-coral font-heading font-extrabold text-xs">
                  {talent.price} <span className="text-[10px] font-medium text-slate-600">({talent.priceUnit || 'per gig'})</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {talent.shortlistedCount} recruiters saved
                </span>
              </div>
            </div>
          </div>

          {/* Software & Tools Badges */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-2">
              Software &amp; Tools Mastered
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(talent.tools || ['DaVinci Resolve', 'Premiere Pro', 'CapCut']).map((tool, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold tracking-tight shadow-sm flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-1">
              About The Creator
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {talent.bio}
            </p>
          </div>

          {/* Skills tags */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-2">
              Skills &amp; Fixed Rates
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {talent.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Pills: Proof Slider & Rate Card Generator */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            <button
              onClick={() => onOpenProof && onOpenProof(talent)}
              className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-coral font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Raw vs Final Edit ⚡</span>
            </button>

            <button
              onClick={() => onOpenRateCard && onOpenRateCard(talent)}
              className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-heading font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-forest" />
              <span>Rate Card &amp; UPI QR 🧾</span>
            </button>

            <button
              onClick={() => onOpenSkillTest && onOpenSkillTest(talent)}
              className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{isLiveTested ? 'Retest Creator (15-Min)' : 'Test This Creator ⚡'}</span>
            </button>

            {talent.skills?.some(s => s.toLowerCase().includes('voice')) && (
              <button
                onClick={() => onOpenVoiceStudio && onOpenVoiceStudio(talent)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-forest font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Mic className="w-3.5 h-3.5 text-coral" />
                <span>Open Voiceover Audition Studio (Shure SM7B) 🎙️</span>
              </button>
            )}
          </div>
        </div>

        {/* FEATURE: CREATOR SKILL PASSPORT */}
        <SkillPassport talent={talent} isLiveTested={isLiveTested} />

        {/* PROOF REEL PREVIEW */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900">Proof-of-Work Reel</h3>
              <p className="text-[11px] text-slate-500">Raw screen recording &amp; creative output</p>
            </div>
            <span className="text-[10px] font-semibold text-coral bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              30 sec proof
            </span>
          </div>

          <div className="relative aspect-[9/12] max-h-72 w-full rounded-2xl overflow-hidden bg-black border border-slate-200 group">
            <video
              src={talent.videoUrl}
              poster={talent.posterUrl || talent.avatar}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 PROJECT CARDS WITH REAL PRICES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-heading font-extrabold text-base text-slate-900">
                Featured Projects &amp; Gigs
              </h2>
              <p className="text-xs text-slate-500">
                Transparent package pricing. Direct delivery.
              </p>
            </div>
            <span className="text-xs font-semibold text-forest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Fixed Rates
            </span>
          </div>

          {talent.projects && talent.projects.length > 0 ? (
            talent.projects.map((project, pIdx) => (
              <div
                key={pIdx}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-coral hover:shadow-md transition duration-200"
              >
                <div className="flex gap-3 sm:gap-4 items-start">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-block text-[10px] font-heading font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Project #{pIdx + 1}
                      </span>
                      <span className="font-heading font-extrabold text-sm sm:text-base text-coral">
                        {project.price}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-1 leading-snug">
                      {project.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onBookEscrow) onBookEscrow(talent, project);
                        }}
                        className="flex-1 py-2 px-3 rounded-btn bg-accent text-surface hover:bg-accent-hover font-medium text-xs transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-soft"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Book with Escrow</span>
                      </button>

                      <button
                        onClick={() => handleHireProject(project)}
                        className="py-2 px-3 rounded-btn bg-surface border border-border hover:bg-surface-muted text-text font-medium text-xs transition-colors duration-150 flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-success" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-text-muted p-4 bg-surface rounded-card border border-border">
              Projects are being updated for this creator.
            </p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="bg-surface-muted rounded-card p-4 border border-border text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-success">
            <ShieldCheck className="w-4 h-4 text-success" /> 100% Escrow Protection Guaranteed
          </div>
          <p className="text-[11px] text-text-muted">
            Funds held securely until delivery approval. Zero platform fees for early Indian creators &amp; founders.
          </p>
        </div>
      </div>

      {/* STICKY BOTTOM BAR: Direct WhatsApp & Escrow CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border p-3 shadow-soft">
        <div className="max-w-lg mx-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden xs:block flex-1 min-w-0">
            <span className="text-[10px] text-text-muted block uppercase font-medium">Starting Rate</span>
            <span className="font-heading font-bold text-sm sm:text-base text-accent">
              {talent.price}
            </span>
          </div>

          <button
            onClick={() => {
              const primaryProj = talent.projects?.[0] || {
                title: `${talent.name}'s Primary Service`,
                price: talent.price
              };
              if (onBookEscrow) onBookEscrow(talent, primaryProj);
            }}
            className="flex-1 bg-accent hover:bg-accent-hover text-surface font-medium text-xs sm:text-sm py-2.5 px-3 rounded-btn transition-colors duration-150 shadow-soft flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-surface" />
            <span>Book with Escrow</span>
          </button>

          <button
            onClick={() => onOpenChat(talent)}
            className="px-3 sm:px-4 py-2.5 rounded-btn bg-success hover:opacity-95 text-surface font-medium text-xs sm:text-sm transition-opacity duration-150 flex items-center justify-center gap-1.5 shadow-soft"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-surface" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onToggleShortlist(talent);
            }}
            className={`p-2.5 rounded-btn border transition-colors duration-150 ${
              isShortlisted
                ? 'bg-surface-muted border-accent text-accent'
                : 'bg-surface border-border text-text hover:bg-surface-muted'
            }`}
            title="Shortlist"
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current text-accent' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
