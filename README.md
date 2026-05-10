# Traveloop

**Traveloop** is a smart trip planner that helps users plan, organize, and share itineraries with live city data and budget tracking.

## Hackathon Demo / How judges can access
1. Open the deployed project URL :
   - I don’t have a live deployment yet, judges can still run the project locally (steps below).
2. Alternatively, use the GitHub repo you are viewing:
   - `https://github.com/Aeist-og/OdooHackathonTravelLoop`

> **Deployed version** deploy to ** Netlify ** so judges can access it immediately in a browser without setup.

here is the link :  `https://6a0059b376586000086fb274--melodious-phoenix-908646.netlify.app/`

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

## Project structure 
- `src/pages/` - route pages (Login, Signup, Dashboard, Itinerary, etc.)
- `src/components/` - reusable UI components
- `src/api/` - API helper modules
- `src/context/` - React contexts (auth/theme/trips)

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

## Deployment (recommended)
### Vercel / Netlify (SPA)
These platforms will build Vite automatically.
- Build command: `npm run build`
- Output directory: `dist`

If using a platform that needs routing rules for React Router, enable SPA fallback (rewrites to `index.html`).

