// Script de un solo uso: extrae los team-ups del bundle oficial de marvelrivals.com
// y descarga todas las imágenes a assets/teamups/img/
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

const src = readFileSync(process.argv[2], 'utf8');

// 1. Base URL del CDN
const base = src.match(/a\.p="(https:\/\/[^"]+)"/)[1];

// 2. Mapa de módulos webpack: id -> ruta de imagen
const moduleMap = {};
for (const m of src.matchAll(/(\d+):\(e,p,a\)=>\{e\.exports=a\.p\+"([^"]+)"\}/g)) {
  moduleMap[m[1]] = m[2];
}

// 3. Array de datos: desde "const n=[" hasta el cierre del array
const start = src.indexOf('const n=[');
const tail = src.slice(start + 8);
let depth = 0, end = 0;
for (let i = 0; i < tail.length; i++) {
  if (tail[i] === '[') depth++;
  else if (tail[i] === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
}
const arrayLiteral = tail.slice(0, end);

// 4. Evaluar el literal con a() resolviendo a la ruta de imagen
const a = (id) => moduleMap[String(id)] || null;
const data = new Function('a', `return ${arrayLiteral};`)(a);

// 5. Normalizar: nombre de archivo local + URL completa
const fileOf = (p) => (p ? p.split('/').pop() : null);
const teamups = data.map(t => ({
  id: t.id,
  enName: t.enName,
  enNameFull: t.enNameFull,
  cnName: t.cnName,
  cnNameFull: t.cnNameFull,
  cnTeamName: t.cnteamname,
  images: {
    list: fileOf(t.lbimg),
    listActive: fileOf(t.lbimgActive),
    detailBig: fileOf(t.teambig) || fileOf(t.lbimg),
  },
  partners: (t.headers || []).map(h => ({
    portrait: fileOf(h.headerImg),
    skillIcon: fileOf(h.iconImg),
  })),
}));

mkdirSync('assets/teamups/img', { recursive: true });
writeFileSync('assets/teamups/teamups.json', JSON.stringify({
  source: 'https://www.marvelrivals.com/heroes/teamup.html',
  cdnBase: base,
  extractedAt: new Date().toISOString().slice(0, 10),
  note: 'La página oficial no publica descripciones de los team-ups, solo nombres e imágenes. partners[].portrait = héroe aliado, partners[].skillIcon = ícono de la habilidad team-up.',
  teamups,
}, null, 2));

// 6. Descargar todas las imágenes del mapa de módulos
const urls = [...new Set(Object.values(moduleMap))].filter(p => /\.(png|jpg)$/i.test(p));
console.log(`descargando ${urls.length} imágenes...`);
let ok = 0, fail = 0;
for (const p of urls) {
  const name = fileOf(p);
  try {
    execSync(`curl -sfL "${base}${p}" -o "assets/teamups/img/${name}"`, { stdio: 'pipe' });
    ok++;
  } catch {
    fail++;
    console.log('falló:', p);
  }
}
console.log(`listo: ${ok} descargadas, ${fail} fallidas, ${teamups.length} teamups en teamups.json`);
