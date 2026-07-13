// Genera src/data/teamups.ts y copia los íconos de team-up a public/teamups/
// a partir de assets/heroes-data/heroes.json (extraído del sitio oficial).
// Uso: node scripts/generate-teamups.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';

const data = JSON.parse(readFileSync('assets/heroes-data/heroes.json', 'utf8'));
const heroesTs = readFileSync('src/data/heroes.ts', 'utf8');

// Roster de la app: id + name desde src/data/heroes.ts
const roster = [...heroesTs.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)]
  .map(m => ({ id: m[1], name: m[2] }));

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

mkdirSync('public/teamups', { recursive: true });

const lines = [];
const unmatched = [];
for (const hero of data.heroes) {
  const key = norm(hero.name || hero.displayName);
  const app = roster.find(r => norm(r.name) === key);
  if (!app) { unmatched.push(hero.slug); continue; }

  const entries = [];
  for (const tu of hero.teamups || []) {
    if (!tu.icon) continue;
    const destName = `${app.id}-${slugify(tu.name)}.png`;
    copyFileSync(`assets/heroes-data/${tu.icon}`, `public/teamups/${destName}`);
    // Compañero: "When teaming up with X," dentro de la descripción
    const m = /teaming up with ([^,.]+)[,.]/i.exec(tu.baseEffect?.description || '');
    const partner = m ? m[1].trim() : null;
    entries.push({ name: tu.name, icon: `./teamups/${destName}`, partner });
  }
  const items = entries.map(e =>
    `    { name: ${JSON.stringify(e.name)}, icon: ${JSON.stringify(e.icon)}${e.partner ? `, partner: ${JSON.stringify(e.partner)}` : ''} }`
  ).join(',\n');
  lines.push(`  ${app.id.includes('-') ? `'${app.id}'` : app.id}: [\n${items},\n  ],`);
}

const out = `// Generado por scripts/generate-teamups.mjs — no editar a mano.
// Fuente: assets/heroes-data/heroes.json (marvelrivals.com, ${data.extractedAt})
import type { TeamUp } from '../types';

export const TEAMUPS: Record<string, TeamUp[]> = {
${lines.join('\n')}
};
`;
writeFileSync('src/data/teamups.ts', out);
console.log(`teamups.ts generado: ${lines.length} héroes${unmatched.length ? ' | SIN MAPEAR: ' + unmatched.join(', ') : ''}`);
