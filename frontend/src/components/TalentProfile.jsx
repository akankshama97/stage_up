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
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SkillPassport from './SkillPassport';

export default function TalentProfile({
  talent,
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
    <div className="min-h-screen bg-cream text-ink pb-24">
      {/* Top Mobile Bar */}
      <div className="sticky top-0 z-30 bg-cream/95 border-b border-cream-border backdrop-blur-none px-4 py-3 max-w-lg mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-human bg-white border border-cream-border flex items-center justify-center text-ink hover:bg-cream-muted transition shadow-sm"
          aria-label="Back to feed"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="font-heading font-bold text-sm tracking-tight text-ink block">
            {talent.name}
          </span>
          <span className="text-[11px] text-ink-muted">Talent Profile</span>
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
                  colors: ['#FF4D2E', '#1E7A4C']
                });
              }
            }}
            className={`w-9 h-9 rounded-human border flex items-center justify-center transition shadow-sm ${
              isShortlisted
                ? 'bg-coral border-coral text-white'
                : 'bg-white border-cream-border text-ink hover:bg-cream-muted'
            }`}
            title="Shortlist talent"
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-human bg-white border border-cream-border flex items-center justify-center text-ink hover:bg-cream-muted transition shadow-sm"
            title="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-lg mx-auto p-4 sm:p-5 space-y-5">
        {/* Profile Card Header */}
        <div className="bg-white rounded-human border border-cream-border p-5 shadow-paper">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={talent.avatar}
                alt={talent.name}
                className="w-20 h-20 rounded-human object-cover border-2 border-cream-border shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 bg-forest text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full border border-white flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-heading text-xl font-bold text-ink leading-tight">
                  {talent.name}
                </h1>
                {isLiveTested && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 text-amber-950 border border-amber-400 font-heading font-extrabold text-[10px] shadow-sm">
                    <Award className="w-3 h-3 text-amber-900" />
                    <span>StageUp Verified - Live Tested</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                <span className="flex items-center gap-0.5 text-ink-secondary font-medium">
                  <MapPin className="w-3.5 h-3.5 text-coral" /> {talent.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-forest font-medium">
                  <Clock className="w-3.5 h-3.5" /> {talent.turnaroundTime || '24 hrs'}
                </span>
              </div>

              {/* Price Tag */}
              <div className="mt-3 flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-[8px] bg-coral-light border border-coral-border text-coral font-heading font-bold text-xs">
                  {talent.price} <span className="text-[10px] font-medium text-ink-secondary">({talent.priceUnit || 'per gig'})</span>
                </div>
                <span className="text-[11px] text-ink-light">
                  {talent.shortlistedCount} recruiters saved
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 pt-4 border-t border-cream-muted">
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-light mb-1">
              About The Creator
            </h4>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {talent.bio}
            </p>
          </div>

          {/* Skills tags */}
          <div className="mt-4 pt-3 border-t border-cream-muted">
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-light mb-2">
              Skills & Fixed Rates
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {talent.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 rounded-[8px] bg-cream-muted border border-cream-border text-ink text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Pills: Proof Slider & Rate Card Generator */}
          <div className="mt-4 pt-3 border-t border-cream-muted flex flex-wrap gap-2">
            <button
              onClick={() => onOpenProof && onOpenProof(talent)}
              className="flex-1 min-w-[140px] py-2 px-3 rounded-human bg-coral-light hover:bg-coral/20 border border-coral-border text-coral font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Raw vs Final Edit ⚡</span>
            </button>

            <button
              onClick={() => onOpenRateCard && onOpenRateCard(talent)}
              className="flex-1 min-w-[140px] py-2 px-3 rounded-human bg-cream-muted hover:bg-cream-darker border border-cream-border text-ink font-heading font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-forest" />
              <span>Rate Card & UPI QR 🧾</span>
            </button>

            <button
              onClick={() => onOpenSkillTest && onOpenSkillTest(talent)}
              className="flex-1 min-w-[140px] py-2 px-3 rounded-human bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{isLiveTested ? 'Retest Creator (15-Min)' : 'Test This Creator ⚡'}</span>
            </button>

            {talent.skills?.some(s => s.toLowerCase().includes('voice')) && (
              <button
                onClick={() => onOpenVoiceStudio && onOpenVoiceStudio(talent)}
                className="w-full py-2 px-3 rounded-human bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-forest font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Mic className="w-3.5 h-3.5 text-coral" />
                <span>Open Voiceover Audition Studio (Shure SM7B) 🎙️</span>
              </button>
            )}
          </div>
        </div>

        {/* FEATURE 2: CREATOR SKILL PASSPORT (CV Replacement) */}
        <SkillPassport talent={talent} isLiveTested={isLiveTested} />

        {/* PROOF REEL PREVIEW */}
        <div className="bg-white rounded-human border border-cream-border p-4 shadow-paper">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-ink">Proof-of-Work Reel</h3>
              <p className="text-[11px] text-ink-muted">Raw screen recording & creative output</p>
            </div>
            <span className="text-[10px] font-semibold text-coral bg-coral-light px-2 py-0.5 rounded-full border border-coral-border">
              30 sec proof
            </span>
          </div>

          <div className="relative aspect-[9/12] max-h-72 w-full rounded-human overflow-hidden bg-black border border-cream-border group">
            <video
              src={talent.videoUrl}
              poster={talent.posterUrl || talent.avatar}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 PROJECT CARDS WITH REAL PRICES (Core Requirement) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-heading font-bold text-base text-ink">
                3 Featured Projects & Gigs
              </h2>
              <p className="text-xs text-ink-muted">
                Transparent package pricing. Direct delivery.
              </p>
            </div>
            <span className="text-xs font-semibold text-forest bg-forest-light px-2 py-0.5 rounded-full border border-forest-border">
              Fixed Rates
            </span>
          </div>

          {talent.projects && talent.projects.length > 0 ? (
            talent.projects.map((project, pIdx) => (
              <div
                key={pIdx}
                className="bg-white rounded-human border border-cream-border p-4 shadow-paper hover:border-coral transition duration-200"
              >
                <div className="flex gap-3 sm:gap-4 items-start">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0 border border-cream-border"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-block text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-cream-muted text-ink-secondary">
                        Project #{pIdx + 1}
                      </span>
                      <span className="font-heading font-extrabold text-sm sm:text-base text-coral">
                        {project.price}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-ink mt-1 leading-snug">
                      {project.title}
                    </h4>

                    <p className="text-xs text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onBookEscrow) onBookEscrow(talent, project);
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded-human bg-ink hover:bg-neutral-800 text-cream font-heading font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Lock className="w-3 h-3 text-forest-border" />
                        <span>Book with Escrow</span>
                      </button>

                      <button
                        onClick={() => handleHireProject(project)}
                        className="py-1.5 px-2.5 rounded-human bg-cream-muted hover:bg-cream-darker text-ink font-heading font-semibold text-xs transition flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-forest" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-ink-muted p-4 bg-white rounded-human border border-cream-border">
              Projects are being updated for this creator.
            </p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="bg-forest-light rounded-human p-4 border border-forest-border text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-forest">
            <ShieldCheck className="w-4 h-4 text-forest" /> 100% Escrow Protection Guaranteed
          </div>
          <p className="text-[11px] text-forest">
            Funds held securely until delivery approval. Zero platform fees for early Indian creators & founders.
          </p>
        </div>
      </div>

      {/* STICKY BOTTOM BAR: Direct WhatsApp & Escrow CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-border p-3">
        <div className="max-w-lg mx-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden xs:block flex-1 min-w-0">
            <span className="text-[10px] text-ink-muted block uppercase font-bold">Starting Rate</span>
            <span className="font-heading font-extrabold text-sm sm:text-base text-coral">
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
            className="flex-1 bg-ink hover:bg-neutral-800 active:scale-[0.99] text-white font-heading font-extrabold text-xs sm:text-sm py-3 px-3 rounded-human transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-forest-border" />
            <span>Book with Escrow</span>
          </button>

          <button
            onClick={() => onOpenChat(talent)}
            className="px-3 sm:px-4 py-3 rounded-human bg-forest hover:bg-emerald-800 text-white font-heading font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-sm"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onToggleShortlist(talent);
            }}
            className={`p-3 rounded-human border transition ${
              isShortlisted
                ? 'bg-coral-light border-coral text-coral'
                : 'bg-cream border-cream-border text-ink hover:bg-cream-muted'
            }`}
            title="Shortlist"
          >
            <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-coral' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
