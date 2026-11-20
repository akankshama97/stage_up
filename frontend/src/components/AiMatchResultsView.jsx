import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  X,
  Play,
  Lock,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
  Award,
  SlidersHorizontal,
  RotateCcw,
  Check,
  IndianRupee,
  Share2
} from 'lucide-react';

export default function AiMatchResultsView({
  criteria,
  matchedTalents = [],
  onClearFilter,
  onEditCriteria,
  onViewReel,
  onHireNow,
  onViewProfile,
  testedTalentIds = new Set()
}) {
  const [activeTooltipTalentId, setActiveTooltipTalentId] = useState(null);

  const getScoreBadgeClass = (score) => {
    if (score > 90) {
      return {
        container: 'bg-emerald-50 text-forest border border-emerald-300',
        label: 'text-forest',
        pill: 'bg-forest text-white'
      };
    }
    if (score >= 70) {
      return {
        container: 'bg-rose-50 text-coral border border-rose-300',
        label: 'text-coral',
        pill: 'bg-coral text-white'
      };
    }
    return {
      container: 'bg-slate-100 text-slate-600 border border-slate-200',
      label: 'text-slate-600',
      pill: 'bg-slate-600 text-white'
    };
  };

  const toggleTooltip = (talentId) => {
    setActiveTooltipTalentId((prev) => (prev === talentId ? null : talentId));
  };

  return (
    <div className="relative w-full h-full bg-slate-50 text-slate-900 flex flex-col overflow-hidden font-sans">
      
      {/* TOP HEADER */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-3 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          
          {/* Back to normal feed */}
          <button
            onClick={onClearFilter}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-heading font-bold text-slate-800 transition shadow-2xs active:scale-95"
            title="Go back to normal feed"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-coral" />
            <span>Feed</span>
          </button>

          {/* Title & Match Count */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <h2 className="font-heading font-extrabold text-sm text-slate-900 tracking-tight">
                AI Match Score
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-medium block">
              {matchedTalents.length} creators ranked by fit
            </span>
          </div>

          {/* Clear Filter Button */}
          <button
            onClick={onClearFilter}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-heading font-semibold text-slate-600 transition shadow-2xs active:scale-95"
            title="Clear matching filter"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Clear</span>
          </button>
        </div>

        {/* Selected Criteria Filter Chips */}
        {criteria && (
          <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Criteria:
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-coral text-[11px] font-heading font-bold whitespace-nowrap">
                {criteria.skill}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-forest text-[11px] font-heading font-bold whitespace-nowrap">
                {criteria.budget}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-heading font-semibold whitespace-nowrap">
                {criteria.deadline}
              </span>
            </div>

            <button
              onClick={onEditCriteria}
              className="px-2.5 py-0.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-heading font-bold text-coral whitespace-nowrap shrink-0 transition shadow-2xs"
              title="Edit your requirements"
            >
              Modify
            </button>
          </div>
        )}
      </div>

      {/* SCROLLABLE RANKED CREATOR CARDS LIST */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-20">
        {matchedTalents.map((creator, index) => {
          const score = creator.matchScore ?? 0;
          const badgeStyle = getScoreBadgeClass(score);
          const isTopCreator = index === 0;
          const isTested = testedTalentIds.has(creator._id);
          const breakdown = creator.matchBreakdown || {
            skillPoints: 40,
            budgetPoints: 30,
            deadlinePoints: 30,
            reasons: ['✓ Budget Match', '✓ 24hr Delivery', '✓ 98% Reliability']
          };
          const isTooltipOpen = activeTooltipTalentId === creator._id;

          return (
            <div
              key={creator._id || index}
              className={`relative bg-white rounded-2xl border p-4 shadow-sm transition-all duration-200 ${
                isTopCreator
                  ? 'border-coral/50 ring-2 ring-coral/15 bg-gradient-to-b from-rose-50/30 to-white shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* TOP TAG FOR BEST MATCH */}
              {isTopCreator && (
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-heading font-extrabold text-xs shadow-2xs">
                    <span>🏆 Best Match For You</span>
                  </div>
                  <span className="text-[10px] font-mono text-coral font-bold uppercase tracking-wider">
                    Rank #1
                  </span>
                </div>
              )}

              {/* MAIN CREATOR ROW */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Photo */}
                  <div
                    onClick={() => onViewProfile && onViewProfile(creator)}
                    className="relative cursor-pointer group shrink-0"
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-100 group-hover:ring-2 group-hover:ring-coral transition"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-forest border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  </div>

                  {/* Name + City + Skills */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3
                        onClick={() => onViewProfile && onViewProfile(creator)}
                        className="font-heading font-bold text-base text-slate-900 hover:text-coral transition cursor-pointer truncate"
                      >
                        {creator.name}
                      </h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                      {isTested && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                          <Award className="w-2.5 h-2.5 text-amber-900" />
                          <span>Tested</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-0.5 font-medium text-slate-700">
                        <MapPin className="w-3 h-3 text-coral" /> {creator.city}
                      </span>
                      <span>•</span>
                      <span className="font-heading font-bold text-coral">
                        {creator.price}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-forest font-semibold">
                        <Clock className="w-3 h-3 text-forest" /> {creator.turnaroundTime || '24 hrs'}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(creator.skills || []).slice(0, 2).map((skillStr, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                        >
                          {skillStr.split('-')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BIG MATCH SCORE BADGE */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center p-1 text-center shadow-xs transition ${badgeStyle.container}`}
                  >
                    <span className="font-heading font-black text-lg leading-none tracking-tight">
                      {score}%
                    </span>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-tight mt-0.5">
                      Match
                    </span>
                  </div>

                  {/* Why this match? */}
                  <button
                    onClick={() => toggleTooltip(creator._id)}
                    className="mt-1.5 flex items-center gap-0.5 text-[10px] font-heading font-semibold text-coral hover:underline"
                    title="View why this creator matched your request"
                  >
                    <span>Why?</span>
                    <Info className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* WHY THIS MATCH? TOOLTIP CARD */}
              {isTooltipOpen && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-fadeIn relative shadow-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="font-heading font-bold text-slate-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-coral" />
                      Score Breakdown ({score}%)
                    </span>
                    <button
                      onClick={() => setActiveTooltipTalentId(null)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        • Skill Match ({criteria?.skill}):
                      </span>
                      <span className="font-mono font-bold text-forest">
                        +{breakdown.skillPoints} pts
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 pl-2">
                      {breakdown.skillNote || 'Verified Skill Portfolio'}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        • Budget Fit ({criteria?.budget}):
                      </span>
                      <span className="font-mono font-bold text-forest">
                        +{breakdown.budgetPoints} pts
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 pl-2">
                      {breakdown.budgetNote || `Rate is ${creator.price}`}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        • Deadline Fit ({criteria?.deadline}):
                      </span>
                      <span className="font-mono font-bold text-forest">
                        +{breakdown.deadlinePoints} pts
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 pl-2">
                      {breakdown.deadlineNote || `Turnaround is ${creator.turnaroundTime || '24 hrs'}`}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                    Total Match Score = {score}% • 100% Verified Proof-of-Work
                  </div>
                </div>
              )}

              {/* 3 SMALL REASONS WHY MATCHED */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                {(breakdown.reasons || []).map((reason, rIdx) => (
                  <span
                    key={rIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-forest border border-emerald-200 text-[11px] font-heading font-semibold"
                  >
                    {reason}
                  </span>
                ))}
              </div>

              {/* SKILL PASSPORT SCORE VISIBILITY */}
              <div className="mt-2.5 flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                  <span className="text-[11px] text-slate-600 font-medium">Skill Passport Score:</span>
                  <span className="text-[11px] font-mono font-bold text-forest">98% Reliability</span>
                </div>
                <button
                  onClick={() => onViewProfile && onViewProfile(creator)}
                  className="text-[10px] font-heading font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  View Passport →
                </button>
              </div>

              {/* ACTION BUTTONS: "View Reel" and "Hire Now" */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onViewReel && onViewReel(creator, index)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-800" />
                  <span>View Reel</span>
                </button>

                <button
                  onClick={() => onHireNow && onHireNow(creator)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/25 active:scale-95 transition"
                >
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Hire Now</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* BOTTOM CLEAR FILTER */}
        <div className="pt-2 text-center">
          <button
            onClick={onClearFilter}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow-2xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Filter &amp; Return to Normal Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
