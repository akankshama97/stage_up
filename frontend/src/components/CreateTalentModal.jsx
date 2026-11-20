import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Check,
  Upload,
  Video,
  AlertCircle,
  Play,
  Pause,
  Image as ImageIcon,
  Film,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreateTalentModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Noida',
    skills: 'Reel Editing - Rs 500, Hook Design',
    price: 'Rs 500',
    priceUnit: 'per reel',
    turnaroundTime: '24 hrs',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-her-phone-40763-large.mp4',
    posterUrl: ''
  });

  const [videoSourceMode, setVideoSourceMode] = useState('upload'); // 'upload' | 'url'
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoPreviewRef = useRef(null);
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleAvatars = [
    { label: 'Priya', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { label: 'Arjun', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { label: 'Sneha', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    { label: 'Rohan', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' }
  ];

  const quickSkills = [
    'Reel Editing - Rs 500',
    'Thumbnail Design - Rs 300',
    'Shorts Scriptwriting - Rs 400',
    'Voiceover & Dubbing - Rs 600',
    'Color Grading - Rs 800',
    'Canva Banners - Rs 350'
  ];

  // Handle local video file upload (MP4/WebM/MOV)
  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (.mp4, .webm, .mov)');
      return;
    }

    setUploadedVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    setFormData(prev => ({
      ...prev,
      videoUrl: objectUrl
    }));
    setError('');
  };

  // Handle custom avatar upload
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      avatar: objectUrl
    }));
  };

  const handleAddSkill = (skill) => {
    setFormData(prev => {
      const current = prev.skills ? prev.skills.split(',').map(s => s.trim()) : [];
      if (!current.includes(skill)) {
        return {
          ...prev,
          skills: current.length > 0 ? `${prev.skills}, ${skill}` : skill
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || !formData.price.trim()) {
      setError('Please fill in Name, City, and Starting Price.');
      return;
    }

    setLoading(true);
    setError('');

    const formattedPrice = formData.price.startsWith('Rs') || formData.price.startsWith('₹')
      ? formData.price
      : `Rs ${formData.price}`;

    const projectsPayload = [
      {
        title: `${formData.name}'s Primary Service`,
        price: formattedPrice,
        image: formData.avatar || '/davinci-timeline.svg',
        description: `High-retention work delivered in ${formData.turnaroundTime}. 1 revision included.`
      },
      {
        title: `Rush 12-Hour Delivery Package`,
        price: 'Rs 900',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        description: 'Priority queue with fast iteration on WhatsApp.'
      },
      {
        title: `Monthly Retainer (4 Gigs)`,
        price: 'Rs 2000',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
        description: 'Consistent weekly output for your social media channels.'
      }
    ];

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/talents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formattedPrice,
          projects: projectsPayload
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save to backend');
      }

      const created = await res.json();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF385C', '#059669', '#6366F1']
      });

      onCreated(created);
      onClose();
    } catch (err) {
      console.warn('Backend POST failed, creating locally:', err);
      // Fallback local creation
      const localTalent = {
        _id: `talent_${Date.now()}`,
        ...formData,
        price: formattedPrice,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        shortlistedCount: 1,
        projects: projectsPayload
      };
      onCreated(localTalent);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-human border border-cream-border shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 border-b border-cream-muted bg-cream flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-coral">
              🇮🇳 Creator Onboarding
            </span>
            <h3 className="font-heading font-bold text-base text-ink">
              Upload Your Skill Reel & Set Rates
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-muted hover:bg-cream-darker flex items-center justify-center text-ink transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* VIDEO UPLOAD & REAL-TIME PREVIEW SECTION */}
          <div className="bg-cream-muted/60 p-3.5 rounded-human border border-cream-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-ink flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-coral" />
                Proof-of-Work Reel (Vertical 9:16) *
              </label>

              {/* Mode switch pills */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-cream-border text-[10px]">
                <button
                  type="button"
                  onClick={() => setVideoSourceMode('upload')}
                  className={`px-2 py-0.5 rounded-full font-medium transition ${
                    videoSourceMode === 'upload' ? 'bg-ink text-white font-bold' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceMode('url')}
                  className={`px-2 py-0.5 rounded-full font-medium transition ${
                    videoSourceMode === 'url' ? 'bg-ink text-white font-bold' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {videoSourceMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />

                {uploadedVideoFile ? (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-human border border-cream-border">
                    <div className="w-16 h-20 rounded-[8px] overflow-hidden bg-black flex-shrink-0 relative">
                      <video
                        src={videoPreviewUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        autoPlay
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-forest font-semibold text-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>Ready to Stream</span>
                      </div>
                      <p className="text-xs font-bold text-ink truncate mt-0.5">
                        {uploadedVideoFile.name}
                      </p>
                      <p className="text-[10px] text-ink-muted">
                        {(uploadedVideoFile.size / (1024 * 1024)).toFixed(1)} MB • Vertical Reel
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs font-bold text-coral bg-coral-light rounded-human hover:bg-coral-light/80"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cream-darker hover:border-coral bg-white hover:bg-cream-muted/40 transition rounded-human p-5 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-coral-light text-coral flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-bold text-xs text-ink">
                      Drag & Drop or Click to Upload Your Reel
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      Supports MP4, MOV, WebM (under 50MB recommended)
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  placeholder="https://assets.mixkit.co/... or direct video mp4 link"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-white border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
                />
              </div>
            )}
          </div>

          {/* AVATAR / PROFILE PHOTO PICKER */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-bold text-ink">
                Profile Photo
              </label>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="text-[11px] font-semibold text-coral hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload Custom Photo
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {sampleAvatars.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData(prev => ({ ...prev, avatar: av.url }))}
                  className={`relative rounded-full p-0.5 border-2 transition flex-shrink-0 ${
                    formData.avatar === av.url ? 'border-coral scale-105' : 'border-transparent'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  {formData.avatar === av.url && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-coral text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}

              {formData.avatar && !sampleAvatars.some(a => a.url === formData.avatar) && (
                <div className="relative rounded-full p-0.5 border-2 border-coral scale-105 flex-shrink-0">
                  <img
                    src={formData.avatar}
                    alt="Custom"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-coral text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1">
                City / Location *
              </label>
              <select
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
              >
                <option value="Noida">Noida</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kochi">Kochi</option>
                <option value="Pune">Pune</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1">
              WhatsApp Number (for direct client hiring & Escrow receipts)
            </label>
            <input
              type="text"
              placeholder="+91 98112 43210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
            />
          </div>

          {/* Skills & Quick Helper */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1">
              Skills & Pricing Tag (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Reel Editing - Rs 500, Hook Writing - Rs 300"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
            />

            {/* Quick Skill Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickSkills.map((sk, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSkill(sk)}
                  className="px-2 py-0.5 rounded-full bg-cream hover:bg-cream-darker border border-cream-border text-[10px] text-ink-secondary transition"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Rates & Turnaround Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1">
                Starting Rate (₹) *
              </label>
              <input
                type="text"
                required
                placeholder="Rs 500"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1">
                Average Turnaround
              </label>
              <select
                value={formData.turnaroundTime}
                onChange={e => setFormData({ ...formData, turnaroundTime: e.target.value })}
                className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
              >
                <option value="6 hrs">6 hrs (Rush Delivery)</option>
                <option value="12 hrs">12 hrs (Fast)</option>
                <option value="24 hrs">24 hrs (Standard)</option>
                <option value="48 hrs">48 hrs</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1">
              Short Human Bio
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Freelance video editor from Sector 62. I turn raw phone footage into high-retention viral reels for Indian brands..."
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full text-xs sm:text-sm bg-cream-muted border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-ink"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-human bg-ink hover:bg-neutral-800 text-cream font-heading font-extrabold text-sm transition shadow-paper flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-coral" />
              <span>{loading ? 'Publishing Reel...' : 'Publish Talent Reel Card'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
