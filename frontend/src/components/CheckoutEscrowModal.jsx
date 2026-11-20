import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  Smartphone,
  CreditCard,
  Building2,
  FileText,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutEscrowModal({ talent, project, onClose, onOrderSuccess }) {
  if (!talent || !project) return null;

  // Extract clean numerical amount from string like "Rs 500" or "₹1200"
  const rawPriceStr = project.price || talent.price || '500';
  const numericAmount = parseInt(rawPriceStr.replace(/[^0-9]/g, ''), 10) || 500;

  // Form states
  const [brief, setBrief] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'upi_id' | 'card'
  const [upiId, setUpiId] = useState('');
  
  // UI states
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [processingStatus, setProcessingStatus] = useState('Initiating secure UPI session...');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'upi_id' && !upiId.trim()) {
      setError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank)');
      return;
    }

    setStep('processing');
    setProcessingStatus('Verifying StageUp Escrow vault...');

    try {
      await new Promise(r => setTimeout(r, 700));
      setProcessingStatus(`Authorizing ₹${numericAmount} via ${paymentMethod.toUpperCase()}...`);
      await new Promise(r => setTimeout(r, 900));
      setProcessingStatus('Securing funds in 100% Escrow Hold...');
      await new Promise(r => setTimeout(r, 700));

      const payload = {
        talentId: talent._id,
        talentName: talent.name,
        talentPhone: talent.phone || '+919811243210',
        talentAvatar: talent.avatar,
        projectTitle: project.title,
        amount: numericAmount,
        paymentMethod: paymentMethod === 'upi_id' ? `UPI (${upiId})` : paymentMethod.toUpperCase(),
        upiId: upiId || `${paymentMethod}@upi`,
        brief: brief.trim(),
        driveLink: driveLink.trim(),
        turnaroundTime: talent.turnaroundTime || '24 hrs',
        recruiterPhone: recruiterPhone.trim()
      };

      let orderResult = null;
      try {
        const apiBase = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiBase}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          orderResult = await res.json();
        }
      } catch (e) {
        console.warn('API /api/orders unavailable, using offline escrow simulation:', e);
      }

      if (!orderResult) {
        orderResult = {
          _id: `ord_${Date.now()}`,
          orderId: `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
          ...payload,
          status: 'held_in_escrow',
          createdAt: new Date().toISOString()
        };
      }

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('stageup_orders') || '[]');
        localStorage.setItem('stageup_orders', JSON.stringify([orderResult, ...existing]));
      } catch (e) {}

      setCreatedOrder(orderResult);
      setStep('success');

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF385C', '#059669', '#6366F1']
      });

      if (onOrderSuccess) {
        onOrderSuccess(orderResult);
      }
    } catch (err) {
      console.error(err);
      setError('Payment simulation failed. Please try again.');
      setStep('checkout');
    }
  };

  const copyOrderId = () => {
    if (createdOrder && navigator.clipboard) {
      navigator.clipboard.writeText(createdOrder.orderId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getWhatsAppReceiptLink = () => {
    if (!createdOrder) return '#';
    const cleanPhone = (talent.phone || '+919811243210').replace(/[^0-9]/g, '');
    const message = `Namaste ${talent.name}! 🚀\n\nI just booked your "${project.title}" on StageUp and deposited ₹${numericAmount} in Escrow Hold.\n\n📋 Order ID: ${createdOrder.orderId}\n⏱️ Turnaround: ${talent.turnaroundTime || '24 hrs'}\n📝 Brief: ${createdOrder.brief || 'Discussed on chat'}\n${createdOrder.driveLink ? `📁 Footage: ${createdOrder.driveLink}\n` : ''}\nStageUp will release the payment directly to you once I approve your delivery. Please confirm when you start!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse"></span>
            <span className="text-xs font-heading font-extrabold tracking-tight text-slate-900 uppercase">
              StageUp Instant Escrow Booking
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CHECKOUT SCREEN */}
        {step === 'checkout' && (
          <form onSubmit={handlePay} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Selected Package Summary Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex items-start gap-3.5">
              <img
                src={project.image || talent.avatar}
                alt={project.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Hiring {talent.name} (📍 {talent.city})
                  </span>
                  <span className="text-sm font-heading font-extrabold text-coral">
                    ₹{numericAmount}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 truncate mt-0.5">
                  {project.title}
                </h4>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-forest" />
                    Turnaround: <strong>{talent.turnaroundTime || '24 hrs'}</strong>
                  </span>
                  <span>•</span>
                  <span>1 Revision included</span>
                </div>
              </div>
            </div>

            {/* Escrow Trust Assurance */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-emerald-900">
                <strong className="font-heading font-bold block text-slate-900">
                  100% Escrow Protection
                </strong>
                Aapke paise StageUp safe vault mein hold rahenge. Ye creator ko tabhi transfer honge jab aap unka draft dekh kar santusht honge.
              </div>
            </div>

            {/* Brief & Drive Link */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                  Project Brief &amp; Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="e.g. 30-sec reel for Instagram, upbeat audio, add catchy Hindi subtitles, focus on hook..."
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-coral focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                    Raw Footage / Drive Link
                  </label>
                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-coral focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                    Your WhatsApp (for updates)
                  </label>
                  <input
                    type="tel"
                    value={recruiterPhone}
                    onChange={(e) => setRecruiterPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-coral focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-800 mb-2">
                Choose Instant Payment Method
              </label>

              {/* UPI Quick Apps Grid */}
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {[
                  { id: 'gpay', label: 'Google Pay', badge: 'Fastest' },
                  { id: 'phonepe', label: 'PhonePe', badge: 'Popular' },
                  { id: 'paytm', label: 'Paytm UPI', badge: 'Instant' }
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setPaymentMethod(app.id)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center relative ${
                      paymentMethod === app.id
                        ? 'border-coral bg-rose-50 text-slate-900 shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className={`w-4 h-4 mb-1 ${paymentMethod === app.id ? 'text-coral' : 'text-slate-400'}`} />
                    <span className="text-xs font-heading font-bold">{app.label}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">{app.badge}</span>
                    {paymentMethod === app.id && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Other Options: UPI ID & Card */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_id')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'upi_id'
                      ? 'border-coral bg-rose-50 text-slate-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Any UPI ID / VPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'border-coral bg-rose-50 text-slate-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards / Netbanking</span>
                </button>
              </div>

              {paymentMethod === 'upi_id' && (
                <div className="mt-2.5 animate-fadeIn">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. mobile@okhdfcbank, user@paytm)"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-coral"
                  />
                </div>
              )}
            </div>

            {/* Transparent Bill Breakdown */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Gig Price</span>
                <span className="font-semibold text-slate-900">₹{numericAmount}</span>
              </div>
              <div className="flex justify-between text-forest">
                <span>StageUp Escrow Protection</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-forest">
                <span>Platform Fee (Early Creator Beta)</span>
                <span className="font-semibold">₹0</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-heading font-extrabold text-sm text-slate-900">
                <span>Total Amount in Escrow</span>
                <span className="text-coral">₹{numericAmount}</span>
              </div>
            </div>

            {/* Pay CTA */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.99] text-white font-heading font-extrabold text-sm transition shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>Pay ₹{numericAmount} &amp; Lock in Escrow</span>
                <ArrowRight className="w-4 h-4 text-white ml-1" />
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-forest" />
                256-bit Bank Grade Security • 100% Refund if not satisfied
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: PROCESSING ANIMATION */}
        {step === 'processing' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-coral animate-spin"></div>
              <Lock className="w-6 h-6 text-forest" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                Processing Secure Escrow
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {processingStatus}
              </p>
            </div>

            <div className="w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-coral h-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS & RECEIPT */}
        {step === 'success' && createdOrder && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 animate-fadeIn">
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 bg-emerald-50 text-forest rounded-full mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-heading font-extrabold tracking-wider uppercase text-forest block">
                Escrow Locked Successfully
              </span>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">
                ₹{numericAmount} Held in Safe Escrow!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {talent.name} ko notify kar diya gaya hai. Jab tak aapka kaam final nahi ho jata, paise safe hain.
              </p>
            </div>

            {/* Escrow Order Pass */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Escrow ID</span>
                  <div className="font-mono font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{createdOrder.orderId}</span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="p-1 hover:bg-slate-200 rounded transition text-slate-400 hover:text-slate-700"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Turnaround</span>
                  <div className="font-heading font-bold text-xs text-forest flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{talent.turnaroundTime || '24 hrs'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Creator:</span>
                  <strong className="text-slate-900">{talent.name} ({talent.city})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Package:</span>
                  <strong className="text-slate-900 truncate max-w-[200px]">{project.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <strong className="text-slate-900">{createdOrder.paymentMethod}</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <a
                href={getWhatsAppReceiptLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Send Order Receipt to {talent.name} on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-semibold text-xs transition"
              >
                Done • Back to Feed
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
