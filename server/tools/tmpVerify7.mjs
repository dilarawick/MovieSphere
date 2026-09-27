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
async function searchTV(t) {
  const u = 'https://api.themoviedb.org/3/search/tv?api_key=' + KEY + '&query=' + encodeURIComponent(t) + '&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== TV ' + t + ' ===');
  (j.results || []).slice(0, 3).forEach((x) => console.log('   ' + x.id + ' | ' + x.name + ' | ' + x.first_air_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
  await sleep(130);
}
async function movie(id) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(id + ' => ' + j.title + ' (' + (j.release_date||'?') + ') adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
await searchTV('Squid Game');
await searchTV('Stranger Things');
await searchTV('Wednesday');
await searchTV('The Last of Us');
await searchTV('House of the Dragon');
await movie(912495);
