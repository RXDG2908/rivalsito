# Assets HD de rivalskins.com

Assets de mayor calidad extraídos de https://rivalskins.com (costume **default** de cada héroe),
para futuras versiones de Rivalsito. Un archivo por héroe (`<slug>.png`, slug de rivalskins).

## Carpetas

| Carpeta | Contenido | Tamaño aprox. |
|---------|-----------|---------------|
| `emblems/` | Emblema/logo del héroe en **Full HD y con su color correcto** (fondo transparente) | ~0.4 MB c/u |
| `sprays/` | Spray del héroe en Full HD (retrato en marco circular) | ~0.9 MB c/u |
| `fullbody/` | Render de cuerpo completo en **Full HD** (default). No todos los héroes tienen. | 8–30 MB c/u ⚠️ |

## ⚠️ Nota sobre `fullbody/` y Git

Los renders de cuerpo completo son enormes (Full HD real, p. ej. 3414×6205). En conjunto
superan los ~500 MB, demasiado para un repositorio Git normal / GitHub. Por eso:

- `emblems/` y `sprays/` **sí** se versionan en Git.
- `fullbody/` está en `.gitignore` (se guarda **solo en local**). Para respaldarlos:
  Git LFS, o subirlos como un `.zip` en un GitHub Release.

## Re-extraer

```
node scripts/extract-rivalskins.mjs "$(node -e "…lista de slugs…")"
```
El script lee el JSON `data-views` de cada página de item y descarga:
`costume-default → vista full` (cuerpo completo), `emblema/spray → vista full_hd`.
