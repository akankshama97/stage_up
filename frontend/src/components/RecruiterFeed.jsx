import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  FolderGit2,
  MessageCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  MapPin,
  Clock,
  CheckCircle,
  Share2,
  Plus,
  Bookmark,
  Sparkles,
  ArrowLeft,
  Flame,
  Zap,
  Music2,
  Search,
  SlidersHorizontal,
  Lock,
  ShieldCheck,
  X,
  RotateCcw,
  Sliders,
  FileText,
  Mic,
  Award,
  Timer,
  User,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AiMatchModal from './AiMatchModal';
import AiMatchResultsView from './AiMatchResultsView';
import { rankTalents, calculateMatchScore } from '../utils/aiMatchLogic';

export default function RecruiterFeed({
  talents = [],
  currentUser = null,
  userRole = null,
  onOpenAuth,
  onLogout,
  onNavigateToLogin,
  onNavigateToSignup,
  shortlistedIds = new Set(),
  ordersCount = 0,
  onToggleShortlist,
  onOpenProjects,
  onOpenChat,
  onBookEscrow,
  onViewProfile,
  onOpenCreate,
  onOpenShortlistList,
  onOpenOrders,
  onOpenProof,
  onOpenUrgentGigs,
  onOpenRateCard,
  onOpenVoiceStudio,
  testedTalentIds = new Set(),
  onOpenSkillTest,
  selectedCity = 'All',
  onSelectCity,
  onGoHome
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);
  const [activeCaptionIdx, setActiveCaptionIdx] = useState(0);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const videoRef = useRef(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All'); // 'All' | 'under500' | '500to1000' | 'above1000'
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // AI Match Score State
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [matchCriteria, setMatchCriteria] = useState(null);
  const [showMatchResultsScreen, setShowMatchResultsScreen] = useState(false);

  // Clear AI Match Filter
  const handleClearMatchFilter = () => {
    setIsMatchActive(false);
    setMatchCriteria(null);
    setShowMatchResultsScreen(false);
    setCurrentIndex(0);
  };

  // Cities for the horizontal filter pills
  const cities = ['All', 'Noida', 'Delhi', 'Mumbai', 'Bengaluru', 'Kochi', 'Pune'];

  const categories = [
    { id: 'All', label: 'All Skills' },
    { id: 'reel', label: '🎬 Reel Editing' },
    { id: 'thumbnail', label: '🎨 Thumbnail Design' },
    { id: 'script', label: '✍️ Scriptwriting' },
    { id: 'voiceover', label: '🎙️ Voiceover' },
    { id: 'product', label: '📸 Product Shoot' }
  ];

  // Helper to extract clean numerical price
  const getTalentPriceNumber = (t) => {
    return parseInt((t.price || '500').replace(/[^0-9]/g, ''), 10) || 500;
  };

  // Compute matched talents when AI match is active
  const matchedTalents = isMatchActive && matchCriteria
    ? rankTalents(talents, matchCriteria)
    : [];

  const baseTalents = isMatchActive ? matchedTalents : talents;

  // Multi-tier filtering
  const filteredTalents = baseTalents.filter((t) => {
    // 1. City Filter
    if (selectedCity !== 'All' && t.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // 2. Category Filter (applicable when AI Match is not driving category)
    if (!isMatchActive && selectedCategory !== 'All') {
      const skillsStr = (t.skills || []).join(' ').toLowerCase();
      if (!skillsStr.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // 3. Budget Filter (applicable when AI Match is not driving budget)
    if (!isMatchActive) {
      const priceNum = getTalentPriceNumber(t);
      if (selectedBudget === 'under500' && priceNum > 500) return false;
      if (selectedBudget === '500to1000' && (priceNum < 500 || priceNum > 1000)) return false;
      if (selectedBudget === 'above1000' && priceNum <= 1000) return false;
    }

    // 4. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = t.name.toLowerCase().includes(q);
      const cityMatch = t.city.toLowerCase().includes(q);
      const bioMatch = (t.bio || '').toLowerCase().includes(q);
      const skillMatch = (t.skills || []).some(s => s.toLowerCase().includes(q));
      if (!nameMatch && !cityMatch && !bioMatch && !skillMatch) {
        return false;
      }
    }

    return true;
  });

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedBudget !== 'All' ? 1 : 0);

  const currentTalent = filteredTalents[currentIndex] || filteredTalents[0] || null;
  const isLiveTested = currentTalent ? testedTalentIds.has(currentTalent._id) : false;

  // Kinetic captions specific to Indian creator skills for realism
  const captionsBySkill = {
    'Reel Editing - Rs 500': [
      '✂️ Raw phone footage → 30s High-Retention Reel',
      '🔥 3-second hook that stopped 1.8M scrollers',
      '✨ Color graded in DaVinci Resolve + SFX popups'
    ],
    'Poster Design - Rs 300': [
      '🎨 Concept to print-ready poster in 18 hours',
      '📌 Custom typography for indie gigs & cafes',
      '🚀 High-contrast layout designed for Delhi NCR brands'
    ],
    'Thumbnail Design - Rs 250': [
      '⚡ 3.2% CTR boosted to 11.4% CTR on YouTube',
      '🎯 Punchy Hindi typography + expressive cutout',
      '🔥 Tested for mobile dark mode feed retention'
    ],
    'Shorts Scriptwriting - Rs 400': [
      '✍️ 45-sec retention script: Hook → Tension → Payoff',
      '📈 Zero audience dropoff in the first 5 seconds',
      '🎙️ Complete stage directions for video editors'
    ],
    'Voiceover & Dubbing - Rs 600': [
      '🎙️ Recorded on Shure SM7B studio setup',
      '🌟 Warm conversational Indian English & Malayalam',
      '🎧 De-essed & broadcast-compressed audio delivery'
    ],
    'Product Shoot & Reels - Rs 1500': [
      '☕ 120fps slow-motion tabletop camera slider',
      '💡 RGB rim lighting + condensation glass macro B-roll',
      '🎬 Whip-pan sound-synced transitions'
    ]
  };

  const defaultCaptions = [
    '⚡ Verified proof-of-work on StageUp',
    '🎯 Transparent pricing • 100% Escrow Protection',
    '🚀 24-hour delivery turnaround'
  ];

  const currentCaptions = currentTalent
    ? (captionsBySkill[currentTalent.skills?.[0]] || defaultCaptions)
    : defaultCaptions;

  // Reel progress loop (15-second loop simulation)
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setReelProgress((prev) => {
          if (prev >= 100) {
            setActiveCaptionIdx((c) => (c + 1) % currentCaptions.length);
            return 0;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentCaptions.length]);

  // Video element playback synchronization
  useEffect(() => {
    setReelProgress(0);
    setActiveCaptionIdx(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  // Handle index boundaries
  const handleNext = () => {
    if (currentIndex < filteredTalents.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredTalents.length]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (videoRef.current) {
        if (next) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      return next;
    });
    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 500);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  const handleShortlistClick = (e, talent) => {
    e.stopPropagation();
    const isNowShortlisted = !shortlistedIds.has(talent._id);
    onToggleShortlist(talent);

    if (isNowShortlisted) {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.8, x: 0.85 },
        colors: ['#FF4D2E', '#1E7A4C', '#FAF7F2']
      });
    }
  };

  const handleShare = async (e, talent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${talent.name} on StageUp`,
          text: `Check out ${talent.name}'s reel on StageUp: ${talent.skills.join(', ')}`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert(`Link copied for ${talent.name}'s profile!`);
    }
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBudget('All');
    setSearchQuery('');
    onSelectCity('All');
    setIsMatchActive(false);
    setMatchCriteria(null);
    setShowMatchResultsScreen(false);
    setCurrentIndex(0);
  };

  if (!currentTalent) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center text-[#1A1A1A]">
        <div className="w-14 h-14 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-500 mb-3 shadow-xs">
          <Search className="w-6 h-6" />
        </div>
        <p className="font-heading font-bold text-lg text-[#1A1A1A]">
          No creators found matching your filters
        </p>
        <p className="text-xs text-neutral-600 mt-1 max-w-xs">
          Try clearing your search term, city selection, or budget filters.
        </p>
        <button
          onClick={resetAllFilters}
          className="mt-4 px-4 py-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white rounded-human text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  const isShortlisted = shortlistedIds.has(currentTalent._id);
  const activeProject = currentTalent.projects?.[activeCaptionIdx % (currentTalent.projects?.length || 1)] || currentTalent.projects?.[0] || null;

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col items-center justify-center overflow-hidden">
      {/* Phone container mockup on desktop, full-screen on mobile - Warm tactile frame */}
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-[#FAF7F2] flex flex-col justify-between overflow-hidden shadow-2xl sm:rounded-[20px] sm:h-[880px] sm:my-4 sm:border sm:border-neutral-300">

        {/* SCREEN: SMART AI MATCH RESULTS RANKED LIST */}
        {showMatchResultsScreen ? (
          <AiMatchResultsView
            criteria={matchCriteria}
            matchedTalents={matchedTalents}
            onClearFilter={handleClearMatchFilter}
            onEditCriteria={() => setIsMatchModalOpen(true)}
            onViewReel={(creator) => {
              const targetIdx = filteredTalents.findIndex(t => t._id === creator._id);
              if (targetIdx !== -1) {
                setCurrentIndex(targetIdx);
              }
              setShowMatchResultsScreen(false);
              setIsPlaying(true);
            }}
            onHireNow={(creator) => {
              if (onBookEscrow) {
                onBookEscrow(creator, creator.projects?.[0] || { title: `${creator.name}'s Featured Project`, price: creator.price });
              }
            }}
            onViewProfile={onViewProfile}
            testedTalentIds={testedTalentIds}
          />
        ) : (
          <>
            {/* TOP BAR: White with soft shadow, Black text "StageUp" */}
            <header className="absolute top-0 left-0 right-0 z-30 pt-3 pb-2.5 px-3.5 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-b border-neutral-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {/* Home Navigation Button */}
                  {onGoHome && (
                    <button
                      onClick={onGoHome}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-[#1A1A1A] text-[11px] font-semibold transition border border-neutral-200 shadow-xs"
                      title="Go back to Home page"
                    >
                      <ArrowLeft className="w-3 h-3 text-[#FF4D2E]" />
                      <span>Home</span>
                    </button>
                  )}

                  {/* StageUp Logo - Black Text */}
                  <button
                    onClick={onGoHome}
                    className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-[#1A1A1A] flex items-center gap-1 hover:opacity-90 transition text-left"
                  >
                    <span>StageUp</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2E] inline-block"></span>
                  </button>

                  {/* Auth User Status / Login Button */}
                  {currentUser ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] shadow-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser.role === 'recruiter' ? 'bg-[#FF4D2E]' : 'bg-emerald-500'}`}></span>
                      <span className="font-bold text-[#1A1A1A] max-w-[70px] truncate">
                        {currentUser.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-neutral-500 capitalize">
                        ({currentUser.role === 'recruiter' ? 'Recruiter' : 'Creator'})
                      </span>
                      {onLogout && (
                        <button
                          onClick={onLogout}
                          className="text-neutral-400 hover:text-neutral-700 ml-0.5"
                          title="Log out"
                        >
                          <LogOut className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ) : (onNavigateToLogin || onOpenAuth) ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onNavigateToLogin ? onNavigateToLogin('recruiter') : onOpenAuth('recruiter')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white hover:bg-neutral-50 text-[#1A1A1A] text-[10px] font-bold border border-neutral-200 transition shadow-xs"
                        title="Log in to account"
                      >
                        <User className="w-2.5 h-2.5 text-[#FF4D2E]" />
                        <span>Log In</span>
                      </button>
                      <button
                        onClick={() => onNavigateToSignup ? onNavigateToSignup('recruiter') : onOpenAuth('recruiter')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[10px] font-bold transition shadow-xs"
                        title="Create an account"
                      >
                        <span>Sign Up</span>
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Search Toggle */}
                  <button
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    className={`p-1.5 rounded-full transition border ${
                      isSearchVisible || searchQuery
                        ? 'bg-[#FF4D2E] text-white border-[#FF4D2E]'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] border-neutral-200'
                    }`}
                    title="Search creators & skills"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>

                  {/* Advanced Filter Drawer Button */}
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border transition ${
                      activeFilterCount > 0
                        ? 'bg-[#FF4D2E] text-white border-[#FF4D2E] font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] border-neutral-200'
                    }`}
                    title="Filter by category & budget"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#FF4D2E] text-white font-bold text-[9px] flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Urgent 24h Gigs Casting Calls */}
                  <button
                    onClick={onOpenUrgentGigs}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF4D2E] hover:bg-coral-hover text-white text-[11px] font-semibold border border-[#FF4D2E] transition shadow-xs animate-pulse"
                    title="Urgent 24-Hour Gigs & Casting Calls"
                  >
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Urgent Gigs</span>
                  </button>

                  {/* Escrow Orders Button */}
                  <button
                    onClick={onOpenOrders}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1E7A4C]/10 hover:bg-[#1E7A4C]/20 text-[#1E7A4C] text-[11px] font-semibold border border-[#1E7A4C]/30 transition shadow-xs"
                    title="View My Escrow Orders"
                  >
                    <ShieldCheck className="w-3 h-3 text-[#1E7A4C]" />
                    <span>Orders</span>
                    {ordersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#1E7A4C] text-white text-[9px] font-bold flex items-center justify-center">
                        {ordersCount}
                      </span>
                    )}
                  </button>

                  {/* Shortlist Counter Badge */}
                  <button
                    onClick={onOpenShortlistList}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] text-[11px] font-medium border border-neutral-200 transition"
                    title="View Shortlisted Talents"
                  >
                    <Bookmark className={`w-3 h-3 ${shortlistedIds.size > 0 ? 'text-[#FF4D2E] fill-[#FF4D2E]' : 'text-[#1A1A1A]'}`} />
                    <span>{shortlistedIds.size}</span>
                  </button>

                  {/* Post Work CTA */}
                  <button
                    onClick={onOpenCreate}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FF4D2E] hover:bg-coral-hover text-white text-[11px] font-semibold shadow-xs transition"
                    title="Post Your Work"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              </div>

              {/* FEATURE: "Find My Perfect Match" in Coral Orange #FF4D2E */}
              <div className="pt-2">
                {!isMatchActive ? (
                  <button
                    onClick={() => setIsMatchModalOpen(true)}
                    className="w-full py-1.5 px-3 rounded-human bg-[#FF4D2E] hover:bg-coral-hover active:scale-[0.98] text-white text-xs font-heading font-extrabold flex items-center justify-between shadow-xs transition border border-coral-border group"
                    title="Find your perfect Indian creator match with Smart AI Match"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                      <span>Find My Perfect Match ✨</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium text-white group-hover:bg-white/30 transition">
                      AI Match →
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-human border border-neutral-200 shadow-xs">
                    <button
                      onClick={() => setShowMatchResultsScreen(true)}
                      className="flex-1 py-1 px-2.5 rounded-human bg-[#FF4D2E] hover:bg-coral-hover text-white text-[11px] font-heading font-bold flex items-center justify-between shadow-xs transition"
                    >
                      <span className="flex items-center gap-1 truncate">
                        <Sparkles className="w-3 h-3 text-amber-200" />
                        <span>Match: {matchCriteria?.skill}</span>
                      </span>
                      <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full ml-1">
                        {matchedTalents.length} Ranked
                      </span>
                    </button>
                    <button
                      onClick={() => setIsMatchModalOpen(true)}
                      className="px-2 py-1 rounded-human bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-neutral-200 text-[10px] font-medium transition"
                      title="Modify match criteria"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleClearMatchFilter}
                      className="px-2 py-1 rounded-human bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-neutral-200 text-[10px] font-medium flex items-center gap-0.5 transition"
                      title="Clear AI match filter"
                    >
                      <X className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible Search Input */}
              {isSearchVisible && (
                <div className="pt-2 animate-fadeIn">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentIndex(0);
                      }}
                      placeholder="Search by skill, DaVinci, hook, editor name..."
                      className="w-full text-xs bg-neutral-100 border border-neutral-300 rounded-human py-1.5 pl-8 pr-7 text-[#1A1A1A] placeholder:text-neutral-500 focus:outline-none focus:border-[#FF4D2E]"
                      autoFocus
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-neutral-500 hover:text-[#1A1A1A]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* City Filter Pills: White background, Black text, Coral border when active */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setCurrentIndex(0);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shadow-xs ${
                      selectedCity === city
                        ? 'bg-white text-[#1A1A1A] border-2 border-[#FF4D2E] shadow-xs font-bold'
                        : 'bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-neutral-200/90'
                    }`}
                  >
                    {city === 'All' ? '🇮🇳 All' : city}
                  </button>
                ))}
              </div>
            </header>

            {/* CENTER: Reel Player Area */}
            <div
              onClick={togglePlayPause}
              className="relative flex-1 w-full h-full bg-[#1A1A1A] flex items-center justify-center cursor-pointer select-none overflow-hidden"
            >
              {/* Native HTML5 Video Element */}
              {currentTalent.videoUrl && (
                <video
                  ref={videoRef}
                  src={currentTalent.videoUrl}
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              {/* Dynamic Reel Canvas Backdrop (Clean natural contrast, no dark blue/purple gradients) */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                  style={{
                    backgroundImage: `url(${activeProject?.image || currentTalent.posterUrl || currentTalent.avatar})`
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Floating AI Match active banner when viewing reel */}
              {isMatchActive && currentTalent && (
                <div className="absolute top-36 left-3.5 right-14 z-20 pointer-events-auto">
                  <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-human bg-white/95 border border-[#FF4D2E] text-[#1A1A1A] shadow-md animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-bold truncate">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF4D2E] shrink-0" />
                      <span className="truncate">
                        Match: {currentTalent.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        (currentTalent.matchScore ?? 0) > 90 ? 'bg-[#1E7A4C] text-white' : 'bg-[#FF4D2E] text-white'
                      }`}>
                        {currentTalent.matchScore ?? 0}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMatchResultsScreen(true);
                        }}
                        className="text-[10px] text-[#FF4D2E] font-bold hover:underline"
                      >
                        All Matches
                      </button>
                      <span className="text-neutral-300">•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearMatchFilter();
                        }}
                        className="text-[10px] text-neutral-500 hover:text-[#1A1A1A]"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sound Toggle (Top Right of Player) - White circular button with black icon */}
              <button
                onClick={toggleMute}
                className={`absolute ${isMatchActive ? 'top-48' : 'top-36'} right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 border border-neutral-200/80 shadow-md flex items-center justify-center text-[#1A1A1A] backdrop-blur-sm hover:bg-white transition`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-neutral-600" /> : <Volume2 className="w-4 h-4 text-[#FF4D2E]" />}
              </button>

              {/* Live Kinetic Caption Banner */}
              <div className={`absolute ${isMatchActive ? 'top-56' : 'top-44'} left-3.5 right-14 z-20 pointer-events-none`}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-human bg-white/95 border border-neutral-200 text-[#1A1A1A] shadow-sm backdrop-blur-none animate-fadeIn">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4D2E] shrink-0 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide text-[#1A1A1A]">
                    {currentCaptions[activeCaptionIdx]}
                  </span>
                </div>
              </div>

              {/* Play/Pause Center Indicator */}
              {showPlayPulse && (
                <div className="absolute z-20 w-16 h-16 rounded-full bg-white/80 border border-neutral-200 shadow-lg flex items-center justify-center text-[#1A1A1A] scale-110 transition-transform">
                  {isPlaying ? <Play className="w-8 h-8 fill-[#1A1A1A] ml-1" /> : <Pause className="w-8 h-8 fill-[#1A1A1A]" />}
                </div>
              )}

              {/* Swipe indicator navigation arrows (Desktop helper) */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  disabled={currentIndex === 0}
                  className="w-8 h-8 rounded-full bg-white/90 border border-neutral-200 text-[#1A1A1A] shadow-md flex items-center justify-center hover:bg-white disabled:opacity-30 transition"
                  title="Previous reel (Up arrow)"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={currentIndex === filteredTalents.length - 1}
                  className="w-8 h-8 rounded-full bg-white/90 border border-neutral-200 text-[#1A1A1A] shadow-md flex items-center justify-center hover:bg-white disabled:opacity-30 transition"
                  title="Next reel (Down arrow)"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT ACTION RAIL: White circular buttons with Black icons */}
            <div className="absolute right-3.5 bottom-28 z-30 flex flex-col items-center gap-3 select-none pointer-events-auto">
              {/* 1. Shortlist button */}
              <button
                onClick={(e) => handleShortlistClick(e, currentTalent)}
                className="flex flex-col items-center gap-1 group active:scale-90 transition"
                aria-label="Shortlist this creator"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md transition ${
                  isShortlisted
                    ? 'bg-[#FF4D2E] border-[#FF4D2E] text-white scale-105'
                    : 'bg-white border-neutral-200 text-[#1A1A1A] hover:border-[#FF4D2E]'
                }`}>
                  <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-white text-white' : 'text-[#1A1A1A]'}`} />
                </div>
                <span className="text-[10px] font-bold text-[#1A1A1A] bg-white/90 px-1.5 py-0.2 rounded-full shadow-xs font-heading">
                  {(currentTalent.shortlistedCount || 1) + (isShortlisted ? 1 : 0)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  Shortlist
                </span>
              </button>

              {/* 2. Projects button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProjects(currentTalent);
                }}
                className="flex flex-col items-center gap-1 group active:scale-90 transition"
                aria-label="View creator packages"
              >
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 text-[#1A1A1A] flex items-center justify-center shadow-md hover:border-[#FF4D2E] transition">
                  <FolderGit2 className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <span className="text-[10px] font-bold text-[#1A1A1A] bg-white/90 px-1.5 py-0.2 rounded-full shadow-xs font-heading">
                  {currentTalent.projects?.length || 3}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  Gigs
                </span>
              </button>

              {/* 3. Proof of Work: Raw vs Final Transformation Split */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenProof) onOpenProof(currentTalent);
                }}
                className="flex flex-col items-center gap-1 group active:scale-90 transition"
                aria-label="Compare Raw vs Final Edit"
              >
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 text-[#1A1A1A] flex items-center justify-center shadow-md hover:border-[#FF4D2E] transition">
                  <Sliders className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <span className="text-[9px] font-bold text-[#1A1A1A] bg-white/90 px-1 py-0.2 rounded shadow-xs font-heading">
                  Raw ↔ Edit
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  Proof
                </span>
              </button>

              {/* 4. Live Skill Test (Anti-Fake Portfolio) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSkillTest) onOpenSkillTest(currentTalent);
                }}
                className="flex flex-col items-center gap-1 group active:scale-90 transition"
                aria-label="Live Skill Test"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition ${
                  isLiveTested
                    ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 scale-105'
                    : 'bg-white border border-neutral-200 text-[#1A1A1A] hover:border-amber-400'
                }`}>
                  <Award className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <span className="text-[9px] font-bold text-[#1A1A1A] bg-white/90 px-1 py-0.2 rounded shadow-xs font-heading">
                  {isLiveTested ? 'Tested 🏆' : 'Live Test'}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  {isLiveTested ? 'Verified' : '15-Min'}
                </span>
              </button>

              {/* 5. Voice Audition Studio (if voice talent) */}
              {currentTalent.skills?.some(s => s.toLowerCase().includes('voice')) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenVoiceStudio) onOpenVoiceStudio(currentTalent);
                  }}
                  className="flex flex-col items-center gap-1 group active:scale-90 transition"
                  aria-label="Voiceover Audition Studio"
                >
                  <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 text-[#1A1A1A] flex items-center justify-center shadow-md hover:border-emerald-500 transition">
                    <Mic className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <span className="text-[9px] font-bold text-[#1A1A1A] bg-white/90 px-1 py-0.2 rounded shadow-xs font-heading">
                    Audition
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                    Voice
                  </span>
                </button>
              )}

              {/* 6. Chat button (WhatsApp / Direct) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChat(currentTalent);
                }}
                className="flex flex-col items-center gap-1 group active:scale-90 transition"
                aria-label="Chat with creator"
              >
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 text-[#1E7A4C] flex items-center justify-center shadow-md hover:border-[#1E7A4C] transition">
                  <MessageCircle className="w-5 h-5 text-[#1E7A4C]" />
                </div>
                <span className="text-[10px] font-bold text-[#1A1A1A] bg-white/90 px-1.5 py-0.2 rounded-full shadow-xs font-heading">
                  Chat
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  Direct
                </span>
              </button>

              {/* 7. Instant Rate Card & UPI QR */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenRateCard) onOpenRateCard(currentTalent);
                }}
                className="flex flex-col items-center gap-1 active:scale-90 transition"
                title="Creator Rate Card & UPI Invoice"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 text-[#1A1A1A] flex items-center justify-center shadow-sm hover:border-[#FF4D2E] transition">
                  <FileText className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <span className="text-[8px] uppercase tracking-wider text-[#1A1A1A] font-bold bg-white/90 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  Invoice
                </span>
              </button>

              {/* Quick Share button */}
              <button
                onClick={(e) => handleShare(e, currentTalent)}
                className="flex flex-col items-center gap-1 active:scale-90 transition"
                title="Share Reel"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 text-[#1A1A1A] flex items-center justify-center shadow-sm">
                  <Share2 className="w-4 h-4 text-[#1A1A1A]" />
                </div>
              </button>
            </div>

            {/* WHITE BOTTOM CARD OVERLAY: Creator Info, Pricing & Direct CTAs */}
            <div className="absolute left-3 right-16 bottom-3 z-30 pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-[16px] border border-black/[0.08] p-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.12)] space-y-2">
                {/* Creator Header */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile(currentTalent);
                  }}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={currentTalent.avatar}
                      alt={currentTalent.name}
                      className="w-10 h-10 rounded-full border-2 border-neutral-100 object-cover group-hover:ring-2 group-hover:ring-[#FF4D2E] transition"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#1E7A4C] border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#FF4D2E] transition leading-tight truncate">
                        {currentTalent.name}
                      </h3>
                      {/* Green Verified Badge ✓ */}
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#1E7A4C]/10 border border-[#1E7A4C]/20 text-[#1E7A4C] text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3 text-[#1E7A4C] fill-[#1E7A4C] text-white" />
                        <span>Verified ✓</span>
                      </span>
                      {isLiveTested && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                          <Award className="w-2.5 h-2.5 text-amber-900" />
                          <span>Live Tested</span>
                        </span>
                      )}
                    </div>

                    {/* City: Noida | Price: ₹500 | Delivery: 24 hrs */}
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 font-medium mt-0.5 flex-wrap">
                      <span className="flex items-center gap-0.5 text-neutral-800">
                        <MapPin className="w-3 h-3 text-[#FF4D2E]" /> {currentTalent.city}
                      </span>
                      <span className="text-neutral-300">|</span>
                      <span className="font-heading font-bold text-[#FF4D2E]">
                        Price: {currentTalent.price}
                      </span>
                      <span className="text-neutral-300">|</span>
                      <span className="flex items-center gap-0.5 text-[#1E7A4C] font-semibold">
                        <Clock className="w-3 h-3 text-[#1E7A4C]" /> Delivery: {currentTalent.turnaroundTime || '24 hrs'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill tags: Reel Editing */}
                <div className="flex flex-wrap gap-1.5">
                  {currentTalent.skills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-[6px] bg-neutral-100 border border-neutral-200 text-[#1A1A1A] text-[10px] sm:text-[11px] font-medium"
                    >
                      {skill.split('-')[0].trim()}
                    </span>
                  ))}
                </div>

                {/* Pricing & Escrow Hire CTAs */}
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  {/* If AI Match Active, show match score pill */}
                  {isMatchActive && currentTalent && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] font-heading font-extrabold text-[11px] shadow-xs ${
                      (currentTalent.matchScore ?? 0) > 90
                        ? 'bg-[#1E7A4C] text-white'
                        : (currentTalent.matchScore ?? 0) >= 70
                        ? 'bg-[#FF4D2E] text-white'
                        : 'bg-neutral-600 text-white'
                    }`}>
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>{currentTalent.matchScore ?? 0}% Match</span>
                    </div>
                  )}

                  {/* Direct Instant Escrow Hire Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookEscrow) {
                        onBookEscrow(currentTalent, activeProject || { title: `${currentTalent.name}'s Service`, price: currentTalent.price });
                      }
                    }}
                    className="px-3 py-1.5 rounded-[8px] bg-[#FF4D2E] hover:bg-coral-hover text-white font-heading font-extrabold text-xs shadow-xs flex items-center gap-1 active:scale-95 transition"
                  >
                    <Lock className="w-3 h-3 text-white" />
                    <span>Hire Now</span>
                  </button>

                  {/* Test This Creator CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenSkillTest) onOpenSkillTest(currentTalent);
                    }}
                    className={`px-2.5 py-1.5 rounded-[8px] font-heading font-bold text-xs shadow-xs flex items-center gap-1 active:scale-95 transition ${
                      isLiveTested
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] border border-neutral-200'
                    }`}
                    title="15-Minute Live Skill Challenge"
                  >
                    <Award className={`w-3.5 h-3.5 ${isLiveTested ? 'text-amber-900' : 'text-amber-600'}`} />
                    <span>{isLiveTested ? 'Tested 🏆' : 'Live Test'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(currentTalent);
                    }}
                    className="text-[11px] text-neutral-600 underline underline-offset-2 hover:text-[#1A1A1A] font-medium ml-auto"
                  >
                    Passport →
                  </button>
                </div>
              </div>
            </div>

            {/* Real-Time Reel Progress Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-200 z-40">
              <div
                className="h-full bg-[#FF4D2E] transition-all duration-150 ease-linear"
                style={{ width: `${reelProgress}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* FILTER MODAL / DRAWER */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-none animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-t-[20px] sm:rounded-human border border-cream-border p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-coral" />
                <h3 className="font-heading font-bold text-sm text-ink">
                  Filter Creators
                </h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-7 h-7 rounded-full bg-cream-muted flex items-center justify-center text-ink hover:bg-cream-darker"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category / Skill */}
            <div>
              <label className="block text-xs font-heading font-bold text-ink mb-1.5">
                Skill Category
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentIndex(0);
                    }}
                    className={`p-2 rounded-human border text-left text-xs transition ${
                      selectedCategory === cat.id
                        ? 'border-coral bg-coral-light font-bold text-coral'
                        : 'border-cream-border hover:bg-cream-muted text-ink'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-heading font-bold text-ink mb-1.5">
                Budget Range
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'All', label: 'Any' },
                  { id: 'under500', label: 'Under ₹500' },
                  { id: '500to1000', label: '₹500 - ₹1K' },
                  { id: 'above1000', label: '₹1K+' }
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setSelectedBudget(bg.id);
                      setCurrentIndex(0);
                    }}
                    className={`p-2 rounded-human border text-center transition ${
                      selectedBudget === bg.id
                        ? 'border-coral bg-coral-light font-bold text-coral'
                        : 'border-cream-border hover:bg-cream-muted text-ink'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2 px-3 rounded-human bg-cream-muted hover:bg-cream-darker text-ink text-xs font-semibold"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-human bg-ink hover:bg-neutral-800 text-cream text-xs font-bold"
              >
                Apply ({filteredTalents.length} Creators)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI MATCH SCORE MODAL: "Describe Your Work" */}
      <AiMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        currentCriteria={matchCriteria}
        onFindMatches={(criteria) => {
          setMatchCriteria(criteria);
          setIsMatchActive(true);
          setShowMatchResultsScreen(true);
          setIsMatchModalOpen(false);
          setCurrentIndex(0);
        }}
      />
    </div>
  );
}
