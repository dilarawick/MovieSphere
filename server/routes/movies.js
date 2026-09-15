import express from 'express';
import { Movie } from '../models/Movie.js';
import { toClientMovie, fetchTmdb, getTmdbTrailer, getTmdbProviders } from '../services/movieService.js';
import { applyPosterFix3 } from '../data/posterFix3.js';
import { getStreamingServers } from '../services/vidsrc.js';
import { ENGLISH } from '../data/seedEnglish.js';
import { ENGLISH_MORE } from '../data/seedEnglishMore.js';
import { PUBLIC_DOMAIN } from '../data/seedPublicDomain.js';
import { SINHALA } from '../data/seedSinhala.js';
import { LATEST_MOVIES } from '../data/seed2026a.js';
import { LATEST_MORE } from '../data/seed2026b.js';
import { LATEST_TV } from '../data/seed2026c.js';
import { BULK_HORROR } from '../data/seedBulkHorror1.js';
import { BULK_HORROR2 } from '../data/seedBulkHorror2.js';
import { BULK_COMEDY } from '../data/seedBulkComedy.js';
import { BULK_FAMILY } from '../data/seedBulkFamily.js';
import { BULK_THRILLER } from '../data/seedBulkThriller.js';
import { BULK_2026 } from '../data/seedBulkExtra.js';
import { REAL2026_A } from '../data/seed2026real1.js';
import { REAL2026_B } from '../data/seed2026real2.js';
import { REAL2026_C } from '../data/seed2026real3.js';
import { REAL2026_D } from '../data/seed2026real4.js';

