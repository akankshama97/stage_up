import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageCircle,
  Sparkles,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrdersDrawer({
  isOpen,
  onClose,
  orders = [],
  onUpdateStatus,
  onOpenChat
}) {
  if (!isOpen) return null;

  const handleApprove = async (order) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E7A4C', '#FF4D2E', '#FAF7F2']
    });

    if (onUpdateStatus) {
      onUpdateStatus(order._id || order.orderId, 'completed');
    }
  };

  const handleRequestRevision = (order) => {
    if (onUpdateStatus) {
      onUpdateStatus(order._id || order.orderId, 'in_progress');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-emerald-100 text-forest border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Approved & Released
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3" />
            Ready for Your Review
          </span>
        );
      case 'escrow_held':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Funds Held in Escrow
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl overflow-hidden border-l border-cream-border">
        {/* Header */}
        <div className="p-4 border-b border-cream-border bg-cream flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-forest" />
            <div>
              <h3 className="font-heading font-bold text-base text-ink">
                My Escrow Bookings
              </h3>
              <span className="text-[11px] text-ink-muted">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} tracked with safe escrow
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

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {orders.length > 0 ? (
            orders.map((ord, idx) => (
              <div
                key={ord._id || ord.orderId || idx}
                className="bg-white rounded-human border border-cream-border p-3.5 shadow-paper space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ord.talentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={ord.talentName}
                      className="w-10 h-10 rounded-full object-cover border border-cream-border"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-ink leading-tight">
                        {ord.talentName}
                      </h4>
                      <span className="text-[10px] text-ink-muted font-mono">
                        {ord.orderId}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-extrabold text-sm text-coral block">
                      ₹{ord.amount}
                    </span>
                    {getStatusBadge(ord.status)}
                  </div>
                </div>

                {/* Package and brief details */}
                <div className="bg-cream-muted/60 p-2.5 rounded-[8px] text-xs space-y-1">
                  <div className="font-semibold text-ink truncate">
                    📦 {ord.projectTitle}
                  </div>
                  {ord.brief && (
                    <div className="text-[11px] text-ink-secondary line-clamp-2">
                      Brief: {ord.brief}
                    </div>
                  )}
                  {ord.driveLink && (
                    <a
                      href={ord.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-forest hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Project Assets / Drive Link
                    </a>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-cream-border">
                  {ord.status !== 'completed' ? (
                    <>
                      <button
                        onClick={() => handleApprove(ord)}
                        className="flex-1 py-2 px-3 rounded-human bg-forest hover:bg-emerald-800 text-white font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Release Pay</span>
                      </button>

                      <button
                        onClick={() => handleRequestRevision(ord)}
                        className="py-2 px-3 rounded-human bg-cream-muted hover:bg-cream-darker text-ink font-heading font-semibold text-xs transition flex items-center gap-1"
                        title="Request Revision"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
                        <span>Revision</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 py-1 text-center text-xs text-forest font-semibold flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Payment Released to Creator
                    </div>
                  )}

                  {/* Direct WhatsApp link */}
                  <a
                    href={`https://wa.me/${(ord.talentPhone || '+919811243210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${ord.talentName}, checking in on Order ${ord.orderId} (${ord.projectTitle}) on StageUp.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-human bg-cream-muted hover:bg-cream-darker text-ink transition"
                    title="Chat with Creator"
                  >
                    <MessageCircle className="w-4 h-4 text-forest" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 bg-cream-muted rounded-full flex items-center justify-center mx-auto text-ink-muted">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-ink">
                No active escrow bookings
              </h4>
              <p className="text-xs text-ink-secondary max-w-xs mx-auto">
                Jab aap kisi creator ka package book karenge, toh aapke paise safely hold rahenge aur yahan track honge.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-human bg-ink text-cream text-xs font-bold"
              >
                Browse Creators Feed
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-cream-border bg-cream text-[10px] text-ink-muted flex items-center justify-between">
          <span>🔒 100% Guaranteed Escrow</span>
          <span>Zero platform charges</span>
        </div>
      </div>
    </div>
  );
}
