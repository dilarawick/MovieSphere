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
const need = [
  ['Godzilla x Kong: The New Empire', 2024], ['Wish', 2023], ['Challengers', 2024],
  ['The First Omen', 2024], ['Late Night with the Devil', 2023], ['Smile 2', 2024],
  ['Nosferatu', 2024], ['Heretic', 2024], ['A Quiet Place: Day One', 2024],
  ['A Quiet Place Part II', 2021], ['Get Out', 2017], ['Evil Dead Rise', 2023],
  ['M3GAN', 2023], ['The Nun II', 2023], ['Argylle', 2024], ['Dark Harvest', 2023],
  ['The Exorcist: Believer', 2023], ['Insidious: The Red Door', 2023],
  ['The Iron Claw', 2023], ['The Holdovers', 2023], ['The Long Game', 2023],
  ['Alien: Romulus', 2024], ['House of Spoils', 2024], ['The Deliverance', 2024],
  ['Borderlands', 2024], ['It Ends with Us', 2024], ['The End of Oak Street', 2024],
];
for (const [t, y] of need) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + KEY + '&query=' + encodeURIComponent(t) + '&year=' + y + '&include_adult=false';
  try {
    const r = await fetch(u); const j = await r.json();
    console.log('=== ' + t + ' (' + y + ') total=' + j.total_results);
    (j.results || []).slice(0, 2).forEach((x) => console.log('   ' + x.id + ' | ' + x.title + ' | ' + x.release_date + ' | p=' + x.poster_path + ' | b=' + x.backdrop_path));
  } catch (e) { console.log('ERR ' + t); }
  await sleep(150);
}
const r2 = await fetch('https://api.themoviedb.org/3/tv/93405?api_key=' + KEY);
const j2 = await r2.json();
console.log('TV 93405 => ' + (j2.name || j2.status_message) + ' p=' + j2.poster_path + ' b=' + j2.backdrop_path);
