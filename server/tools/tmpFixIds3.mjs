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
  ['The Long Game', 2024], ['Back to Black', 2024], ['The Holdovers', 2023],
  ['The Iron Claw', 2023], ['Dark Harvest', 2023], ['Inside Out 2 Bonus', null],
  ['Venom: The Last Dance Alt', null], ['Sonic the Hedgehog 3 Alt', null],
];
for (const [t, y] of want) {
  let u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(t)+(y?'&year='+y:'')+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== '+t+' total='+j.total_results);
  (j.results||[]).slice(0,3).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | p='+x.poster_path+' | b='+x.backdrop_path));
  await sleep(130);
}
// verify bulk image candidates
const check = [
  'https://image.tmdb.org/t/p/w500/mu8LRWT9GHkfiyHm7kgxT6YNvMW.jpg',
  'https://image.tmdb.org/t/p/original/umyOinNa6vqqnqoVc9QqzyaapUz.jpg',
  'https://image.tmdb.org/t/p/w500/ht8Uv9QPv9y7K0RvUyJIaXOZTfd.jpg',
  'https://image.tmdb.org/t/p/original/iR79ciqhtaZ9BE7YFA1HpCHQgX4.jpg',
  'https://image.tmdb.org/t/p/w500/5qGIxdEO841C0tdY8vOdLoRVrr0.jpg',
  'https://image.tmdb.org/t/p/original/gprjiZWY43vxSKngMha1wfb5TGG.jpg',
  'https://image.tmdb.org/t/p/w500/tnsDyNNkOxYUyjD8CNJoAla6YvY.jpg',
  'https://image.tmdb.org/t/p/original/mIBG74mhGEJnBubhYLkCtvplcNr.jpg',
  'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
  'https://image.tmdb.org/t/p/original/bBQHALHRAaaORlPNXv7fNcRXYdx.jpg',
  'https://image.tmdb.org/t/p/w500/5ik4ATKmNtmJU6AYD0bLm56BCVM.jpg',
  'https://image.tmdb.org/t/p/original/7bWxAsNPv9CXHOhZbJVlj2KxgfP.jpg',
];
for (const u of check) {
  const h = await fetch(u, { method: 'HEAD' });
  console.log(h.status + ' ' + u.slice(-34));
}
