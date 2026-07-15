// Empareja cada ícono actual de team-up (public/teamups) con su versión de alta
// calidad (assets/teamups/img/iconN-M) por similitud visual, resolviendo el mapeo
// sin depender de nombres. Solo reporta; no modifica nada.
import sharp from 'sharp';
import { readdirSync } from 'fs';

const N = 32;
async function signature(path) {
  // Aplana sobre fondo negro, escala de grises NxN, normaliza contraste
  const buf = await sharp(path)
    .flatten({ background: '#000' })
    .resize(N, N, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();
  const px = [...buf];
  const min = Math.min(...px), max = Math.max(...px);
  const range = max - min || 1;
  return px.map(v => (v - min) / range);
}

const mse = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; }
  return s / a.length;
};

const current = readdirSync('public/teamups').filter(f => f.endsWith('.png'));
const candidates = readdirSync('assets/teamups/img').filter(f => /^icon\d+-\d+_/.test(f));

const candSig = {};
for (const c of candidates) candSig[c] = await signature(`assets/teamups/img/${c}`);

const results = [];
for (const cur of current) {
  const sig = await signature(`public/teamups/${cur}`);
  let best = null, bestD = Infinity, second = Infinity;
  for (const c of candidates) {
    const d = mse(sig, candSig[c]);
    if (d < bestD) { second = bestD; bestD = d; best = c; }
    else if (d < second) { second = d; }
  }
  results.push({ cur, best, dist: bestD, margin: second - bestD });
}

results.sort((a, b) => b.dist - a.dist);
console.log('PEORES coincidencias (mayor distancia = menos parecido):');
results.slice(0, 12).forEach(r => console.log(`  ${r.dist.toFixed(4)}  ${r.cur} -> ${r.best}`));
console.log('\nMEJORES coincidencias:');
results.slice(-6).forEach(r => console.log(`  ${r.dist.toFixed(4)}  ${r.cur} -> ${r.best}`));
const dists = results.map(r => r.dist).sort((a, b) => a - b);
console.log(`\ntotal:${results.length}  mediana:${dists[dists.length>>1].toFixed(4)}  max:${dists[dists.length-1].toFixed(4)}`);
