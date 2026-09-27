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
// Final canonical IDs after audit (movie endpoint)
const ids = [762509, 533535, 1114513, 1062215, 929590, 1086747, 869291, 1010600, 1072342, 1225377, 1008409, 639720, 940551, 912649, 1022789, 402431, 974635, 848538, 807172, 614479, 1011985, 746036, 787699, 572802, 967847, 937287, 519182, 889737, 646683, 1205229];
for (const id of ids) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
    const j = await r.json();
    console.log(id + ' | ' + j.title + ' | adult=' + j.adult + ' | p=' + j.poster_path + ' | b=' + j.backdrop_path);
  } catch (e) { console.log(id + ' ERR'); }
  await sleep(110);
}
