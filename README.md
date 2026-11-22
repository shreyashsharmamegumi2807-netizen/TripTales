# TripTales — Your AI-Powered Travel Companion

TripTales is a modern, premium, responsive, and fully functional travel platform designed to deliver genuine AI-powered travel planning, deterministic budget calculations, live weather intelligence, and authenticated personal journey management.

---

## 🌟 Why TripTales Is Different

Traditional travel tools often suffer from canned responses, static templates, arithmetic hallucinations, and exposed secrets. TripTales has been engineered with strict architectural guarantees:

1. **Zero Canned Responses:** Every chatbot query and trip planning request invokes the actual configured AI API. If an API key is missing or fails, the application displays a clear, actionable error banner rather than deceptive mock answers.
2. **Deterministic Financial Engine:** Budget totals, category breakdowns, room allocations, and per-person estimates are calculated using pure JavaScript arithmetic functions. Accommodation calculations automatically account for room occupancy (e.g. 2 travellers per room standard), avoiding the mistake of multiplying shared costs by the number of travellers.
3. **Real-time Live Weather:** Integrated with real meteorological radar (Open-Meteo High Resolution Global Models), delivering live temperatures, weather codes, humidity, and 5-day forecasts for any destination worldwide with zero required API keys.
4. **Geographically Verified Hidden Gems:** Curated offbeat sanctuaries (Chopta, Ziro Valley, Tirthan, Gandikota, Mawlynnong, Dholavira) with authentic transit routes and verified cultural advice.
5. **Private User Data Isolation:** User authentication and row-level data access ensure that saved itineraries, journals, and private travel histories are never visible to unauthenticated guests or other users.
6. **Premium Blue-and-White Design:** Sophisticated palette (`#2563EB`, `#172554`, `#EFF6FF`, `#F8FAFC`, `#0F766E`), elegant card elevations, subtle transitions, and fully responsive layouts.

---

## 🏗️ Technology Stack

- **Frontend:** React 18, Vite 6, TypeScript
- **Styling:** Tailwind CSS, Plus Jakarta Sans typography, Lucide React icons
- **Backend:** Node.js, Express, global Fetch
- **AI Engine:** Google Gemini API (`@google/genai` & REST endpoints with resilient model fallback)
- **Database & Authentication:** Supabase (with built-in isolated Local Storage fallback for offline/demo evaluation)
- **Weather API:** Open-Meteo High-Resolution Meteorological API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher; tested on Node v24)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your keys in `.env`:
```env
# Server Port (default 5000)
PORT=5000

# Google Gemini API Key (Required for AI features)
# Obtain free from: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (Optional for demo, Recommended for cloud sync)
# Obtain from your Supabase Project Settings -> API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Supabase Database Setup (Optional for cloud sync)
If using Supabase, navigate to the **SQL Editor** in your Supabase dashboard and run the script located at:
`supabase/schema.sql`

This creates:
- `profiles` table with automatic signup triggers
- `saved_trips` table with Row Level Security (RLS)
- `travel_journal` table with RLS
- `chat_conversations` table with RLS

*(Note: If Supabase keys are left empty, TripTales seamlessly uses an encrypted client-side local storage engine with full user account isolation, allowing immediate testing.)*

### 5. Running the Application
To run both backend Express server (port 5000) and Vite frontend (port 5173) concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend API
npm run server

# Terminal 2: Vite Frontend
npm run client
```

Open your browser at:
`http://localhost:5173`

---

## Deploying to Netlify

Use Node.js 24, `npm run build` as the build command, and `dist` as the publish directory. Netlify serves the Vite frontend from `dist` and loads `netlify/server/index.mjs` for `/api/*`. Both local development and Netlify use the same Express routes.

---

## 🧪 Automated Verification Suite

Run the built-in automated test suite:
```bash
node tests/api.test.js
```

This verifies:
- **Test 1:** Deterministic arithmetic for solo travellers, 4-person groups, and custom rate overrides.
- **Test 2:** Real meteorological data retrieval for live destinations (Jaipur, Varanasi).
- **Test 3:** Anti-canned response enforcement (verifying system throws clear errors if API key is missing instead of returning fake outputs).

---

## 📁 Project Architecture

```
triptales/
├── package.json              # Unified scripts and dependencies
├── vite.config.ts            # Vite config with /api proxy to port 5000
├── tailwind.config.js        # Brand color palette configuration
├── index.html                # Entry HTML with Plus Jakarta Sans
├── .env.example              # Environment variables template
├── supabase/
│   └── schema.sql            # Complete Supabase schema & RLS policies
├── netlify/server/index.mjs  # Netlify entry point for /api/*
├── server/
│   ├── index.js              # Local server entry point
│   ├── app.js                # Shared Express API
│   ├── routes/
│   │   ├── planner.js        # Dynamic itinerary generation endpoint
│   │   ├── budget.js         # Deterministic budget calculation endpoint
│   │   ├── weather.js        # Real weather radar endpoint
│   │   └── hiddenGems.js     # Curated offbeat destinations endpoint
│   └── services/
│       ├── geminiService.js   # Gemini API client with fallback
│       ├── budgetCalculator.js# Deterministic arithmetic engine
│       └── weatherService.js  # Open-Meteo meteorological integration
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root application router
│   ├── index.css             # Tailwind base & utilities
│   ├── types/
│   │   └── index.ts          # TypeScript domain interfaces
│   ├── lib/
│   │   ├── api.ts            # Client API services
│   │   └── supabase.ts       # Supabase client & fallback
│   ├── context/
│   │   └── AuthContext.tsx   # Auth, Session, Trips, & Journal state
│   ├── components/
│   │   ├── Navbar.tsx        # Responsive navigation with profile dropdown
│   │   ├── Footer.tsx        # Brand footer & technical details
│   │   └── AuthModal.tsx     # Sign in / Sign up modal with validation
│   └── pages/
│       ├── HomePage.tsx      # Clean landing page
│       ├── ChatPage.tsx      # Real AI travel chatbot
│       ├── PlannerPage.tsx   # Interactive trip planner
│       ├── BudgetPage.tsx    # Smart budget calculator
│       ├── HiddenGemsPage.tsx# Verified offbeat destinations
│       ├── WeatherPage.tsx   # Live weather forecast
│       ├── JournalPage.tsx   # Authenticated travel journal
│       └── DashboardPage.tsx # Authenticated My Trips dashboard
└── tests/
    └── api.test.js           # Comprehensive automated verification suite
```
