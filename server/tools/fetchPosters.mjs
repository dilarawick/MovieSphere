// Tool — fetch REAL TMDB poster/backdrop paths for movies that still use
// placehold.co placeholders. Writes server/data/posterFix3.js.
//
// TMDB's public website is scraped (no API key needed):
//  - movies with a known tmdbId  -> https://www.themoviedb.org/movie/<id>
//  - movies without one          -> site search, pick the result whose
//                                   release year matches the seed year
// Every found image is verified with a HEAD request against image.tmdb.org.
//
// Usage: node server/tools/fetchPosters.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Input: every seeded title that still has a placehold.co poster ----------
const BY_ID = [
  // BULK_HORROR
  [1138194, 'The End of Oak Street', 2024],
  [1096197, 'Late Night with the Devil', 2024],
  [1118032, 'Smile 2', 2024],
  [933260, 'The Substance', 2024],
  [1114894, 'Nosferatu', 2024],
  [1184918, 'Heretic', 2024],
  [1176142, 'Terrifier 3', 2024],
  [1072349, 'Longlegs', 2024],
  [1054899, 'A Quiet Place: Day One', 2024],
  [1010600, 'The First Omen', 2024],
  // BULK_HORROR2
  [694, 'The Shining', 1980],
  [423108, 'Get Out', 2017],
  [496243, 'Parasite', 2019],
  [381288, 'Split', 2016],
  [493922, 'Hereditary', 2018],
  [1085453, 'Evil Dead Rise', 2023],
  [1008042, 'Talk to Me', 2023],
  [1049817, 'M3GAN', 2023],
  [1029575, 'The Nun II', 2023],
  [762441, 'A Quiet Place Part II', 2021],
  // BULK_COMEDY
  [1022789, 'IF', 2024],
  [748783, 'The Garfield Movie', 2024],
  [976573, 'Elemental', 2023],
  [502356, 'The Super Mario Bros. Movie', 2023],
  [695721, 'The Hunger Games: Ballad of Songbirds', 2023],
  [901362, 'Trolls Band Together', 2023],
  [507089, 'Five Nights at Freddys', 2023],
  // BULK_FAMILY
  [1079091, 'It Ends with Us', 2024],
  [365177, 'Borderlands', 2024],
  [974453, 'Alien: Romulus', 2024],
  [940139, 'House of Spoils', 2024],
  [1124641, 'The Deliverance', 2024],
  [1114738, 'Boneyard', 2024],
  [987686, 'A Family Affair', 2024],
  [1104845, 'The Long Game', 2024],
  [805509, 'Back to Black', 2024],
  [1041619, 'Thelma', 2024],
  // BULK_THRILLER
  [1100099, 'Argylle', 2024],
  [1055401, 'Dark Harvest', 2023],
  [645061, 'The Exorcist: Believer', 2023],
  [961422, 'Insidious: The Red Door', 2023],
  [1006462, 'The Iron Claw', 2023],
  [1028723, 'The Holdovers', 2023],
  [467244, 'The Zone of Interest', 2023],
  [915935, 'Anatomy of a Fall', 2023],
  // BULK_BIG
  [519182, 'Despicable Me 4', 2024],
  [1212073, 'Mufasa: The Lion King', 2024],
  [1030077, 'Wicked: Part One', 2024],
  [1061692, 'Deadpool and Wolverine (Alt Art)', 2024],
  [889737, 'Joker: Folie a Deux', 2024],
  [1087215, 'Speak No Evil', 2024],
  [1168178, 'The Exorcism', 2024],
  [1134058, 'Afraid', 2024],
  [1099239, 'Night of the Zoopocalypse', 2024],
  // BULK_BIG2
  [786892, 'Furiosa: A Mad Max Saga Alt', 2024],
  [653346, 'Kingdom of the Planet of the Apes Alt', 2024],
  [575264, 'Mission: Impossible - Dead Reckoning', 2023],
  [667538, 'Transformers: Rise of the Beasts', 2023],
  [298618, 'The Flash', 2023],
  [346698, 'Barbie Alt', 2023],
  [980489, 'Gran Turismo', 2023],
  [678512, 'Sound of Freedom', 2023],
  [976409, 'John Wick: Chapter 4 Alt', 2023],
  [609681, 'The Marvels', 2023],
  // BULK_FINAL
  [1011985, 'Kung Fu Panda 4', 2024],
  [1094844, 'Godzilla x Kong: The New Empire', 2024],
  [746036, 'The Fall Guy', 2024],
  [787699, 'Wonka', 2023],
  [1029576, 'Wish', 2023],
  [572802, 'Aquaman and the Lost Kingdom', 2023],
  [1211951, 'Ghostbusters: Frozen Empire', 2024],
  [1194915, 'Challengers', 2024],
  [1059094, 'Hit Man', 2024],
  [1017163, 'Civil War', 2024],
  [1064486, 'The Watchers', 2024],
  [1087388, 'Sting', 2024],
  [1086747, 'Cuckoo', 2024],
  [1115623, 'The Strangers: Chapter 1', 2024],
  [1280768, 'Night Swim', 2024],
  [1055547, 'The Mouse Trap', 2024],
  [1063879, 'The Bike Riders', 2024],
];

