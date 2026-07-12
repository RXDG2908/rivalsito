// Extrae la información completa de héroes (habilidades, stats, team-ups e imágenes)
// desde marvelrivals.com/heroes/index.html y las páginas de detalle de cada héroe.
// Uso: node scripts/extract-heroes.mjs
// Requiere: npm i --no-save cheerio
import * as cheerio from 'cheerio';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT = 'assets/heroes-data';
const INDEX_URL = 'https://www.marvelrivals.com/heroes/index.html';
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (rivalsito-extractor)' } };

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, UA);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const downloads = new Map(); // url -> ruta local relativa
function queueImage(url, localPath) {
  if (!url) return null;
  if (downloads.has(url)) return downloads.get(url);
  downloads.set(url, localPath);
  return localPath;
}

// Extrae pares clave/valor de una tabla anidada de stats
function parseStats($, td) {
  const stats = {};
  $(td).find('table tr').each((_, tr) => {
    const cells = $(tr).children('td');
    if (cells.length >= 2) {
      const k = $(cells[0]).text().trim();
      const v = $(cells[1]).text().trim();
      if (k) stats[k] = v;
    }
  });
  return stats;
}

function parseHeroArticle(html, slug) {
  const $ = cheerio.load(html);
  const art = $('.artText').first();
  const hero = {
    name: art.find('.p1').first().text().trim(),
    fullName: art.find('.p2').first().text().trim(),
    role: art.find('.p3').first().text().trim(),
    description: art.find('.p4').first().text().trim(),
    lore: art.find('.d1').first().text().trim().replace(/\s*\n\s*/g, '\n'),
    stats: {},
    colorBlocks: [],
    abilities: [],
    teamups: [],
  };

  const rows = art.find('table.table-imgs').first().children('tbody').children('tr');
  let inTeamups = false;
  const rawTeamupRows = [];

  rows.each((_, tr) => {
    const tds = $(tr).children('td');
    const label = $(tds[0]).text().trim();
    const name = $(tds[1]).text().trim();

    if (name === '占位空格' || name === '') { // separador de sección
      if (label === '4' || name === '占位空格') inTeamups = true;
      return;
    }

    if (label === '0') {
      // Fila cabecera del héroe: stats base + bloques de color
      tds.each((_, td) => {
        const nested = parseStats($, td);
        if (Object.keys(nested).length) Object.assign(hero.stats, nested);
      });
      tds.each((i2, td) => {
        const img = $(td).children('img').attr('src');
        if (img) {
          const local = queueImage(img, `img/${slug}/color-block-${hero.colorBlocks.length + 1}.png`);
          if (local && !hero.colorBlocks.includes(local)) hero.colorBlocks.push(local);
        }
      });
      return;
    }

    // Fila de habilidad o team-up: [label, nombre, ícono, descripción, stats]
    const icon = $(tds[2]).find('img').attr('src') || $(tds[1]).find('img').attr('src') || null;
    let description = '';
    let stats = {};
    tds.each((i2, td) => {
      if (i2 < 2) return;
      const hasTable = $(td).find('table').length > 0;
      const text = $(td).clone().children('table').remove().end().text().trim();
      if (hasTable) Object.assign(stats, parseStats($, td));
      else if (text && text !== '' && !description && !$(td).find('img').length) description = text;
    });

    const entry = { name, icon, description, stats };
    if (inTeamups) rawTeamupRows.push(entry);
    else {
      const local = queueImage(icon, `img/${slug}/ability-${hero.abilities.length + 1}-${slugify(name)}.png`);
      hero.abilities.push({ slot: label, name, icon: local, description, stats });
    }
  });

  // Los team-ups vienen en pares consecutivos: efecto base + efecto mejorado
  for (let i = 0; i < rawTeamupRows.length; i++) {
    const row = rawTeamupRows[i];
    const next = rawTeamupRows[i + 1];
    const localIcon = queueImage(row.icon, `img/${slug}/teamup-${slugify(row.name)}.png`);
    const teamup = {
      name: row.name,
      icon: localIcon,
      baseEffect: { description: row.description, stats: row.stats },
      enhancedEffect: null,
    };
    if (next && next.name === row.name) {
      teamup.enhancedEffect = { description: next.description, stats: next.stats };
      i++;
    }
    hero.teamups.push(teamup);
  }

  return hero;
}

// ---- main ----
const indexHtml = await fetchText(INDEX_URL);
const $i = cheerio.load(indexHtml);
const anchors = $i('.heroNewsList a').toArray();
console.log(`héroes encontrados: ${anchors.length}`);

const heroes = [];
for (const a of anchors) {
  const $a = $i(a);
  const title = $a.attr('title') || $a.attr('data-name');
  const slug = slugify($a.attr('data-name') || title);
  const articleUrl = $a.attr('data-url');
  const cardImages = [];
  $a.find('img').each((n, img) => {
    const src = $i(img).attr('src');
    const local = queueImage(src, `img/${slug}/card-${n + 1}.png`);
    if (local) cardImages.push(local);
  });

  process.stdout.write(`${slug}... `);
  try {
    const html = await fetchText(articleUrl);
    const detail = parseHeroArticle(html, slug);
    heroes.push({
      id: $a.attr('data-id'),
      slug,
      displayName: title,
      roleTag: $a.attr('data-tag'),
      articleUrl,
      cardImages,
      ...detail,
    });
    console.log(`ok (${detail.abilities.length} habilidades, ${detail.teamups.length} team-ups)`);
  } catch (e) {
    console.log('FALLÓ:', e.message);
    heroes.push({ id: $a.attr('data-id'), slug, displayName: title, roleTag: $a.attr('data-tag'), articleUrl, cardImages, error: e.message });
  }
  await sleep(120);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'heroes.json'), JSON.stringify({
  source: INDEX_URL,
  extractedAt: new Date().toISOString().slice(0, 10),
  note: 'teamups[].baseEffect / enhancedEffect según la ficha oficial de cada héroe. Las rutas de imagen son relativas a assets/heroes-data/.',
  heroes,
}, null, 2));

console.log(`\ndescargando ${downloads.size} imágenes...`);
let ok = 0, fail = 0;
for (const [url, local] of downloads) {
  try {
    const res = await fetch(url, UA);
    if (!res.ok) throw new Error(res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = join(OUT, local);
    mkdirSync(join(dest, '..'), { recursive: true });
    writeFileSync(dest, buf);
    ok++;
  } catch (e) {
    fail++;
    console.log('imagen falló:', url, e.message);
  }
  await sleep(30);
}
console.log(`listo: ${heroes.length} héroes, ${ok} imágenes descargadas, ${fail} fallidas`);
