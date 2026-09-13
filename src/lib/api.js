const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  movies: (params = {}) => {
    const qs = new URLSearchParams({ lang: 'all', sort: 'latest', ...params }).toString();
    return get(`/api/movies?${qs}`);
  },
  featured: () => get('/api/movies/featured'),
  trending: () => get('/api/movies/trending'),
  topRated: () => get('/api/movies/top-rated'),
  freeLegal: () => get('/api/movies/free-legal'),
  genres: () => get('/api/movies/genres'),
  detail: (id) => get(`/api/movies/${id}`),
  stream: (id) => get(`/api/movies/${id}/stream`),
  legalSources: () => get('/api/legal-sources'),
};

export const API_BASE = BASE;
