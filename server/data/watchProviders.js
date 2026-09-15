// Curated provider directory (logos via TMDB CDN).
export const PROVIDERS = {
  netflix: { name: 'Netflix', logo: 'https://image.tmdb.org/t/p/w92/9A1JSVmSxsyaBK4SUFsYVqbAYWH.jpg' },
  prime: { name: 'Prime Video', logo: 'https://image.tmdb.org/t/p/w92/68MNrwlkpF7WnmNPXLah69CR5cb.jpg' },
  disney: { name: 'Disney+', logo: 'https://image.tmdb.org/t/p/w92/7rwgEsCKZCEdTAobaVNhj8rmScZX.jpg' },
  max: { name: 'Max', logo: 'https://image.tmdb.org/t/p/w92/fksCUZ9QDWZMUwL2LgMtLckROUN.jpg' },
  apple: { name: 'Apple TV+', logo: 'https://image.tmdb.org/t/p/w92/6uhKBfmtzFqOcLousHwZuzcrScK.jpg' },
  hulu: { name: 'Hulu', logo: 'https://image.tmdb.org/t/p/w92/bPN9ehGZrmpdFj9s0P0AN0l5gkB.jpg' },
  peacock: { name: 'Peacock', logo: 'https://image.tmdb.org/t/p/w92/lvppT7zbFMWmAe0FZSrEIHfvk6t.jpg' },
  paramount: { name: 'Paramount+', logo: 'https://image.tmdb.org/t/p/w92/hphQx9lGngLuPVVg2w9nQ9yKmKc.jpg' },
  crunchyroll: { name: 'Crunchyroll', logo: 'https://image.tmdb.org/t/p/w92/gx8C3cV71M8yGrD7JdttezZT9Qb.jpg' },
  youtube: { name: 'YouTube', logo: 'https://image.tmdb.org/t/p/w92/oIk4zitD3qKSRP4IaxTiQ9Q0zzg.jpg' },
  googleplay: { name: 'Google Play', logo: 'https://image.tmdb.org/t/p/w92/8z7rC8uIDaTM91X0ZfkRf4ydofZ.jpg' },
};

export function p(...keys) {
  return keys.map((k) => PROVIDERS[k]).filter(Boolean).map(({ name, logo }) => ({ name, logo }));
}

export function buildWatchLinks(o) {
  const title = o.title || '';
  const year = o.year || '';
  const tmdbId = o.tmdbId || null;
  const mediaType = o.mediaType || 'movie';
  const q = encodeURIComponent((title + ' ' + year).trim());
  const tmdbBase = mediaType === 'tv' ? 'https://www.themoviedb.org/tv' : 'https://www.themoviedb.org/movie';
  return {
    tmdb: tmdbId ? (tmdbBase + '/' + tmdbId) : ('https://www.themoviedb.org/search?query=' + q),
    justwatch: 'https://www.justwatch.com/us/search?q=' + q,
    netflix: 'https://www.netflix.com/search?q=' + q,
    primeVideo: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=' + q,
    disney: 'https://www.disneyplus.com/search/' + q,
    max: 'https://play.max.com/search?query=' + q,
    apple: 'https://tv.apple.com/search?query=' + q,
    hulu: 'https://www.hulu.com/search?q=' + q,
    youtube: 'https://www.youtube.com/results?search_query=' + q + '+trailer',
    google: 'https://www.google.com/search?q=' + q + '+where+to+watch',
  };
}
