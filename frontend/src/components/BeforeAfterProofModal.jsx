import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  Lock,
  MessageCircle,
  Eye,
  Zap,
  ArrowRight,
  TrendingUp,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Rich before-and-after proof data for each talent
export const proofData = {
  talent_1: {
    title: 'DaVinci Resolve Color Grade & Retention Cut',
    category: 'Reel Editing',
    metric: '+58% View Retention',
    beforeLabel: 'Raw Phone Footage (Flat & Shaky)',
    afterLabel: 'Color Graded + Kinetic Subtitles',
    beforeImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    afterImage: '/davinci-timeline.svg',
    description: 'Transforming flat, low-contrast phone recording into an explosive viral reel with color grading, SFX, and bold bilingual captions.',
    breakdown: [
      'Rec.709 Color Profile with warm skin-tone curve',
      'Pacing cuts: Deleted 18 seconds of dead pauses',
      'Kinetic animated text popups in Hindi & English',
      'Layered sound design: Beat-synced whooshes and bass drops'
    ]
  },
  talent_2: {
    title: 'Kraft Paper Cafe Gig Poster',
    category: 'Poster Design',
    metric: 'Sold-Out Live Gig',
    beforeLabel: 'Client Pencil Rough Sketch',
    afterLabel: 'Print-Ready Kraft Typography Poster',
    beforeImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    description: 'From an illegible napkin doodle to a textured, retro-modern gig poster that drove 180+ ticket pre-bookings in Hauz Khas.',
    breakdown: [
      'Custom hand-lettered serif headline vector',
      'Distressed screenprint noise & halftone grain',
      'High-contrast typographic hierarchy for phone scrolling',
      '300 DPI CMYK export ready for physical print & Instagram'
    ]
  },
  talent_3: {
    title: 'High-CTR YouTube Finance Thumbnail',
    category: 'Thumbnail Design',
    metric: '14.2% CTR (vs 3.1% baseline)',
    beforeLabel: 'Standard Video Frame Grab',
    afterLabel: 'High-Contrast 3D Face Pop Thumbnail',
    beforeImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    description: 'A dull screenshot gets zero clicks. We isolate the subject, boost lighting, and add an irresistible intrigue hook in under 3 words.',
    breakdown: [
      'Sub-pixel subject masking with rim light enhancement',
      'Eye-tracking color layout with glowing green cash flow',
      'Large mobile-legible typography (max 3 words)',
      'A/B tested against 4 variants for maximum click rate'
    ]
  },
  talent_4: {
    title: 'Psychological 3-Second Retention Script',
    category: 'Scriptwriting',
    metric: '82% Retention at 0:05',
    beforeLabel: 'Boring Bullet Notes ("10 Tips")',
    afterLabel: 'Story-Driven Curiosity Gap Script',
    beforeImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Replaced a dry listicle with an emotional counter-intuitive hook that stops scrolling fingers in the first 2 seconds.',
    breakdown: [
      'Subverted expectations hook ("Stop doing this immediately")',
      'Stage direction cues for the video editor at every 4-second mark',
      'Relatable Hindi-English street cadence',
      'Frictionless call-to-action that feels organic'
    ]
  },
  talent_5: {
    title: 'Commercial Voiceover & Broadcast Mastering',
    category: 'Voiceover',
    metric: '100% Client Approval in 1 Take',
    beforeLabel: 'Phone Voice Note (Room Echo)',
    afterLabel: 'Shure SM7B Studio Master',
    beforeImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    description: 'Clean room recording with broadcast audio chain: noise suppression, de-essing, subtle tube compression, and stereo warmth.',
    breakdown: [
      'Shure SM7B microphone + Cloudlifter CL-1',
      'iZotope RX de-click and mouth de-noise processing',
      'Bilingual fluency: Natural Malayalam and Indian English tone',
      'Delivered in 24-bit 48kHz WAV ready for editing'
    ]
  },
  talent_6: {
    title: 'Macro Product B-Roll & Turntable Cine Reel',
    category: 'Product Shoot',
    metric: '3.4x Higher Ad Conversions',
    beforeLabel: 'Static Phone Photo on Desk',
    afterLabel: '120fps Macro Turntable Video',
    beforeImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    description: 'Turned a static product into dynamic, mouthwatering tabletop cinema with high-speed macro motion and RGB rim lighting.',
    breakdown: [
      'Sony A7SIII + 90mm F2.8 Macro lens at 120fps',
      'Motorized 360-degree turntable with RGB rim key light',
      'Crisp foley sound design (crunch, pour, sizzle)',
      'Seamless 9:16 vertical crop ready for Meta & YouTube ads'
    ]
  }
};

