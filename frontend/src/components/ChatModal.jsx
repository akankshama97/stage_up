import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, ExternalLink, CheckCheck } from 'lucide-react';

export default function ChatModal({ talent, project, onClose }) {
  if (!talent) return null;

  const initialMsg = project
    ? `Namaste ${talent.name}! I saw your "${project.title}" (${project.price}) on StageUp. Are you available this week for a gig?`
    : `Hi ${talent.name}! Saw your proof reel on StageUp (${talent.skills[0] || 'work'}). Want to discuss a project.`;

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'recruiter',
      text: initialMsg,
      time: 'Just now'
    },
    {
      sender: 'talent',
      text: `Haan ji! Namaste! Main ${talent.city} se hoon. Main ${talent.turnaroundTime || '24 hrs'} ke andar delivery de sakti/sakta hoon. Aap brief share kar do!`,
      time: 'Typing done'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newRecruiterMsg = {
      sender: 'recruiter',
      text: inputMsg.trim(),
      time: 'Just now'
    };

    setMessages(prev => [...prev, newRecruiterMsg]);
    setInputMsg('');

    // Simulate Indian talent fast response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'talent',
          text: `Got it! Let's connect on WhatsApp at ${talent.phone || '+91 98112 43210'} ya fir aap yahan drive link bhej do.`,
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  const cleanPhone = (talent.phone || '+919811243210').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(initialMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* WhatsApp-styled Header */}
        <div className="flex items-center justify-between p-3.5 bg-forest text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={talent.avatar}
                alt={talent.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-300 border border-white"></span>
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-sm text-white leading-tight">
                {talent.name}
              </h3>
              <span className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                <span>📍 {talent.city}</span> • <span>Online</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 transition"
              title="Open real WhatsApp"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice banner */}
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-[11px] text-slate-600 text-center font-medium">
          Direct deal • 100% Escrow Protected • Zero agency commission
        </div>

        {/* Message bubble stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/70">
          {messages.map((m, idx) => {
            const isRecruiter = m.sender === 'recruiter';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isRecruiter ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isRecruiter
                      ? 'bg-gradient-to-r from-coral to-rose-600 text-white rounded-br-none'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                      isRecruiter ? 'text-rose-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.time}</span>
                    {isRecruiter && <CheckCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message or brief..."
            className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-coral focus:ring-2 focus:ring-rose-500/10 transition"
          />

          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-forest hover:bg-emerald-700 text-white flex items-center justify-center transition shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
