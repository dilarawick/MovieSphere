import { youtubeSearchEmbed, youtubeWatchEmbed } from './legalSources.js';

// Normalize any catalogue entry (DB doc or seed object) into the API shape
// the React client consumes.
export function toClientMovie(m) {
  const doc = typeof m.toObject === 'function' ? m.toObject() : m;
  const streamUrl =
    doc.streamUrl ||
    (doc.trailerYouTubeKey
      ? youtubeWatchEmbed(doc.trailerYouTubeKey)
      : youtubeSearchEmbed(doc));
  return {
    id: String(doc._id || doc.id),
    tmdbId: doc.tmdbId ?? null,
    title: doc.title,
    year: doc.year,
    imdb: doc.imdb,
    duration: doc.duration,
    maturity: doc.maturity,
    quality: doc.quality,
    genres: doc.genres || [],
    overview: doc.overview,
    cast: doc.cast || [],
    director: doc.director,
    poster: doc.poster,
    backdrop: doc.backdrop,
    tagline: doc.tagline,
    trending: !!doc.trending,
    featured: !!doc.featured,
    language: doc.language || 'en',
    languageLabel: doc.languageLabel || (doc.language === 'si' ? 'Sinhala' : 'English'),
    trailerYouTubeKey: doc.trailerYouTubeKey || null,
    streamType: doc.streamType || 'youtube-search',
    streamUrl,
    source: doc.source || 'youtube-legal',
    license: doc.license || 'All rights reserved — trailer only',
    licenseUrl: doc.licenseUrl || null,
  };
}

// Optional TMDB enrichment for metadata/posters ONLY (never video).
export async function fetchTmdb(path, params = {}) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  const base = process.env.TMDB_BASE || 'https://api.themoviedb.org/3';
  const qs = new URLSearchParams({ api_key: key, language: 'en-US', ...params });
  const res = await fetch(`${base}${path}?${qs}`);
  if (!res.ok) return null;
  return res.json();
}