// [search query, seed title, seed year, mode] — 2026 speculative slate +
// Sinhala films. mode 'yt' passes the year to TMDB's y: search filter.
const BY_SEARCH = [
  // English 2026 slate
  ['Spider-Man: Brand New Day', 'Spider-Man: Brand New Day', 2026, 'yt'],
  ['The Odyssey', 'The Odyssey', 2026, 'yt'],
  ['Toy Story 5', 'Toy Story 5', 2026, 'yt'],
  ['Project Hail Mary', 'Project Hail Mary', 2026, 'yt'],
  ['The Mandalorian and Grogu', 'The Mandalorian and Grogu', 2026, 'yt'],
  ['Moana', 'Moana', 2026, 'yt'],
  ['Supergirl', 'Supergirl', 2026, 'yt'],
  ['Coyote vs. Acme', 'Coyote vs. Acme', 2026, 'yt'],
  ['Scream 7', 'Scream 7', 2026, 'yt'],
  ['Scary Movie 6', 'Scary Movie 6', 2026, 'yt'],
  ['The Devil Wears Prada 2', 'The Devil Wears Prada 2', 2026, 'yt'],
  ['Michael', 'Michael', 2026, 'yt'],
  ['Avengers: Doomsday', 'Avengers: Doomsday', 2026, 'yt'],
  ['Dune: Part Three', 'Dune: Part Three', 2026, 'yt'],
  ['The Super Mario Galaxy Movie', 'The Super Mario Galaxy Movie', 2026, 'yt'],
  ['Minions and Monsters', 'Minions and Monsters', 2026, 'yt'],
  ['Hokum', 'Hokum Carry', 2026, 'yt'],
  ['The Sheep Detectives', 'The Sheep Detectives', 2026, 'yt'],
  ['Masters of the Universe', 'Masters of the Universe', 2026, 'yt'],
  ['Ready or Not 2', 'Ready or Not 2', 2026, 'yt'],
  ['Greenland 2: Migration', 'Greenland 2: Migration', 2026, 'yt'],
  ['28 Years Later: The Bone Temple', '28 Years Later: The Bone Temple', 2026, 'yt'],
  ['Primate', 'Primate', 2026, 'yt'],
  ['The Backrooms', 'The Backrooms', 2026, 'yt'],
  ['Obsession', 'Obsession', 2026, 'yt'],
  ['Whistle', 'Whistle', 2026, 'yt'],
  ['Resident Evil', 'Resident Evil Reboot', 2026, 'yt'],
  ['The Hunger Games: Sunrise on the Reaping', 'The Hunger Games: Sunrise on the Reaping', 2026, 'yt'],
  ['Jumanji 3', 'Jumanji 3', 2026, 'yt'],
  ['Ice Age 6', 'Ice Age 6', 2026, 'yt'],
  ['Shrek 5', 'Shrek 5', 2026, 'yt'],
  ['We Bury the Dead', 'We Bury the Dead', 2025, 'yt'],
  ['The Rip', 'The Rip', 2026, 'yt'],
  ['The Dutchman', 'The Dutchman', 2026, 'yt'],
  ['The Other Woman', 'The Other Woman', 2026, 'yt'],
  // Sinhala cinema
  ['Aloko Udapadi', 'Aloko Udapadi', 2017, 'no'],
  ['Aba', 'Aba', 2008, 'no'],
  ['Siri Parakum', 'Siri Parakum', 2013, 'no'],
  ['Vijayaba Kollaya', 'Vijayaba Kollaya', 2019, 'no'],
  ['Nim Him', 'Nim Him (නම් හිම්)', 2023, 'no'],
  ['Guththila', 'Guththila Karthu (ගුත්තිල)', 2023, 'no'],
  ['The Newspaper', 'The Newspaper (ද නිව්ස්පේපර්)', 2020, 'no'],
  ['Premaya Nam', 'Premaya Nam', 2023, 'no'],
  ['Komaali Kings', 'Komaali Kings', 2018, 'no'],
  ['Sulanga Gini Aran', 'Sulanga Gini Aran (Dark in the White Light)', 2015, 'no'],
];

