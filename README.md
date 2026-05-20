# Naap Book Website

Standalone web app for tailor shops — customers, jobs, calendar, dashboard, and billing. Runs in the browser with **demo mode** (no backend required).

## Quick start

```powershell
cd "Naap Book Website"
copy .env.example .env.local
npm install
npm run dev
```

Or double-click **`start-dev.bat`** (Windows), then open [http://127.0.0.1:3000](http://127.0.0.1:3000).

First compile can take 30–60 seconds. If dev runs out of memory:

```powershell
npm run build
npm run start
```

## Environment

| Variable | Demo (default in `.env.example`) |
|----------|----------------------------------|
| `NEXT_PUBLIC_DEMO_MODE` | `true` — in-memory API |
| `NEXT_PUBLIC_DEMO_SKIP_LOGIN` | `true` — auto login |
| `NEXT_PUBLIC_API_URL` | Backend URL when demo is off |

Optional public demo gate:

```env
DEMO_GATE_ENABLED=true
DEMO_GATE_PASSWORD=your-secret
```

## Main routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Shop overview, KPIs, urgent alerts |
| `/today` | Today's deliveries |
| `/customers` | Customer directory |
| `/job/new` | New job wizard |
| `/jobs/[id]` | Job detail |
| `/jobs/[id]/receipt` | Receipt / print / share |
| `/calendar` | Delivery calendar |
| `/gallery` | Work gallery |
| `/analytics` | Advanced analytics |
| `/profile` | Language, theme, settings |

## Stitch UI reference

Design exports and integration notes live in `stitch_naap_book_ui_system/` (`SCREENS-MAP.md`, `INTEGRATION-STATUS.md`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (webpack, port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Tech stack

- Next.js 15 (App Router)
- React 19, Redux Toolkit, RTK Query
- CSS modules + Stitch design tokens
- Recharts (analytics)
