// Genera src/data/teamups.ts: para cada héroe, sus compañeros DIRECTOS de team-up
// y el ícono oficial (azul) de la combinación en que participa. Copia los íconos a
// public/teamups/. Fuentes: assets/teamups/teamups.json (íconos oficiales por combo)
// + assets/heroes-data/heroes.json (relaciones de team-up por héroe).
// Uso: node scripts/generate-teamup-combos.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'fs';

const combos = JSON.parse(readFileSync('assets/teamups/teamups.json', 'utf8')).teamups;
const heroesData = JSON.parse(readFileSync('assets/heroes-data/heroes.json', 'utf8')).heroes;
const heroesTs = readFileSync('src/data/heroes.ts', 'utf8');

const roster = [...heroesTs.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)]
  .map(m => ({ id: m[1], name: m[2] }));
const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const alias = { jubilationlee: 'jubilee', jeffthelandshark: 'jeff', devildinosaur: 'devildino' };
const idByNorm = {};
for (const r of roster) idByNorm[norm(r.name)] = r.id;
const toId = name => idByNorm[norm(name)] || idByNorm[alias[norm(name)]] || null;
const nameById = Object.fromEntries(roster.map(r => [r.id, r.name]));

const partnerOf = (t) => {
  const desc = (t.baseEffect?.description || '') + ' ' + (t.enhancedEffect?.description || '');
  const m = /teaming up with ([^,.]+)/i.exec(desc);
  return m ? m[1].trim() : null;
};

// 1. Grafo NO dirigido de compañeros: A-B si A o B nombra al otro en un team-up
const neighbors = {};
const link = (a, b) => {
  if (!a || !b || a === b) return;
  (neighbors[a] = neighbors[a] || new Set()).add(b);
  (neighbors[b] = neighbors[b] || new Set()).add(a);
};
for (const h of heroesData) {
  const hid = toId(h.name);
  if (!hid) continue;
  for (const t of h.teamups || []) {
    const pid = toId(partnerOf(t));
    if (pid) link(hid, pid);
  }
}

// 2. Ícono oficial (azul) por ancla de combo
rmSync('public/teamups', { recursive: true, force: true });
mkdirSync('public/teamups', { recursive: true });
const iconByAnchor = {};
for (const c of combos) {
  const anchorId = toId(c.enName);
  const iconSrc = c.partners?.[0]?.skillIcon;
  if (anchorId && iconSrc) {
    const out = `${anchorId}-teamup.png`;
    copyFileSync(`assets/teamups/img/${iconSrc}`, `public/teamups/${out}`);
    iconByAnchor[anchorId] = `./teamups/${out}`;
  }
}

// 3. Por héroe: compañeros directos + ícono del combo relevante
//    (su propio combo si es ancla; si no, el de un compañero que sea ancla)
const byHero = {};
const uncovered = [];
for (const r of roster) {
  const nb = [...(neighbors[r.id] || [])];
  if (nb.length === 0) { uncovered.push(r.id); continue; }
  let icon = iconByAnchor[r.id] || null;
  if (!icon) {
    const anchorNb = nb.find(id => iconByAnchor[id]);
    icon = anchorNb ? iconByAnchor[anchorNb] : null;
  }
  const partners = nb.map(id => nameById[id]).filter(Boolean).sort();
  byHero[r.id] = { icon, partners };
  if (!icon) uncovered.push(r.id);
}

const body = Object.entries(byHero).map(([id, v]) => {
  const key = /^[a-z][a-z0-9]*$/.test(id) ? id : `'${id}'`;
  return `  ${key}: { icon: ${JSON.stringify(v.icon)}, partners: [${v.partners.map(p => JSON.stringify(p)).join(', ')}] },`;
}).join('\n');

const out = `// Generado por scripts/generate-teamup-combos.mjs — no editar a mano.
// Team-ups oficiales de marvelrivals.com/heroes/teamup.html.
// Por cada héroe: compañeros directos de team-up + ícono oficial del combo.
import type { HeroTeamUp } from '../types';

export const TEAMUPS_BY_HERO: Record<string, HeroTeamUp> = {
${body}
};
`;
writeFileSync('src/data/teamups.ts', out);

console.log(`héroes con team-up: ${Object.keys(byHero).length}/${roster.length}`);
if (uncovered.length) console.log('sin combo/ícono:', uncovered.join(', '));
