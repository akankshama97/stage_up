# StageUp — Skip the CV, Show Your Skill 🇮🇳

> A mobile-first, proof-of-work talent hiring platform built for Indian creators and recruiters.

StageUp reimagines hiring for Indian video editors, thumbnail designers, scriptwriters, and voiceover artists by replacing outdated CVs with **Instagram-style vertical reels**, **transparent gig pricing**, **100% UPI Escrow protection**, and **direct WhatsApp connections**.

---

## 🎨 Human-Centered Design Philosophy (Anti-AI Aesthetic)

- **Zero Purple/Blue AI Gradients**: Built with warm, tactile paper tones.
  - Warm Cream background: `#FAF7F2`
  - Soft Black typography: `#1A1A1A`
  - One punchy accent: Coral Orange `#FF4D2E`
  - Muted Green for trust and success: `#1E7A4C`
- **Typography**: Headings set in **Plus Jakarta Sans** and body text in **Inter**.
- **Real Indian Data**: Authentic creator profiles from **Noida, Delhi, Mumbai, Bengaluru, Kochi, and Pune** with realistic market rates:
  - *Priya Sharma (Noida)* — "Reel Editing - ₹500", "Color Grading - ₹800"
  - *Arjun Mehta (Delhi)* — "Poster Design - ₹300", "Brand Logos - ₹1200"
  - *Sneha Patel (Mumbai)* — "Thumbnail Design - ₹250", "Canva Banners - ₹350"
  - *Rohan Verma (Bengaluru)* — "Shorts Scriptwriting - ₹400", "Hook Writing - ₹300"
  - *Pooja Nair (Kochi)* — "Voiceover & Dubbing - ₹600", "Audio Cleanup - ₹500"
  - *Tanmay Joshi (Pune)* — "Product Shoot & Reels - ₹1500", "Food Styling - ₹800"
- **Real Photography**: High-quality portraits of genuine Indian creators (no generic AI avatars or 3D robot illustrations).
- **Tactile UI**: 12px border radius (`rounded-human`), subtle paper shadows, real price tags, and city badges.

---

## 📱 Core Screens & Killer Unique Features

### 1. **Screen 1: Splash Screen**
- Warm cream background, StageUp logo with coral accent.
- Tagline: *"Skip the CV, Show Your Skill"* in clear typography.
- Platform proof stats: average rates (₹250–₹1500/gig), active Indian cities, 24h turnaround.

### 2. **Screen 2: Role Selection**
- Photo-backed dual cards:
  - **"Mujhe Kaam Chahiye"**: Freelancers upload proof reels, set rates, generate UPI invoices, and receive WhatsApp client leads.
  - **"Mujhe Talent Chahiye"**: Recruiters, agency leads, and founders browse reels and hire with Escrow protection.

### 3. **Screen 3: Recruiter Feed (Instagram Reels Format)**
- Full-screen vertical video player with touch swipe, arrow keys, mute toggle, and play/pause.
- Bottom overlay: Name, Verified checkmark, City badge, Skills tags, and Starting Price.
- **Top Bar**: Search bar, City pills, Multi-filter drawer, Orders tracker badge, and **Urgent Gigs live alert**.
- **Right Action Stack**:
  - **Shortlist**: Heart button with live count & confetti.
  - **Gigs / Projects**: Opens 3 fixed-price packages.
  - **⚡ Raw ↔ Edit Proof**: One-tap Before/After split comparison.
  - **🎙️ Audition**: Voiceover Studio (for voice artists).
  - **WhatsApp Direct**: Simulated chat + `wa.me` connection.
  - **🧾 Invoice**: Instant rate card & UPI QR generator.

### 4. **Screen 4: Talent Profile**
- Verified badge, turnaround time, bio, and skill rate chips.
- Interactive Proof Reel video player.
- **3 Project Cards with real prices** and instant escrow booking.
- Direct links to Before/After comparison and Rate Card generator.

---

### ⭐ What Makes StageUp 100% Unique (Industry Firsts for India)

