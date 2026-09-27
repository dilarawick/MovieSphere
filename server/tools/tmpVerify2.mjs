import fs from 'node:fs';
const envText = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
async function movie(id) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(id + ' => ' + j.title + ' (' + (j.release_date||'?') + ') adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
}
async function images(id) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '/images?api_key=' + KEY);
  const j = await r.json();
  console.log('--- backdrops for ' + id + ' (' + (j.backdrops||[]).length + ') ---');
  (j.backdrops||[]).slice(0,8).forEach((b,i)=>console.log('  ['+i+'] '+b.file_path+' votes='+b.vote_count+' avg='+b.vote_average));
  console.log('--- posters for ' + id + ' (' + (j.posters||[]).length + ') ---');
  (j.posters||[]).slice(0,8).forEach((p,i)=>console.log('  ['+i+'] '+p.file_path+' votes='+p.vote_count+' avg='+p.vote_average));
}
await movie(1059094);
await images(1059094);
await movie(533535);
await images(533535);
