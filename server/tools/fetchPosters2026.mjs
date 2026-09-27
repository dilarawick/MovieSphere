// Tool — fetch REAL TMDB poster/backdrop art for every seed title still on a
// placehold.co placeholder (or carrying a borrowed/shared backdrop).
// Writes server/data/posterFix4.js with POSTER_FIX4 + applyPosterFix4.
//
// Uses the TMDB API key from server/.env, verifies every image URL with a
// HEAD request against image.tmdb.org, then merges with the existing
// POSTER_FIX3 map so nothing already fixed is lost.
//
// Usage: node server/tools/fetchPosters2026.mjs
import fs from 'node:fs';

const BASE = new URL('../data/', import.meta.url);
const imp = (f) => import(new URL(f, BASE).href);

// ---------- Load env (server/.env) ----------
const envText = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('=');
  return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const TMDB_KEY = env.TMDB_API_KEY;
const TMDB_BASE = env.TMDB_BASE || 'https://api.themoviedb.org/3';
if (!TMDB_KEY) { console.error('TMDB_API_KEY missing in server/.env'); process.exit(1); }

// ---------- Backdrops that seeds "borrow" from other movies (wrong art) ----------
const SHARED_BACKDROPS = [
  'yDHYTfA3R0jFYba16jBB1ef8oIt.jpg', 'xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
  'h8gHn0OzBoaefsYseUByqsmEDMY.jpg', 'rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
  'stKGOm8UyhuLPR9sZLjs5AkmncA.jpg', '5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg',
  's16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
];
const isPlaceholder = (u) => !u || u.includes('placehold.co');
const isBorrowedBackdrop = (m) => {
  if (isPlaceholder(m.backdrop)) return true;
  return SHARED_BACKDROPS.some((h) => (m.backdrop || '').includes(h));
};

// ---------- Load all seeds ----------
const { ENGLISH } = await imp('seedEnglish.js');
const { ENGLISH_MORE } = await imp('seedEnglishMore.js');
const { PUBLIC_DOMAIN } = await imp('seedPublicDomain.js');
const { SINHALA } = await imp('seedSinhala.js');
const { LATEST_MOVIES } = await imp('seed2026a.js');
const { LATEST_MORE } = await imp('seed2026b.js');
const { LATEST_TV } = await imp('seed2026c.js');
const { BULK_HORROR } = await imp('seedBulkHorror1.js');
const { BULK_HORROR2 } = await imp('seedBulkHorror2.js');
const { BULK_COMEDY } = await imp('seedBulkComedy.js');
const { BULK_FAMILY } = await imp('seedBulkFamily.js');
const { BULK_THRILLER } = await imp('seedBulkThriller.js');
const { BULK_BIG } = await imp('seedBulkBig.js');
const { BULK_BIG2 } = await imp('seedBulkBig2.js');
const { BULK_FINAL } = await imp('seedBulkFinal.js');
const { REAL2026_A } = await imp('seed2026real1.js');
const { REAL2026_B } = await imp('seed2026real2.js');
const { REAL2026_C } = await imp('seed2026real3.js');
const { REAL2026_D } = await imp('seed2026real4.js');

// ---------- Existing POSTER_FIX3 (keep those entries) ----------
const pf3 = await imp('posterFix3.js');
// posterFix4 may exist from a previous run — skip those too (idempotent reruns).
let pf4 = { POSTER_FIX3: {} };
try { pf4 = await imp('posterFix4.js'); } catch { /* first run */ }

const all = [...ENGLISH, ...ENGLISH_MORE, ...PUBLIC_DOMAIN, ...SINHALA,
  ...LATEST_MOVIES, ...LATEST_MORE, ...LATEST_TV,
  ...BULK_HORROR, ...BULK_HORROR2, ...BULK_COMEDY, ...BULK_FAMILY, ...BULK_THRILLER,
  ...BULK_BIG, ...BULK_BIG2, ...BULK_FINAL,
  ...REAL2026_A, ...REAL2026_B, ...REAL2026_C, ...REAL2026_D]
  .filter((m) => !m.skip);

// Unique work list: needs a placeholder poster OR a placeholder/borrowed
// backdrop, and not already covered by POSTER_FIX3.
const seen = new Set();
const work = [];
for (const m of all) {
  const needsP = isPlaceholder(m.poster);
  const needsB = isBorrowedBackdrop(m);
  if (!needsP && !needsB) continue;
  if (pf3.POSTER_FIX3[m.title]) continue;
  if (pf4.POSTER_FIX4 && pf4.POSTER_FIX4[m.title]) continue;
  if (seen.has(m.title)) continue;
  seen.add(m.title);
  work.push({ title: m.title, year: m.year || null });
}

