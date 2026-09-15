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

function tag(list, fallback) {
  return list.filter((m) => !m.skip).map((m) => ({ mediaType: m.mediaType || fallback, ...m }));
}
const all = [
  ...tag(ENGLISH, 'movie'),
  ...tag(ENGLISH_MORE, 'movie'),
  ...tag(PUBLIC_DOMAIN, 'movie'),
  ...tag(SINHALA, 'movie'),
  ...tag(LATEST_MOVIES, 'movie'),
  ...tag(LATEST_MORE, 'movie'),
  ...tag(LATEST_TV, 'tv'),
];

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviesphere';
  await mongoose.connect(uri);
  // Drop collection to clear any stale text index (old index treated
  // `language` as the text-search language override, rejecting 'si').
  try { await mongoose.connection.collection('movies').drop(); } catch { /* first run */ }
  await Movie.syncIndexes();
  await Movie.insertMany(all);
  console.log(`[seed] Inserted ${all.length} titles (EN:${ENGLISH.length + ENGLISH_MORE.length} PD:${PUBLIC_DOMAIN.length} SI:${SINHALA.length} NEW:${LATEST_MOVIES.length + LATEST_MORE.filter((m) => !m.skip).length} TV:${LATEST_TV.length})`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
