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
{
  const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=' + encodeURIComponent('Challengers') + '&year=2024&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('MOVIE Challengers total=' + j.total_results);
  (j.results || []).slice(0, 3).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
  await sleep(110);
}
{
  const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=' + encodeURIComponent('Godzilla x Kong') + '&year=2024&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('MOVIE GxK total=' + j.total_results);
  (j.results || []).slice(0, 3).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
  await sleep(110);
}
for (const id of [932420, 823464]) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '/images?api_key=' + KEY + '&include_image_language=en,null');
  const j = await r.json();
  console.log('IMG ' + id + ' backdrops=' + (j.backdrops || []).length + ' posters=' + (j.posters || []).length);
  const topB = [...(j.backdrops || [])].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))[0];
  const topP = [...(j.posters || [])].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))[0];
  console.log('   topBackdrop=' + (topB && topB.file_path) + ' votes=' + (topB && topB.vote_count));
  console.log('   topPoster=' + (topP && topP.file_path) + ' votes=' + (topP && topP.vote_count));
  await sleep(110);
}

