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
const need = [
  ['Alien: Romulus', 2024, 'movie'], ['House of Spoils', 2024, 'movie'],
  ['The Deliverance', 2024, 'movie'], ['Back to Black', 2024, 'movie'],
  ['John Wick: Chapter 4', 2023, 'movie'], ['Squid Game', null, 'tv'],
  ['Breaking Bad', null, 'tv'], ['House of the Dragon', null, 'tv'],
  ['The Last of Us', null, 'tv'], ['Stranger Things', null, 'tv'],
  ['Wednesday', null, 'tv'],
];
for (const [t, y, kind] of need) {
  const ep = kind === 'tv' ? 'search/tv' : 'search/movie';
  let u = 'https://api.themoviedb.org/3/' + ep + '?api_key=' + KEY + '&query=' + encodeURIComponent(t) + '&include_adult=false';
  if (y) u += '&year=' + y;
  const r = await fetch(u); const j = await r.json();
  console.log('=== ' + t + ' (' + kind + ') total=' + j.total_results);
  (j.results || []).slice(0, 2).forEach((x) => console.log('   ' + x.id + ' | ' + (x.title || x.name) + ' | ' + (x.release_date || x.first_air_date) + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
  await sleep(150);
}
// Back to Black: is 805509 the Amy Winehouse one?
const r2 = await fetch('https://api.themoviedb.org/3/movie/805509/videos?api_key=' + KEY);
const j2 = await r2.json();
console.log('805509 videos: ' + JSON.stringify((j2.results || []).slice(0, 1).map((v) => v.name)));
const r3 = await fetch('https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=Back%20to%20Black&year=2024&include_adult=false');
const j3 = await r3.json();
console.log('Back to Black 2024 search total=' + j3.total_results);
(j3.results || []).slice(0, 3).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path));
