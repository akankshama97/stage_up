import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Timer,
  Play,
  Pause,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Download,
  Sparkles,
  Award,
  ShieldCheck,
  Video,
  ExternalLink,
  Flame,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Customized live challenges according to talent skill
const skillTestChallenges = {
  talent_1: {
    role: 'Video Editor',
    taskTitle: '20-Sec Raw Phone Clip: DaVinci Color Grade + Kinetic Subtitles',
    taskDescription:
      'Download this unedited 4K phone clip of a founder unboxing a tech gadget. Remove dead pauses, apply a cinematic Rec.709 color grade, and add bold kinetic subtitles with 2 beat-synced whoosh sound effects.',
    rawClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rawClipDuration: '0:22',
    rawClipSize: '14.2 MB',
    checklist: [
      'Apply warm skin-tone color balance (eliminate green camera tint)',
      'Cut out the 3.5s hesitation pause at second 0:08',
      'Add animated kinetic captions in bilingual Hindi & English',
      'Provide screen-recording proof of timeline (DaVinci / Premiere)'
    ]
  },
  talent_2: {
    role: 'Poster Designer',
    taskTitle: '15-Min Live Typography Redesign for Indie Gig Night',
    taskDescription:
      'Take this rough, cluttered event brief and sketch a print-ready kraft paper poster. Must feature hand-textured typography and clean event hierarchy.',
    rawClipUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    rawClipDuration: 'Asset Pack',
    rawClipSize: '8.5 MB',
    checklist: [
      'Bold vintage headline font with custom kerning',
      'Halftone paper texture overlay',
      'Clear date, venue & ticket QR placement',
      'Screen-record 60-second time-lapse in Illustrator/Photoshop'
    ]
  },
  talent_3: {
    role: 'Thumbnail Artist',
    taskTitle: 'High-CTR YouTube Face Cutout & Glow Challenge',
    taskDescription:
      'Download the raw camera freeze frame. Isolate the subject, add directional rim-light, and create an irresistible curiosity hook with max 3 words for a finance video.',
    rawClipUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    rawClipDuration: 'Raw Frame',
    rawClipSize: '5.1 MB',
    checklist: [
      'Sub-pixel subject cutout with zero jagged edges',
      'Eye-level high-contrast headline text (mobile legible)',
      'Vibrant directional background glow',
      'Screen recording proof showing layer stack'
    ]
  },
  default: {
    role: 'Creator',
    taskTitle: '15-Minute Live Proof-of-Work Challenge',
    taskDescription:
      'Execute a rapid 15-minute turnaround task based on your trade. Prove that your portfolio reflects your actual speed and raw execution without agency outsourcing.',
    rawClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rawClipDuration: '0:20',
    rawClipSize: '12.0 MB',
    checklist: [
      'Complete deliverables within the 15-minute window',
      'Maintain standard export resolution (1080p / 300 DPI)',
      'Upload screen-recording link verifying your active timeline',
      'Adhere to the brand guidelines specified in brief'
    ]
  }
};

