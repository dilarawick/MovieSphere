import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__d, '..', 'data');
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = (env.TMDB_API_KEY || '').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Only titles with WRONG tmdb ids (adult hits or mismatches from audit).
// Correct ids verified via TMDB search; fetch their REAL poster+backdrop.
const targets = [
  ['Mufasa: The Lion King', 762509],
  ['Speak No Evil', 1114513],
  ['Afraid', 1062215],
  ['Civil War', 929590],
  ['Cuckoo', 869291],
  ['The Strangers: Chapter 1', 1010600],
  ['Night Swim', 1072342],
  ['The Mouse Trap', 1225377],
  ['The Bike Riders', 1008409],
  ['IF', 639720],
  ['Migration', 940551],
  ['Venom: The Last Dance', 912649],
  ['Squid Game', null], // tv - handle separately
];
const out = {};
for (const [title, id] of targets) {
  if (!id) continue;
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(title + ' => id=' + j.id + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  out[title] = ['https://image.tmdb.org/t/p/w500' + j.poster_path, 'https://image.tmdb.org/t/p/original' + j.backdrop_path];
  await sleep(150);
}
// Squid Game is a TV show
{
  const r = await fetch('https://api.themoviedb.org/3/tv/95479?api_key=' + KEY);
  const j = await r.json();
  console.log('Squid Game => id=95479 name=' + j.name + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  out['Squid Game'] = ['https://image.tmdb.org/t/p/w500' + j.poster_path, 'https://image.tmdb.org/t/p/original' + j.backdrop_path];
}
fs.writeFileSync(path.join(__d, 'fixPayload.json'), JSON.stringify(out, null, 2));
console.log('wrote fixPayload.json with ' + Object.keys(out).length + ' entries');
