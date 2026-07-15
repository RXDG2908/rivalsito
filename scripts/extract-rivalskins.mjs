// Descarga desde rivalskins.com, por cada héroe (costume DEFAULT):
//  - emblema Full HD  -> assets/rivalskins/emblems/<hero>.png
//  - cuerpo completo   -> assets/rivalskins/fullbody/<hero>.png  (no todos tienen)
//  - spray Full HD     -> assets/rivalskins/sprays/<hero>.png
// Cada item expone un JSON data-views con las URLs; usamos:
//  costume-default -> vista "full" (cuerpo completo) ; emblema/spray -> "full_hd".
// Uso: node scripts/extract-rivalskins.mjs
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const BASE = 'https://rivalskins.com';
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (rivalsito-extractor)' } };
const OUT = 'assets/rivalskins';
for (const d of ['emblems', 'fullbody', 'sprays']) mkdirSync(`${OUT}/${d}`, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const get = async (url) => (await fetch(url, UA)).text();

const HEROES = JSON.parse(process.argv[2] || '[]');

const parseDataViews = (html, itemId) => {
  // localizar el bloque del item correcto (por id) y su data-views
  const re = new RegExp(`data-views="([^"]+)"`, 'g');
  let m, best = null;
  // el item page tiene un único data-views principal
  m = re.exec(html);
  if (!m) return null;
  try {
    return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  } catch { return null; }
};

const download = async (url, dest) => {
  const res = await fetch(url, UA);
  if (!res.ok) throw new Error(res.status);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
};

let stats = { emblem: 0, full: 0, spray: 0, noFull: [] };
for (const hero of HEROES) {
  try {
    const heroHtml = await get(`${BASE}/hero/${hero}/`);
    const idBySlug = {};
    for (const mm of heroHtml.matchAll(/\/item\/(\d+)\/([a-z0-9-]+)\//g)) idBySlug[mm[2]] = mm[1];
    const slugs = Object.keys(idBySlug);

    // emblema = único item cuyo slug termina en "-emblem"; el spray del héroe es
    // ese mismo slug sin "-emblem" (comparten el nombre base, p.ej. cloak-dagger)
    const emblemSlug = slugs.find(s => /-spray-.+-emblem$/.test(s));
    const spraySlug = emblemSlug ? emblemSlug.replace(/-emblem$/, '') : `${hero}-spray-${hero}`;

    const targets = {
      full:   `${hero}-costume-default`,
      emblem: emblemSlug,
      spray:  spraySlug,
    };

    for (const [kind, slug] of Object.entries(targets)) {
      const dir = kind === 'full' ? 'fullbody' : kind === 'emblem' ? 'emblems' : 'sprays';
      const dest = `${OUT}/${dir}/${hero}.png`;
      if (existsSync(dest)) { stats[kind]++; continue; } // ya descargado: no re-bajar
      try {
        const id = slug && idBySlug[slug];
        if (!id) { if (kind === 'full') stats.noFull.push(hero); continue; }
        const views = parseDataViews(await get(`${BASE}/item/${id}/${slug}/`));
        if (!views) continue;
        // cuerpo completo -> vista "full"; emblema/spray -> "full_hd" (deben tener url no vacía)
        const url = (kind === 'full' ? views.full?.url : (views.full_hd?.url || views.full?.url)) || '';
        if (!url) { if (kind === 'full') stats.noFull.push(hero); continue; }
        await download(BASE + url, dest);
        stats[kind]++;
        await sleep(60);
      } catch (e) {
        console.log(`  ${hero}/${kind}: FALLÓ ${e.message}`);
      }
    }
    console.log(`${hero}: ok`);
  } catch (e) {
    console.log(`${hero}: FALLÓ ${e.message}`);
  }
  await sleep(120);
}
console.log(`\nemblemas: ${stats.emblem}  cuerpo completo: ${stats.full}  sprays: ${stats.spray}`);
if (stats.noFull.length) console.log('sin full body:', [...new Set(stats.noFull)].join(', '));
