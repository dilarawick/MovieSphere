import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = (env.TMDB_API_KEY || '').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function tv(id) {
  const r = await fetch('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log('TV ' + id + ' => name=' + j.name + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
await tv(95479);
await tv(247627);
const u = 'https://api.themoviedb.org/3/search/tv?api_key=' + KEY + '&query=' + encodeURIComponent('Squid Game') + '&include_adult=false';
const r = await fetch(u); const j = await r.json();
console.log('--- Squid Game tv search, total=' + j.total_results + ' ---');
(j.results || []).slice(0, 4).forEach((x) => console.log('   ' + x.id + ' | ' + x.name + ' | ' + x.first_air_date + ' | adult=' + x.adult + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
