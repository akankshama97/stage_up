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
  CheckCircle2,
  ChevronDown
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-sans">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card - Modern Glassmorphic Sleek Aesthetic */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xl space-y-5 z-10 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-coral to-rose-600 border border-white/20 flex items-center justify-center text-white shadow-md shadow-rose-500/25 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-coral bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Smart AI Matcher
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight mt-0.5">
                Describe Your Project
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero CVs. Matched to verified Indian creators in seconds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Simple Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input 1: What do you need? */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-heading font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-coral" />
                1. What do you need?
              </span>
              <span className="text-[10px] text-forest font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                40% Weight
              </span>
            </label>

            <div className="relative">
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-xs font-heading font-bold text-slate-900 focus:outline-none focus:border-coral focus:ring-4 focus:ring-rose-500/10 transition shadow-xs cursor-pointer"
              >
                {SKILL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-slate-900 py-1">
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {getSkillIcon(skill)}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick selector chips */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {SKILL_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSkill(opt)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-heading font-semibold text-left flex items-center gap-1.5 border transition ${
                    skill === opt
                      ? 'bg-rose-50 border-coral text-coral font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${skill === opt ? 'bg-coral' : 'bg-slate-300'} inline-block`} />
                  <span className="truncate">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Your Budget? */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-heading font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-forest" />
                2. Your Budget?
              </span>
              <span className="text-[10px] text-forest font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                30% Weight
              </span>
            </label>

            <div className="relative">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-xs font-heading font-bold text-slate-900 focus:outline-none focus:border-coral focus:ring-4 focus:ring-rose-500/10 transition shadow-xs cursor-pointer"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-slate-900 py-1">
                    {opt}
                  </option>
                ))}
              </select>
              <IndianRupee className="w-4 h-4 text-forest absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick budget tier buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setBudget(opt)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-heading font-semibold text-center border transition ${
                    budget === opt
                      ? 'bg-emerald-50 border-forest text-forest font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Deadline? */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-heading font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-coral" />
                3. Deadline?
              </span>
              <span className="text-[10px] text-forest font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                30% Weight
              </span>
            </label>

            <div className="relative">
              <select
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-xs font-heading font-bold text-slate-900 focus:outline-none focus:border-coral focus:ring-4 focus:ring-rose-500/10 transition shadow-xs cursor-pointer"
              >
                {DEADLINE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-slate-900 py-1">
                    {opt}
                  </option>
                ))}
              </select>
              <Zap className="w-4 h-4 text-coral absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick deadline pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {DEADLINE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setDeadline(opt)}
                  className={`py-2 px-1.5 rounded-xl text-[11px] font-heading font-semibold text-center border transition truncate ${
                    deadline === opt
                      ? 'bg-rose-50 border-coral text-coral font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Transparent Match Formula Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-[11px] text-slate-600 flex items-start gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-heading font-bold text-slate-800 block">Transparent Match Formula:</span>
              <span className="text-slate-500">Skill (40 pts) + Price (30 pts) + Turnaround (30 pts) = 100% Match. Zero ghost agencies.</span>
            </div>
          </div>

          {/* Action Button: Find Best Matches */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-coral via-rose-600 to-indigo-600 hover:brightness-105 active:scale-[0.98] text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer"
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
