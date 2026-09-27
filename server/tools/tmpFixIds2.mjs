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
const want = [
  ['Late Night with the Devil', 2023], ['Smile 2', 2024], ['Nosferatu', 2024],
  ['Heretic', 2024], ['A Quiet Place: Day One', 2024], ['The First Omen', 2024],
  ['The End of Oak Street', 2024], ['Get Out', 2017], ['Evil Dead Rise', 2023],
  ['M3GAN', 2023], ['The Nun II', 2023], ['A Quiet Place Part II', 2021],
  ['Alien: Romulus', 2024], ['House of Spoils', 2024], ['The Deliverance', 2024],
];
for (const [t, y] of want) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(t)+'&year='+y+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== '+t+' ('+y+')');
  (j.results||[]).slice(0,3).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | p='+x.poster_path+' | b='+x.backdrop_path));
  await sleep(130);
}
