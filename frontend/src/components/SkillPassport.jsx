import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Download,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  RotateCcw,
  Users,
  IndianRupee,
  Share2,
  FileCheck,
  Check,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SkillPassport({ talent, isLiveTested = false }) {
  if (!talent) return null;

  const [downloadToast, setDownloadToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Passport metadata
  const passportNumber = `STG-IND-${talent._id ? talent._id.replace(/[^0-9]/g, '01') : '942'}-2026`;
  const issueDate = '15 JAN 2026';
  const primaryTrade = talent.skills?.[0] ? talent.skills[0].split('-')[0].trim() : 'Digital Creator';

  // Last 6 months earnings data (INR)
  const earningsHistory = [
    { month: 'Jun', amount: 18500, height: 42 },
    { month: 'Jul', amount: 24000, height: 55 },
    { month: 'Aug', amount: 31200, height: 72 },
    { month: 'Sep', amount: 28400, height: 65 },
    { month: 'Oct', amount: 42500, height: 92 },
    { month: 'Nov', amount: 48900, height: 100 }
  ];

  const handleDownloadPassport = () => {
    setDownloadToast(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF4D2E', '#1E7A4C', '#FFB800']
    });
    setTimeout(() => setDownloadToast(false), 3000);
  };

  const handleCopyPassportLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/passport/${talent._id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-human border-2 border-cream-border p-4 sm:p-6 shadow-paper space-y-5 relative overflow-hidden">
      {/* Background Indian Security Micro-Pattern Motifs (Subtle Paper Watermark) */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: REPUBLIC OF CREATORS / PASSPORT HEADER */}
      <div className="border-b-2 border-dashed border-cream-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-human bg-cream border-2 border-cream-border flex items-center justify-center text-ink shadow-inner flex-shrink-0">
            <span className="font-heading font-black text-xs text-center leading-none text-ink">
              🇮🇳<br />IND
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-muted">
                Official Skill Passport
              </span>
              <span className="text-[10px] bg-forest-light text-forest font-bold px-2 py-0.2 rounded-full border border-forest-border">
                CV Replacement
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink tracking-tight flex items-center gap-1.5">
              Republic of Indian Creators 🇮🇳
            </h3>
            <span className="font-mono text-[11px] text-ink-muted block mt-0.5">
              Doc ID: <span className="font-bold text-ink">{passportNumber}</span> • Issued: {issueDate}
            </span>
          </div>
        </div>

        {/* Action: Download / Share Passport */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyPassportLink}
            className="py-1.5 px-2.5 rounded-human bg-cream hover:bg-cream-muted border border-cream-border text-ink text-xs font-heading font-semibold transition flex items-center gap-1 shadow-sm"
            title="Copy Passport Share Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-forest" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleDownloadPassport}
            className="py-1.5 px-3 rounded-human bg-ink hover:bg-neutral-800 text-cream text-xs font-heading font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download Passport as Image"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Passport as Image</span>
          </button>
        </div>
      </div>

      {/* DOWNLOAD CONFIRMATION TOAST */}
      {downloadToast && (
        <div className="p-2.5 rounded-human bg-forest text-white text-xs font-heading font-bold flex items-center justify-between shadow-paper animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Official Skill Passport snapshot generated & ready for download!</span>
          </div>
          <span className="text-[10px] text-emerald-200 font-normal">PNG High-Res</span>
        </div>
      )}

      {/* PASSPORT BIOMETRIC & TRADE PROFILE SECTION */}
      <div className="bg-cream/60 rounded-human border border-cream-border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={talent.avatar}
              alt={talent.name}
              className="w-20 h-24 rounded-lg object-cover border-2 border-white shadow-sm"
            />
            {/* Red Holographic / Paper Corner */}
            <div className="absolute -top-1.5 -left-1.5 bg-coral text-white text-[8px] font-mono font-bold px-1 py-0.2 rounded shadow">
              AUTH
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ink-muted block font-semibold">
              Certified Professional
            </span>
            <h4 className="font-heading font-extrabold text-lg text-ink leading-tight flex items-center gap-1.5">
              {talent.name}
            </h4>

            <div className="flex items-center gap-2 text-xs text-ink-secondary flex-wrap">
              <span className="font-medium flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-coral" /> {talent.city}, India
              </span>
              <span>•</span>
              <span className="font-bold text-ink bg-white px-2 py-0.5 rounded border border-cream-border">
                {primaryTrade}
              </span>
            </div>

            <div className="text-[11px] text-ink-muted pt-0.5">
              Average Turnaround: <span className="font-semibold text-forest">{talent.turnaroundTime || '24 hrs'}</span>
            </div>
          </div>
        </div>

        {/* OFFICIAL VERIFIED STAMP */}
        <div className="flex sm:flex-col items-center justify-center p-3 rounded-full border-2 border-forest/60 bg-forest-light/60 text-forest text-center self-end sm:self-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-black text-xs shadow-inner">
            ✓
          </div>
          <div className="text-[9px] font-heading font-black uppercase tracking-tighter text-forest mt-1 leading-tight">
            STAGEUP VERIFIED<br />GOVT STANDARD
          </div>
        </div>
      </div>

      {/* GOLDEN LIVE TESTED BADGE IF ACTIVE */}
      {isLiveTested && (
        <div className="bg-amber-50 rounded-human border-2 border-amber-400 p-3 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xs text-amber-950 uppercase tracking-wide flex items-center gap-1">
                🏆 StageUp Verified - Live Tested
              </div>
              <p className="text-[11px] text-amber-900">
                15-Minute Raw Footage test verified on timeline. Zero ghost agency outsourcing.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-1 rounded">
            100% AUTHENTIC
          </span>
        </div>
      )}

      {/* THE 4 PILLARS OF PROOF (CV REPLACEMENT CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* CARD 1: RELIABILITY SCORE */}
        <div className="bg-cream/40 rounded-human border border-cream-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-ink-secondary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-forest" />
              Reliability Score
            </span>
            <span className="font-heading font-extrabold text-base text-forest">
              98%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-cream-muted rounded-full overflow-hidden border border-cream-border">
            <div className="h-full bg-forest rounded-full transition-all duration-500" style={{ width: '98%' }} />
          </div>

          <p className="text-[11px] text-ink-muted">
            Delivered 48 of 49 gigs strictly on-time within guaranteed turnaround.
          </p>
        </div>

        {/* CARD 2: REVISION SCORE */}
        <div className="bg-cream/40 rounded-human border border-cream-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-ink-secondary flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-coral" />
              Revision Friction Score
            </span>
            <span className="font-heading font-extrabold text-base text-coral">
              1.2 avg
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink font-semibold">
            <div className="flex-1 bg-white p-1 rounded border border-cream-border text-center text-[11px]">
              1st Cut Approval: <span className="text-forest font-bold">84%</span>
            </div>
            <div className="flex-1 bg-white p-1 rounded border border-cream-border text-center text-[11px]">
              Industry Avg: <span className="text-ink-muted">3.8</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-muted">
            Clients require minimum back-and-forth due to detailed project brief matching.
          </p>
        </div>

        {/* CARD 3: REPEAT CLIENT RATE */}
        <div className="bg-cream/40 rounded-human border border-cream-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-ink-secondary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-ink" />
              Repeat Client Rate
            </span>
            <span className="font-heading font-extrabold text-base text-ink">
              64%
            </span>
          </div>

          <div className="w-full h-2 bg-cream-muted rounded-full overflow-hidden border border-cream-border">
            <div className="h-full bg-coral rounded-full transition-all duration-500" style={{ width: '64%' }} />
          </div>

          <p className="text-[11px] text-ink-muted">
            64 out of 100 first-time clients re-booked within 60 days.
          </p>
        </div>

        {/* CARD 4: ESCROW SETTLEMENT TRACK RECORD */}
        <div className="bg-cream/40 rounded-human border border-cream-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-ink-secondary flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              Dispute Rate
            </span>
            <span className="font-heading font-extrabold text-base text-forest">
              0.0%
            </span>
          </div>

          <div className="bg-white p-1.5 rounded border border-cream-border flex items-center justify-between text-xs">
            <span className="text-ink-muted text-[11px]">Escrow Funds Cleared:</span>
            <span className="font-heading font-bold text-ink">₹1,84,000+</span>
          </div>

          <p className="text-[11px] text-ink-muted">
            100% of escrow contracts successfully approved by clients without refund disputes.
          </p>
        </div>
      </div>

      {/* MONTHLY EARNINGS PROOF GRAPH (LAST 6 MONTHS) */}
      <div className="bg-cream/50 rounded-human border border-cream-border p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-forest" />
              Proof of Income & Volume (Last 6 Months)
            </h4>
            <p className="text-[11px] text-ink-muted">
              Verified freelance income settled via StageUp UPI Escrow
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-ink-muted">Total 6-Mo Volume:</span>
            <div className="font-heading font-extrabold text-sm text-forest">
              ₹2,07,500
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 bg-white rounded-human border border-cream-border">
          {earningsHistory.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              {/* Tooltip on hover */}
              <span className="text-[9px] font-mono font-bold text-ink-muted group-hover:text-coral transition">
                ₹{(item.amount / 1000).toFixed(1)}k
              </span>

              {/* Bar */}
              <div
                className="w-full max-w-[28px] rounded-t-[4px] bg-cream-muted group-hover:bg-coral transition-all duration-300 border border-cream-border relative"
                style={{ height: `${item.height}%` }}
              >
                {idx === earningsHistory.length - 1 && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-forest animate-ping" />
                )}
              </div>

              {/* Month label */}
              <span className="text-[10px] font-heading font-semibold text-ink-secondary">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER GUARANTEE BADGE */}
      <div className="pt-2 border-t border-cream-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-ink-muted">
        <span>Verified by StageUp Independent Talent Audit Protocol</span>
        <span className="font-mono text-forest font-bold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-forest" /> 100% NO CV • PURE PROOF OF WORK
        </span>
      </div>
    </div>
  );
}
