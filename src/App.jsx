import { useEffect, useMemo, useState } from 'react';
import { Flame, Trophy, LayoutGrid, SearchX, Clapperboard, WifiOff, BadgeCheck } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Row from './components/Row.jsx';
import { MovieCard } from './components/Row.jsx';
import { DetailModal, PlayerModal, ListDrawer } from './components/Modals.jsx';
import { api, API_BASE } from './lib/api.js';

const FALLBACK_GENRES = ['All','Action','Sci-Fi','Adventure','Drama','Thriller','Crime','Comedy','Animation','Horror','History'];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState(FALLBACK_GENRES);
  const [freeFilms, setFreeFilms] = useState([]);
  const [apiOnline, setApiOnline] = useState(true);
  const [lang, setLang] = useState('all');
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('latest');
  const [detail, setDetail] = useState(null);
  const [player, setPlayer] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([api.trending().catch(() => []), api.freeLegal().catch(() => []), api.genres().catch(() => FALLBACK_GENRES)])
      .then(() => setApiOnline(true)).catch(() => setApiOnline(false));
    api.movies({ lang: 'all', sort: 'latest', limit: 100 })
      .then((d) => { if (alive) { setMovies(d); setApiOnline(true); setApiError(false); } })
      .catch(() => { if (alive) { setApiOnline(false); setApiError(true); } });
    api.freeLegal().then((d) => { if (alive) setFreeFilms(d); }).catch(() => {});
    api.genres().then((g) => { if (alive && g.length) setGenres(g); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      api.movies({ lang, q: query, genre, sort, limit: 100 }).then(setMovies).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [lang, query, genre, sort]);

  const inList = (m) => watchlist.some((x) => x.id === m.id);
  const toggle = (m) => setWatchlist((w) => (inList(m) ? w.filter((x) => x.id !== m.id) : [...w, m]));
  const play = async (m) => {
    // Always resolve via /stream so TMDB trailers + provider links load fresh.
    // Show the player instantly in loading state, then swap in real URLs.
    setDetail(null);
    setPlayer({ ...m, _loading: true });
    try {
      const s = await api.stream(m.id);
      setPlayer({ ...m, ...s, _loading: false });
    } catch {
      setPlayer({ ...m, _loading: false });
    }
  };
  const featured = useMemo(() => movies.filter((m) => m.featured), [movies]);
  const trending = useMemo(() => movies.filter((m) => m.trending), [movies]);
  const english = useMemo(() => movies.filter((m) => (m.language || 'en') === 'en'), [movies]);
  const sinhala = useMemo(() => movies.filter((m) => m.language === 'si'), [movies]);
  const topRated = useMemo(() => [...movies].sort((a, b) => (b.imdb || 0) - (a.imdb || 0)).slice(0, 10), [movies]);
  return (
    <div id="top" className="min-h-screen bg-void">
      <Navbar query={query} setQuery={setQuery} watchCount={watchlist.length} onWatchOpen={() => setListOpen(true)} />
      {!apiOnline && (
        <div className="pt-20 px-6 max-w-7xl mx-auto">
          <p className="flex items-center gap-2 text-xs bg-yellow-500/15 border border-yellow-500/40 text-yellow-200 rounded-xl px-4 py-2.5"><WifiOff size={14} /> API offline — run backend: cd server, npm install, npm run dev.</p>
        </div>
      )}
      <Hero movies={featured.length ? featured : movies.slice(0, 5)} onMore={setDetail} onPlay={play} />
      <main className="max-w-7xl mx-auto px-6 md:px-10 -mt-10 relative z-30 space-y-12 pb-16">
        <div className="flex flex-wrap items-center gap-2">
          {[{ k: 'all', l: 'All Languages' }, { k: 'en', l: 'English' }, { k: 'si', l: 'Sinhala' }].map((t) => (
            <button key={t.k} onClick={() => setLang(t.k)} className={lang === t.k ? 'px-4 py-2 rounded-full text-sm font-bold bg-red-600' : 'px-4 py-2 rounded-full text-sm font-semibold bg-white/5 border border-white/15'}>{t.l}</button>
          ))}
        </div>
        {freeFilms.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-green-400 font-bold uppercase tracking-widest text-xs"><BadgeCheck size={15} /> Free and legal full films</div>
            <Row title="Watch Full Films Free" sub="Public-domain archive.org streams" movies={freeFilms} onMore={setDetail} onPlay={play} inList={inList} onToggle={toggle} />
          </div>
        )}
        <div id="trending">
          <div className="flex items-center gap-2 mb-3 text-red-500 font-bold uppercase tracking-widest text-xs">
            <Flame size={15} /> Trending Now
          </div>
          <Row title="Trending Movies" sub="Most watched this week" movies={trending} onMore={setDetail} onPlay={play} inList={inList} onToggle={toggle} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3 text-sky-400 font-bold uppercase tracking-widest text-xs"><Clapperboard size={15} /> Sinhala Cinema</div>
          <Row title="Sinhala Movies" sub="Trailer / licensed embeds" movies={sinhala} onMore={setDetail} onPlay={play} inList={inList} onToggle={toggle} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3 text-violet-400 font-bold uppercase tracking-widest text-xs"><Clapperboard size={15} /> English Cinema</div>
          <Row title="English Movies" sub="Latest plus classics" movies={english.slice(0, 12)} onMore={setDetail} onPlay={play} inList={inList} onToggle={toggle} />
        </div>
        <div id="browse" className="rounded-3xl border border-white/10 bg-panel/60 p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <h2 className="text-xl font-extrabold flex items-center gap-2"><LayoutGrid className="text-red-500" size={22} /> Browse by Genre</h2>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-black/50 border border-white/15 rounded-full text-sm px-4 py-2 outline-none">
              <option value="latest">Sort: Latest</option>
              <option value="imdb">Sort: IMDb High-Low</option>
              <option value="az">Sort: A-Z</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {genres.map((g) => (
              <button key={g} onClick={() => setGenre(g)} className={genre === g ? 'shrink-0 px-4 py-2 rounded-full text-sm font-semibold bg-red-600' : 'shrink-0 px-4 py-2 rounded-full text-sm font-semibold bg-white/5 border border-white/15 hover:bg-white/15'}>{g}</button>
            ))}
          </div>
          {apiError ? (
            <div className="py-14 text-center text-gray-400"><SearchX className="mx-auto mb-3" size={32} /><p>Couldn&apos;t reach the API{API_BASE ? ` at ${API_BASE}` : ''}.</p><p className="mt-1 text-xs">Check Railway Variables → VITE_API_URL, then redeploy.</p></div>
          ) : movies.length === 0 ? (
            <div className="py-14 text-center text-gray-400"><SearchX className="mx-auto mb-3" size={32} /><p>No movies for this filter — try “All”.</p></div>
          ) : (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
              {movies.map((m) => (<MovieCard key={m.id} m={m} onMore={setDetail} onPlay={play} inList={inList(m)} onToggle={toggle} />))}
            </div>
          )}
        </div>
        <div id="top-rated">
          <div className="flex items-center gap-2 mb-3 text-yellow-400 font-bold uppercase tracking-widest text-xs"><Trophy size={15} /> Top 10 IMDb</div>
          <Row title="Highest Rated Movies" sub="Sorted by IMDb score" movies={topRated} onMore={setDetail} onPlay={play} inList={inList} onToggle={toggle} />
        </div>
        <footer className="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between text-sm text-gray-400">
          <p className="flex items-center gap-2 font-bold text-white"><span className="grid place-items-center w-8 h-8 rounded-lg bg-red-600"><Clapperboard size={17} /></span>MovieSphere</p>
          <p>React - Express - MongoDB - TMDB metadata - archive.org public-domain streams</p>
        </footer>
      </main>
      <DetailModal m={detail} onClose={() => setDetail(null)} onPlay={play} inList={detail ? inList(detail) : false} onToggle={toggle} />
      <PlayerModal m={player} onClose={() => setPlayer(null)} />
      <ListDrawer open={listOpen} items={watchlist} onClose={() => setListOpen(false)} onMore={(m) => { setListOpen(false); setDetail(m); }} onRemove={toggle} />
    </div>
  );
}
