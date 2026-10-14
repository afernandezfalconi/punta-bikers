# PUNTA BIKERS

SaaS de administración integral para rentas de scooters en Puerto Escondido, Oaxaca.

## Commands

- `npm run dev` — Start development server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm test` — Run test suite (Vitest)
- `npx prisma db push` — Push Prisma schema to database (dev)
- `npx prisma migrate dev` — Create/apply migration
- `npx prisma generate` — Generate Prisma client
- `npm run db:seed` — Populate seed data (scooters, seasons)

## Tech Stack

Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + Supabase (PostgreSQL) + Prisma + Stripe + Vercel

## Architecture

### Directory Structure
- `src/app/` — Next.js App Router pages and API routes (organized by feature)
- `src/components/` — UI components (ui/, marketing/, app/, shared/)
- `src/lib/` — Utilities: Supabase clients, Stripe helpers, auth, DB
- `src/types/` — Shared TypeScript types and database schema
- `prisma/` — Database schema and migrations
- `public/` — Static assets

### Data Flow
- **Server Components by default** for data fetching (pages, layouts)
- **Client Components only for interactivity** (forms, modals, date pickers)
- **Database queries:** via Prisma ORM (`src/lib/db.ts`)
- **Real-time:** Supabase subscriptions for rental/document status changes
- **API routes:** `/api/rentals`, `/api/documents`, `/api/payments` handle mutations + Stripe webhooks

### Key Patterns
1. **Rentals are the core entity** — all other features (deposits, commissions, damages) hang off rentals
2. **State machine for rentals:** `PENDING_DOC` → `PENDING_PAYMENT` → `ACTIVE` → `COMPLETED`
3. **Role-based filtering:** Customer sees own rentals; Receptionist sees facilitated rentals; Admin sees all
4. **Financial calculations are automatic:** Commission, deposit, cancellation penalty computed server-side
5. **Stripe webhook for payment confirmation** — updates rental status → activates rental
6. **Document approval is manual** — admin/receptionist approve before payment can proceed

## Code Organization Rules

1. **One component per file.** Max 300 lines. If longer, extract sub-components.
2. **Path alias:** Use `@/` for `src/` imports. Never use relative paths (`../../../`).
3. **No barrel exports.** Import directly from source file (not index).
4. **Server Components by default.** Add `"use client"` only for interactivity (forms, state).
5. **Colocate related files** — keep page-specific components next to their page.
6. **API routes are type-safe** — use Zod for request validation, typed responses.
7. **Database queries in lib/db.ts** — don't query directly in components.
8. **Environment variables in .env.local** — never hardcode secrets; use `process.env`.

## Design System

### Colors
- **Primary:** #FF6B35 (naranja PUNTA BIKERS) — buttons, accents
- **Secondary:** #004E89 (azul) — links, secondary actions
- **Success:** #10B981 (verde) — approved docs, active rentals
- **Warning:** #F59E0B (amarillo) — pending actions
- **Destructive:** #EF4444 (rojo) — cancellations, damages
- **Background:** #F8F9FA — page background
- **Surface:** #FFFFFF — cards, panels
- **Text:** #1F2937 — body text
- **Muted:** #9CA3AF — secondary text, borders

### Typography
- **Headings:** Inter, weights 600-700, sizes 20-32px
- **Body:** Inter, 16px, weight 400
- **Small:** Inter, 14px, weight 400
- **Code:** JetBrains Mono, 14px

### Spacing & Style
- **Base spacing:** 4px scale (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- **Border radius:** 8px default, 12px on cards, full on avatars
- **Shadows:** Minimal (0 1px 3px), subtle animations 150-200ms
- **Aesthetic:** Clean, minimal, rounded corners, responsive-first design

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `DATABASE_URL` | PostgreSQL connection (from Supabase) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## Reglas No Negociables

1. **TypeScript strict mode always.** No `any` types. Use `unknown` + type guards if needed.
2. **All financial calculations server-side.** Never trust client-side math for money (commissions, deposits, penalties).
3. **Stripe webhook signature verification.** Always verify `signature` header using `Stripe.webhooks.constructEvent()`.
4. **Database migrations are permanent.** Test locally before pushing; use rollback migrations only when needed.
5. **Customer data isolation via RLS.** Customers can only see/modify their own rentals. Receptionists can only see their facilitated rentals.
6. **Email verification required.** Customers + receptionists must verify email before first use.
7. **No hardcoded prices.** All prices (rental, deposit, commission) pulled from database (Season, constants).
8. **Responsive mobile-first design.** Test on mobile before desktop. No content should be hidden on small screens.
9. **Error handling on all API routes.** Return consistent error shape: `{ error: "message", code: "ERROR_CODE" }`.
10. **Logging & monitoring.** Log all payment events, errors, and anomalies (use Sentry or similar).
