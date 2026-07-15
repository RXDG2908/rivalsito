// Descarga el render de cuerpo completo (PNG transparente) de cada héroe desde
// su artículo oficial. El full-body es la imagen vertical con transparencia y
// mayor altura del artículo (las de fondo son horizontales; el resto, íconos).
// Uso: node scripts/extract-fullbody.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const OUT = 'assets/heroes-full';
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (rivalsito-extractor)' } };
const data = JSON.parse(readFileSync('assets/heroes-data/heroes.json', 'utf8'));
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

let ok = 0, fail = 0;
for (const hero of data.heroes) {
  if (!hero.articleUrl) { fail++; continue; }
  try {
    const html = await (await fetch(hero.articleUrl, UA)).text();
    const art = html.slice(html.indexOf('artText'), html.indexOf('go-top'));
    const urls = [...new Set([...art.matchAll(/<img[^>]*src="(https?:[^"]+\.png)"/g)].map(m => m[1]))];

    let best = null, bestH = 0;
    for (const url of urls) {
      try {
        const buf = Buffer.from(await (await fetch(url, UA)).arrayBuffer());
        const m = await sharp(buf).metadata();
        // full-body: vertical, con transparencia, ancho decente
        if (m.hasAlpha && m.width >= 400 && m.height > m.width * 1.25 && m.height > bestH) {
          best = buf; bestH = m.height;
        }
      } catch { /* imagen ilegible, ignorar */ }
    }

    if (best) {
      writeFileSync(`${OUT}/${hero.slug}.png`, best);
      ok++;
      console.log(`${hero.slug}: ${bestH}px`);
    } else {
      fail++;
      console.log(`${hero.slug}: SIN full-body`);
    }
  } catch (e) {
    fail++;
    console.log(`${hero.slug}: FALLÓ ${e.message}`);
  }
  await sleep(100);
}
console.log(`\nlisto: ${ok} renders, ${fail} fallidos`);