1. **⚡ "Raw vs Final Edit" Proof-of-Work Split Slider (`BeforeAfterProofModal`)**:
   - Recruiters don't want to guess what the editor actually did.
   - Interactive draggable slider compares **Raw unedited camera footage** with the **Final color-graded, kinetic-captioned reel**.
   - Includes technical skill breakdown (Rec.709 LUT, pacing cuts, beat-synced SFX).
2. **🔥 "Urgent 24-Hour Gigs & Casting Calls Board" (`UrgentGigsModal`)**:
   - Solves the urgent hiring dilemma for Indian YouTubers, startup founders, and agencies.
   - Live countdowns ("Urgent: 3h left", "Tomorrow 10 AM").
   - Recruiters broadcast a 60-second urgent gig with fixed budget.
   - Creators apply in 1-tap with their proof reel directly on WhatsApp.
3. **🧾 "Creator Rate Card & Instant UPI Invoice Generator" (`RateCardInvoiceModal`)**:
   - Solves non-payment and awkward negotiations for Indian freelancers.
   - Pick deliverable items (Reel editing, 3D thumbnail, express delivery).
   - Generates an authentic tactile Indian invoice with a **real scannable UPI QR code** (SVG) and direct `upi://pay` link for GPay, PhonePe, and Paytm.
4. **🎙️ "Voiceover Audition Studio" (`VoiceStudioModal`)**:
   - Dedicated soundboard for voice artists (e.g. Pooja Nair).
   - Real-time animated audio waveform visualizer.
   - Bilingual demos: Conversational Hindi, Malayalam storytelling, Hinglish promo, ASMR skincare.
   - Shure SM7B hardware specs & 1-tap booking.
5. **🏆 Live Skill Test — Anti-Fake Portfolio (`LiveSkillTestModal`)**:
   - Recruiters can challenge any creator with a 15-minute unedited raw task (e.g., 20-sec raw clip color grading, hook subtitles).
   - Live 15-minute countdown clock ensures zero ghost agency outsourcing.
   - Creator submits raw timeline video + screen-recording proof.
   - Passing awards the official golden badge: `StageUp Verified - Live Tested` (stored in persistent state/localStorage).
6. **🇮🇳 Creator Skill Passport — CV Replacement (`SkillPassport`)**:
   - Designed like an authentic Indian Passport / National ID card with biometric-style photo, doc number, and official verified seal.
   - 4 Pillars of Proof:
     1. Reliability Score: 98% (with active progress meter)
     2. Revision Score: 1.2 avg revisions per order (vs industry avg 3.8)
     3. Repeat Client Rate: 64% clients re-booked
     4. Verified 6-Month Income Graph: Bar chart showing freelance volume settled via UPI Escrow
   - One-click UI for "Download Passport as Image" and instant sharing.
7. **🛡️ 100% Escrow Protection (`CheckoutEscrowModal` & `OrdersDrawer`)**:
   - Recruiter funds held safely in StageUp Escrow vault via UPI.
   - Real-time order tracking: Escrow Held ➔ In Progress ➔ Delivered ➔ Completed.
   - Payment released to creator only after satisfaction.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express, MongoDB (Mongoose) with fallback in-memory cache for zero-friction local execution
- **Fonts**: Plus Jakarta Sans & Inter (via Google Fonts)

---

## 🚀 Running the Project

### 1. Start Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser or mobile device.

---

## 📡 API Endpoints

- `GET /api/talents` — List all talents (supports query params `?city=Noida&search=Reel`)
- `GET /api/talents/:id` — Retrieve a single talent and their 3 project cards
- `POST /api/talents` — Create and publish a new creator profile
- `POST /api/talents/:id/shortlist` — Increment the creator's shortlist counter
- `GET /api/orders` — List active escrow orders
- `POST /api/orders` — Create a new UPI escrow order
- `PATCH /api/orders/:id/status` — Update order status (delivered, completed, disputed)
- `GET /api/gigs` — List live urgent casting calls
- `POST /api/gigs` — Broadcast a new 60-second urgent gig
- `GET /api/health` — Service health and database status
