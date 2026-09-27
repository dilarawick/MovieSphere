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
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
async function checkMovie(id, label) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(label + ' id=' + id + ' => ' + (j.title || j.status_message) + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
// unchecked / suspicious ones
await checkMovie(937287, 'Challengers?');
await checkMovie(1011985, 'KungFuPanda4?');
await checkMovie(746036, 'FallGuy?');
await checkMovie(787699, 'Wonka?');
await checkMovie(1029576, 'Wish?');
await checkMovie(572802, 'Aquaman2?');
await checkMovie(967847, 'GhostbustersFE?');
await checkMovie(609681, 'TheMarvels?');
await checkMovie(912649, 'VenomLastDance(correct)?');
await checkMovie(1022789, 'InsideOut2(correct)?');
await checkMovie(93405, 'SquidGameTV?');
for (const id of [66732, 119051, 100088, 94997, 1396]) {
  const r = await fetch('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log('TV id=' + id + ' => ' + (j.name || j.status_message) + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
