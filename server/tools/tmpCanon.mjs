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
// Canonical poster/backdrop verify for every ID in the change plan
const movies = [762509,533535,1114513,1062215,929590,1086747,869291,1010600,1072342,1225377,1008409,639720,940551,912649,1022789,402431,974635,848538,807172,614479,1011985,746036,787699,572802,967847,937287,519182,889737,646683,1205229,1094844,976409,609681];
for (const id of movies) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
    const j = await r.json();
    console.log(id + ' | ' + j.title + ' | adult=' + j.adult + ' | p=' + j.poster_path + ' | b=' + j.backdrop_path);
  } catch(e) { console.log('ERR ' + id); }
  await sleep(110);
}
const tvs = [[66732,'Stranger Things'],[119051,'Wednesday'],[100088,'The Last of Us'],[94997,'House of the Dragon'],[93405,'Squid Game']];
for (const [id, t] of tvs) {
  const r = await fetch('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log('TV ' + id + ' | ' + j.name + ' | p=' + j.poster_path + ' | b=' + j.backdrop_path);
  await sleep(110);
}
