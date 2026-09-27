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
const files = ['seedBulkBig.js','seedBulkBig2.js','seedBulkFinal.js','seedBulkFamily.js','seedBulkThriller.js','seedBulkHorror1.js','seedBulkHorror2.js'];
const re2 = /\[(\d{4,8}),\s*'([^']+)'/g;
let pairs = [];
for (const f of files) {
  const t = fs.readFileSync(path.join(dataDir, f), 'utf8');
  for (const m of t.matchAll(re2)) pairs.push([m[1], m[2], f]);
}
const seen = new Set(); pairs = pairs.filter(([id]) => !seen.has(id) && seen.add(id));
console.log('CHECKING '+pairs.length+' ids');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [id, title, f] of pairs) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/movie/'+id+'?api_key='+KEY);
    const j = await r.json();
    const norm = (s) => (s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const ok = j.title && (norm(j.title).includes(norm(title).slice(0,6)) || norm(title).includes(norm(j.title).slice(0,6)));
    const flag = (!j.title || j.status_code === 34) ? 'NOTFOUND' : (j.adult ? 'ADULT!!!' : (ok ? 'ok' : 'MISMATCH'));
    console.log(flag+' | seed['+title+'] ('+f+') id='+id+' => TMDB['+(j.title||j.status_message)+'] p='+j.poster_path);
  } catch(e) { console.log('ERR '+id+' '+title); }
  await sleep(110);
}