const router = express.Router();
function dedupe(list) {
  const seen = new Set();
  return list.filter((m) => {
    if (m.skip) return false;
    const key = `${(m.title || '').toLowerCase().trim()}::${m.year || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function withType(list, fallback) {
  return list.filter((m) => !m.skip).map((m) => ({ mediaType: fallback, ...m }));
}
const memoryCatalogue = dedupe([
  ...withType(ENGLISH, 'movie'),
  ...withType(ENGLISH_MORE, 'movie'),
  ...withType(PUBLIC_DOMAIN, 'movie'),
  ...withType(SINHALA, 'movie'),
  ...withType(LATEST_MOVIES, 'movie'),
  ...withType(LATEST_MORE, 'movie'),
  ...withType(BULK_HORROR, 'movie'),
  ...withType(BULK_HORROR2, 'movie'),
  ...withType(BULK_COMEDY, 'movie'),
  ...withType(BULK_FAMILY, 'movie'),
  ...withType(BULK_THRILLER, 'movie'),
  ...withType(BULK_2026, 'movie'),
  ...withType(REAL2026_A, 'movie'),
  ...withType(REAL2026_B, 'movie'),
  ...withType(REAL2026_C, 'movie'),
  ...withType(REAL2026_D, 'movie'),
  ...withType(LATEST_TV, 'tv'),
]).map((m, i) => ({ _id: `seed-${i}`, ...m }));

async function allMovies() {
  if (dbHasMovies()) return Movie.find().lean();
  return applyPosterFix3(memoryCatalogue);
}

let _dbCount = -1;
// -1 = unknown (startup race — use seeds until boot finishes, never DB)
//  0 = known-empty -> use in-memory seeds
// >0 = use Mongo
function dbHasMovies() { return _dbCount > 0; }

router.get('/health', (req, res) => res.json({ ok: true }));

// GET /api/movies?lang=en|si|all&type=movie|tv|all&q=&genre=&sort=latest|imdb|az&limit=
router.get('/', async (req, res) => {
  const { lang = 'all', type = 'all', q = '', genre = 'All', sort = 'latest', limit = 100 } = req.query;
  let list = await allMovies();
  if (lang !== 'all') list = list.filter((m) => (m.language || 'en') === lang);
  if (type !== 'all') list = list.filter((m) => (m.mediaType || 'movie') === type);
  if (genre !== 'All') list = list.filter((m) => (m.genres || []).includes(genre));
  if (q.trim()) {
    const needle = q.toLowerCase();
    list = list.filter((m) => `${m.title} ${m.director || ''} ${(m.cast || []).join(' ')}`.toLowerCase().includes(needle));
  }
  if (sort === 'imdb') list = [...list].sort((a, b) => (b.imdb || 0) - (a.imdb || 0));
  else if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else list = [...list].sort((a, b) => (b.year || 0) - (a.year || 0));
  res.json(list.slice(0, Number(limit)).map(toClientMovie));
});

// GET /api/movies/featured | /trending | /top-rated | /free-legal
router.get('/featured', async (req, res) => {
  const list = (await allMovies()).filter((m) => m.featured);
  res.json(list.map(toClientMovie));
});

router.get('/trending', async (req, res) => {
  const list = (await allMovies()).filter((m) => m.trending);
  res.json(list.map(toClientMovie));
});

router.get('/top-rated', async (req, res) => {
  const list = [...(await allMovies())].sort((a, b) => (b.imdb || 0) - (a.imdb || 0)).slice(0, 10);
  res.json(list.map(toClientMovie));
});

// Full films that are 100% free & legal (public domain mp4 or licensed).
router.get('/free-legal', async (req, res) => {
  const list = (await allMovies()).filter((m) => ['mp4', 'hls'].includes(m.streamType));
  res.json(list.map(toClientMovie));
});

router.get('/genres', async (req, res) => {
  const set = new Set();
  (await allMovies()).forEach((m) => (m.genres || []).forEach((g) => set.add(g)));
  res.json(['All', ...[...set].sort()]);
});

// GET /api/movies/:id — detail incl. stream info
router.get('/:id', async (req, res) => {
  const list = await allMovies();
  const found = list.find((m) => String(m._id || m.id) === req.params.id || String(m.tmdbId) === req.params.id);
  if (!found) return res.status(404).json({ error: 'Movie not found' });
  res.json(toClientMovie(found));
});

// GET /api/movies/:id/stream — legal playback descriptor
// Full films (mp4/hls) stream directly. Everything else resolves the best
// legal option: stored trailer, live TMDB trailer, curated + live providers,
// deep watch-links (Netflix / Prime / Disney / Max / Apple / Hulu / JustWatch).
router.get('/:id/stream', async (req, res) => {
  const list = await allMovies();
  const found = list.find((m) => String(m._id || m.id) === req.params.id || String(m.tmdbId) === req.params.id);
  if (!found) return res.status(404).json({ error: 'Movie not found' });
  const c = toClientMovie(found);
  const mediaKind = c.mediaType || 'movie';
  const tmdbBase = mediaKind === 'tv' ? 'https://www.themoviedb.org/tv' : 'https://www.themoviedb.org/movie';
  const isFullFilm = ['mp4', 'hls'].includes(c.streamType);
  if (isFullFilm) {
    return res.json({
      title: c.title,
      year: c.year,
      mediaType: mediaKind,
      streamType: c.streamType,
      streamUrl: c.streamUrl,
      source: c.source,
      license: c.license,
      licenseUrl: c.licenseUrl,
      fullFilmFree: true,
      provider: null,
      watchLinks: c.watchLinks,
      tmdbUrl: c.tmdbId ? `${tmdbBase}/${c.tmdbId}` : null,
      trailer: null,
      notice: 'Full film — public-domain or rights-holder licensed. Free & legal.',
    });
  }

  // Trailer-only title: start with stored values, then enrich live via TMDB.
  let trailerKey = c.trailerYouTubeKey || null;
  let trailerEmbed = c.streamType === 'youtube' && c.streamUrl ? c.streamUrl : null;
  let trailerWatch = trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null;
  let providers = null;

  if (c.tmdbId) {
    const [trailer, prov] = await Promise.all([
      trailerKey ? null : getTmdbTrailer(c.tmdbId, mediaKind).catch(() => null),
      getTmdbProviders(c.tmdbId, req.query.region || 'US', mediaKind).catch(() => null),
    ]);
    if (trailer) {
      trailerKey = trailer.key;
      trailerEmbed = trailer.embedUrl;
      trailerWatch = trailer.url;
    }
    providers = prov;
  }

  // Merge curated offline providers with live TMDB providers (no TMDB key needed for curated).
  const curated = found.curatedProviders || c.curatedProviders || null;
  const merged = {
    region: providers?.region || 'US',
    link: providers?.link || c.watchLinks.justwatch,
    flatrate: mergeProv(curated?.flatrate, providers?.flatrate),
    rent: mergeProv(curated?.rent, providers?.rent),
    buy: mergeProv(curated?.buy, providers?.buy),
    theaters: !!(curated?.theaters),
  };
  const hasAny = merged.flatrate.length || merged.rent.length || merged.buy.length || merged.theaters;

  // Final fallback: a YouTube search page that always loads.
  const q = encodeURIComponent(`${c.title} ${c.year || ''} official trailer`.trim());
  const searchUrl = `https://www.youtube.com/results?search_query=${q}`;

  // Generate alternative streaming server options via vidsrc
  const servers = getStreamingServers(c);

  res.json({
    title: c.title,
    year: c.year,
    mediaType: mediaKind,
    mediaLabel: c.mediaLabel,
    streamType: trailerEmbed ? 'youtube' : 'youtube-search',
    streamUrl: trailerEmbed || null,
    streamUrlFallback: searchUrl,
    source: 'youtube-legal',
    license: c.license,
    licenseUrl: c.licenseUrl,
    fullFilmFree: false,
    watchNote: c.watchNote,
    provider: hasAny ? merged : providers,
    watchLinks: c.watchLinks,
    tmdbUrl: c.tmdbId ? `${tmdbBase}/${c.tmdbId}` : null,
    trailer: trailerKey
      ? { key: trailerKey, embedUrl: trailerEmbed, watchUrl: trailerWatch }
      : { key: null, embedUrl: null, watchUrl: searchUrl },
    servers,
    notice: mediaKind === 'tv'
      ? 'Trailer plays in-app. Full episodes are under copyright — use the provider links below to watch legally.'
      : 'Trailer plays in-app. Use the server options below to watch the full film.',
  });
});

function mergeProv(a = [], b = []) {
  const seen = new Set();
  const out = [];
  [...(a || []), ...(b || [])].forEach((x) => {
    if (!x || !x.name || seen.has(x.name)) return;
    seen.add(x.name);
    out.push(x);
  });
  return out;
}

// Movie API proxy — TMDB metadata only (requires TMDB_API_KEY).
router.get('/external/tmdb/trending', async (req, res) => {
  const data = await fetchTmdb('/trending/movie/week');
  if (!data) return res.status(503).json({ error: 'TMDB not configured. Set TMDB_API_KEY in server/.env' });
  res.json(data);
});

export function setDbCount(n) { _dbCount = n; }
export default router;
