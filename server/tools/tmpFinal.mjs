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
async function movie(id) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log('MOVIE ' + id + ' => ' + j.title + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
async function tv(id) {
  const r = await fetch('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log('TV ' + id + ' => ' + j.name + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
await tv(93405);
await movie(567646);
await movie(437342);
const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=' + encodeURIComponent('The First Omen') + '&year=2024&include_adult=false';
const r = await fetch(u); const j = await r.json();
console.log('--- First Omen search ---');
(j.results || []).slice(0, 3).forEach((x) => console.log('  ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
