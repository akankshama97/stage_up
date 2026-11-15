import React from 'react';
import {
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Lock,
  Clock,
  Check
} from 'lucide-react';

export default function ProjectsModal({
  talent,
  onClose,
  onBookEscrow,
  onOpenChat
}) {
  if (!talent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-t-[20px] sm:rounded-human border border-cream-border max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cream-muted bg-cream">
          <div className="flex items-center gap-2.5">
            <img
              src={talent.avatar}
              alt={talent.name}
              className="w-10 h-10 rounded-full object-cover border border-cream-border"
            />
            <div>
              <h3 className="font-heading font-bold text-sm text-ink leading-tight">
                {talent.name}'s Packages
              </h3>
              <span className="text-[11px] text-ink-muted">
                📍 {talent.city} • Starts at {talent.price}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-muted hover:bg-cream-darker flex items-center justify-center text-ink transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Escrow Guarantee Banner */}
        <div className="bg-forest-light px-4 py-2 border-b border-forest-border flex items-center justify-between text-forest text-[11px]">
          <span className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            100% Escrow Protection on All Bookings
          </span>
          <span className="text-[10px] text-forest font-bold uppercase">Zero Risk</span>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {talent.projects && talent.projects.length > 0 ? (
            talent.projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-white rounded-human border border-cream-border p-3.5 hover:border-coral transition shadow-paper space-y-3"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={proj.image || talent.avatar}
                    alt={proj.title}
                    className="w-16 h-16 rounded-[8px] object-cover flex-shrink-0 border border-cream-border"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-ink-muted">
                        Package #{idx + 1}
                      </span>
                      <span className="font-heading font-extrabold text-sm text-coral">
                        {proj.price}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-xs sm:text-sm text-ink mt-0.5">
                      {proj.title}
                    </h4>

                    <p className="text-[11px] text-ink-secondary mt-1 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* Dual Action CTAs: Book with Escrow vs Chat */}
                <div className="flex items-center gap-2 pt-2 border-t border-cream-border">
                  <button
                    onClick={() => {
                      onClose();
                      if (onBookEscrow) onBookEscrow(talent, proj);
                    }}
                    className="flex-1 py-2 px-3 rounded-human bg-ink hover:bg-neutral-800 text-cream font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Lock className="w-3 h-3 text-forest-border" />
                    <span>Book with Escrow</span>
                    <ArrowRight className="w-3 h-3 text-coral" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenChat) onOpenChat(talent, proj);
                    }}
                    className="py-2 px-3 rounded-human bg-cream-muted hover:bg-cream-darker text-ink font-heading font-semibold text-xs transition flex items-center gap-1"
                    title="Discuss with Creator on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-forest" />
                    <span className="hidden xs:inline">Chat</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-ink-muted text-center py-4">No packages listed yet.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cream-muted bg-cream flex items-center justify-between">
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-forest" />
            Turnaround: <strong>{talent.turnaroundTime || '24 hrs'}</strong>
          </span>

          <button
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat(talent);
            }}
            className="px-3 py-1.5 rounded-human bg-forest hover:bg-emerald-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Direct WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
