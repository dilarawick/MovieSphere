import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Tv, Clapperboard } from 'lucide-react';
import { ImdbBadge } from './bits.jsx';

export function PosterImg({ src, title, className }) {
  const [err, setErr] = useState(false);
  const bad = !src || src.includes('placehold.co') || err;
  if (bad) {
    const label = (title || 'Poster coming soon').slice(0, 42);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#001a00'/><stop offset='.5' stop-color='#003300'/><stop offset='1' stop-color='#000a00'/></linearGradient></defs><rect width='500' height='750' fill='url(#g)'/><text x='250' y='360' font-family='Orbitron' font-size='34' font-weight='bold' fill='#00ff41' text-anchor='middle'>${label.replace(/&/g, '&').replace(/</g, '<')}</text><text x='250' y='405' font-family='Orbitron' font-size='20' fill='#00ff41aa' text-anchor='middle'>MovieSphere 2026</text></svg>`;
    return (
      <img src={'data:image/svg+xml;utf8,' + encodeURIComponent(svg)} alt={title} loading="lazy" className={className} />
    );
  }
  return <img src={src} alt={title} loading="lazy" onError={() => setErr(true)} className={className} />;
}

export function MovieCard({ m, onMore, onPlay, inList, onToggle }) {
  const isTv = (m.mediaType || 'movie') === 'tv';
  return (
    <div className="card-shine group relative shrink-0 w-[160px] md:w-[190px] snap-start">
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-white/5 border border-neon/20">
        <PosterImg src={m.poster} title={m.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-r from-transparent via-neon/30 to-transparent -translate-x-full w-1/2" />
        <div className="absolute top-2 left-2 flex gap-1">
          <ImdbBadge score={m.imdb} size="sm" />
        </div>
        <span className="absolute top-2 right-2 text-[10px] font-bold bg-black/70 px-1.5 py-0.5 rounded border border-neon/30">{m.quality}</span>
        <span className={`absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${isTv ? 'bg-sky-500/90' : 'bg-violet-600/90'}`}>{isTv ? <Tv size={10} /> : <Clapperboard size={10} />}{isTv ? 'TV' : 'MOVIE'}</span>
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <div className="flex gap-2">
            <button onClick={() => onPlay(m)} className="flex-1 flex items-center justify-center gap-1.5 bg-neon hover:bg-neon-dim text-black rounded-lg py-2.5 text-sm md:text-base font-bold min-h-[44px]"><Play size={16} fill="currentColor" />Play</button>
            <button onClick={() => onToggle(m)} aria-label="list" className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 min-h-[44px] min-w-[44px] grid place-items-center text-neon">{inList ? <Check size={17} /> : <Plus size={17} />}</button>
          </div>
        </div>
      </div>
      <button onClick={() => onMore(m)} className="block w-full text-left mt-2 min-h-[44px]">
        <p className="text-base font-semibold truncate hover:text-neon">{m.title}</p>
        <p className="text-sm text-neon/60">{m.year} • {(m.mediaType === 'tv' ? 'TV • ' : '')}{(m.genres || []).slice(0, 2).join(', ')}</p>
        {m.watchNote && <p className="text-sm text-sky-300 truncate mt-0.5">{m.watchNote}</p>}
      </button>
    </div>
  );
}

export default function Row({ title, sub, movies, onMore, onPlay, inList, onToggle }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 420, behavior: 'smooth' });
  if (!movies.length) return null;
  return (
    <div className="relative">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neon">{title}</h2>
          {sub && <p className="text-base text-neon/70">{sub}</p>}
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="p-3 rounded-full bg-white/5 hover:bg-neon border border-neon/30 min-h-[48px] min-w-[48px] grid place-items-center text-neon"><ChevronLeft size={22} /></button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="p-3 rounded-full bg-white/5 hover:bg-neon border border-neon/30 min-h-[48px] min-w-[48px] grid place-items-center text-neon"><ChevronRight size={22} /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-1">
        {movies.map((m) => (
          <MovieCard key={m.id} m={m} onMore={onMore} onPlay={onPlay} inList={inList(m)} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}