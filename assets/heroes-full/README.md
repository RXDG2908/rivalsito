# Renders de cuerpo completo (extraído de marvelrivals.com)

Render oficial de cuerpo completo de los **52 héroes**, en PNG con fondo transparente,
extraído de la ficha de cada héroe en https://www.marvelrivals.com/heroes/index.html

- Un archivo por héroe: `<slug>.png` (mismo `slug` que en `assets/heroes-data/heroes.json`)
- Resolución vertical alta (≈750×1624 a 750×2403), fondo transparente
- Incluye el aro/decoración dorada detrás del personaje tal como en la web oficial

Materia prima para futuras versiones de Rivalsito (pantalla de héroe, fondo de tarjeta, etc.).

> Para re-extraer cuando salga una temporada nueva: `node scripts/extract-fullbody.mjs`
