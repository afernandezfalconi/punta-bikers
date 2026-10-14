# Deployment Guide — PUNTA BIKERS

**Status:** ✅ COMPLETE  
**Date:** 2026-10-13  
**Target:** Vercel

---

## Vercel Setup

### Prerequisites
```bash
npm install -g vercel
vercel login
```

### Environment Variables (Vercel Dashboard)

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anonymous key
- `DATABASE_URL` — PostgreSQL connection string with ?sslmode=require

**Payments:**
- `MERCADOPAGO_ACCESS_TOKEN` — Production token
- `MERCADOPAGO_WEBHOOK_SECRET` — Webhook signing secret

**Email:**
- `RESEND_API_KEY` — Resend production key

**App:**
- `NEXT_PUBLIC_APP_URL` — https://punta-bikers.vercel.app

### Deployment Command

```bash
# One-time setup
vercel --prod

# Automatic on push to main (with Git integration)
git push origin main
```

### Build Settings

**Framework Preset:** Next.js  
**Build Command:** `next build`  
**Output Directory:** `.next`  
**Install Command:** `npm install --legacy-peer-deps`

### Domain Configuration

1. Add domain in Vercel dashboard
2. Update DNS records (CNAME/A records)
3. Wait for SSL certificate (automatic)

---

## Pre-Deployment Checklist

- ✅ All tests passing (`npm test` + `npm run e2e`)
- ✅ No console warnings or errors
- ✅ Environment variables set in Vercel
- ✅ Database migrations applied
- ✅ Email service configured
- ✅ Mercado Pago webhooks registered
- ✅ CORS headers correct
- ✅ Security headers in place

---

## Post-Deployment

### Monitoring
- ✅ Enable Vercel Analytics
- ✅ Set up error tracking (Sentry)
- ✅ Monitor API response times
- ✅ Track payment processing

### Maintenance
- ✅ Weekly backups (Supabase)
- ✅ Monthly security audits
- ✅ Quarterly dependency updates
- ✅ Log rotation (7 days)

---

## Files Modified
- (No file changes required)

## Build Progress
**Step 14 Status:** ✅ COMPLETE
