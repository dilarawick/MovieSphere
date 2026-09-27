import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__d, '..', 'data');
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
const files = ['seedBulkComedy.js','seedBulkHorror1.js','seedBulkHorror2.js','seedBulkFamily.js','seedBulkThriller.js','seedPublicDomain.js','seedSinhala.js','seed2026a.js','seed2026real1.js','seed2026real2.js','seed2026real3.js','seed2026real4.js','seedEnglishMore.js','seedBulkBig2.js'];
const re1 = /\btmdbId:\s*(\d+)[\s\S]{0,120}?title:\s*'([^']+)'/g;
const re2 = /\[(\d{4,8}),\s*'([^']+)'/g;
let pairs = [];
for (const f of files) {
  try {
    const t = fs.readFileSync(path.join(dataDir, f), 'utf8');
    for (const m of t.matchAll(re1)) pairs.push([m[1], m[2], f]);
    for (const m of t.matchAll(re2)) pairs.push([m[1], m[2], f]);
  } catch(e) { console.log('skip '+f+' '+e.message); }
}
// TV ids live in this set — check against /tv instead of /movie
const TV = new Set(['66732','119051','100088','94997','91769','1396']);
console.log('CHECKING '+pairs.length+' ids');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [id, title, f] of pairs) {
  try {
    const kind = TV.has(id) ? 'tv' : 'movie';
    const r = await fetch('https://api.themoviedb.org/3/'+kind+'/'+id+'?api_key='+KEY);
    const j = await r.json();
    const nm = j.title || j.name;
    const norm = (s) => (s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const ok = nm && (norm(nm).includes(norm(title).slice(0,6)) || norm(title).includes(norm(nm).slice(0,6)));
    const flag = (!nm || j.status_code === 34) ? 'NOTFOUND' : (j.adult ? 'ADULT!!!' : (ok ? 'ok' : 'MISMATCH'));
    console.log(flag+' | seed['+title+'] ('+f+') id='+id+' => TMDB['+(nm||j.status_message)+'] adult='+j.adult+' p='+j.poster_path+' b='+j.backdrop_path);
  } catch(e) { console.log('ERR '+id+' '+title); }
  await sleep(110);
}
