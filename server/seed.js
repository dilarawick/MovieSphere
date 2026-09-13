import 'dotenv/config';
import mongoose from 'mongoose';
import { Movie } from './models/Movie.js';
import { ENGLISH } from './data/seedEnglish.js';
import { ENGLISH_MORE } from './data/seedEnglishMore.js';
import { PUBLIC_DOMAIN } from './data/seedPublicDomain.js';
import { SINHALA } from './data/seedSinhala.js';

const all = [...ENGLISH, ...ENGLISH_MORE, ...PUBLIC_DOMAIN, ...SINHALA];

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviesphere';
  await mongoose.connect(uri);
  // Drop collection to clear any stale text index (old index treated
  // `language` as the text-search language override, rejecting 'si').
  try { await mongoose.connection.collection('movies').drop(); } catch { /* first run */ }
  await Movie.syncIndexes();
  await Movie.insertMany(all);
  console.log(`[seed] Inserted ${all.length} movies (EN:${ENGLISH.length + ENGLISH_MORE.length} PD:${PUBLIC_DOMAIN.length} SI:${SINHALA.length})`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
