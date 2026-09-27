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
  ['Godzilla x Kong: The New Empire', 2024], ['Challengers', 2024], ['Sonic the Hedgehog 3', 2024],
  ['Venom: The Last Dance', 2024], ['The Bikeriders', 2024], ['The Strangers: Chapter 1', 2024],
  ['The Watchers', 2024], ['Inside Out 2 Bonus', 2024], ['Mufasa: The Lion King', 2024],
];
for (const [t, y] of want) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(t)+(y?'&year='+y:'')+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('=== '+t);
  (j.results||[]).slice(0,3).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | p='+x.poster_path+' | b='+x.backdrop_path));
  await sleep(130);
}
// image verify helper for candidates we will write
const check = [
  'https://image.tmdb.org/t/p/w500/dA4N6uWOnEMgbxXwFX7qX7adzs8.jpg',
  'https://image.tmdb.org/t/p/original/1fL2S8LKxCVE9KoPRBXeagmBtex.jpg',
  'https://image.tmdb.org/t/p/w500/gUREuXCnJLVHsvKXDH9fgIcfM6e.jpg',
  'https://image.tmdb.org/t/p/original/zu4m80pS1EBqDd000xD6exSyHp4.jpg',
  'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
  'https://image.tmdb.org/t/p/original/t2SXZ7KLriaLyf5QT8Iar6fSOGp.jpg',
  'https://image.tmdb.org/t/p/w500/3ovFaFeojLFIl5ClqhtgYMDS8sE.jpg',
  'https://image.tmdb.org/t/p/original/go58BqpA6WYL1pzKsb2chi7qx9H.jpg',
  'https://image.tmdb.org/t/p/w500/gSkfBGdxdialBMM7P02V4hcI6Ij.jpg',
  'https://image.tmdb.org/t/p/original/aZ8dBIvpDFp9cp23MfBiY5mWfuy.jpg',
  'https://image.tmdb.org/t/p/w500/ApMuukdDAOR2rgaFDZIcjfigi64.jpg',
  'https://image.tmdb.org/t/p/original/kwGvFyRtGSSm8AFfnRNXoZTQmJj.jpg',
];
for (const u of check) {
  const h = await fetch(u, { method: 'HEAD' });
  console.log(h.status + ' ' + u.slice(-34));
}
