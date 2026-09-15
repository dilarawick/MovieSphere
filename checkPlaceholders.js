// Check which movies still have placeholders after all our fixes
const fs = require('fs');
const path = require('path');

// Load posterFix3.js
const pf3Content = fs.readFileSync('server/data/posterFix3.js', 'utf8');
const match = pf3Content.match(/export const POSTER_FIX3 = (\{[\s\S]*?\});\n\nexport function/);
const posterFix3 = eval('(' + match[1] + ')');

// Load all seed data
const { ENGLISH } = require('./server/data/seedEnglish.js');
const { ENGLISH_MORE } = require('./server/data/seedEnglishMore.js');
const { PUBLIC_DOMAIN } = require('./server/data/seedPublicDomain.js');
const { SINHALA } = require('./server/data/seedSinhala.js');
const { LATEST_MOVIES } = require('./server/data/seed2026a.js');
const { LATEST_MORE } = require('./server/data/seed2026b.js');
const { LATEST_TV } = require('./server/data/seed2026c.js');
const { BULK_HORROR } = require('./server/data/seedBulkHorror1.js');
const { BULK_HORROR2 } = require('./server/data/seedBulkHorror2.js');
const { BULK_COMEDY } = require('./server/data/seedBulkComedy.js');
const { BULK_FAMILY } = require('./server/data/seedBulkFamily.js');
const { BULK_THRILLER } = require('./server/data/seedBulkThriller.js');
const { BULK_BIG } = require('./server/data/seedBulkBig.js');
const { BULK_BIG2 } = require('./server/data/seedBulkBig2.js');
const { BULK_FINAL } = require('./server/data/seedBulkFinal.js');
const { REAL2026_A } = require('./server/data/seed2026real1.js');
const { REAL2026_B } = require('./server/data/seed2026real2.js');
const { REAL2026_C } = require('./server/data/seed2026real3.js');
const { REAL2026_D } = require('./server/data/seed2026real4.js');

const all = [...ENGLISH, ...ENGLISH_MORE, ...PUBLIC_DOMAIN, ...SINHALA,
  ...LATEST_MOVIES, ...LATEST_MORE, ...LATEST_TV,
  ...BULK_HORROR, ...BULK_HORROR2, ...BULK_COMEDY, ...BULK_FAMILY, ...BULK_THRILLER,
  ...BULK_BIG, ...BULK_BIG2, ...BULK_FINAL,
  ...REAL2026_A, ...REAL2026_B, ...REAL2026_C, ...REAL2026_D];

const stillMissing = [];
for (const m of all) {
  if (!m.poster) continue;
  if (m.poster.includes('placehold.co')) {
    if (!posterFix3[m.title]) {
      stillMissing.push({ title: m.title, tmdbId: m.tmdbId });
    }
  }
}

console.log('Movies still using placeholders after fixes:', stillMissing.length);
for (const m of stillMissing) {
  console.log(`  ${m.title} (tmdbId: ${m.tmdbId || 'null'})`);
}
