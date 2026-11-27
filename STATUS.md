# PUNTA BIKERS — Estado real del proyecto

**Actualizado:** 2026-11-27 (verificado con build, tsc, eslint y vitest)

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

## Infraestructura (verificada 2026-11-27)
| Pieza | Estado |
|-------|--------|
| Supabase `PUNTA BIKER` | Activo (ya no está pausado). Migraciones aplicadas: `core_security_documents`, `payments_close_permissive_policies`, `drop_unused_prisma_tables`. Tablas: `scooters`, `rentals`, `payments`, `documents`, todas con RLS y **0 filas** (no hay scooters cargados). |
| Vercel `punta-bikers` | Producción corre `e632bce` (Next 16.4.3, 23 oct). **El código nuevo de `main` (`a4fad64`: seguridad, documentos, RLS) todavía no está desplegado.** |
| Variables en Vercel (prod) | Presentes: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `RESEND_API_KEY`. |
| Variables faltantes | `SUPABASE_SERVICE_ROLE_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`, `ADMIN_EMAILS`. |

## Pendiente antes de operar
1. Agregar en Vercel las variables faltantes (arriba) y **desplegar `main`** (el deploy es por CLI, no automático).
2. Registrar el webhook en Mercado Pago apuntando a `https://<dominio>/api/payments/webhook` con el mismo secret.
3. Verificar dominio/remitente en Resend.
4. Marcar tu usuario como admin: `ADMIN_EMAILS` o `app_metadata.role = 'admin'`.
5. Cargar scooters (la tabla está vacía; el seed de `package.json` apunta a Prisma, que ya no existe en la base).
6. Prueba de punta a punta: registro, renta, documentos, aprobación, pago de prueba y activación por webhook.

## Deuda conocida
- `prisma/schema.prisma` y `@prisma/client` ya no se usan y las tablas Prisma se eliminaron de Supabase: borrar el esquema y la dependencia, y el script `db:seed`.
- CLAUDE.md dice Stripe; el código usa Mercado Pago. Actualizar CLAUDE.md.
- `/admin` y `/api/dashboard/stats` muestran datos de ejemplo fijos, no reales.
- Varios enlaces del panel admin (scooters, users, settings, payments, support) apuntan a páginas que no existen.
- Los tests de `api.test.ts` validan aritmética de Decimal, no las rutas reales. Faltan tests de las rutas de documentos.
- Sin monitoreo (Sentry) configurado.
- Código eliminado por no compilarse: `src/app/` (versión anterior del flujo, reescrita en `app/`).
