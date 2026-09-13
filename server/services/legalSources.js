// Central catalogue of LEGAL / public-domain video sources.
// Rule: MovieSphere never hosts or links pirated files. Full-film playback is
// only allowed from these categories:
//
//  1. Public-domain films on the Internet Archive (archive.org) — direct .mp4
//     downloads that are explicitly marked public domain.
//  2. Creator-licensed YouTube embeds (official trailers, Creative-Commons or
//     rights-holder uploads, Sinhala tele/short films shared legally).
//  3. TMDB API — metadata/posters/ratings ONLY (no video).
//  4. Rights-holder licensed MP4/HLS URLs added by an admin (streamUrl).
//
// Anything still under copyright (most modern English + Sinhala cinema) is
// served as metadata + trailer, never as a full free stream.

export const LEGAL_SOURCES = [
  {
    name: 'Internet Archive — Public Domain Feature Films',
    type: 'mp4',
    url: 'https://archive.org/details/movies',
    license: 'Public Domain',
    note: 'Direct mp4 files, e.g. Night of the Living Dead (1968). Stable hotlinkable downloads.',
  },
  {
    name: 'TMDB API — metadata, posters, ratings',
    type: 'metadata-only',
    url: 'https://www.themoviedb.org/documentation/api',
    license: 'Metadata only, no video',
    note: 'Set TMDB_API_KEY in server/.env to enable live metadata enrichment.',
  },
  {
    name: 'YouTube official / licensed embeds',
    type: 'youtube',
    url: 'https://www.youtube.com',
    license: 'YouTube Standard / Creative Commons via rights holder',
    note: 'Used for trailers and legally-shared Sinhala films. Embed via youtube-nocookie.',
  },
];

export function buildTrailerQuery(movie) {
  return `${movie.title} ${movie.year || ''} official trailer`.trim();
}

export function youtubeSearchEmbed(movie) {
  const q = encodeURIComponent(buildTrailerQuery(movie));
  return `https://www.youtube.com/embed?listType=search&list=${q}&rel=0`;
}

export function youtubeWatchEmbed(key) {
  return `https://www.youtube-nocookie.com/embed/${key}?rel=0`;
}
