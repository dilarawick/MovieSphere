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
// A Quiet Place Part II (2020) correct id + art
let u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent('A Quiet Place Part II')+'&year=2021&include_adult=false';
let r = await fetch(u); let j = await r.json();
console.log('=== Part II');
(j.results||[]).slice(0,2).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | p='+x.poster_path+' | b='+x.backdrop_path));
// Current TV art (posters + backdrops)
for (const id of [93405, 1396, 66732, 119051, 100088, 94997]) {
  const rr = await fetch('https://api.themoviedb.org/3/tv/'+id+'?api_key='+KEY);
  const jj = await rr.json();
  console.log('TV '+id+' => '+jj.name+' p='+jj.poster_path+' b='+jj.backdrop_path);
  await sleep(120);
}
