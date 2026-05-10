# Traveloop

**Traveloop** is a smart trip planner that helps users plan, organize, and share itineraries with live city data and budget tracking.

## Hackathon Demo / How judges can access
1. Open the deployed project URL (recommended):
   - If you don’t have a live deployment yet, judges can still run the project locally (steps below).
2. Alternatively, use the GitHub repo you are viewing:
   - `https://github.com/Aeist-og/OdooHackathonTravelLoop`

> **Next step (recommended for hackathons):** deploy to **Vercel / Netlify / GitHub Pages** so judges can access it immediately in a browser without setup.

## Features
- Create and manage trips
- Build itineraries
- Budget tracking
- City/activities browsing and itinerary sharing
- Admin dashboard and user authentication

## Tech stack
- React + Vite
- React Router
- Tailwind CSS
- Chart.js

## How to run locally
### 1) Prerequisites
- Node.js 18+ recommended
- npm

### 2) Install dependencies
```bash
npm install
```

### 3) Start dev server
```bash
npm run dev
```

After starting, open the shown local URL (usually `http://localhost:5173`).

### 4) Build for production (optional)
```bash
npm run build
npm run preview
```

## Project structure (high level)
- `src/pages/` - route pages (Login, Signup, Dashboard, Itinerary, etc.)
- `src/components/` - reusable UI components
- `src/api/` - API helper modules
- `src/context/` - React contexts (auth/theme/trips)

## Deployment (recommended)
### Vercel / Netlify (SPA)
These platforms will build Vite automatically.
- Build command: `npm run build`
- Output directory: `dist`

If using a platform that needs routing rules for React Router, enable SPA fallback (rewrites to `index.html`).

## Notes
- Ensure `.env` variables (if any) are configured in your deployment environment.

