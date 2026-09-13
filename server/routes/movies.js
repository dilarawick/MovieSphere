import express from 'express';
import { Movie } from '../models/Movie.js';
import { toClientMovie, fetchTmdb, getTmdbTrailer, getTmdbProviders } from '../services/movieService.js';
import { ENGLISH } from '../data/seedEnglish.js';
import { ENGLISH_MORE } from '../data/seedEnglishMore.js';
import { PUBLIC_DOMAIN } from '../data/seedPublicDomain.js';
import { SINHALA } from '../data/seedSinhala.js';

const router = express.Router();
const memoryCatalogue = [...ENGLISH, ...ENGLISH_MORE, ...PUBLIC_DOMAIN, ...SINHALA]
  .map((m, i) => ({ _id: `seed-${i}`, ...m }));

async function allMovies() {
  if (dbHasMovies()) return Movie.find().lean();
  return memoryCatalogue;
}

let _dbCount = -1;
function dbHasMovies() { return _dbCount !== 0; }

router.get('/health', (req, res) => res.json({ ok: true }));

// GET /api/movies?lang=en|si|all&q=&genre=&sort=latest|imdb|az&limit=
router.get('/', async (req, res) => {
  const { lang = 'all', q = '', genre = 'All', sort = 'latest', limit = 100 } = req.query;
  let list = await allMovies();
  if (lang !== 'all') list = list.filter((m) => (m.language || 'en') === lang);
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
// legal option in this order:
//   1. Stored trailerYouTubeKey / streamUrl (seed)
//   2. Live TMDB /movie/{id}/videos trailer via TMDB_API_KEY
//   3. JustWatch watch-providers (rent/buy/subscription) via TMDB
//   4. YouTube search fallback (user clicks through to a real page)
router.get('/:id/stream', async (req, res) => {
  const list = await allMovies();
  const found = list.find((m) => String(m._id || m.id) === req.params.id || String(m.tmdbId) === req.params.id);
  if (!found) return res.status(404).json({ error: 'Movie not found' });
  const c = toClientMovie(found);
  const isFullFilm = ['mp4', 'hls'].includes(c.streamType);
  if (isFullFilm) {
    return res.json({
      title: c.title,
      year: c.year,
      streamType: c.streamType,
      streamUrl: c.streamUrl,
      source: c.source,
      license: c.license,
      licenseUrl: c.licenseUrl,
      fullFilmFree: true,
      provider: null,
      tmdbUrl: c.tmdbId ? `https://www.themoviedb.org/movie/${c.tmdbId}` : null,
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
      trailerKey ? null : getTmdbTrailer(c.tmdbId).catch(() => null),
      getTmdbProviders(c.tmdbId, req.query.region || 'US').catch(() => null),
    ]);
    if (trailer) {
      trailerKey = trailer.key;
      trailerEmbed = trailer.embedUrl;
      trailerWatch = trailer.url;
    }
    providers = prov;
  }

  // Final fallback: a YouTube search page that always loads.
  const q = encodeURIComponent(`${c.title} ${c.year || ''} official trailer`.trim());
  const searchUrl = `https://www.youtube.com/results?search_query=${q}`;

  res.json({
    title: c.title,
    year: c.year,
    streamType: trailerEmbed ? 'youtube' : 'youtube-search',
    streamUrl: trailerEmbed || null,
    streamUrlFallback: searchUrl,
    source: 'youtube-legal',
    license: c.license,
    licenseUrl: c.licenseUrl,
    fullFilmFree: false,
    provider: providers,
    tmdbUrl: c.tmdbId ? `https://www.themoviedb.org/movie/${c.tmdbId}` : null,
    trailer: trailerKey
      ? { key: trailerKey, embedUrl: trailerEmbed, watchUrl: trailerWatch }
      : { key: null, embedUrl: null, watchUrl: searchUrl },
    notice: 'Trailer plays in-app. Full film is under copyright — use the provider links below to watch legally.',
  });
});

// Movie API proxy — TMDB metadata only (requires TMDB_API_KEY).
router.get('/external/tmdb/trending', async (req, res) => {
  const data = await fetchTmdb('/trending/movie/week');
  if (!data) return res.status(503).json({ error: 'TMDB not configured. Set TMDB_API_KEY in server/.env' });
  res.json(data);
});

export function setDbCount(n) { _dbCount = n; }
export default router;
