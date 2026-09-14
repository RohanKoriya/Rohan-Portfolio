# Rohan Koriya — Portfolio

A MERN-stack personal portfolio: React + Vite + Tailwind on the frontend, Express + MongoDB on the backend.

## Structure

```
portfolio/
├── client/   React + Vite frontend
└── server/   Express + MongoDB API (contact form)
```

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env   # then edit MONGODB_URI if needed
npm install
npm run dev             # http://localhost:5000
```

Requires a running MongoDB instance (local, Docker, or Atlas) at the URI in `.env`.

### 2. Frontend

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000` (see `vite.config.js`), so the contact form works out of the box in development.

### 3. Production build

```bash
cd client
npm run build            # outputs to client/dist
```

Deploy `client/dist` to any static host (Vercel, Netlify) and the `server/` folder to any Node host (Render, Railway, Fly.io). Set `CLIENT_ORIGIN` in the server's environment to your deployed frontend URL, and `VITE_API_URL` in the client's build environment to your deployed API URL.

## Before you deploy

- Replace `client/public/resume.pdf` with your real resume.
- Replace the placeholder GitHub/LinkedIn/email links in `client/src/data/projects.js`, `client/src/components/Footer.jsx`, and `client/src/sections/HeroSection.jsx` with your real ones.
- Set a real `MONGODB_URI` (e.g. a MongoDB Atlas connection string) in `server/.env`.

## Notable implementation choices

- **Icons**: all social/action icons are hand-rolled, hover-animated SVGs (`client/src/components/ui/AnimatedIcons.jsx`) built on `motion/react`, each exposing a `startAnimation` / `stopAnimation` ref handle.
- **Projects section**: a sticky, scroll-driven overlapping card stack on desktop (`ProjectStack.jsx`), with a plain stacked-card fallback on mobile — no clipping, no motion trickery on small screens.
- **Signature details**: a live IST clock (footer + hero terminal widget), a "currently building" status card, and a lightweight `Cmd/Ctrl+K` command palette for quick navigation.
- **Contact form**: validated client-side with `react-hook-form` + `zod`, and re-validated server-side (length, email format, tag-stripping) before writing to MongoDB. Rate-limited to 5 submissions per IP per hour.
