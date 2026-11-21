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

  // Authentication Guard: Redirect to login if user is unauthenticated
  useEffect(() => {
    if (!currentUser) {
      if (onNavigateToLogin) {
        onNavigateToLogin('recruiter');
      } else if (onGoHome) {
        onGoHome();
      }
    }
  }, [currentUser, onNavigateToLogin, onGoHome]);

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
        colors: ['#FF385C', '#059669', '#6366F1']
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-lg">
          <Search className="w-7 h-7 text-coral" />
        </div>
        <p className="font-heading font-extrabold text-xl text-white">
          No creators found matching your filters
        </p>
        <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
          Try clearing your search term, city selection, or budget filters.
        </p>
        <button
          onClick={resetAllFilters}
          className="mt-5 px-5 py-2.5 bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/25 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  const isShortlisted = shortlistedIds.has(currentTalent._id);
  const activeProject = currentTalent.projects?.[activeCaptionIdx % (currentTalent.projects?.length || 1)] || currentTalent.projects?.[0] || null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FFF7ED] to-[#F2FBF7] text-[#1A1A1A] flex flex-col items-center justify-between font-sans selection:bg-orange-100 selection:text-[#E8472B]">
      
      {/* Ambient Sunlit Background Glows on Desktop */}
      <div className="hidden sm:block absolute -top-40 -left-40 w-96 h-96 bg-amber-300/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="hidden sm:block absolute -bottom-40 -right-40 w-96 h-96 bg-orange-400/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="hidden sm:block absolute top-1/3 -right-20 w-80 h-80 bg-sky-300/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Global Desktop Top Navbar */}
      <nav className="hidden md:flex w-full sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E7E0D3] px-6 lg:px-8 py-3 items-center justify-between shadow-xs">
        {/* Left: SU Brand Logo + Home Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E8472B] via-[#F97316] to-[#FB923C] text-white flex items-center justify-center font-heading font-black text-xs shadow-md shadow-orange-500/20 select-none">
              SU
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#1A1A1A] flex items-center gap-1">
              StageUp
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            </span>

          </div>

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E7E0D3] text-xs font-medium text-[#5F5A50] hover:text-[#1A1A1A] hover:bg-orange-50/50 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E8472B]" />
              <span>Back to Home</span>
            </button>
          )}
        </div>

        {/* Center: Search & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* AI Match Button */}
          <button
            onClick={() => setIsMatchModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E8472B] to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Match</span>
          </button>

          {/* Urgent Gigs */}
          <button
            onClick={onOpenUrgentGigs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Urgent Gigs</span>
          </button>

          {/* Escrow Orders Button */}
          <button
            onClick={onOpenOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Escrow Orders</span>
            {ordersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Shortlist */}
          <button
            onClick={onOpenShortlistList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-orange-50 text-[#5F5A50] border border-[#E7E0D3] text-xs font-medium transition cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${shortlistedIds.size > 0 ? 'text-[#E8472B] fill-[#E8472B]' : 'text-gray-400'}`} />
            <span>Saved ({shortlistedIds.size})</span>
          </button>
        </div>

        {/* Right: User Status & Prominent Logout */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-orange-50/60 border border-orange-200/80 text-xs">
              <img
                src={currentUser.avatar || (currentUser.role === 'recruiter' ? '/recruiter-profile.jpg' : 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=400&q=80')}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover object-[50%_15%] border border-orange-200 shadow-2xs"
              />
              <span className="font-heading font-bold text-[#1A1A1A] max-w-[110px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-[#5F5A50] capitalize font-medium">
                ({currentUser.role})
              </span>
            </div>
          )}

        </div>
      </nav>

      {/* Main Feed Content Area */}
      <div className="w-full flex-1 flex items-center justify-center py-0 sm:py-4">
        {/* Phone container mockup on desktop, full-screen on mobile */}
        <div className="relative w-full max-w-[430px] h-[100dvh] bg-black flex flex-col justify-between overflow-hidden shadow-2xl sm:rounded-3xl sm:h-[840px] sm:border-[5px] sm:border-slate-800/90 sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

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
            {/* TOP BAR: Clean frosted surface matching tokens */}
            <header className="absolute top-0 left-0 right-0 z-30 pt-3 pb-2.5 px-3.5 bg-white/95 backdrop-blur-md border-b border-[#E7E0D3] text-[#1A1A1A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* StageUp Logo - click to go home */}
                  <button
                    onClick={onGoHome}
                    className="font-heading font-bold text-sm tracking-tight text-[#1A1A1A] flex items-center gap-1.5 hover:opacity-90 transition-opacity duration-150 text-left"
                  >
                    <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#E8472B] to-[#F97316] text-white flex items-center justify-center font-bold text-[10px]">
                      SU
                    </div>
                    <span>StageUp</span>
                  </button>
                </div>

                {/* Mobile Right: Search + Filter */}
                <div className="flex items-center gap-1.5">

                  {/* Search */}
                  <button
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    className={`p-1.5 rounded-lg transition border ${
                      isSearchVisible || searchQuery
                        ? 'bg-[#E8472B] text-white border-[#E8472B] shadow-xs'
                        : 'bg-white hover:bg-orange-50 text-[#5F5A50] border-[#E7E0D3]'
                    }`}
                    title="Search creators"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>

                  {/* Filter */}
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
                      activeFilterCount > 0
                        ? 'bg-[#E8472B] text-white border-[#E8472B] font-bold shadow-xs'
                        : 'bg-white hover:bg-orange-50 text-[#5F5A50] border-[#E7E0D3]'
                    }`}
                    title="Filter"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-white text-[#E8472B] font-bold text-[9px] flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
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
                      className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl py-1.5 pl-8 pr-7 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-coral focus:ring-2 focus:ring-rose-500/10"
                      autoFocus
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* City Filter Pills */}
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
                        ? 'bg-slate-900 text-white font-bold border border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
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
              className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center cursor-pointer select-none overflow-hidden"
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

              {/* Dynamic Reel Canvas Backdrop */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                  style={{
                    backgroundImage: `url(${activeProject?.image || currentTalent.posterUrl || currentTalent.avatar})`
                  }}
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              {/* Floating AI Match active banner when viewing reel */}
              {isMatchActive && currentTalent && (
                <div className="absolute top-36 left-3.5 right-14 z-20 pointer-events-auto">
                  <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-coral text-slate-900 shadow-lg animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-bold truncate">
                      <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
                      <span className="truncate">
                        Match: {currentTalent.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        (currentTalent.matchScore ?? 0) > 90 ? 'bg-forest text-white' : 'bg-coral text-white'
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
                        className="text-[10px] text-coral font-bold hover:underline"
                      >
                        All Matches
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearMatchFilter();
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-800"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sound Toggle (Top Right of Player) */}
              <button
                onClick={toggleMute}
                className={`absolute ${isMatchActive ? 'top-48' : 'top-36'} right-3.5 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 shadow-lg flex items-center justify-center backdrop-blur-md transition`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-coral" />}
              </button>

              {/* Live Kinetic Caption Banner */}
              <div className={`absolute ${isMatchActive ? 'top-56' : 'top-44'} left-3.5 right-14 z-20 pointer-events-none`}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-white/20 text-white shadow-lg backdrop-blur-md animate-fadeIn">
                  <Sparkles className="w-3.5 h-3.5 text-coral shrink-0 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide text-white">
                    {currentCaptions[activeCaptionIdx]}
                  </span>
                </div>
              </div>

              {/* Play/Pause Center Indicator */}
              {showPlayPulse && (
                <div className="absolute z-20 w-16 h-16 rounded-full bg-slate-900/80 border border-white/20 shadow-2xl flex items-center justify-center text-white scale-110 transition-transform backdrop-blur-md">
                  {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
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
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 shadow-md flex items-center justify-center disabled:opacity-30 transition backdrop-blur-sm"
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
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 shadow-md flex items-center justify-center disabled:opacity-30 transition backdrop-blur-sm"
                  title="Next reel (Down arrow)"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT ACTION RAIL: Frosted Glass circular action buttons */}
            <div className="absolute right-3.5 bottom-28 z-30 flex flex-col items-center gap-3 select-none pointer-events-auto">
              {/* 1. Shortlist button */}
              <button
                onClick={(e) => handleShortlistClick(e, currentTalent)}
                className="flex flex-col items-center gap-1 group active:scale-90 transition"
                aria-label="Shortlist this creator"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-lg transition-all duration-200 ${
                  isShortlisted
                    ? 'bg-coral border-coral text-white scale-105 shadow-rose-500/30'
                    : 'bg-white/95 hover:bg-white border-white/80 text-slate-900 hover:border-coral backdrop-blur-md'
                }`}>
                  <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-white text-white' : 'text-slate-900'}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-900 bg-white/95 px-2 py-0.2 rounded-full shadow-xs font-heading backdrop-blur-xs">
                  {(currentTalent.shortlistedCount || 1) + (isShortlisted ? 1 : 0)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
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
                <div className="w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-white/80 text-slate-900 flex items-center justify-center shadow-lg hover:border-coral transition backdrop-blur-md">
                  <FolderGit2 className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-[10px] font-bold text-slate-900 bg-white/95 px-2 py-0.2 rounded-full shadow-xs font-heading">
                  {currentTalent.projects?.length || 3}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
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
                <div className="w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-white/80 text-slate-900 flex items-center justify-center shadow-lg hover:border-coral transition backdrop-blur-md">
                  <Sliders className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-[9px] font-bold text-slate-900 bg-white/95 px-1.5 py-0.2 rounded shadow-xs font-heading">
                  Raw ↔ Edit
                </span>
                <span className="text-[8px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
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
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition ${
                  isLiveTested
                    ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 scale-105'
                    : 'bg-white/95 hover:bg-white border border-white/80 text-slate-900 hover:border-amber-400 backdrop-blur-md'
                }`}>
                  <Award className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-[9px] font-bold text-slate-900 bg-white/95 px-1.5 py-0.2 rounded shadow-xs font-heading">
                  {isLiveTested ? 'Tested 🏆' : 'Live Test'}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
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
                  <div className="w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-white/80 text-slate-900 flex items-center justify-center shadow-lg hover:border-forest transition backdrop-blur-md">
                    <Mic className="w-5 h-5 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-900 bg-white/95 px-1.5 py-0.2 rounded shadow-xs font-heading">
                    Audition
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
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
                <div className="w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-white/80 text-forest flex items-center justify-center shadow-lg hover:border-forest transition backdrop-blur-md">
                  <MessageCircle className="w-5 h-5 text-forest" />
                </div>
                <span className="text-[10px] font-bold text-slate-900 bg-white/95 px-2 py-0.2 rounded-full shadow-xs font-heading">
                  Chat
                </span>
                <span className="text-[8px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
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
                <div className="w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-white/80 text-slate-900 flex items-center justify-center shadow-sm hover:border-coral transition backdrop-blur-md">
                  <FileText className="w-4 h-4 text-slate-900" />
                </div>
                <span className="text-[8px] uppercase tracking-wider text-slate-900 font-bold bg-white/95 px-1 py-0.2 rounded shadow-xs -mt-0.5">
                  Invoice
                </span>
              </button>

              {/* Quick Share button */}
              <button
                onClick={(e) => handleShare(e, currentTalent)}
                className="flex flex-col items-center gap-1 active:scale-90 transition"
                title="Share Reel"
              >
                <div className="w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-white/80 text-slate-900 flex items-center justify-center shadow-sm backdrop-blur-md">
                  <Share2 className="w-4 h-4 text-slate-900" />
                </div>
              </button>
            </div>

            {/* WHITE BOTTOM CARD OVERLAY: Creator Info, Pricing & Direct CTAs */}
            <div className="absolute left-3 right-16 bottom-3 z-30 pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/90 p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.22)] space-y-2">
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
                      className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover group-hover:ring-2 group-hover:ring-coral transition"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-forest border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-coral transition leading-tight truncate">
                        {currentTalent.name}
                      </h3>
                      {/* Green Verified Badge ✓ */}
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-200 text-forest text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3 text-forest fill-forest text-white" />
                        <span>Verified ✓</span>
                      </span>
                      {isLiveTested && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                          <Award className="w-2.5 h-2.5 text-amber-900" />
                          <span>Live Tested</span>
                        </span>
                      )}
                    </div>

                    {/* City: Noida | Price: ₹500 | Delivery: 24 hrs */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mt-0.5 flex-wrap">
                      <span className="flex items-center gap-0.5 text-slate-800">
                        <MapPin className="w-3 h-3 text-coral" /> {currentTalent.city}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-heading font-bold text-coral">
                        Price: {currentTalent.price}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-0.5 text-forest font-semibold">
                        <Clock className="w-3 h-3 text-forest" /> Delivery: {currentTalent.turnaroundTime || '24 hrs'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5">
                  {currentTalent.skills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[10px] sm:text-[11px] font-medium"
                    >
                      {skill.split('-')[0].trim()}
                    </span>
                  ))}
                </div>

                {/* Pricing & Escrow Hire CTAs */}
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  {/* If AI Match Active, show match score pill */}
                  {isMatchActive && currentTalent && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-heading font-extrabold text-[11px] shadow-xs ${
                      (currentTalent.matchScore ?? 0) > 90
                        ? 'bg-forest text-white'
                        : (currentTalent.matchScore ?? 0) >= 70
                        ? 'bg-coral text-white'
                        : 'bg-slate-700 text-white'
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
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-heading font-extrabold text-xs shadow-md shadow-rose-500/25 flex items-center gap-1 active:scale-95 transition"
                  >
                    <Lock className="w-3 h-3 text-white" />
                    <span>Hire Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Real-Time Reel Progress Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800 z-40">
              <div
                className="h-full bg-gradient-to-r from-coral via-rose-500 to-indigo-500 transition-all duration-150 ease-linear shadow-xs"
                style={{ width: `${reelProgress}%` }}
              />
            </div>
          </>
        )}
        </div>
      </div>

      {/* FILTER MODAL / DRAWER */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-coral">
                  <SlidersHorizontal className="w-4 h-4 text-coral" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-slate-900">
                    Filter Creators
                  </h3>
                  <span className="text-[11px] text-slate-500">Find the exact skill & budget</span>
                </div>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category / Skill */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-800 mb-1.5">
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
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      selectedCategory === cat.id
                        ? 'border-coral bg-rose-50 font-bold text-coral shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-800 mb-1.5">
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
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedBudget === bg.id
                        ? 'border-coral bg-rose-50 font-bold text-coral shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
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
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-coral to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition active:scale-95"
              >
                Apply ({filteredTalents.length})
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
