# Punta Biker — exporte del proyecto

Exporte completo de la vista previa independiente de **Punta Biker — Ride the Coast**
(La Punta, Puerto Escondido, Oaxaca). Incluye el código fuente y las copias reales
de todos los archivos multimedia.

## Contenido

| Carpeta o archivo | Qué contiene |
| --- | --- |
| `src/` | Todo el código: página, estilos, visores 360°, modal de consulta, textos en español e inglés, pruebas. |
| `public/` | Íconos del sitio: `favicon.png`, `favicon.ico`, `apple-touch-icon.png`, `app-icon-192.png`, `app-icon-512.png`, `manifest.webmanifest`, `robots.txt`. |
| `assets-originales/` | Copias reales de las 59 imágenes y videos que en el proyecto viven alojados en el CDN, con la misma estructura de carpetas que `src/assets/`. Incluye `manifest.json` con la URL y el tamaño de cada archivo. |
| `package.json`, `bun.lock`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `components.json` | Configuración del proyecto. |
| `AGENTS.md`, `README.md`, `roadmap.md` | Reglas del proyecto, README y bitácora de tareas. |

No se incluyen `node_modules/`, `.git/` ni la carpeta de compilación: se generan al instalar.

## Ejecutar en local

```sh
npm install     # o: bun install
npm run dev     # abre la vista previa en http://localhost:8080
```

Pruebas y revisión de tipos:

```sh
npx vitest run      # o: bunx vitest run
npx tsgo --noEmit   # o: bunx tsgo --noEmit
```

## Sobre los archivos multimedia

El proyecto no guarda las fotos y el video dentro del código: cada uno tiene un
puntero `*.asset.json` en `src/assets/` que apunta a su dirección en el CDN
(`/__l5e/assets-v1/...`). Así el repositorio pesa poco y los archivos se sirven
rápido en todo el mundo.

Las copias originales están en `assets-originales/`, con las mismas rutas
relativas, por si quieres volver a subirlas a otro alojamiento o dejarlas dentro
del proyecto. Para usarlas localmente, reemplaza el contenido de cada
`src/assets/<ruta>.asset.json` por el archivo correspondiente y actualiza las
importaciones para que apunten al archivo directo en lugar del puntero.

## Notas del proyecto

- Es una vista previa de diseño: sin precios, sin reservas, sin pagos y sin base de datos.
- La consulta genera un mensaje listo para copiar o compartir por WhatsApp, con el aviso «Consulta, no reserva.» / «Inquiry, not a booking.».
- Textos completos en español e inglés, con selector ES | EN.
