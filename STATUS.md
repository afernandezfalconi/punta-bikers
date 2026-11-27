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

## Flujo de renta (máquina de estados)
`pending_doc` → `pending_payment` → `active` → `completed` (o `cancelled`).
- El cliente crea la renta (`pending_doc`) y sube INE/pasaporte en `/dashboard/rentals/[id]/documents`.
- Un admin aprueba o rechaza en `/admin/documents`; aprobar pasa la renta a `pending_payment` y avisa por correo.
- Solo con documentos aprobados se puede crear el pago; el webhook de Mercado Pago activa la renta.
- Las fotos van a un bucket privado `documents` (URLs firmadas de 5 min para el admin).

## Pendiente antes de operar
1. **Reactivar el proyecto Supabase `PUNTA BIKER`** (está pausado) y aplicar `supabase/migrations/20261125000000_core_security_documents.sql` (cierra la lectura pública de rentas, agrega `documents` y el bucket privado).
2. **Variables de entorno** en Vercel (ver `.env.example`).
3. **Webhook en Mercado Pago** apuntando a `https://<dominio>/api/payments/webhook` con el mismo secret.
4. **Dominio / email remitente** verificado en Resend.
5. Marcar tu usuario como admin: `ADMIN_EMAILS` o `app_metadata.role = 'admin'`.

## Deuda conocida
- `prisma/schema.prisma` no se usa: las tablas reales se crean por SQL en Supabase. Decidir una sola fuente de verdad.
- CLAUDE.md dice Stripe; el código usa Mercado Pago. Actualizar CLAUDE.md.
- `/admin` y `/api/dashboard/stats` muestran datos de ejemplo fijos, no reales.
- Varios enlaces del panel admin (scooters, users, settings, payments, support) apuntan a páginas que no existen.
- Los tests de `api.test.ts` validan aritmética de Decimal, no las rutas reales. Faltan tests de las rutas de documentos.
- Sin monitoreo (Sentry) configurado.
- Código eliminado por no compilarse: `src/app/` (versión anterior del flujo, reescrita en `app/`).
