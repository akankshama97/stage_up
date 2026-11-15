import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Film,
  Image as ImageIcon,
  Mic,
  PenTool,
  IndianRupee,
  Clock,
  Zap,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Sliders
} from 'lucide-react';
import { SKILL_OPTIONS, BUDGET_OPTIONS, DEADLINE_OPTIONS } from '../utils/aiMatchLogic';

export default function AiMatchModal({
  isOpen,
  onClose,
  onFindMatches,
  currentCriteria = null
}) {
  const [skill, setSkill] = useState(currentCriteria?.skill || 'Reel Editing');
  const [budget, setBudget] = useState(currentCriteria?.budget || 'Under ₹500');
  const [deadline, setDeadline] = useState(currentCriteria?.deadline || 'Urgent (24 hrs)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onFindMatches({
      skill,
      budget,
      deadline
    });
  };

  // Helper icon for skills
  const getSkillIcon = (s) => {
    switch (s) {
      case 'Reel Editing':
        return <Film className="w-4 h-4 text-coral" />;
      case 'Thumbnail Design':
        return <ImageIcon className="w-4 h-4 text-coral" />;
      case 'Voiceover':
        return <Mic className="w-4 h-4 text-coral" />;
      case 'Scriptwriting':
        return <PenTool className="w-4 h-4 text-coral" />;
      default:
        return <Sparkles className="w-4 h-4 text-coral" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-none animate-fadeIn">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card - Warm Tactile Paper Aesthetic */}
      <div className="relative w-full max-w-md bg-cream rounded-t-[24px] sm:rounded-human border-2 border-cream-border p-5 sm:p-6 shadow-paper space-y-5 z-10 max-h-[92vh] overflow-y-auto">
        
        {/* Subtle Paper Stamp Watermark in corner */}
        <div className="absolute top-4 right-14 opacity-10 pointer-events-none select-none">
          <span className="font-mono text-2xl font-black text-ink">MATCH</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-cream-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-human bg-coral-light border border-coral-border flex items-center justify-center text-coral shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 text-coral" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-coral bg-coral-light px-2 py-0.5 rounded border border-coral-border">
                  Proof-of-Work Matcher
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-lg text-ink leading-tight mt-0.5">
                Describe Your Work
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Zero CVs. We match you to tested Indian creators in seconds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-muted hover:bg-cream-darker border border-cream-border flex items-center justify-center text-ink transition shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Simple Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input 1: What do you need? */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-heading font-bold text-ink">
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-coral" />
                1. What do you need?
              </span>
              <span className="text-[10px] text-forest font-semibold">40% Match Weight</span>
            </label>

            <div className="relative">
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-cream-border rounded-human py-2.5 pl-9 pr-9 text-xs font-heading font-bold text-ink focus:outline-none focus:border-coral transition shadow-sm cursor-pointer"
              >
                {SKILL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-ink py-1">
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {getSkillIcon(skill)}
              </div>
              <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick selector chips */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {SKILL_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSkill(opt)}
                  className={`py-1.5 px-2.5 rounded-human text-[11px] font-heading font-semibold text-left flex items-center gap-1.5 border transition ${
                    skill === opt
                      ? 'bg-coral-light border-coral text-coral'
                      : 'bg-white border-cream-border text-ink hover:bg-cream-muted'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block" />
                  <span className="truncate">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Your Budget? */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-heading font-bold text-ink">
              <span className="flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-forest" />
                2. Your Budget?
              </span>
              <span className="text-[10px] text-forest font-semibold">30% Match Weight</span>
            </label>

            <div className="relative">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-cream-border rounded-human py-2.5 pl-9 pr-9 text-xs font-heading font-bold text-ink focus:outline-none focus:border-coral transition shadow-sm cursor-pointer"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-ink py-1">
                    {opt}
                  </option>
                ))}
              </select>
              <IndianRupee className="w-4 h-4 text-forest absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick budget tier buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setBudget(opt)}
                  className={`py-1.5 px-2 rounded-human text-[11px] font-heading font-semibold text-center border transition ${
                    budget === opt
                      ? 'bg-forest-light border-forest text-forest'
                      : 'bg-white border-cream-border text-ink hover:bg-cream-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Deadline? */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-heading font-bold text-ink">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-coral" />
                3. Deadline?
              </span>
              <span className="text-[10px] text-forest font-semibold">30% Match Weight</span>
            </label>

            <div className="relative">
              <select
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-cream-border rounded-human py-2.5 pl-9 pr-9 text-xs font-heading font-bold text-ink focus:outline-none focus:border-coral transition shadow-sm cursor-pointer"
              >
                {DEADLINE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-ink py-1">
                    {opt}
                  </option>
                ))}
              </select>
              <Zap className="w-4 h-4 text-coral absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick deadline pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {DEADLINE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setDeadline(opt)}
                  className={`py-1.5 px-1.5 rounded-human text-[11px] font-heading font-semibold text-center border transition truncate ${
                    deadline === opt
                      ? 'bg-coral-light border-coral text-coral'
                      : 'bg-white border-cream-border text-ink hover:bg-cream-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Anti-AI Paper Guarantee Note */}
          <div className="bg-white/90 border border-cream-border rounded-human p-3 text-[11px] text-ink-secondary flex items-start gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-heading font-bold text-ink block">Transparent Match Formula:</span>
              <span className="text-ink-muted">Skill (40 pts) + Price (30 pts) + Turnaround (30 pts) = 100% Match. Zero ghost agencies.</span>
            </div>
          </div>

          {/* Action Button: Find Best Matches in Coral Orange */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-human bg-coral hover:bg-coral-hover active:scale-[0.98] text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-paper transition border border-coral-border"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Find Best Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