// ---------- TMDB website scraping helpers ----------
async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// og:image holds the canonical poster; the page header img holds the backdrop.
function parseMoviePage(html) {
  const poster = html.match(/og:image"[^>]*content="[^"]*\/t\/p\/[^/]*\/([A-Za-z0-9]+\.(?:jpg|png))/);
  const backdrop = html.match(/\/t\/p\/w1920_and_h800_multi_faces\/([A-Za-z0-9]+\.(?:jpg|png))/);
  const date = html.match(/class="tag release_date"[^>]*>([^<]+)</);
  const title = html.match(/og:title"[^>]*content="([^"]*)"/);
  return {
    poster: poster ? poster[1] : null,
    backdrop: backdrop ? backdrop[1] : null,
    year: date ? parseInt(date[1].trim().slice(-4), 10) : null,
    title: title ? title[1] : null,
  };
}

// Search page: collect the first few candidate movie ids (in relevance order).
function parseSearchPage(html) {
  const ids = [...html.matchAll(/href="\/movie\/(\d+)/g)].map((m) => m[1]);
  return [...new Set(ids)].slice(0, 3);
}

async function fetchMovie(tmdbId) {
  const html = await get(`https://www.themoviedb.org/movie/${tmdbId}?language=en-US`);
  await sleep(350);
  return { id: tmdbId, ...parseMoviePage(html) };
}

async function fetchBySearch(query, wantYear, useSiteYearFilter) {
  const q = encodeURIComponent(query) + (useSiteYearFilter ? ` y:${wantYear}` : '');
  const html = await get(`https://www.themoviedb.org/search/movie?query=${q}`);
  await sleep(350);
  for (const id of parseSearchPage(html)) {
    try {
      const movie = await fetchMovie(id);
      // Year must match the seed (guards against older titles with the same name).
      if (movie.poster && (!wantYear || !movie.year || Math.abs(movie.year - wantYear) <= 1)) return { ...movie, via: 'search' };
    } catch { /* next candidate */ }
  }
  return null;
}

// ---------- Verify each image really exists on the CDN ----------
async function verify(kind, hash) {
  const url = `https://image.tmdb.org/t/p/${kind === 'poster' ? 'w500' : 'original'}/${hash}`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200 ? url : null;
  } catch {
    return null;
  }
}

// ---------- Main ----------
const results = { byId: {}, bySearch: {} };
let ok = 0, miss = 0;

console.log(`Fetching ${BY_ID.length} by ID + ${BY_SEARCH.length} by search...`);
for (const [id, title] of BY_ID) {
  try {
    const m = await fetchMovie(id);
    if (m.poster) { results.byId[title] = m; ok++; }
    else { results.byId[title] = null; miss++; console.log(`  no poster: ${title}`); }
  } catch (e) { results.byId[title] = null; miss++; console.log(`  FAIL ${title}: ${e.message}`); }
}
for (const [query, title, year, mode] of BY_SEARCH) {
  try {
    const m = await fetchBySearch(query, year, mode === 'yt');
    if (m && m.poster) { results.bySearch[title] = m; ok++; }
    else { results.bySearch[title] = null; miss++; console.log(`  not on TMDB: ${title}`); }
  } catch (e) { results.bySearch[title] = null; miss++; console.log(`  FAIL ${title}: ${e.message}`); }
}

console.log(`Found ${ok}, missing ${miss}. Verifying image URLs...`);
const posterMap = {};
for (const list of Object.values(results)) {
  for (const [title, m] of Object.entries(list)) {
    if (!m) continue;
    const [p, b] = await Promise.all([verify('poster', m.poster), verify('backdrop', m.backdrop)]);
    if (p) posterMap[title] = [p, b || `https://image.tmdb.org/t/p/original/${m.poster}`];
    else console.log(`  CDN check failed: ${title} (${m.poster})`);
    await sleep(150);
  }
}

const out = `// Real TMDB poster/backdrop paths for movies that shipped with
// placehold.co placeholder posters — including the 2026 slate and Sinhala
// cinema where TMDB has real art. Generated by server/tools/fetchPosters.mjs
// (every URL verified against image.tmdb.org at generation time).
export const POSTER_FIX3 = ${JSON.stringify(posterMap, null, 2)};

export function applyPosterFix3(list) {
  return list.map((m) => {
    const fix = POSTER_FIX3[m.title];
    if (!fix) return m;
    const out = { ...m };
    if (!out.poster || out.poster.includes('placehold.co')) out.poster = fix[0];
    if (!out.backdrop || out.backdrop.includes('placehold.co')) out.backdrop = fix[1];
    return out;
  });
}
`;
fs.writeFileSync(path.join(__dirname, '../data/posterFix3.js'), out);
console.log(`Wrote posterFix3.js with ${Object.keys(posterMap).length} verified entries.`);

