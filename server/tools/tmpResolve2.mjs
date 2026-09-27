import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
const need = [
  ['The Bike Riders', 2024], ['Deadpool & Wolverine', 2024],
];
for (const [t, y] of need) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(t)+'&year='+y+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== '+t+' ('+y+')');
  (j.results||[]).slice(0,3).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | adult='+x.adult+' | p='+x.poster_path+' | b='+x.backdrop_path));
  await new Promise((r)=>setTimeout(r,150));
}
// TV ids must be checked against /tv endpoint
for (const id of [1396, 91769, 94997, 100088, 66732, 119051]) {
  const r = await fetch('https://api.themoviedb.org/3/tv/'+id+'?api_key='+KEY);
  const j = await r.json();
  console.log('TV '+id+' => '+(j.name||j.status_message)+' adult='+j.adult+' p='+j.poster_path+' b='+j.backdrop_path);
  await new Promise((r)=>setTimeout(r,120));
}
