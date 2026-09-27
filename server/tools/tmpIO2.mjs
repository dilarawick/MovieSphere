import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
const j = await (await fetch('https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=Inside%20Out%202&year=2024&include_adult=false')).json();
(j.results || []).slice(0, 3).forEach((x) => console.log(x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
