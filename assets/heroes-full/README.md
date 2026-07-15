# Renders de cuerpo completo (extraído de marvelrivals.com)

Render oficial de cuerpo completo de los **52 héroes**, en PNG con fondo transparente:
exactamente la ilustración que la web muestra en la **página de detalle** del héroe
(`.hero-details .jyImg`) en https://www.marvelrivals.com/heroes/index.html

- Un archivo por héroe: `<slug>.png` (mismo `slug` que en `assets/heroes-data/heroes.json`)
- Es la 5ª imagen (índice 4) de la tabla `table.tableImg` del artículo de cada héroe,
  que es de donde el propio sitio toma el render de detalle (≈1337×1079, transparente)

Materia prima para futuras versiones de Rivalsito (pantalla de héroe, fondo de tarjeta, etc.).

> Para re-extraer cuando salga una temporada nueva: `node scripts/extract-fullbody.mjs`
