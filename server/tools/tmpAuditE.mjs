import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Wish (Disney 2023) correct id?
let u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=Wish&year=2023&include_adult=false';
let r = await fetch(u); let j = await r.json();
console.log('=== Wish 2023 ===');
(j.results || []).slice(0, 4).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
await sleep(120);
// Sonic 3 poster check
r = await fetch('https://api.themoviedb.org/3/movie/939243?api_key=' + KEY);
j = await r.json();
console.log('Sonic3 => ' + j.title + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
await sleep(120);
// Remaining unchecked seed ids
const files = ['seedBulkHorror1.js', 'seedBulkHorror2.js', 'seedBulkFamily.js', 'seedBulkThriller.js', 'seedPublicDomain.js', 'seedSinhala.js'];
const dataDir = path.join(__d, '..', 'data');
const re1 = /\btmdbId:\s*(\d+)[\s\S]{0,120}?title:\s*'([^']+)'/g;
const re2 = /\[(\d{3,8}),\s*'([^']+)'/g;
let pairs = [];
for (const f of files) {
  const t = fs.readFileSync(path.join(dataDir, f), 'utf8');
  for (const m of t.matchAll(re1)) pairs.push([m[1], m[2], f]);
  for (const m of t.matchAll(re2)) pairs.push([m[1], m[2], f]);
}
console.log('CHECKING ' + pairs.length + ' ids');
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
for (const [id, title, f] of pairs) {
  const rr = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const jj = await rr.json();
  const ok = jj.title && (norm(jj.title).includes(norm(title).slice(0, 6)) || norm(title).includes(norm(jj.title).slice(0, 6)));
  const flag = (!jj.title || jj.status_code === 34) ? 'NOTFOUND' : (jj.adult ? 'ADULT!!!' : (ok ? 'ok' : 'MISMATCH'));
  console.log(flag + ' | seed[' + title + '] (' + f + ') id=' + id + ' => TMDB[' + (jj.title || jj.status_message) + '] p=' + jj.poster_path);
  await sleep(120);
}
