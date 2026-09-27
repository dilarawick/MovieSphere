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
async function movie(id) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(id + ' => ' + j.title + ' (' + (j.release_date||'?') + ') adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
async function tv(id) {
  const r = await fetch('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log('TV ' + id + ' => ' + j.name + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
// seeds with hardcoded (non-placeholder) art — is it the right movie's art?
await movie(939243);   // Sonic 3
await movie(1064213);  // Anora
await movie(1241982);  // Moana 2
await movie(558449);   // Gladiator II
await tv(91769);       // Squid Game
await tv(1396);        // Breaking Bad
