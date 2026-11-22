# 🎬 StageUp — India's Proof-of-Work Creator Marketplace

<p align="center">
  <img src="frontend/public/favicon.svg" alt="StageUp Logo" width="80" height="80" />
</p>

<h3 align="center"><b>Skip the CV, Show Your Skill.</b></h3>

<p align="center">
  A high-retention, mobile-first marketplace connecting verified Indian creators (video editors, thumbnail artists, scriptwriters, and voiceover artists) with modern brands and agencies — featuring <b>100% UPI escrow protection</b> and <b>zero agency markups</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Author-Akanksha%20Maurya-E8472B?style=for-the-badge" alt="Author" />
</p>

---

## 💡 The Problem & The StageUp Solution

| Traditional Platforms (Upwork / Fiverr / LinkedIn) | The StageUp Way 🚀 |
| :--- | :--- |
| **Puffed-up PDFs & Fake Portfolios**: Anyone can claim someone else's viral video as their own work. | **Verified Proof-of-Work**: Timeline previews (DaVinci/Premiere), before/after log grade sliders, and 15-minute Live Skill Tests. |
| **High Agency Commissions**: 20% to 35% platform fees taken from both creator and recruiter. | **Zero Agency Markups**: 100% direct pricing with transparent fixed-price project packages. |
| **Payment Insecurity**: Ghosting, endless delays, or risky direct UPI transfers with zero protection. | **UPI Escrow Protection**: Payment is held securely until deliverables are approved (`Held` → `In Progress` → `Delivered` → `Completed`). |
| **Clunky Desktop UX**: Tedious long-form proposals and slow response times. | **Mobile-First Video Reels**: Swipeable vertical video discovery with 1-click WhatsApp/Chat ordering. |

---

## 🌟 Key Features

### 1. 📱 Reels-Style Video Talent Discovery
- Swipeable vertical video reel interface designed specifically for video editors and creators.
- Sound toggle, active timeline overlay, creator ratings (⭐ 4.9), software badges (*DaVinci Resolve*, *Premiere Pro*, *After Effects*, *CapCut*), and city tags.

### 2. ⚡ Anti-Fake Portfolio Verification
- **15-Minute Live Skill Test**: Real-time timed assessment module. Creators pass an editorial test to earn the coveted **"Live Tested"** badge.
- **Skill Passport**: Replaces conventional resumes with verifiable metrics: **98% On-Time Delivery**, **1.2 Average Revisions**, and **Repeat Client Ratio**.

### 3. 🎚️ Draggable "Raw vs. Final" Before/After Proof
- Interactive split-screen slider allowing recruiters to slide between flat camera log footage and the creator's finalized color grading and sound design.

### 4. 🎙️ Voiceover Audition Studio
- Dedicated audio waveform visualizer for voiceover talents with bilingual demos (Hindi commercial, conversational English, podcast narration).

### 5. 💳 100% UPI Escrow Protection & Invoicing
- **Multi-State Escrow Flow**: Recruiter deposits budget into escrow via UPI (GPay, PhonePe, Paytm). Funds are automatically released upon work sign-off.
- **Dynamic UPI QR Code**: Instant scannable QR code and `upi://pay` deep links for mobile checkout.
- **Escrow Orders Drawer**: Real-time tracking of all active, in-review, and completed deliverables.

### 6. 🤖 Smart AI Talent Matching
- Recruiter matchmaker engine scoring candidates based on required editing software, turnaround window, budget ceiling, and content niche.

### 7. 🔥 Urgent 24H Gigs & Casting Calls
- Dedicated gig board with active countdown timers for recruiters needing same-day video turnaround.