export default function BeforeAfterProofModal({
  talent,
  onClose,
  onOpenChat,
  onBookEscrow
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeTab, setActiveTab] = useState('slider'); // 'slider' | 'before' | 'after'

  if (!talent) return null;

  const currentProof = proofData[talent._id] || {
    title: `${talent.name}'s Proof of Work`,
    category: talent.skills?.[0] || 'Creative Service',
    metric: 'Verified Transformation',
    beforeLabel: 'Raw Unprocessed Asset',
    afterLabel: 'Final Professional Delivery',
    beforeImage: talent.posterUrl || talent.avatar,
    afterImage: talent.projects?.[0]?.image || talent.avatar,
    description: `Real proof of work transformation delivered by ${talent.name}. Showing the difference between raw input and client-ready polish.`,
    breakdown: [
      'Quality enhancement and professional grading',
      'Optimized for mobile social retention',
      'Fast turnaround delivery',
      '100% money-back escrow guarantee'
    ]
  };

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-cream rounded-human border border-cream-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-cream-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral-light border border-coral-border flex items-center justify-center text-coral">
              <Zap className="w-4 h-4 fill-coral" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-ink leading-tight">
                  Raw vs Final Transformation
                </h3>
                <span className="text-[10px] font-semibold text-forest bg-forest-light px-2 py-0.5 rounded-full border border-forest-border flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {currentProof.metric}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                {talent.name} ({talent.city}) • {currentProof.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-human bg-white border border-cream-border flex items-center justify-center text-ink hover:bg-cream-muted transition shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* View Mode Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-ink-secondary">
              Drag slider to compare:
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-human border border-cream-border">
              <button
                onClick={() => setActiveTab('slider')}
                className={`text-[11px] font-heading font-medium px-2.5 py-1 rounded transition ${
                  activeTab === 'slider'
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                Split Slider
              </button>
              <button
                onClick={() => setActiveTab('before')}
                className={`text-[11px] font-heading font-medium px-2.5 py-1 rounded transition ${
                  activeTab === 'before'
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                Raw Asset
              </button>
              <button
                onClick={() => setActiveTab('after')}
                className={`text-[11px] font-heading font-medium px-2.5 py-1 rounded transition ${
                  activeTab === 'after'
                    ? 'bg-coral text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                Final Edit ✨
              </button>
            </div>
          </div>

          {/* Interactive Split Screen Viewport */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-human overflow-hidden border-2 border-cream-border bg-neutral-900 select-none shadow-paper">
            {activeTab === 'slider' ? (
              <div
                className="relative w-full h-full cursor-ew-resize overflow-hidden"
                onMouseMove={handleSliderMove}
                onTouchMove={handleTouchMove}
              >
                {/* AFTER IMAGE (Full width behind) */}
                <img
                  src={currentProof.afterImage}
                  alt={currentProof.afterLabel}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* BEFORE IMAGE (Clipped on left by sliderPosition %) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={currentProof.beforeImage}
                    alt={currentProof.beforeLabel}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{
                      width: '100%',
                      filter: 'grayscale(25%) brightness(0.92)'
                    }}
                  />
                  {/* Subtle 'Raw' tint banner */}
                  <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                    RAW FOOTAGE
                  </div>
                </div>

                {/* Final Edit tag (Right side) */}
                <div className="absolute top-3 right-3 bg-coral text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  FINAL POLISH
                </div>

                {/* Draggable Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-ink shadow-md border-2 border-coral flex items-center justify-center">
                    <Sliders className="w-3.5 h-3.5 text-coral" />
                  </div>
                </div>

                {/* Bottom interactive helper hint */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
                  <span className="text-[10px] font-semibold text-white/90 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    ⟵ Drag left/right to reveal the edit ⟶
                  </span>
                </div>
              </div>
            ) : activeTab === 'before' ? (
              <div className="relative w-full h-full">
                <img
                  src={currentProof.beforeImage}
                  alt={currentProof.beforeLabel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded border border-white/20">
                  {currentProof.beforeLabel}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={currentProof.afterImage}
                  alt={currentProof.afterLabel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-coral text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                  {currentProof.afterLabel}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Skill Breakdown */}
          <div className="bg-white rounded-human border border-cream-border p-4 shadow-paper space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              What Changed in the Edit (Skill Breakdown)
            </h4>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {currentProof.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentProof.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-cream/60 p-2 rounded-human border border-cream-border text-xs text-ink"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & 1-Tap Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div>
              <div className="text-[11px] text-ink-muted">Fixed Gig Rate</div>
              <div className="font-heading font-extrabold text-lg text-coral">
                {talent.price}{' '}
                <span className="text-xs font-medium text-ink-secondary">
                  ({talent.priceUnit || 'per project'})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenChat) onOpenChat(talent);
                }}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-human bg-white hover:bg-cream-muted text-ink font-heading font-bold text-xs border border-cream-border transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-forest" />
                <span>Chat on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onBookEscrow) {
                    onBookEscrow(talent, talent.projects?.[0] || null);
                  }
                }}
                className="flex-1 sm:flex-initial py-2.5 px-5 rounded-human bg-coral hover:bg-coral-hover text-white font-heading font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Book via Escrow</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
