# PUNTA BIKERS — Estado real del proyecto

**Actualizado:** 2026-11-20 (verificado con build, tsc, eslint y vitest)

## Verificación automática
| Check | Resultado |
|-------|-----------|
| `tsc --noEmit` | OK |
| `npm run lint` | 0 errores (37 warnings) |
| `npm test` | 64/64 pasan |
| `next build` | OK (34 páginas) |

## Qué está en producción (árbol `app/` de la raíz)
Landing (Lovable), login/signup, dashboard de rentas y scooters, pagos Mercado Pago (crear + webhook), emails (Resend).

## Pendiente antes de operar
1. **Variables de entorno** en Vercel (ver `.env.example`): Supabase (URL, anon, service role), `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS`.
2. **Tablas en Supabase**: ejecutar `/api/setup` como admin (o los scripts `create-*-table.js`).
3. **Webhook en Mercado Pago** apuntando a `https://<dominio>/api/payments/webhook` con el mismo secret.
4. **Dominio / email remitente** verificado en Resend.

## Deuda conocida
- `src/app/` (rutas `/app/*`, documentos INE/pasaporte, `/api/documents`, `/api/webhooks/mercadopago`) **no se compila**: Next usa `app/` de la raíz. La verificación manual de documentos (estado `PENDING_DOC`) no está activa. Hay que portarla a `app/` o descartarla.
- `prisma/schema.prisma` no se usa: las tablas reales se crean por SQL en Supabase. Decidir una sola fuente de verdad.
- CLAUDE.md dice Stripe; el código usa Mercado Pago. Actualizar CLAUDE.md.
- `/admin` y `/api/dashboard/stats` muestran datos de ejemplo fijos, no reales.
- Los tests de `api.test.ts` validan aritmética de Decimal, no las rutas reales.
- No hay RLS verificada en Supabase (revisar políticas; `/api/setup` crea políticas amplias `authenticated`).
- Sin monitoreo (Sentry) configurado.
