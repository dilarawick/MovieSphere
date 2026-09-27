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
const check = [
  [974453, 'movie'], [940139, 'movie'], [1124641, 'movie'], [365177, 'movie'],
  [1079091, 'movie'], [805509, 'movie'], [694, 'movie'], [1100099, 'movie'],
  [1034541, 'movie'], [1226578, 'movie'], [1011985, 'movie'], [746036, 'movie'],
];
for (const [id, kind] of check) {
  const r = await fetch('https://api.themoviedb.org/3/' + kind + '/' + id + '?api_key=' + KEY + '&language=en-US');
  const j = await r.json();
  console.log(id + ' => ' + (j.title || j.status_message) + ' adult=' + j.adult + ' p=' + j.poster_path);
  await sleep(110);
}
const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=' + encodeURIComponent('The End of Oak Street') + '&include_adult=false&language=en-US';
const r = await fetch(u); const j = await r.json();
console.log('End of Oak Street search total=' + j.total_results);
(j.results || []).slice(0, 4).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
