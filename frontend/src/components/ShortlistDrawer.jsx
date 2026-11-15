import React from 'react';
import { X, Heart, MessageCircle, ArrowRight, Trash2 } from 'lucide-react';

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlistedTalents = [],
  onRemove,
  onViewProfile,
  onOpenChat
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-none animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl border-l border-cream-border">
        {/* Drawer Header */}
        <div className="p-4 border-b border-cream-muted bg-cream flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral-light border border-coral-border flex items-center justify-center text-coral">
              <Heart className="w-4 h-4 fill-coral" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-ink leading-tight">
                Shortlisted Creators
              </h3>
              <span className="text-[11px] text-ink-muted">
                {shortlistedTalents.length} creators saved
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

        {/* List of shortlisted talents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {shortlistedTalents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-cream-muted flex items-center justify-center mx-auto mb-3 text-ink-light">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-ink">No creators shortlisted yet</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Click the heart icon on any vertical reel to save creators for quick comparison.
              </p>
            </div>
          ) : (
            shortlistedTalents.map((talent) => (
              <div
                key={talent._id}
                className="bg-white rounded-human border border-cream-border p-3.5 shadow-paper flex gap-3 items-center group"
              >
                <img
                  src={talent.avatar}
                  alt={talent.name}
                  className="w-12 h-12 rounded-full object-cover border border-cream-border flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      onClick={() => {
                        onClose();
                        onViewProfile(talent);
                      }}
                      className="font-heading font-bold text-xs sm:text-sm text-ink truncate cursor-pointer hover:text-coral transition"
                    >
                      {talent.name}
                    </h4>
                    <span className="font-heading font-bold text-xs text-coral">
                      {talent.price}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink-muted truncate">
                    📍 {talent.city} • {talent.skills[0]}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenChat(talent);
                      }}
                      className="px-2.5 py-1 rounded-[6px] bg-forest text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-800 transition"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onViewProfile(talent);
                      }}
                      className="px-2.5 py-1 rounded-[6px] bg-cream-muted text-ink text-[11px] font-semibold hover:bg-cream-darker transition"
                    >
                      Profile →
                    </button>

                    <button
                      onClick={() => onRemove(talent._id)}
                      className="p-1 text-ink-light hover:text-red-600 transition ml-auto"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {shortlistedTalents.length > 0 && (
          <div className="p-3 border-t border-cream-muted bg-cream">
            <button
              onClick={() => {
                onClose();
                onOpenChat(shortlistedTalents[0]);
              }}
              className="w-full py-2.5 px-4 rounded-human bg-ink hover:bg-neutral-800 text-cream font-heading font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Message Top Shortlisted</span>
              <ArrowRight className="w-3.5 h-3.5 text-coral" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
