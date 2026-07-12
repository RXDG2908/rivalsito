# Team-Ups (extraído de marvelrivals.com)

Datos e imágenes de los **28 team-ups** oficiales, extraídos de
https://www.marvelrivals.com/heroes/teamup.html para usarse en futuras versiones de Rivalsito.

## Archivos

- `teamups.json` — datos estructurados de cada team-up
- `img/` — las 169 imágenes PNG originales del sitio oficial

## Estructura de `teamups.json`

Cada entrada representa un team-up con su **héroe ancla** (el que otorga la habilidad):

| Campo | Descripción |
|-------|-------------|
| `enName` / `enNameFull` | Nombre del héroe ancla (inglés) |
| `cnName` / `cnNameFull` | Nombre en chino (dato original del sitio) |
| `images.list` | Tarjeta del héroe ancla (arte del carrusel) |
| `images.listActive` | Variante de la tarjeta al pasar el mouse |
| `partners[]` | Héroes aliados del team-up |
| `partners[].portrait` | Retrato del héroe aliado (`headerN-M_*.png`) |
| `partners[].skillIcon` | Ícono de la habilidad team-up (`iconN-M_*.png`) |

## Convención de nombres en `img/`

- `pN_*.png` / `pN-active_*.png` — tarjeta del team-up N (normal / hover)
- `headerN-M_*.png` — retrato del aliado M del team-up N
- `iconN-M_*.png` — ícono de habilidad del aliado M del team-up N

> Notas:
> - La página oficial **no publica descripciones** de los team-ups (el campo de texto llega vacío);
>   solo nombres e imágenes.
> - El sitio no identifica por nombre a los aliados: su identidad está en el retrato.
>   Retratos con el mismo hash en el nombre de archivo son el mismo héroe.
> - Para re-extraer cuando salga una temporada nueva: `node scripts/extract-teamups.mjs <teamup.js>`
>   (descarga el bundle actual desde la página y pásale la ruta).
