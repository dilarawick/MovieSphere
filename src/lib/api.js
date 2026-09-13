const BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');

async function get(path) {
  const url = BASE ? `${BASE}${path}` : path;
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error(`NETWORK ${url}: ${e.message}`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${url} :: ${body.slice(0, 200)}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const body = await res.text().catch(() => '');
    throw new Error(`NON-JSON ${res.status} ${url} :: ${body.slice(0, 200)}`);
  }
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
