import React, { useState } from 'react';
import {
  X,
  Flame,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  Plus,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const initialUrgentGigs = [
  {
    id: 'gig_1',
    title: 'Urgent: 3 Tech Reels for D2C AI Keyboard Launch',
    recruiter: 'Akanksha (Founder & Director)',
    avatar: '/recruiter-profile.jpg',
    city: 'Bengaluru',
    budget: '₹1,500',
    category: 'Reel Editing',
    deadline: 'Tomorrow 10:00 AM',
    hoursLeft: 6,
    brief: 'We have 4K raw phone clips of product unboxing. Need dynamic jump cuts, kinetic captions in Hindi/English, and Ali Abdaal style zooms.',
    referenceLink: 'https://drive.google.com/sample-raw',
    applicantsCount: 4,
    status: 'urgent'
  },
  {
    id: 'gig_2',
    title: 'Clickable YouTube Thumbnail for Finance Breakdown',
    recruiter: 'Tanvi M. (180k Subs Creator)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    city: 'Delhi',
    budget: '₹400',
    category: 'Thumbnail Design',
    deadline: 'Today by 8:00 PM',
    hoursLeft: 3,
    brief: 'Topic: "How Zerodha makes ₹4000 Cr profit". Need high-contrast face cutout with dramatic curiosity hook text. PSD/PNG delivery.',
    referenceLink: 'https://youtube.com/@example',
    applicantsCount: 7,
    status: 'urgent'
  },
  {
    id: 'gig_3',
    title: 'Bilingual Voiceover for South India Brand Ad',
    recruiter: 'Adarsh Raj (Creative Director @ Kochi Media)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Kochi',
    budget: '₹800',
    category: 'Voiceover',
    deadline: 'Within 12 Hours',
    hoursLeft: 10,
    brief: '30-second conversational script in Malayalam with English brand punchline. Warm, relatable tone for organic Instagram ad.',
    referenceLink: 'https://drive.google.com/script-sample',
    applicantsCount: 2,
    status: 'urgent'
  },
  {
    id: 'gig_4',
    title: 'Food Styling & Tabletop Macro B-Roll for Cafe Launch',
    recruiter: 'Meera Sen (Marketing Lead @ BrewCraft)',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    city: 'Pune',
    budget: '₹2,000',
    category: 'Product Shoot',
    deadline: 'Friday Afternoon',
    hoursLeft: 24,
    brief: 'On-location quick shoot in Koregaon Park. Need 5 aesthetic slow-mo clips of iced matcha pour and sourdough toast slice.',
    referenceLink: 'https://instagram.com/brewcraft',
    applicantsCount: 3,
    status: 'active'
  }
];

export default function UrgentGigsModal({
  isOpen,
  onClose,
  talents = [],
  onApplyGig,
  onOpenEscrow
}) {
  const [gigs, setGigs] = useState(initialUrgentGigs);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPostingFormOpen, setIsPostingFormOpen] = useState(false);
  const [appliedGigIds, setAppliedGigIds] = useState(new Set());

  // Post gig form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Reel Editing');
  const [newBudget, setNewBudget] = useState('₹800');
  const [newCity, setNewCity] = useState('Delhi');
  const [newDeadline, setNewDeadline] = useState('Within 24 Hours');
  const [newBrief, setNewBrief] = useState('');
  const [recruiterName, setRecruiterName] = useState('Akanksha (Founder)');

  if (!isOpen) return null;

  const categories = ['All', 'Reel Editing', 'Thumbnail Design', 'Voiceover', 'Product Shoot', 'Scriptwriting'];

  const filteredGigs = gigs.filter(g => {
    if (selectedCategory === 'All') return true;
    return g.category === selectedCategory;
  });

  const handleApply = (gig) => {
    setAppliedGigIds(prev => new Set(prev).add(gig.id));
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 }
    });
    if (onApplyGig) {
      onApplyGig(gig);
    }
  };

  const handleCreateGig = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBrief.trim()) return;

    const createdGig = {
      id: `gig_${Date.now()}`,
      title: newTitle.trim(),
      recruiter: recruiterName || 'Verified Founder',
      avatar: '/recruiter-profile.jpg',
      city: newCity,
      budget: newBudget.startsWith('₹') ? newBudget : `₹${newBudget}`,
      category: newCategory,
      deadline: newDeadline,
      hoursLeft: 18,
      brief: newBrief.trim(),
      referenceLink: '',
      applicantsCount: 1,
      status: 'urgent'
    };

    setGigs(prev => [createdGig, ...prev]);
    setIsPostingFormOpen(false);
    setNewTitle('');
    setNewBrief('');

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.4 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-cream rounded-human border border-cream-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-cream-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral-light border border-coral-border flex items-center justify-center text-coral">
              <Flame className="w-4 h-4 fill-coral" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-ink leading-tight">
                  Urgent 24-Hour Gigs & Casting Calls
                </h3>
                <span className="text-[10px] font-semibold text-coral bg-coral-light px-2 py-0.5 rounded-full border border-coral-border flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
                  Live Casting
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Immediate delivery requirements with StageUp Escrow payment protection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPostingFormOpen(!isPostingFormOpen)}
              className="px-2.5 py-1.5 rounded-human bg-ink hover:bg-neutral-800 text-white font-heading font-semibold text-xs transition shadow-sm flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isPostingFormOpen ? 'View Gigs' : 'Post a Gig'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-human bg-white border border-cream-border flex items-center justify-center text-ink hover:bg-cream-muted transition shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Post A Gig Form (Collapsible) */}
          {isPostingFormOpen ? (
            <form onSubmit={handleCreateGig} className="bg-white rounded-human border border-cream-border p-4 sm:p-5 shadow-paper space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-cream-muted">
                <h4 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-coral" />
                  Post a 60-Second Urgent Gig Alert
                </h4>
                <span className="text-[11px] text-ink-muted">Free during launch</span>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-ink mb-1">
                  Gig Title & What You Need *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need 2 Reels edited by tomorrow 10 AM with hook captions"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-cream/50 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-heading font-semibold text-ink-secondary mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs bg-cream/50 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
                  >
                    <option value="Reel Editing">🎬 Reel Editing</option>
                    <option value="Thumbnail Design">🎨 Thumbnail Design</option>
                    <option value="Voiceover">🎙️ Voiceover</option>
                    <option value="Product Shoot">📸 Product Shoot</option>
                    <option value="Scriptwriting">✍️ Scriptwriting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold text-ink-secondary mb-1">
                    Fixed Budget (INR) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="₹800"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full text-xs bg-cream/50 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold text-ink-secondary mb-1">
                    City / Remote
                  </label>
                  <input
                    type="text"
                    placeholder="Delhi or Remote"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full text-xs bg-cream/50 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-heading font-semibold text-ink-secondary mb-1">
                  Urgency / Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Within 6 hours / Tonight 9 PM"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full text-xs bg-cream/50 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-ink mb-1">
                  Brief Details & Style Reference *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention raw footage length, style inspiration (e.g. Ali Abdaal / Ranveer Allahbadia), and deliverables."
                  value={newBrief}
                  onChange={(e) => setNewBrief(e.target.value)}
                  className="w-full text-xs bg-cream/50 border border-cream-border rounded-human p-2 text-ink focus:outline-none focus:border-coral"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostingFormOpen(false)}
                  className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-human bg-coral hover:bg-coral-hover text-white font-heading font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Urgent Gig</span>
                </button>
              </div>
            </form>
          ) : null}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-heading font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-white hover:bg-cream-muted text-ink-secondary border border-cream-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gigs List */}
          <div className="space-y-3">
            {filteredGigs.map(gig => {
              const isApplied = appliedGigIds.has(gig.id);
              return (
                <div
                  key={gig.id}
                  className="bg-white rounded-human border border-cream-border p-4 shadow-paper hover:border-coral/50 transition duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={gig.avatar}
                        alt={gig.recruiter}
                        className="w-10 h-10 rounded-human object-cover border border-cream-border flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-heading font-bold text-ink">
                            {gig.recruiter}
                          </span>
                          <span className="text-[10px] text-ink-muted flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 text-coral" />
                            {gig.city}
                          </span>
                          <span className="text-[10px] bg-cream-muted px-2 py-0.5 rounded text-ink-secondary font-medium">
                            {gig.category}
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-sm text-ink mt-1">
                          {gig.title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-heading font-extrabold text-base text-coral">
                        {gig.budget}
                      </div>
                      <div className="text-[10px] text-forest font-semibold flex items-center gap-0.5 justify-end mt-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        Escrow Backed
                      </div>
                    </div>
                  </div>

                  {/* Brief */}
                  <p className="text-xs text-ink-secondary mt-2.5 bg-cream/50 p-2.5 rounded-human border border-cream-border leading-relaxed">
                    {gig.brief}
                  </p>

                  {/* Footer Meta & Actions */}
                  <div className="mt-3 pt-2.5 border-t border-cream-muted flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                      <span className="flex items-center gap-1 text-coral font-medium">
                        <Clock className="w-3 h-3" />
                        Urgent: {gig.deadline} ({gig.hoursLeft}h left)
                      </span>
                      <span>•</span>
                      <span>{gig.applicantsCount} applied</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApply(gig)}
                        disabled={isApplied}
                        className={`px-3.5 py-1.5 rounded-human font-heading font-bold text-xs transition shadow-sm flex items-center gap-1.5 ${
                          isApplied
                            ? 'bg-forest text-white cursor-default'
                            : 'bg-coral hover:bg-coral-hover text-white'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Pitch Sent via WhatsApp</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>Apply with My Reel (1-Tap)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
