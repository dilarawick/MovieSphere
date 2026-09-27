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
// Correct TV ids: Squid Game + Bike Riders movie
for (const q of [['Squid Game', 'tv'], ['Stranger Things', 'tv']]) {
  const u = 'https://api.themoviedb.org/3/search/' + q[1] + '?api_key=' + KEY + '&query=' + encodeURIComponent(q[0]) + '&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== ' + q[0] + ' (' + q[1] + ') total=' + j.total_results);
  (j.results || []).slice(0, 3).forEach((x) => console.log('   ' + x.id + ' | ' + (x.name || x.title) + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
  await sleep(120);
}
const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=Bike%20Riders&include_adult=false';
const r = await fetch(u); const j = await r.json();
console.log('=== Bike Riders (no year) total=' + j.total_results);
(j.results || []).slice(0, 5).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
