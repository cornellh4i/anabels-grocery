# Contributing

## Frontend

- **Where:** `src/app/` (Next.js App Router). Root layout: `src/app/layout.tsx`; home: `src/app/page.tsx`.
- **Run:** `npm run dev` — app at [http://localhost:3000](http://localhost:3000). Frontend and API are the same origin: pages at `/`, `/admin/*`, `/volunteer` and API at `/api/*` (e.g. `fetch('/api/shifts')`).

Admin pages: `src/app/admin/`. Minimal volunteer-facing entry: **`src/app/volunteer/page.tsx`** — expand or add routes from there.
