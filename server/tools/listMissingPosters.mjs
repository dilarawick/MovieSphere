// Scan every seed for titles whose poster/backdrop is still a placehold.co
// placeholder AND that POSTER_FIX3 doesn't cover.
import fs from 'node:fs';

const BASE = new URL('../data/', import.meta.url);
const imp = (f) => import(new URL(f, BASE).href);
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

const pf3Content = fs.readFileSync(new URL('../data/posterFix3.js', import.meta.url), 'utf8');
const match = pf3Content.match(/export const POSTER_FIX3 = (\{[\s\S]*?\});\n\nexport function/);
const posterFix3 = eval('(' + match[1] + ')');

const all = [...ENGLISH, ...ENGLISH_MORE, ...PUBLIC_DOMAIN, ...SINHALA,
  ...LATEST_MOVIES, ...LATEST_MORE, ...LATEST_TV,
  ...BULK_HORROR, ...BULK_HORROR2, ...BULK_COMEDY, ...BULK_FAMILY, ...BULK_THRILLER,
  ...BULK_BIG, ...BULK_BIG2, ...BULK_FINAL,
  ...REAL2026_A, ...REAL2026_B, ...REAL2026_C, ...REAL2026_D];

const stillMissing = [];
for (const m of all) {
  if (m.skip) continue;
  const badPoster = !m.poster || m.poster.includes('placehold.co');
  const badBackdrop = !m.backdrop || m.backdrop.includes('placehold.co');
  if (!badPoster && !badBackdrop) continue;
  if (posterFix3[m.title]) continue; // will be fixed at serve time
  stillMissing.push({ title: m.title, year: m.year, tmdbId: m.tmdbId, poster: badPoster, backdrop: badBackdrop });
}

console.log('Titles still on placeholders with no POSTER_FIX3 entry:', stillMissing.length);
for (const m of stillMissing) {
  console.log(`  ${m.title} (${m.year}) tmdbId=${m.tmdbId ?? 'null'} needsP=${m.poster} needsB=${m.backdrop}`);
}
