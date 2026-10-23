# Lovable → Vercel: plan de sincronización de la landing

La landing (`/`) se diseña en **Lovable**. La app (dashboard, auth, admin, pagos, API) vive en **este repo Next.js** y se aloja en **Vercel**. Este documento es el procedimiento para que un cambio en Lovable llegue a Vercel sin romper nada.

```
Lovable (diseña)  ──push──▶  GitHub: rama punta-biker-landing   (fuente de verdad del diseño)
                                       │  npm run sync:lovable
                                       ▼
                    GitHub: rama main (este repo)  ──vercel --prod──▶  Vercel (producción)
                                       ▲
                          feedback ◀───┴─── hallazgos del port → mensaje a Lovable
```

## Reglas

1. **Nunca se edita a mano** lo que genera el script: `app/landing.css`, `src/components/landing/**`, `src/lib/landing/**`, `public/landing/**`, `public/{favicon.png,apple-touch-icon.png,app-icon-*.png,manifest.webmanifest}`, `app/favicon.ico`. El cambio se hace en Lovable y se re-sincroniza; si no, el siguiente sync lo pisa.
2. Se edita a mano solo `app/page.tsx` (fuentes `next/font` + metadata). El resto del repo no lo toca el sync.
3. Todo el CSS de la landing está limitado a `.pb-landing`, así que no afecta dashboard/auth/admin.
4. Los assets de Lovable usan rutas `/__l5e/...` que solo existen en el hosting de Lovable; el script los copia a `public/landing/` y reescribe las rutas.
5. Si el script no entiende un cambio de Lovable, **se detiene sin escribir nada** y dice qué ajustar. Esa es la red de seguridad: un error ruidoso es mejor que una landing rota.

## Procedimiento (cada vez que cambie algo en Lovable)

| # | Paso | Comando | Debe pasar |
|---|------|---------|-----------|
| 0 | Confirmar que Lovable ya subió el cambio a GitHub (rama `punta-biker-landing`) | `npm run sync:lovable:check` | Muestra `PENDING` con los archivos cambiados |
| 1 | Sincronizar | `npm run sync:lovable` | `Synced ... written` sin `SYNC FAILED` |
| 2 | Tipos | `npx tsc --noEmit` | 0 errores |
| 3 | Build de producción (lo mismo que ejecuta Vercel) | `npx next build` | Termina con la tabla de rutas |
| 4 | Paridad contra Lovable (texto, assets, alts, aria-labels) | `npm run dev` y en otra terminal `npm run verify:landing` | `PARITY OK` |
| 5 | Revisión visual: escritorio y móvil (hero, flota 360°, modal de consulta, FAQ, menú móvil, cambio ES/EN) | abrir `http://localhost:3000` junto a `https://puntabiker.lovable.app` | Igual a Lovable |
| 6 | Confirmar que el dashboard/auth no cambió de estilo | abrir `/auth/login` y `/dashboard` | Sin cambios visuales |
| 7 | Commit y push a `main` (respaldo del código) | `git add <archivos> && git commit && git push` | Push OK |
| 8 | **Desplegar a producción.** El push a GitHub NO despliega: el proyecto está enlazado por CLI (`.vercel/project.json`) | `vercel --prod` | `readyState: READY` |
| 9 | Paridad en producción | `node scripts/compare-landing.mjs https://puntabiker.lovable.app https://punta-bikers.vercel.app` | `PARITY OK` |

Notas:
- El paso 4 compara contra la **versión publicada** de Lovable. Si el cambio está en el preview pero no publicado, publícalo primero en Lovable o pasa la URL del preview como primer argumento.
- `lovable-sync.json` guarda el commit de Lovable ya sincronizado. Se versiona para que `--check` funcione desde cualquier máquina.

## Si algo falla

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| `SYNC FAILED: Lovable changed shape: could not apply "..."` | Lovable cambió la estructura de un archivo que el script transforma | Ajustar esa transformación en `scripts/sync-lovable.mjs`. No se escribió nada |
| `package "x" is not installed` | La landing usa una librería nueva | `npm install x` y re-sincronizar |
| `imports @/..., which is not ported` | La landing importa un archivo nuevo (hook, componente UI) | Agregarlo a `ALIASES` y a la lista de archivos del script |
| `unknown font "X"` | Lovable usa una tipografía nueva | Agregarla a `FONT_MAP` en el script y a `next/font` en `app/page.tsx` |
| `New Lovable routes NOT ported` (aviso) | Lovable agregó otra página | Decidir si se porta a una ruta Next.js |
| `next build` falla | Error de tipos, aunque sea en otra parte del repo | Corregirlo antes del push: **un build roto impide que Vercel publique cualquier cambio** |
| `PARITY OK` falla con diferencias de texto | Algo no se sincronizó o `app/page.tsx` quedó desactualizado | Leer el diff que imprime el script |

## Rollback

- Vercel: panel → Deployments → versión anterior → *Promote to Production* (instantáneo).
- Git: `git revert <commit>` del commit del sync y push.

## Feedback hacia Lovable

Cuando el port revele algo que conviene corregir en el origen (accesibilidad, texto, un asset pesado), se envía a Lovable para que el diseño y el repo no diverjan. Requiere **créditos de Lovable** y la aprobación del dueño del proyecto, porque cada mensaje a Lovable consume créditos.

- Canal: herramienta `send_message` del conector de Lovable, preferentemente con `plan_mode=true` para discutir antes de que escriba código.
- Plantilla: *"En la integración a Next.js/Vercel encontramos X en `<archivo>`. Propuesta: Y. No cambies la estructura de `src/routes/index.tsx` ni los nombres de clases, porque un script los transforma automáticamente."*
- Mantener en Lovable: un solo archivo de ruta (`src/routes/index.tsx`), estilos en `src/styles.css`, assets en `assets-originales/` + punteros `.asset.json`, sin `url()` en el CSS.

## Pendientes

- Vercel: conectar el repo de GitHub en el panel (Project → Settings → Git) para que cada push a `main` despliegue solo. Hoy el despliegue es manual con `vercel --prod`; sin esa conexión, un push no publica nada.
- Lovable: confirmar que cada cambio se publique a la rama `punta-biker-landing` (ya existe en GitHub) y recargar créditos.
- La landing de Lovable no enlaza a `/auth/login` ni al dashboard. El acceso a la app sigue en esas rutas; si se quiere un botón de ingreso en la landing, debe agregarse **en Lovable** para que no lo pise el sync.
- `robots.txt` de Lovable no se copia (el sitio también sirve áreas privadas); definir uno propio de la app.
