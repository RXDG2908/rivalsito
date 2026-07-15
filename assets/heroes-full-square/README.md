# Renders de cuerpo completo — recortados a cuadrado 1:1

Versión recortada de los renders oficiales de `assets/heroes-full/` (los 52 héroes).
A cada imagen se le quitó el espacio transparente sobrante y se centró al personaje
en un lienzo **cuadrado 1:1**, sin cortar nada.

- Un archivo por héroe: `<slug>.png`, fondo transparente
- Lado del cuadrado = dimensión mayor del personaje (siempre el alto), rellenando
  el ancho de forma simétrica → el personaje nunca se recorta
- Ideal para tarjetas/avatares de proporción cuadrada

> Regenerar desde los originales: `node scripts/crop-fullbody-square.mjs`