// ---------- TMDB helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function tmdb(path, params = {}) {
  const qs = new URLSearchParams({ api_key: TMDB_KEY, language: 'en-US', ...params });
  for (let attempt = 0; attempt < 3; attempt++) {
    let res;
    try {
      res = await fetch(`${TMDB_BASE}${path}?${qs}`);
    } catch { await sleep(600); continue; }
    if (res.status === 429) { await sleep(1200 * (attempt + 1)); continue; }
    if (!res.ok) return null;
    return res.json();
  }
  return null;
}
// Clean the seed title into a good search query.
function searchQuery(title) {
  return title
    .replace(/\(.*?\)/g, '')       // drop "(Early Announce)" etc.
    .replace(/[^\x00-\x7F]/g, '')  // drop Sinhala script
    .replace(/\s+/g, ' ')
    .trim();
}
// Seed titles that need a different TMDB search query.
const ALIASES = {
  'Resident Evil Reboot': 'Resident Evil',
  'Hokum Carry': 'Hokum',
  'Guththila Karthu (ගුත්තිල)': 'Guththila',
};
async function findMovie(title, year) {
  const q = ALIASES[title] || searchQuery(title);
  if (!q) return null;
  const data = await tmdb('/search/movie', { query: q, ...(year ? { year } : {}) });
  const results = [...((data && data.results) || [])];
  if (!results.length && year) {
    const d2 = await tmdb('/search/movie', { query: q });
    results.push(...((d2 && d2.results) || []));
  }
  if (!results.length) return null;
  // prefer a result whose release year matches (±1), then popularity
  const byYear = year
    ? results.find((r) => r.release_date && Math.abs(Number(r.release_date.slice(0, 4)) - year) <= 1)
    : null;
  const pick = byYear || results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0];
  return pick || null;
}
async function verify(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch { return false; }
}

// ---------- Main ----------
const posterMap = {};
let ok = 0, miss = 0;
console.log(`Fetching real TMDB art for ${work.length} titles...`);
for (const w of work) {
  const pick = await findMovie(w.title, w.year);
  if (!pick || (!pick.poster_path && !pick.backdrop_path)) {
    miss++;
    console.log(`  not on TMDB: ${w.title} (${w.year ?? '—'})`);
    await sleep(120);
    continue;
  }
  const poster = pick.poster_path ? `https://image.tmdb.org/t/p/w500${pick.poster_path}` : null;
  const backdrop = pick.backdrop_path ? `https://image.tmdb.org/t/p/original${pick.backdrop_path}` : null;
  const [pOk, bOk] = await Promise.all([
    poster ? verify(poster) : false,
    backdrop ? verify(backdrop) : false,
  ]);
  if (!pOk && !bOk) { miss++; console.log(`  CDN check failed: ${w.title}`); continue; }
  posterMap[w.title] = [
    pOk ? poster : backdrop,
    bOk ? backdrop : poster,
  ];
  ok++;
  console.log(`  ok: ${w.title} -> ${pick.release_date || 'no date'}`);
  await sleep(120);
}

// ---------- Merge with POSTER_FIX3 and write posterFix4.js ----------
const merged = { ...pf3.POSTER_FIX3, ...(pf4.POSTER_FIX4 || {}) };
for (const [t, v] of Object.entries(posterMap)) {
  if (!merged[t]) merged[t] = v; // never downgrade an existing verified entry
}

const out = `// Real TMDB poster/backdrop art (TMDB API, every URL HEAD-verified against
// image.tmdb.org). Merge of POSTER_FIX3 + newly fetched 2025/2026/Sinhala art.
// Generated by server/tools/fetchPosters2026.mjs
export const POSTER_FIX4 = ${JSON.stringify(merged, null, 2)};

// Backdrop hashes that several seed files borrow from unrelated blockbusters
// (e.g. every seed2026real1 movie shipped with Deadpool & Wolverine's banner).
const BORROWED = [
  'yDHYTfA3R0jFYba16jBB1ef8oIt.jpg', 'xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
  'h8gHn0OzBoaefsYseUByqsmEDMY.jpg', 'rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
  'stKGOm8UyhuLPR9sZLjs5AkmncA.jpg', '5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg',
  's16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
];
const badBackdrop = (u) => !u || u.includes('placehold.co') || BORROWED.some((h) => u.includes(h));

export function applyPosterFix4(list) {
  return list.map((m) => {
    const fix = POSTER_FIX4[m.title];
    if (!fix) return m;
    const out = { ...m };
    if ((!out.poster || out.poster.includes('placehold.co')) && fix[0]) out.poster = fix[0];
    if (badBackdrop(out.backdrop) && fix[1]) out.backdrop = fix[1];
    return out;
  });
}
`;
fs.writeFileSync(new URL('../data/posterFix4.js', import.meta.url), out);
console.log(`Wrote posterFix4.js: ${Object.keys(merged).length} total entries (${ok} newly fetched, ${miss} not found on TMDB).`);