export default function LiveSkillTestModal({
  talent,
  onClose,
  onTestPassed,
  isAlreadyPassed = false
}) {
  if (!talent) return null;

  const challenge = skillTestChallenges[talent._id] || skillTestChallenges.default;

  // 15-minute countdown timer state (15 * 60 = 900 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef(null);

  // Form submission inputs
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [screenRecordingUrl, setScreenRecordingUrl] = useState('');
  const [editingSoftware, setEditingSoftware] = useState('DaVinci Resolve 19');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPassedSuccess, setIsPassedSuccess] = useState(isAlreadyPassed);

  // Live timer interval
  useEffect(() => {
    if (isTimerRunning && secondsRemaining > 0 && !isPassedSuccess) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, secondsRemaining, isPassedSuccess]);

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setSecondsRemaining(15 * 60);
    setIsTimerRunning(true);
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission validation
    await new Promise((r) => setTimeout(r, 900));

    setIsSubmitting(false);
    setIsPassedSuccess(true);
    setIsTimerRunning(false);

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFB800', '#FF4D2E', '#1E7A4C', '#FAF7F2']
    });

    if (onTestPassed) {
      onTestPassed(talent._id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-cream rounded-human border border-cream-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-cream-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-ink leading-tight">
                  Live Skill Test (Anti-Fake Portfolio)
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 border border-amber-400 flex items-center gap-1 shadow-sm">
                  ⚡ 15-Min Proof
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Candidate: <span className="font-semibold text-ink">{talent.name}</span> ({talent.city}) • Raw Unedited Execution
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* SUCCESS BANNER IF TEST PASSED */}
          {isPassedSuccess && (
            <div className="bg-amber-50 rounded-human border-2 border-amber-400 p-4 shadow-paper flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-heading font-black text-[11px] tracking-wide uppercase">
                    🏆 StageUp Verified - Live Tested
                  </div>
                  <h4 className="font-heading font-bold text-sm text-ink mt-0.5">
                    {talent.name} has officially passed the Live Skill Test!
                  </h4>
                  <p className="text-xs text-ink-secondary">
                    Golden verification badge is now permanently active on their creator reel and profile.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-2 px-4 rounded-human bg-amber-500 hover:bg-amber-400 text-black font-heading font-bold text-xs transition shadow-sm whitespace-nowrap"
              >
                View Profile Badge →
              </button>
            </div>
          )}

          {/* TIMER BANNER (LIVE TICKING) */}
          <div className="bg-neutral-900 text-cream rounded-human p-4 sm:p-5 border border-neutral-800 shadow-paper flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                <Timer className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                  Official Live Skill Stopwatch
                </span>
                <span className="text-xs text-neutral-400">
                  Creator must complete and submit raw timeline proof before clock hits 00:00
                </span>
              </div>
            </div>

            {/* Big Digital Clock */}
            <div className="flex items-center gap-3 bg-neutral-950 px-4 py-2 rounded-human border border-neutral-800">
              <span className={`font-mono text-3xl font-extrabold tracking-widest ${
                secondsRemaining < 180 ? 'text-coral animate-pulse' : 'text-amber-400'
              }`}>
                {formatTime(secondsRemaining)}
              </span>

              <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
                  title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
                  title="Reset 15-min timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* TASK BRIEF CARD */}
          <div className="bg-white rounded-human border border-cream-border p-4 sm:p-5 shadow-paper space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-cream-muted pb-3">
              <div>
                <span className="text-[10px] font-heading font-extrabold text-coral uppercase tracking-wider">
                  Assigned Real-Time Task
                </span>
                <h4 className="font-heading font-bold text-base text-ink mt-0.5">
                  {challenge.taskTitle}
                </h4>
              </div>

              <a
                href={challenge.rawClipUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="py-1.5 px-3 rounded-human bg-cream-muted hover:bg-cream-darker border border-cream-border text-ink font-heading font-bold text-xs transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-coral" />
                <span>Download Raw Clip ({challenge.rawClipSize})</span>
              </a>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {challenge.taskDescription}
            </p>

            {/* Checklist */}
            <div className="pt-1">
              <h5 className="text-[11px] font-heading font-bold text-ink-secondary uppercase tracking-wider mb-2">
                Verification Rubric & Mandatory Checks:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {challenge.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-cream/60 p-2 rounded-human border border-cream-border text-xs text-ink"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUBMISSION & PROOF FORM */}
          <form onSubmit={handleSubmitTest} className="bg-white rounded-human border border-cream-border p-4 sm:p-5 shadow-paper space-y-4">
            <div className="flex items-center justify-between border-b border-cream-muted pb-2">
              <h4 className="font-heading font-bold text-sm text-ink flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-coral" />
                <span>Submit Final Edit & Screen-Recording Proof</span>
              </h4>
              <span className="text-[11px] text-forest font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Anti-Agency Check
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-semibold text-ink mb-1">
                  Final Edited Clip Link (Drive / Loom / Dropbox) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/edited-clip"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full text-xs bg-cream/40 border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-ink mb-1">
                  Screen Recording Proof Link (Loom / OBS clip) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://loom.com/share/proof-of-timeline"
                  value={screenRecordingUrl}
                  onChange={(e) => setScreenRecordingUrl(e.target.value)}
                  className="w-full text-xs bg-cream/40 border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-coral"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-semibold text-ink mb-1">
                  Primary Editing Software Used
                </label>
                <select
                  value={editingSoftware}
                  onChange={(e) => setEditingSoftware(e.target.value)}
                  className="w-full text-xs bg-cream/40 border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-coral"
                >
                  <option value="DaVinci Resolve 19">DaVinci Resolve Studio 19</option>
                  <option value="Adobe Premiere Pro">Adobe Premiere Pro 2026</option>
                  <option value="Final Cut Pro">Apple Final Cut Pro</option>
                  <option value="Adobe Photoshop">Adobe Photoshop (Design)</option>
                  <option value="CapCut Desktop">CapCut Desktop Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-ink mb-1">
                  Turnaround Note / LUTs Applied
                </label>
                <input
                  type="text"
                  placeholder="e.g. Applied Kodak 2383 LUT, beat cut on 124 BPM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs bg-cream/40 border border-cream-border rounded-human p-2.5 text-ink focus:outline-none focus:border-coral"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-ink-muted">
                Submissions are timestamped and verified against 15-min clock.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-3 text-xs text-ink-secondary hover:text-ink font-medium"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-5 rounded-human bg-amber-500 hover:bg-amber-400 text-black font-heading font-extrabold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Proof...' : 'Submit Proof & Pass Test'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
