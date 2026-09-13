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
  try {
    const res = await fetch(`${base}${path}?${qs}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Fetch official YouTube trailer for a TMDB movie id.
// Returns { key, name, url, embedUrl } or null.
export async function getTmdbTrailer(tmdbId) {
  if (!tmdbId) return null;
  const data = await fetchTmdb(`/movie/${tmdbId}/videos`);
  const results = data?.results || [];
  if (!results.length) return null;
  const pick =
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    results.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
    results.find((v) => v.site === 'YouTube');
  if (!pick) return null;
  return {
    key: pick.key,
    name: pick.name,
    url: `https://www.youtube.com/watch?v=${pick.key}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${pick.key}?autoplay=1&rel=0`,
  };
}

// Fetch JustWatch-powered watch providers for a TMDB movie id.
// Returns { link, flatrate: [], rent: [], buy: [] } or null.
export async function getTmdbProviders(tmdbId, region = 'US') {
  if (!tmdbId) return null;
  const data = await fetchTmdb(`/movie/${tmdbId}/watch/providers`);
  if (!data?.results) return null;
  // Prefer requested region, then LK (Sri Lanka), US, GB, IN, any first.
  const order = [region, 'LK', 'US', 'GB', 'IN'];
  let entry = null;
  for (const r of order) {
    if (data.results[r]) { entry = { region: r, ...data.results[r] }; break; }
  }
  if (!entry) {
    const firstKey = Object.keys(data.results)[0];
    if (!firstKey) return null;
    entry = { region: firstKey, ...data.results[firstKey] };
  }
  const map = (arr = []) => arr.map((p) => ({
    name: p.provider_name,
    logo: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
  }));
  return {
    region: entry.region,
    link: entry.link || null,
    flatrate: map(entry.flatrate),
    rent: map(entry.rent),
    buy: map(entry.buy),
  };
}
