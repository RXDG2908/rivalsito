# Rivalsito — Marvel Rivals Drafter

Sorteo táctico de héroes y roles para Marvel Rivals. Soporta 1 o 2 equipos (2, 4 o 6 jugadores por equipo), modos party (todos el mismo héroe, solo tanques, etc.), mezcla de jugadores, deshabilitar héroes y pegado masivo de nombres desde el portapapeles.

App 100% estática y sin dependencias externas: no requiere claves de API ni conexión a servicios de terceros.

## Ejecutar localmente

**Requisitos:** Node.js

1. Instala dependencias:
   ```
   npm install
   ```
2. Inicia la app:
   ```
   npm run dev
   ```

## Scripts

- `npm run dev` — servidor de desarrollo en el puerto 3000
- `npm run build` — build de producción en `dist/`
- `npm run preview` — sirve el build de producción
- `npm run lint` — verificación de tipos con TypeScript
