import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
// Bikeriders verified id 1008409; John Wick alt uses real 603692
for (const id of [1008409, 603692, 974635, 762509]) {
  const r = await fetch('https://api.themoviedb.org/3/movie/'+id+'?api_key='+KEY);
  const j = await r.json();
  console.log(id+' => '+j.title+' ('+j.release_date+') adult='+j.adult+' p='+j.poster_path+' b='+j.backdrop_path);
}
