# StageUp
**Skip the CV, show your skill.**
A mobile-first, proof-of-work hiring platform for Indian creators and recruiters. Creators showcase proof reels and transparent rates; recruiters browse, shortlist, and hire with escrow-protected UPI payments.

## Features
- **Reels-style talent feed**: swipeable vertical video discovery with search, city, and filter options
- **Raw vs. Final proof**: draggable before/after slider showing the creator's actual edit
- **Fixed-price packages**: three bookable project cards per creator
- **UPI escrow**: funds held until delivery, with order tracking (Escrow Held → In Progress → Delivered → Completed)
- **Rate card and UPI invoice**: scannable QR code and `upi://pay` deep link
- **Urgent gigs board**: 24-hour casting calls with live countdowns
- **Live Skill Test**: 15-minute timed task that earns a "Live Tested" badge
- **Skill Passport**: CV replacement with reliability, revision, repeat-client, and income proof
- **Voiceover audition studio**: waveform player with bilingual demos

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express, MongoDB (Mongoose), with an in-memory fallback so it runs locally without a database

## Getting Started

```bash
# Backend (port 5000)
cd backend
npm install
npm start

# Frontend (port 5173), in a second terminal
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/talents` | List talents (`?city=Noida&search=Reel`) |
| `GET` | `/api/talents/:id` | Get a talent and their project cards |
| `POST` | `/api/talents` | Create a creator profile |
| `POST` | `/api/talents/:id/shortlist` | Increment shortlist count |
| `GET` | `/api/orders` | List escrow orders |
| `POST` | `/api/orders` | Create an escrow order |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `GET` | `/api/gigs` | List urgent gigs |
| `POST` | `/api/gigs` | Broadcast a new gig |
| `GET` | `/api/health` | Service and database status |
