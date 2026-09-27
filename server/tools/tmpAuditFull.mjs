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
const movieIds = [786892, 653346, 575264, 667538, 298618, 346698, 980489, 678512, 609681, 748783, 502356, 695721, 901362, 507089, 884605, 976573, 1079091, 365177, 945961, 1014661, 930600, 1114738, 987686, 1079810, 998846, 1051891, 938614, 1100782, 933260, 426063, 1138194, 1034541, 1226578, 762441, 437342, 939243, 558449, 1241982, 1064213];
const lines = [];
for (const id of movieIds) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
    const j = await r.json();
    lines.push(id + ' => ' + (j.title || j.status_message) + ' | adult=' + j.adult + ' | p=' + j.poster_path + ' | b=' + j.backdrop_path);
  } catch (e) { lines.push(id + ' => ERR'); }
  await sleep(100);
}
for (const id of [93405, 66732, 119051, 100088, 94997, 1396]) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + KEY);
    const j = await r.json();
    lines.push('TV ' + id + ' => ' + (j.name || j.status_message) + ' | p=' + j.poster_path + ' | b=' + j.backdrop_path);
  } catch (e) { lines.push('TV ' + id + ' => ERR'); }
  await sleep(100);
}
fs.writeFileSync(path.join(__d, 'auditReport.txt'), lines.join('\n'));
console.log('wrote ' + lines.length + ' lines');
