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
| UI Components | shadcn/ui patterns (Radix primitives) |
| Animation | Framer Motion |
| Routing | React Router 7 |
| State | Zustand + localStorage persistence |
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
# Clone or navigate to the project
cd classSchedule

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Account

| Field | Value |
|-------|-------|
| Email | `demo@classflow.app` |
| Password | `demo1234` |

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

All data is stored in the browser via **localStorage** (no backend required). To connect Supabase or Firebase later, replace the stores in `src/stores/` with API calls.

## License

MIT — Free for educational and personal use.

---

Built with care for learning communities worldwide.
