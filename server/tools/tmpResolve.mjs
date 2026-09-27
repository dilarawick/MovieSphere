import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__d, '..', 'data');
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
// Titles that need their CORRECT tmdb id resolved via search
const need = [
  ['Mufasa: The Lion King', 2024], ['Speak No Evil', 2024], ['Afraid', 2024],
  ['Civil War', 2024], ['The Watchers', 2024], ['Cuckoo', 2024],
  ['The Strangers: Chapter 1', 2024], ['Night Swim', 2024], ['The Mouse Trap', 2024],
  ['The Bike Riders', 2024], ['IF', 2024], ['Migration', 2023],
  ['Venom: The Last Dance', 2024], ['Inside Out 2', 2024], ['Hit Man', 2023],
];
for (const [t, y] of need) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(t)+'&year='+y+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== '+t+' ('+y+')');
  (j.results||[]).slice(0,3).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | adult='+x.adult+' | p='+x.poster_path+' | b='+x.backdrop_path));
  await new Promise((r)=>setTimeout(r,150));
}
