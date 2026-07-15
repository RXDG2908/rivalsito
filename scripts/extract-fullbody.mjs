// Descarga el render de cuerpo completo de la PÁGINA DE DETALLE de cada héroe
// (el que marvelrivals.com/heroes/index.html muestra en .hero-details .jyImg).
// El sitio lo toma de la 5ª imagen (índice 4) de la tabla `table.tableImg` del
// artículo del héroe; replicamos esa misma lógica -> exacto para héroes viejos y nuevos.
// Uso: node scripts/extract-fullbody.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';

const OUT = 'assets/heroes-full';
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (rivalsito-extractor)' } };
const DETAIL_RENDER_INDEX = 4; // == jyImg eq(1) en el JS oficial del sitio
const data = JSON.parse(readFileSync('assets/heroes-data/heroes.json', 'utf8'));
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const detailRenderUrl = (html) => {
  const ti = html.indexOf('class="tableImg"');
  if (ti < 0) return null;
  const seg = html.slice(ti, html.indexOf('</table>', ti));
  const imgs = [...seg.matchAll(/<img[^>]*src="(https?:[^"]+\.png)"/g)].map(m => m[1]);
  return imgs[DETAIL_RENDER_INDEX] || null;
};

let ok = 0, fail = 0;
for (const hero of data.heroes) {
  if (!hero.articleUrl) { fail++; console.log(`${hero.slug}: sin articleUrl`); continue; }
  try {
    const html = await (await fetch(hero.articleUrl, UA)).text();
    const url = detailRenderUrl(html);
    if (!url) { fail++; console.log(`${hero.slug}: SIN tableImg`); continue; }
    const buf = Buffer.from(await (await fetch(url, UA)).arrayBuffer());
    writeFileSync(`${OUT}/${hero.slug}.png`, buf);
    ok++;
    console.log(`${hero.slug}: ${url.split('/').pop()}`);
  } catch (e) {
    fail++;
    console.log(`${hero.slug}: FALLÓ ${e.message}`);
  }
  await sleep(100);
}
console.log(`\nlisto: ${ok} renders, ${fail} fallidos`);
