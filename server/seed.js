import 'dotenv/config';
import mongoose from 'mongoose';
import { Movie } from './models/Movie.js';
import { ENGLISH } from './data/seedEnglish.js';
import { ENGLISH_MORE } from './data/seedEnglishMore.js';
import { PUBLIC_DOMAIN } from './data/seedPublicDomain.js';
import { SINHALA } from './data/seedSinhala.js';
import { LATEST_MOVIES } from './data/seed2026a.js';
import { LATEST_MORE } from './data/seed2026b.js';
import { LATEST_TV } from './data/seed2026c.js';
import { BULK_HORROR } from './data/seedBulkHorror1.js';
import { BULK_HORROR2 } from './data/seedBulkHorror2.js';
import { BULK_COMEDY } from './data/seedBulkComedy.js';
import { BULK_FAMILY } from './data/seedBulkFamily.js';
import { BULK_THRILLER } from './data/seedBulkThriller.js';
import { BULK_2026 } from './data/seedBulkExtra.js';

function tag(list, fallback) {
  return list.filter((m) => !m.skip).map((m) => ({ mediaType: m.mediaType || fallback, ...m }));
}
function dedupe(list) {
  const seen = new Set();
  return list.filter((m) => {
    const key = `${(m.title || '').toLowerCase().trim()}::${m.year || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
const all = dedupe([
  ...tag(ENGLISH, 'movie'),
  ...tag(ENGLISH_MORE, 'movie'),
  ...tag(PUBLIC_DOMAIN, 'movie'),
  ...tag(SINHALA, 'movie'),
  ...tag(LATEST_MOVIES, 'movie'),
  ...tag(LATEST_MORE, 'movie'),
  ...tag(BULK_HORROR, 'movie'),
  ...tag(BULK_HORROR2, 'movie'),
  ...tag(BULK_COMEDY, 'movie'),
  ...tag(BULK_FAMILY, 'movie'),
  ...tag(BULK_THRILLER, 'movie'),
  ...tag(BULK_2026, 'movie'),
  ...tag(LATEST_TV, 'tv'),
]);

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviesphere';
  await mongoose.connect(uri);
  // Drop collection to clear any stale text index (old index treated
  // `language` as the text-search language override, rejecting 'si').
  try { await mongoose.connection.collection('movies').drop(); } catch { /* first run */ }
  await Movie.syncIndexes();
  await Movie.insertMany(all);
  console.log(`[seed] Inserted ${all.length} titles (bulk horror/comedy/family/thriller + 2024-26 included)`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
