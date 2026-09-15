// vidsrc.mov integration — provides additional streaming server options.
// vidsrc.mov is an open-source movie streaming aggregator that provides
// embeddable players for movies and TV shows.
//
// Usage: vidsrc.mov embed URLs come in two patterns:
//   - Movies: https://vidsrc.mov/embed/movie/{tmdbId}
//   - TV:     https://vidsrc.mov/embed/tv/{tmdbId}/{season}/{episode}
//
// For movies without a TMDB ID, we fall back to a title-based search on flixnetwork.is
// (the site that fronts vidsrc) which accepts ?s= queries.

const VIDSRC_BASE = 'https://vidsrc.mov';
const FLIXNETWORK_SEARCH = 'https://flixnetwork.is';

export function buildVidsrcEmbed(tmdbId, mediaType = 'movie', season, episode) {
  if (!tmdbId) return null;
  if (mediaType === 'tv') {
    if (season == null || episode == null) return null;
    return `${VIDSRC_BASE}/embed/tv/${tmdbId}/${season}/${episode}`;
  }
  return `${VIDSRC_BASE}/embed/movie/${tmdbId}`;
}

export function buildFlixSearch(title, year) {
  const q = encodeURIComponent(`${title} ${year || ''}`.trim());
  return `${FLIXNETWORK_SEARCH}/?s=${q}`;
}

export function getStreamingServers(movie) {
  const tmdbId = movie.tmdbId;
  const mediaType = movie.mediaType || 'movie';
  const servers = [];

  // Option 1: Direct vidsrc.movie embed
  const vidsrcEmbed = buildVidsrcEmbed(tmdbId, mediaType);
  if (vidsrcEmbed) {
    servers.push({
      name: 'VidSrc',
      type: 'iframe',
      url: vidsrcEmbed,
      quality: 'Multi',
      label: 'Primary Stream',
    });
  }

  // Option 2: If no TMDB ID, link to flixnetwork search
  if (!vidsrcEmbed) {
    servers.push({
      name: 'FlixNetwork',
      type: 'link',
      url: buildFlixSearch(movie.title, movie.year),
      quality: 'Multi',
      label: 'Search on FlixNetwork',
    });
  }

  return servers;
}
