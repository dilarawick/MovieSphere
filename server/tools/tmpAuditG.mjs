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
const ids = [
  [1011985, 'Kung Fu Panda 4'], [823464, 'Godzilla x Kong: The New Empire'],
  [746036, 'The Fall Guy'], [787699, 'Wonka'], [1029576, 'Wish'],
  [572802, 'Aquaman and the Lost Kingdom'], [967847, 'Ghostbusters: Frozen Empire'],
  [937287, 'Challengers'], [1008409, 'The Bike Riders'],
  [1100099, 'Argylle'], [675531, 'Dark Harvest'], [645061, 'The Exorcist: Believer'],
  [961422, 'Insidious: The Red Door'], [850165, 'The Iron Claw'], [840430, 'The Holdovers'],
  [467244, 'The Zone of Interest'], [915935, 'Anatomy of a Fall'],
  [912495, 'Venom: The Last Dance'], [976409, 'John Wick: Chapter 4 Alt'], [1282015, 'Inside Out 2 Bonus'],
];
for (const [id, t] of ids) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(id + ' [' + t + '] => ' + (j.title || j.status_message) + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(110);
}
