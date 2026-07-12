# Datos de héroes (extraído de marvelrivals.com)

Fichas completas de los **52 héroes** oficiales, extraídas de
https://www.marvelrivals.com/heroes/index.html y las páginas de detalle de cada héroe.
Materia prima para futuras versiones de Rivalsito (ej. team-up aleatorio en el sorteo,
ver `docs/funcion-teamup-aleatorio.md`).

## Archivos

- `heroes.json` — datos estructurados de los 52 héroes
- `img/<slug>/` — 965 imágenes PNG organizadas por héroe

## Estructura de cada héroe en `heroes.json`

| Campo | Descripción |
|-------|-------------|
| `id` | UUID oficial del héroe (el de `?heroId=` en la web) |
| `slug` | Identificador legible (ej. `hulk`, `jeff-the-land-shark`) |
| `name` / `fullName` | Nombre de héroe y nombre real (ej. JUBILEE / JUBILATION LEE) |
| `roleTag` | VANGUARD / DUELIST / STRATEGIST |
| `description` | Descripción corta oficial |
| `lore` | Historia del héroe |
| `stats` | Salud, velocidad de movimiento, etc. |
| `abilities[]` | Habilidades: `slot`, `name`, `icon`, `description`, `stats` (tecla, daño, cooldown…) |
| `teamups[]` | **Team-ups del héroe (todos tienen 2)** |
| `cardImages[]` | Las 4 imágenes de tarjeta/retrato del selector |
| `colorBlocks[]` | Bloques de color decorativos de la ficha |

## Team-ups (`teamups[]`)

Cada team-up incluye:

- `name` — nombre oficial (ej. "SAVAGE SLAM", "COSMIC CYCLONE")
- `icon` — **logo personalizado del team-up** (PNG con transparencia,
  el que debe mostrarse en la esquina de la tarjeta al sortear)
- `baseEffect` — descripción y stats del efecto base
- `enhancedEffect` — stats del efecto mejorado (al jugar con el compañero indicado);
  el compañero aparece nombrado dentro de la descripción ("When teaming up with X…")

## Imágenes por héroe (`img/<slug>/`)

- `card-1..4.png` — retratos/tarjetas del selector de héroes
- `ability-N-<nombre>.png` — ícono de cada habilidad
- `teamup-<nombre>.png` — logo de cada team-up
- `color-block-N.png` — bloques decorativos de la ficha oficial

> Para re-extraer cuando salga una temporada nueva:
> `npm i --no-save cheerio && node scripts/extract-heroes.mjs`
