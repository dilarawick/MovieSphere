import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
for (const q of ['Bike Riders', 'Bikeriders']) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(q)+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== '+q+' total='+j.total_results);
  (j.results||[]).slice(0,4).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | p='+x.poster_path+' | b='+x.backdrop_path));
}
