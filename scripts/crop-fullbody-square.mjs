// Recorta el espacio transparente sobrante de cada render de cuerpo completo
// (assets/heroes-full) y centra al personaje en un lienzo cuadrado 1:1, sin
// cortar nada. Salida: assets/heroes-full-square/ (no toca los originales).
// Uso: node scripts/crop-fullbody-square.mjs [archivo-suelto-opcional]
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';

const IN = 'assets/heroes-full';
const OUT = 'assets/heroes-full-square';
mkdirSync(OUT, { recursive: true });

const files = process.argv[2] ? [process.argv[2]] : readdirSync(IN).filter(f => f.endsWith('.png'));

let ok = 0;
for (const f of files) {
  // 1. Recortar bordes transparentes -> caja mínima que rodea al personaje
  const { data, info } = await sharp(`${IN}/${f}`)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .toBuffer({ resolveWithObject: true });

  // 2. Padear simétricamente hasta cuadrado (lado = dimensión mayor), centrado
  const size = Math.max(info.width, info.height);
  const left = Math.floor((size - info.width) / 2);
  const right = size - info.width - left;
  const top = Math.floor((size - info.height) / 2);
  const bottom = size - info.height - top;

  await sharp(data)
    .extend({ top, bottom, left, right, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`${OUT}/${f}`);

  ok++;
  console.log(`${f}: ${info.width}x${info.height} -> ${size}x${size}`);
}
console.log(`\nlisto: ${ok} imágenes recortadas a cuadrado`);
