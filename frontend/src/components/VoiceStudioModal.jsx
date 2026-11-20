import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  Lock,
  MessageCircle,
  Sparkles,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

const voiceDemos = [
  {
    id: 'demo_1',
    title: 'Conversational Hindi Tech Explainer',
    language: 'Hindi',
    tone: 'Conversational / Relatable',
    duration: '0:28',
    transcript: 'Dosto, agar aap bhi roz subah 10 alag-alag apps kholte ho to manage your work, then you are wasting at least 2 hours every single day. Let me show you how one simple shortcut changed everything...',
    style: 'Explainer Reel, YouTube Shorts'
  },
  {
    id: 'demo_2',
    title: 'Warm Malayalam Brand Storytelling',
    language: 'Malayalam',
    tone: 'Emotional / Warm',
    duration: '0:34',
    transcript: 'Fort Kochi-yile ee pazhaya theruvukalil oru puthiya sughandham. Kaalathinte ormakalumaayi, nammude swantham kaappiyude madhuram...',
    style: 'D2C Brand Film, Regional Ad'
  },
  {
    id: 'demo_3',
    title: 'High-Energy Hinglish Promo Stinger',
    language: 'Hinglish',
    tone: 'Energetic / Punchy',
    duration: '0:18',
    transcript: 'Wait, don’t scroll! Delhi ke sabse aesthetic rooftop cafe me ab flat 40% off on all specialty coffees this weekend. Grab your passes right now!',
    style: 'Instagram Ad, Event Promo'
  },
  {
    id: 'demo_4',
    title: 'ASMR Relaxing Skincare Commercial',
    language: 'English (Indian Accent)',
    tone: 'Soft / ASMR / Aesthetic',
    duration: '0:25',
    transcript: 'Close your eyes. Breathe in. Feel pure cold-pressed almond oil melt into your skin. Crafted for dry winter mornings. Naturally yours.',
    style: 'Cosmetics Commercial, Luxury Brand'
  }
];

export default function VoiceStudioModal({
  talent,
  onClose,
  onOpenChat,
  onBookEscrow
}) {
  const [activeDemo, setActiveDemo] = useState(voiceDemos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef(null);

  if (!talent) return null;

  // Simulate audio playback with animated waveform bars
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2.5 * playbackSpeed;
        });
      }, 250);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playbackSpeed]);

  const togglePlay = (demo) => {
    if (activeDemo.id === demo.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveDemo(demo);
      setPlaybackProgress(0);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-cream rounded-human border border-cream-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-cream-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral-light border border-coral-border flex items-center justify-center text-coral">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-ink leading-tight">
                  Voiceover & Dubbing Studio
                </h3>
                <span className="text-[10px] font-semibold text-forest bg-forest-light px-2 py-0.5 rounded-full border border-forest-border flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Shure SM7B Mic
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                {talent.name} ({talent.city}) • 24-Bit Studio Mastered Audio
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

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Active Audio Player Visualizer Card */}
          <div className="bg-neutral-900 text-cream rounded-human p-5 shadow-paper border border-neutral-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-coral font-bold">
                  {activeDemo.language} • {activeDemo.tone}
                </span>
                <h4 className="font-heading font-bold text-base text-white mt-0.5">
                  {activeDemo.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Best for: {activeDemo.style}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded text-xs text-neutral-300 font-mono">
                <span>{activeDemo.duration}</span>
              </div>
            </div>

            {/* Interactive Waveform Visualizer */}
            <div className="h-14 flex items-center justify-between gap-1 px-1">
              {Array.from({ length: 36 }).map((_, idx) => {
                const isPlayed = (idx / 36) * 100 <= playbackProgress;
                // Pseudo height curve with lively animation if playing
                const baseHeight = 20 + Math.sin(idx * 0.5) * 15 + ((idx % 5) * 6);
                const animatedHeight = isPlaying
                  ? Math.min(100, Math.max(15, baseHeight + (Math.sin(Date.now() / 200 + idx) * 18)))
                  : baseHeight;

                return (
                  <div
                    key={idx}
                    className="flex-1 rounded-full transition-all duration-150"
                    style={{
                      height: `${animatedHeight}%`,
                      backgroundColor: isPlayed ? '#FF385C' : '#404040'
                    }}
                  />
                );
              })}
            </div>

            {/* Player Controls & Transcript Snippet */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => togglePlay(activeDemo)}
                  className="w-10 h-10 rounded-full bg-coral hover:bg-coral-hover text-white flex items-center justify-center shadow-lg transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                {/* Progress bar */}
                <div className="flex-1 mx-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral transition-all duration-200"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>

                {/* Speed Toggle */}
                <button
                  onClick={() => setPlaybackSpeed(s => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
                  className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-mono font-bold"
                >
                  {playbackSpeed}x
                </button>
              </div>

              {/* Spoken Transcript Preview */}
              <div className="p-3 bg-neutral-800/80 rounded-human border border-neutral-700/60 text-xs text-neutral-300 italic leading-relaxed">
                "{activeDemo.transcript}"
              </div>
            </div>
          </div>

          {/* Demos Track List */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink-secondary">
              Available Audition Samples (Bilingual)
            </h4>

            {voiceDemos.map((demo) => {
              const isSelected = activeDemo.id === demo.id;
              return (
                <div
                  key={demo.id}
                  onClick={() => togglePlay(demo)}
                  className={`p-3 rounded-human border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-coral shadow-sm'
                      : 'bg-white border-cream-border hover:bg-cream/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected && isPlaying ? 'bg-coral text-white' : 'bg-cream-muted text-ink'
                    }`}>
                      {isSelected && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </div>

                    <div>
                      <div className="text-xs font-heading font-bold text-ink">
                        {demo.title}
                      </div>
                      <div className="text-[11px] text-ink-muted">
                        {demo.language} • {demo.tone}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-ink-secondary">
                    {demo.duration}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Studio Hardware Specs */}
          <div className="bg-white rounded-human border border-cream-border p-3.5 shadow-paper">
            <h4 className="text-[11px] font-heading font-bold uppercase tracking-wider text-ink-secondary mb-2">
              Studio Hardware & Delivery Specs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-ink-secondary">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                <span>Shure SM7B Broadcast Mic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                <span>Focusrite Scarlett 2i2 Preamp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                <span>24-bit 48kHz WAV Masters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                <span>1 Free Pronunciation Revision</span>
              </div>
            </div>
          </div>

          {/* Bottom Action CTAs */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[11px] text-ink-muted block">Fixed Voice Rate</span>
              <span className="font-heading font-extrabold text-lg text-coral">
                {talent.price} <span className="text-xs font-normal text-ink-secondary">({talent.priceUnit || 'per minute'})</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenChat) onOpenChat(talent);
                }}
                className="py-2 px-3 rounded-human bg-white hover:bg-cream-muted text-ink font-heading font-bold text-xs border border-cream-border transition shadow-sm flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-forest" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onBookEscrow) {
                    onBookEscrow(talent, talent.projects?.[0] || null);
                  }
                }}
                className="py-2 px-4 rounded-human bg-coral hover:bg-coral-hover text-white font-heading font-bold text-xs transition shadow-sm flex items-center gap-1.5"
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
