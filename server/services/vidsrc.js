// vidsrc.mov integration — full-movie streaming server options.
// vidsrc.mov is part of the VidSrc embed network that provides embeddable
// players for movies and TV shows, keyed by TMDB IDs.
//
// Embed URL patterns:
//   - Movies: https://vidsrc.mov/embed/movie/{tmdbId}
//   - TV:     https://vidsrc.mov/embed/tv/{tmdbId}/{season}/{episode}
//
// For titles without a TMDB ID, we fall back to a title-based search on
// flixnetwork.is (the site that fronts vidsrc) which accepts ?s= queries.

const VIDSRC_BASE = 'https://vidsrc.mov';
const FLIXNETWORK_SEARCH = 'https://flixnetwork.is';

// Known mirror embeds of the VidSrc network. They accept the same TMDB id and
// are offered as backup servers when the primary domain is down/rate-limited.
const MIRRORS = [
  {
    name: 'VidSrc #2',
    movie: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
    tv: (id, s, e) => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'VidSrc #3',
    movie: (id) => `https://vidsrc.su/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidLink',
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
];

export function buildVidsrcEmbed(tmdbId, mediaType = 'movie', season = 1, episode = 1) {
  if (!tmdbId) return null;
  if (mediaType === 'tv') {
    return `${VIDSRC_BASE}/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
  }
  return `${VIDSRC_BASE}/embed/movie/${tmdbId}`;
}

export function buildMirrorEmbed(mirror, tmdbId, mediaType = 'movie', season = 1, episode = 1) {
  if (!tmdbId) return null;
  return mediaType === 'tv'
    ? mirror.tv(tmdbId, season || 1, episode || 1)
    : mirror.movie(tmdbId);
}

export function buildFlixSearch(title, year) {
  const q = encodeURIComponent(`${title} ${year || ''}`.trim());
  return `${FLIXNETWORK_SEARCH}/?s=${q}`;
}

export function getStreamingServers(movie) {
  const tmdbId = movie.tmdbId;
  const mediaType = movie.mediaType || 'movie';
  const season = movie.season || 1;
  const episode = movie.episode || 1;
  const servers = [];

  // Option 1: VidSrc embeds — play the FULL film / show in-app.
  const vidsrcEmbed = buildVidsrcEmbed(tmdbId, mediaType, season, episode);
  if (vidsrcEmbed) {
    servers.push({
      name: 'VidSrc',
      type: 'iframe',
      url: vidsrcEmbed,
      quality: 'Multi',
      primary: true,
      label: mediaType === 'tv' ? 'Full Show (S1 E1)' : 'Full Movie',
    });
    // Backup mirrors of the same embed network.
    MIRRORS.forEach((mirror) => {
      const url = buildMirrorEmbed(mirror, tmdbId, mediaType, season, episode);
      if (url) {
        servers.push({
          name: mirror.name,
          type: 'iframe',
          url,
          quality: 'Multi',
          label: 'Backup Server',
        });
      }
    });
  }

  // Option 2: No TMDB ID — link to a title search on the FlixNetwork front-end.
  if (!servers.length) {
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
