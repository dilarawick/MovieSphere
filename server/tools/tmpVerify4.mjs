import fs from 'node:fs';
const envText = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
// Confirm correct Glen Powell Hit Man id=974635 art + safest Deadpool backdrop.
for (const id of [974635, 533535]) {
  const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
  const j = await r.json();
  console.log(id + ' => ' + j.title + ' (' + (j.release_date||'?') + ') adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
}
// HEAD-verify each candidate URL
const urls = [
  'https://image.tmdb.org/t/p/w500/oil3EZwKFp3CWxZnfGfGglesvm9.jpg',
  'https://image.tmdb.org/t/p/original/nv6F6tz7r61DUhE7zgHwLJFcTYp.jpg',
  'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
  'https://image.tmdb.org/t/p/original/wNa8cZp4fjF5Fa1oE5HhF6Km7kK.jpg',
];
for (const u of urls) {
  const h = await fetch(u, { method: 'HEAD' });
  console.log(h.status + ' ' + u.slice(-34));
}
