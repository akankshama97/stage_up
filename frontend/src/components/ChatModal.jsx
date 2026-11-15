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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-t-[20px] sm:rounded-human border border-cream-border h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* WhatsApp-styled human Header */}
        <div className="flex items-center justify-between p-3.5 bg-forest text-white">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={talent.avatar}
                alt={talent.name}
                className="w-10 h-10 rounded-full object-cover border border-white/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-sm text-white leading-tight">
                {talent.name}
              </h3>
              <span className="text-[11px] text-forest-light flex items-center gap-1">
                <span>📍 {talent.city}</span> • <span>Online</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1 transition"
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
        <div className="bg-cream-muted px-3 py-1.5 border-b border-cream-border text-[11px] text-ink-secondary text-center">
          Direct deal • No agency fees • Negotiate or pay UPI on delivery
        </div>

        {/* Message bubble stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]">
          {messages.map((m, idx) => {
            const isRecruiter = m.sender === 'recruiter';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isRecruiter ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[12px] p-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isRecruiter
                      ? 'bg-ink text-white rounded-br-none'
                      : 'bg-white text-ink border border-cream-border rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                      isRecruiter ? 'text-cream/70' : 'text-ink-light'
                    }`}
                  >
                    <span>{m.time}</span>
                    {isRecruiter && <CheckCheck className="w-3 h-3 text-coral" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-cream-border flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message or brief..."
            className="flex-1 text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human px-3.5 py-2.5 text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition"
          />

          <button
            type="submit"
            className="w-10 h-10 rounded-human bg-forest hover:bg-emerald-800 text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
