import express from 'express';
import { Movie } from '../models/Movie.js';
import { toClientMovie, fetchTmdb } from '../services/movieService.js';
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
router.get('/:id/stream', async (req, res) => {
  const list = await allMovies();
  const found = list.find((m) => String(m._id || m.id) === req.params.id || String(m.tmdbId) === req.params.id);
  if (!found) return res.status(404).json({ error: 'Movie not found' });
  const c = toClientMovie(found);
  res.json({
    title: c.title,
    streamType: c.streamType,
    streamUrl: c.streamUrl,
    source: c.source,
    license: c.license,
    licenseUrl: c.licenseUrl,
    fullFilmFree: ['mp4', 'hls'].includes(c.streamType),
    notice:
      c.streamType === 'mp4' || c.streamType === 'hls'
        ? 'Full film — public-domain or rights-holder licensed. Free & legal.'
        : 'Trailer / licensed embed only — this title is under copyright and cannot be streamed free in full.',
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
