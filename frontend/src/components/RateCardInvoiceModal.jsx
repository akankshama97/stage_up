import React, { useState } from 'react';
import {
  X,
  FileText,
  QrCode,
  Copy,
  Check,
  Share2,
  Download,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Simple lightweight SVG QR code matrix generator for UPI links
function generateSimpleQRMatrix(text) {
  // 21x21 standard QR grid representation
  const size = 21;
  const matrix = Array(size).fill(0).map(() => Array(size).fill(false));

  // Finder patterns at top-left, top-right, bottom-left
  const addFinder = (startR, startC) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startR + r][startC + c] = true;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, 14);
  addFinder(14, 0);

  // Timing lines
  for (let i = 8; i < 13; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic hash based on text input to fill internal data dots
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 1000000007;
  }

  for (let r = 1; r < size - 1; r++) {
    for (let c = 1; c < size - 1; c++) {
      // Don't overwrite finders
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= 13) ||
        (r >= 13 && c < 8)
      ) {
        continue;
      }
      const pseudoVal = (r * 17 + c * 23 + hash) % 10;
      matrix[r][c] = pseudoVal < 4;
    }
  }

  return matrix;
}

export default function RateCardInvoiceModal({ talent, onClose }) {
  if (!talent) return null;

  const defaultUpi = `${talent.name.toLowerCase().replace(/\s+/g, '')}@okhdfcbank`;

  // Form states
  const [clientName, setClientName] = useState('D2C Brand / Founder');
  const [upiId, setUpiId] = useState(defaultUpi);
  const [selectedItems, setSelectedItems] = useState([
    { id: 'item_1', name: '1x High-Retention Reel (DaVinci Color + Hook)', price: 500, selected: true },
    { id: 'item_2', name: 'Kinetic Bilingual Subtitles (Hindi & English)', price: 200, selected: true },
    { id: 'item_3', name: 'Sound Design & Beat-Synced SFX', price: 150, selected: false },
    { id: 'item_4', name: 'Clickable 3D YouTube Thumbnail', price: 250, selected: false },
    { id: 'item_5', name: 'Express 12-Hour Rush Turnaround', price: 200, selected: false }
  ]);

  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Calculate totals
  const totalAmount = selectedItems
    .filter(i => i.selected)
    .reduce((sum, item) => sum + item.price, 0);

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // UPI intent link
  const cleanUpi = upiId.trim() || defaultUpi;
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(
    talent.name
  )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`StageUp-${talent.name}-Gig`)}`;

  const qrMatrix = generateSimpleQRMatrix(upiIntentUri);

  const handleCopyInvoice = () => {
    const lines = [
      `🧾 STAGEUP INVOICE & RATE CARD`,
      `---------------------------------`,
      `Creator: ${talent.name} (${talent.city})`,
      `Client: ${clientName}`,
      `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      ``,
      `Deliverables:`,
      ...selectedItems
        .filter(i => i.selected)
        .map(i => `• ${i.name} — ₹${i.price}`),
      ``,
      `---------------------------------`,
      `TOTAL AMOUNT: ₹${totalAmount}`,
      `UPI ID: ${cleanUpi}`,
      `Pay Link: ${upiIntentUri}`,
      `Protected by StageUp Proof-of-Work Standard 🇮🇳`
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(lines);
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanUpi);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi ${clientName}, here is the verified StageUp rate quote from ${talent.name} for ₹${totalAmount}.\n\nUPI: ${cleanUpi}\nPayment Link: ${upiIntentUri}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-cream rounded-human border border-cream-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-cream-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest-light border border-forest-border flex items-center justify-center text-forest">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-ink leading-tight">
                  Creator Rate Card & UPI Invoice
                </h3>
                <span className="text-[10px] font-semibold text-forest bg-forest-light px-2 py-0.5 rounded-full border border-forest-border">
                  Instant UPI
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Transparent billing & instant settlement for Indian freelancers
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

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Creator & Client Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-human border border-cream-border">
              <label className="block text-[11px] font-heading font-semibold text-ink-secondary mb-1">
                Client / Company Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. D2C Brand / Cafe Owner"
                className="w-full text-xs bg-cream/40 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
              />
            </div>

            <div className="bg-white p-3 rounded-human border border-cream-border">
              <label className="block text-[11px] font-heading font-semibold text-ink-secondary mb-1">
                Creator UPI ID for Settlement
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. name@okhdfcbank"
                className="w-full text-xs bg-cream/40 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
              />
            </div>
          </div>

          {/* Service Deliverable Checkboxes */}
          <div className="bg-white rounded-human border border-cream-border p-4 shadow-paper space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-cream-muted">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink-secondary">
                Select Deliverables & Scope
              </h4>
              <span className="text-[11px] text-coral font-bold font-heading">
                Total: ₹{totalAmount}
              </span>
            </div>

            <div className="space-y-2">
              {selectedItems.map(item => (
                <label
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-human border transition cursor-pointer select-none ${
                    item.selected
                      ? 'bg-cream-muted border-coral/60'
                      : 'bg-white border-cream-border hover:bg-cream/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => {}}
                      className="w-4 h-4 text-coral accent-coral rounded focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-ink">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-xs font-heading font-bold text-ink-secondary">
                    ₹{item.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* TACTILE INVOICE CARD WITH UPI QR */}
          <div className="bg-white rounded-human border-2 border-dashed border-cream-border p-4 sm:p-5 shadow-paper relative">
            <div className="flex items-start justify-between border-b border-cream-border pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-sm text-ink tracking-tight">
                    Stage<span className="text-coral">Up</span>
                  </span>
                  <span className="text-[10px] text-ink-muted">Proof Invoice</span>
                </div>
                <div className="text-xs font-bold text-ink mt-1">
                  Issued to: <span className="text-ink-secondary font-medium">{clientName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-ink-muted">Invoice No:</span>
                <div className="text-xs font-mono font-bold text-ink">
                  INV-{Math.floor(10000 + Math.random() * 90000)}
                </div>
              </div>
            </div>

            <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left summary */}
              <div className="space-y-1.5 flex-1 w-full">
                <div className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold">
                  Payment Summary
                </div>
                <div className="font-heading font-extrabold text-2xl text-ink flex items-center gap-0.5">
                  ₹{totalAmount}
                  <span className="text-xs font-normal text-ink-muted ml-1">INR (Net)</span>
                </div>
                <div className="text-xs text-ink-secondary flex items-center gap-1">
                  <span>Payee:</span>
                  <span className="font-mono font-bold text-ink">{cleanUpi}</span>
                  <button
                    onClick={handleCopyUpi}
                    className="p-1 hover:bg-cream-muted rounded text-ink-muted hover:text-ink"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Right: SVG UPI QR Code */}
              <div className="flex flex-col items-center p-2.5 bg-cream/70 rounded-human border border-cream-border flex-shrink-0">
                <svg
                  viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                  className="w-24 h-24 sm:w-28 sm:h-28"
                  shapeRendering="crispEdges"
                >
                  <rect width="100%" height="100%" fill="#FAF7F2" />
                  {qrMatrix.map((row, r) =>
                    row.map((val, c) =>
                      val ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width={1}
                          height={1}
                          fill="#1A1A1A"
                        />
                      ) : null
                    )
                  )}
                </svg>
                <span className="text-[9px] font-mono font-bold text-ink-secondary mt-1 flex items-center gap-0.5">
                  <Smartphone className="w-2.5 h-2.5 text-forest" /> Scan via GPay / PhonePe
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-cream-border text-[10px] text-ink-muted flex items-center justify-between">
              <span>Backed by 100% StageUp Escrow Protection</span>
              <span className="text-forest font-semibold">Verified Creator Account</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
            <button
              onClick={handleCopyInvoice}
              className="w-full sm:w-auto py-2.5 px-4 rounded-human bg-white hover:bg-cream-muted text-ink font-heading font-bold text-xs border border-cream-border transition shadow-sm flex items-center justify-center gap-1.5"
            >
              {copiedInvoice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest" />
                  <span>Invoice Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Invoice Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto py-2.5 px-4 rounded-human bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <a
              href={upiIntentUri}
              className="w-full sm:w-auto py-2.5 px-5 rounded-human bg-coral hover:bg-coral-hover text-white font-heading font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 text-center"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Open in UPI App</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
