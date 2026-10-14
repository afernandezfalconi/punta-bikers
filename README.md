# PUNTA BIKERS

SaaS para administración integral de rentas de scooters en Puerto Escondido, Oaxaca.

## Quick Start

```bash
# 1. Install dependencies (already done)
npm install

# 2. Update .env.local with Supabase + Stripe credentials
# See: .env.example for what you need

# 3. Start development server
npm run dev

# Open: http://localhost:3000
```

## Project Structure

```
punta-bikers/
├── app/                    # Next.js App Router (pages + API routes)
├── components/             # React components (ui/, marketing/, app/)
├── lib/                    # Utilities (supabase, stripe, auth, db)
├── public/                 # Static assets
├── prisma/                 # Database schema (not yet created)
├── .env.local              # Environment variables (git-ignored)
├── CLAUDE.md               # Project instructions + rules
├── PROGRESS.md             # Build checkpoint (Step 1/17)
└── punta-bikers-blueprint.md # Complete architecture (8500+ lines)
```

## Build Status

**Current Step:** 1 of 17 ✅  
**Progress:** Scaffolding complete

### Next: Step 2 (Supabase Setup & Database)

Before continuing, you need:
1. **Supabase project** (get URL + keys)
2. **Stripe account** (get keys + webhook secret)
3. **Update `.env.local`** with credentials

See `PROGRESS.md` for detailed checklist.

## Key Files

- **`CLAUDE.md`** — Read this first: project architecture, code rules, design system
- **`PROGRESS.md`** — Current build status (which step you're on, what's done, what's next)
- **`punta-bikers-blueprint.md`** (in parent: `C:\Users\HP\`) — Complete 17-step build guide

## Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run lint          # Run linter
npm test              # Run tests
npx prisma studio    # Open Prisma Studio (once DB is set up)
```

## Tech Stack

- **Next.js 15** + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (PostgreSQL) + **Prisma ORM**
- **Stripe** for payments
- **Vercel** for hosting

## Important

⚠️ **Do NOT commit `.env.local`** — it contains secrets  
✅ **Copy from `.env.example`** when setting up  
✅ **All financial calculations are server-side** — never trust client-side math  
✅ **TypeScript strict mode** — no `any` types

## Next Steps

1. Create Supabase project
2. Create Stripe account
3. Update `.env.local`
4. Follow Step 2 in `punta-bikers-blueprint.md`

For full build order, see: **`C:\Users\HP\punta-bikers-blueprint.md`** (Section 9)