### 8. 🎨 Cohesive Split-Screen Auth & Design System
- **Single Canvas Theme**: Unified `#FAF7F2` warm canvas palette matching luxury SaaS aesthetics.
- **Quick Demo Mode**: 1-click test credentials for recruiters and creators without typing.
- **Brand Trust Social Proof**: Verified integrations and trust signals from leading Indian startups (Swiggy, Zomato, Nykaa, Dream11, Razorpay).

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, CSS Custom Properties Design Tokens (`tokens.css`)
- **Typography**: Plus Jakarta Sans (Headings), Inter (UI & Body)
- **Icons**: Lucide React
- **Delight & Animations**: Canvas Confetti, Framer-inspired CSS transitions

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB via Mongoose
- **Zero-Config Fallback**: Built-in memory fallback engine so the full app runs out-of-the-box locally even without an active MongoDB connection.

---

## 📂 Project Structure

```text
STAGEUP/
├── backend/
│   ├── data/                 # Seed talent and project data
│   ├── models/               # Mongoose schemas (Talent, Order, Gig, User)
│   ├── server.js             # Express API server with in-memory fallback
│   ├── .env.example         
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── favicon.svg       # Brand SU squircle favicon
│   │   └── davinci-timeline.svg
│   ├── src/
│   │   ├── assets/           # Media & graphics
│   │   ├── components/       # UI screens & modular interactive widgets
│   │   │   ├── AuthPage.jsx            # Split-screen login & signup
│   │   │   ├── RecruiterFeed.jsx       # Reels-style vertical talent feed
│   │   │   ├── TalentProfile.jsx       # Comprehensive talent profile
│   │   │   ├── BeforeAfterProofModal.jsx # Draggable split comparison
│   │   │   ├── LiveSkillTestModal.jsx  # 15-min portfolio verification
│   │   │   ├── SkillPassport.jsx       # Trust metrics & reliability
│   │   │   ├── VoiceStudioModal.jsx    # Audio waveform player
│   │   │   ├── CheckoutEscrowModal.jsx # UPI Escrow booking & QR
│   │   │   ├── OrdersDrawer.jsx        # Order lifecycle tracker
│   │   │   └── UrgentGigsModal.jsx     # 24H casting calls
│   │   ├── data/             # Rich offline seed talents
│   │   ├── utils/            # AI match score algorithms
│   │   ├── index.css         # Tailwind directives & base styles
│   │   ├── tokens.css        # Global CSS theme tokens (--bg: #FAF7F2)
│   │   ├── App.jsx           # Screen routing & state coordinator
│   │   └── main.jsx
│   ├── index.html            # OpenGraph, metadata, and fonts
│   ├── tailwind.config.js
│   └── vite.config.js
├── vercel.json               # Production deployment rewrite configuration
├── package.json              # Monorepo task scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0 or higher)
- npm install

### 1. Clone the repository
```bash
git clone https://github.com/akankshama97/stage_up.git
cd stage_up
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start
```

### 3. Start the Frontend
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/talents` | Filterable list of creators (`?city=Delhi&search=DaVinci`) |
| `GET` | `/api/talents/:id` | Detailed creator profile and project packages |
| `POST` | `/api/talents` | Create a new creator profile |
| `POST` | `/api/talents/:id/shortlist`| Increment shortlist counter |
| `GET` | `/api/orders` | Fetch active and past escrow orders |
| `POST` | `/api/orders` | Create a new UPI escrow order |
| `PATCH`| `/api/orders/:id/status` | Advance order status (`held` → `in_progress` → `delivered` → `completed`) |
| `GET` | `/api/gigs` | Fetch urgent 24-hour casting calls |
| `POST` | `/api/gigs` | Post an urgent gig |
| `GET` | `/api/health` | Service and database healthcheck |

---

## 👩‍💻 Author & Portfolio Details

**Developed with ❤️ by Akanksha Maurya**  
*Full Stack Developer & Product Designer*

- **GitHub**: [@akankshama97](https://github.com/akankshama97)
- **Repository**: [stage_up](https://github.com/akankshama97/stage_up)
- **Project Scope**: Full-stack MERN architecture, responsive UI design system, escrow workflow simulation, client-side resilience.

---

<p align="center">
  <sub>© 2026 StageUp. All rights reserved. Built for creators across India.</sub>
</p>
