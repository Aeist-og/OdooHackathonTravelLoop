# 🌍 Traveloop — Implementation Plan

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Build Tool** | Vite | Blazing-fast HMR for real-time UI updates |
| **Framework** | React 18+ | Component-based, great ecosystem |
| **Routing** | React Router v6 | Client-side multi-page navigation |
| **Styling** | Vanilla CSS (custom design system) | Full control, premium aesthetics |
| **State** | React Context + useReducer | No extra dependencies, sufficient for MVP |
| **Charts** | Chart.js (via react-chartjs-2) | Budget breakdowns, pie/bar charts |
| **Icons** | Lucide React | Modern, clean icon set |
| **Data Persistence** | localStorage (MVP) → Backend later | Quick prototype, upgrade path to DB |

---

## Live Data APIs (No Static JSON!)

| API | Purpose | Auth |
|-----|---------|------|
| **GeoDB Cities** (via RapidAPI free tier) | City search, population, country, coordinates | Free API key |
| **Unsplash API** | High-quality destination photos | Free API key |
| **RestCountries** | Country data, flags, currencies, regions | No key needed |
| **OpenWeatherMap** | Weather data for destinations | Free API key |
| **Overpass API (OpenStreetMap)** | POIs, attractions, activities near coordinates | No key needed |
| **ExchangeRate API** | Currency conversion for budget | Free, no key |

> [!NOTE]
> We'll abstract all API calls behind service modules so switching to a real backend later is trivial.

---

## Screens & Build Phases

### Phase 1 — Core MVP (Build First)

| # | Screen | Priority | Key Components |
|---|--------|----------|----------------|
| 1 | **Login / Signup** | 🔴 High | Auth forms, validation, localStorage session |
| 2 | **Dashboard / Home** | 🔴 High | Welcome banner, recent trips, recommended cities (live API), "Plan New Trip" CTA |
| 3 | **Create Trip** | 🔴 High | Trip form (name, dates, description), city suggestions from GeoDB API |
| 4 | **My Trips** | 🔴 High | Trip cards with tabs (Ongoing/Upcoming/Completed), edit/view/delete |
| 5 | **Itinerary Builder** | 🔴 High | Add stops, assign dates, add activities per stop, drag-to-reorder |
| 6 | **Itinerary View** | 🔴 High | Day-wise timeline, city headers, activity blocks with cost, calendar/list toggle |

### Phase 2 — Search & Budget

| # | Screen | Priority | Key Components |
|---|--------|----------|----------------|
| 7 | **City Search** | 🟡 Medium | Live search via GeoDB, filters by country/region, "Add to Trip" |
| 8 | **Activity Search** | 🟡 Medium | Search via Overpass API, filter by type/cost/duration |
| 9 | **Trip Budget** | 🟡 Medium | Cost breakdown (transport/stay/activities/meals), pie/bar charts, per-day average |

### Phase 3 — Extras & Social

| # | Screen | Priority | Key Components |
|---|--------|----------|----------------|
| 10 | **Packing Checklist** | 🟢 Low | Add/check items, categorize, reset |
| 11 | **Shared Itinerary** | 🟢 Low | Public read-only view, copy trip, share URL |
| 12 | **User Profile** | 🟢 Low | Edit name/photo/email, saved destinations |
| 13 | **Trip Notes/Journal** | 🟢 Low | Per-trip/per-stop notes, timestamps |
| 14 | **Admin Dashboard** | 🟢 Optional | Usage charts, top cities, user stats |

---

## Design System

```
Colors:
  --primary:        #2563EB (Royal Blue)
  --primary-light:  #3B82F6
  --accent:         #F59E0B (Amber)
  --accent-coral:   #FF6B6B
  --success:        #10B981
  --background:     #0F172A (Dark navy)
  --surface:        #1E293B
  --surface-light:  #334155
  --text-primary:   #F8FAFC
  --text-secondary: #94A3B8
  --glass:          rgba(255,255,255,0.05)
  --glass-border:   rgba(255,255,255,0.1)

Typography:
  Font: "Inter" (Google Fonts)
  Headings: 600-700 weight
  Body: 400 weight

Effects:
  - Glassmorphism cards with backdrop-blur
  - Subtle gradient backgrounds
  - Smooth 300ms transitions on all interactives
  - Micro-animations on hover/focus
  - Animated page transitions
```

---

## Project Structure

```
traveloop/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css              # Design system + global styles
│   ├── api/                   # Live API service modules
│   │   ├── cities.js          # GeoDB Cities API
│   │   ├── activities.js      # Overpass/OSM API
│   │   ├── photos.js          # Unsplash API
│   │   ├── weather.js         # OpenWeatherMap API
│   │   └── currency.js        # Exchange rate API
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── TripContext.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TripCard.jsx
│   │   ├── CityCard.jsx
│   │   ├── ActivityCard.jsx
│   │   ├── BudgetChart.jsx
│   │   ├── Timeline.jsx
│   │   └── ...
│   └── pages/
│       ├── Login.jsx
│       ├── Signup.jsx
│       ├── Dashboard.jsx
│       ├── CreateTrip.jsx
│       ├── MyTrips.jsx
│       ├── ItineraryBuilder.jsx
│       ├── ItineraryView.jsx
│       ├── CitySearch.jsx
│       ├── ActivitySearch.jsx
│       ├── TripBudget.jsx
│       ├── PackingChecklist.jsx
│       ├── SharedItinerary.jsx
│       ├── UserProfile.jsx
│       ├── TripNotes.jsx
│       └── AdminDashboard.jsx
└── .gitignore
```

---

## Git Workflow

- **Single branch**: `main` only
- All files committed directly to `main`
- Push commands:
  ```bash
  git add .
  git commit -m "your message"
  git push origin main
  ```

---

## Next Steps

> [!IMPORTANT]
> **Awaiting your confirmation before I start building.**

1. ✅ Review this plan
2. 🔨 I'll scaffold the Vite + React project
3. 🎨 Build the design system (index.css)
4. 🚀 Implement Phase 1 screens one by one
5. 🔗 Connect live APIs
6. 📱 Ensure responsive design throughout

**Questions for you:**
1. Do you want a **dark theme** (as planned above) or **light theme**?
2. For the free APIs, I'll use public endpoints that don't need keys where possible. For GeoDB/Unsplash, do you have API keys, or should I use the free tier with rate limits?
3. Should I start building now or do you want to adjust anything in this plan?
