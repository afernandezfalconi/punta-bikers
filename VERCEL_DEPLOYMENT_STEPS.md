# Vercel Deployment Steps — PUNTA BIKERS

## Paso 1: Autenticar con Vercel

```bash
vercel login
```

Sigue las instrucciones en pantalla para:
- Crear una cuenta en Vercel (si no tienes)
- Conectar tu cuenta de GitHub
- Autorizar Vercel CLI

## Paso 2: Configurar Variables de Entorno

En tu terminal (PowerShell):
```bash
cd C:\Users\HP\punta-bikers
```

Luego accede al dashboard de Vercel en https://vercel.com/dashboard

O usa Vercel CLI:
```bash
vercel env pull
```

Esto descargará las variables de entorno configuradas en el dashboard.

## Paso 3: Agregar Variables de Entorno (Vercel Dashboard)

1. Ve a https://vercel.com/dashboard
2. Selecciona "punta-bikers" (o créalo si no existe)
3. Ve a "Settings" → "Environment Variables"
4. Agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://yrwpwpbjndfaphcqxlek.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pnJRZYiEvykeDMuqeo-zgw_qkA-h16C
DATABASE_URL=postgresql://postgres:AFernandezFalconi92@db.yrwpwpbjndfaphcqxlek.supabase.co:5432/postgres?sslmode=require
MERCADOPAGO_ACCESS_TOKEN=<tu-mercado-pago-token>
MERCADOPAGO_WEBHOOK_SECRET=<tu-webhook-secret>
RESEND_API_KEY=<tu-resend-api-key>
NEXT_PUBLIC_APP_URL=https://punta-bikers.vercel.app
```

## Paso 4: Deploy a Vercel

### Opción A: CLI (Recomendado)
```bash
cd C:\Users\HP\punta-bikers
vercel --prod
```

### Opción B: Git Push (Automático)
```bash
git push origin main
```
(Si conectaste tu repo a Vercel)

### Opción C: Script
```bash
bash DEPLOY.sh
```

## Paso 5: Verificación Post-Deploy

Verifica que todo funcionó:

1. **URL en vivo:**
   ```
   https://punta-bikers.vercel.app
   ```

2. **Verifica componentes:**
   - ✅ Landing page carga
   - ✅ Emails se envían
   - ✅ Mercado Pago API responde
   - ✅ Base de datos conecta
   - ✅ Storage funciona

3. **Monitorea logs:**
   ```bash
   vercel logs --tail
   ```

4. **Checks en Vercel Dashboard:**
   - Deployment successful (verde)
   - Build logs sin errores
   - Performance metrics

## Variables de Entorno Necesarias

| Variable | Descripción | Dónde obtener |
|----------|-------------|---------------|
| NEXT_PUBLIC_SUPABASE_URL | URL del proyecto Supabase | Supabase Dashboard |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Clave anónima | Supabase Settings |
| DATABASE_URL | Conexión PostgreSQL | Supabase Database |
| MERCADOPAGO_ACCESS_TOKEN | Token de producción | Mercado Pago Account |
| MERCADOPAGO_WEBHOOK_SECRET | Secret del webhook | Mercado Pago Webhooks |
| RESEND_API_KEY | API key de Resend | Resend Dashboard |
| NEXT_PUBLIC_APP_URL | URL de producción | Vercel deployment URL |

## Troubleshooting

### "Build failed"
```bash
npm run build
```
Verifica que no hay errores localmente primero.

### "Not authenticated"
```bash
vercel login
```
Autentica nuevamente con Vercel.

### Variables de entorno no funcionan
1. Verifica que están en Vercel Dashboard
2. Redeploy después de agregar variables:
   ```bash
   vercel redeploy
   ```

### Base de datos no conecta
- Verifica DATABASE_URL con `?sslmode=require`
- Confirma IP de Vercel está en whitelist de Supabase

## Dominio Personalizado (Opcional)

En Vercel Dashboard:
1. Settings → Domains
2. Add domain
3. Configure DNS records
4. SSL se genera automáticamente

Ejemplo:
```
punta-bikers.com → Vercel
```

## Status del Deployment

Ver estado en tiempo real:
```bash
vercel status
```

O en: https://vercel.com/dashboard

## Rollback (Si necesario)

```bash
vercel rollback
```

## Monitoreo Post-Deploy

- **Errores:** https://vercel.com/dashboard → [proyecto] → Monitoring
- **Performance:** Vercel Analytics (habilitado automáticamente)
- **Logs:** `vercel logs --tail`

---

**¡Listo para deployar!** 🚀
