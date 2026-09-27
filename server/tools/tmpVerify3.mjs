import fs from 'node:fs';
const envText = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// 1) What is tmdbId 1061692 (used for 'Deadpool and Wolverine (Alt Art)')?
// 2) Correct Hit Man (Glen Powell 2023/2024)?
for (const id of [1061692, 872585]) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(id + ' => ' + j.title + ' (' + (j.release_date||'?') + ') adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(130);
}
let url = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=Hit%20Man&year=2023&include_adult=false';
let r = await fetch(url); let j = await r.json();
console.log('--- Hit Man 2023 search ---');
(j.results||[]).slice(0,4).forEach((x)=>console.log('  '+x.id+':'+x.title+':'+x.release_date+':p='+x.poster_path+':b='+x.backdrop_path));
