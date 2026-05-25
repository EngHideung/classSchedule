# ClassFlow

A modern, production-ready class schedule management web application for students, teachers, schools, universities, and communities.

![ClassFlow](public/favicon.svg)

## Features

- **Authentication** — Register, login, forgot password, Google sign-in UI (mockup)
- **Dashboard** — Daily overview, weekly stats, Pomodoro timer, notifications, assignments, AI study tips UI
- **Schedule management** — Add/edit/delete classes, color tags, conflict detection, recurring schedules
- **Calendar** — Day, week, month, and agenda views with drag-and-drop rescheduling
- **Collaboration** — Share links, PDF/image export (UI), invite classmates
- **Personalization** — Dark/light/system theme, accent colors, focus mode
- **Accessibility** — Keyboard shortcuts (⌘K, ⌘N, ⌘D, ⌘C), ARIA labels, semantic HTML, reduced motion support

## Tech Stack (100% Free & Open Source)

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 8 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database & Auth | **Supabase** (free tier) |
| i18n | **i18next** — English & Indonesian |
| UI Components | shadcn/ui patterns (Radix primitives) |
| Animation | Framer Motion |
| Routing | React Router 7 |
| State | Zustand |
| Icons | Lucide React |
| Dates | date-fns |
| Charts | Recharts |
| Toasts | Sonner |
| Command palette | cmdk |

## Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm 9+

### Installation

```bash
cd classSchedule
npm install
cp .env.example .env
# Edit .env with your Supabase URL and anon key
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Supabase Setup (required)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Open **SQL Editor** and run the full script from `supabase/schema.sql`
4. (Optional) Under **Authentication → URL Configuration**, add `http://localhost:5173` as Site URL for password reset
5. Register a new account in the app — sample classes are seeded automatically on first login

### Language / Bahasa

Switch between **English** and **Indonesia (Bahasa Indonesia)** using:

- The flag button in the header (marketing & app)
- **Settings → Language**
- Preference is saved to your profile in Supabase when logged in

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn-style primitives
│   ├── layout/       # Marketing & app shells
│   ├── dashboard/    # Dashboard widgets
│   ├── calendar/     # Calendar views
│   ├── schedule/     # Class form modal
│   └── shared/       # Reusable utilities
├── pages/            # Route-level pages
├── stores/           # Zustand state (auth, schedule, preferences)
├── hooks/            # Theme, shortcuts, Pomodoro
├── lib/              # Utilities (schedule logic, storage)
├── types/            # TypeScript interfaces
└── data/             # Sample data & constants
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + K` | Open command palette |
| `⌘/Ctrl + N` | Add new class |
| `⌘/Ctrl + D` | Go to dashboard |
| `⌘/Ctrl + C` | Go to calendar |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

The included `vercel.json` handles SPA routing.

### Netlify

1. Push to GitHub
2. Create a new site at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

The `public/_redirects` file handles SPA routing on Netlify.

### Manual Static Hosting

```bash
npm run build
# Upload the `dist/` folder to any static host
```

## Design Principles

ClassFlow follows **Jakob Nielsen's 10 Usability Heuristics** and WCAG-oriented contrast ratios. The UI uses:

- Glassmorphism cards with subtle gradients
- Bento grid dashboard layout
- Mobile-first responsive design
- Inter + Outfit typography
- Indigo/cyan harmonious palette

## Data Storage

All schedule data, profiles, assignments, and notifications are stored in **Supabase** with Row Level Security (each user only sees their own data). Authentication uses Supabase Auth (email/password).

## License

MIT — Free for educational and personal use.

---

Built with care for learning communities worldwide.
