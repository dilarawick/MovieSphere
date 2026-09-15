import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Tv, Clapperboard } from 'lucide-react';
import { ImdbBadge } from './bits.jsx';

export function MovieCard({ m, onMore, onPlay, inList, onToggle }) {
  const isTv = (m.mediaType || 'movie') === 'tv';
  return (
    <div className="card-shine group relative shrink-0 w-[160px] md:w-[190px] snap-start">
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-white/5 border border-white/10">
        <img src={m.poster} alt={m.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full w-1/2" />
        <div className="absolute top-2 left-2 flex gap-1">
          <ImdbBadge score={m.imdb} size="sm" />
        </div>
        <span className="absolute top-2 right-2 text-[10px] font-bold bg-black/70 px-1.5 py-0.5 rounded border border-white/20">{m.quality}</span>
        <span className={`absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${isTv ? 'bg-sky-500/90' : 'bg-violet-600/90'}`}>{isTv ? <Tv size={10} /> : <Clapperboard size={10} />}{isTv ? 'TV' : 'MOVIE'}</span>
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <div className="flex gap-2">
            <button onClick={() => onPlay(m)} className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 rounded-lg py-2.5 text-sm md:text-base font-bold min-h-[44px]"><Play size={16} fill="currentColor" />Play</button>
            <button onClick={() => onToggle(m)} aria-label="list" className="p-2.5 rounded-lg bg-white/20 hover:bg-white/35 border border-white/20 min-h-[44px] min-w-[44px] grid place-items-center">{inList ? <Check size={17} /> : <Plus size={17} />}</button>
          </div>
        </div>
      </div>
      <button onClick={() => onMore(m)} className="block w-full text-left mt-2 min-h-[44px]">
        <p className="text-base font-semibold truncate hover:text-red-400">{m.title}</p>
        <p className="text-sm text-gray-300">{m.year} • {(m.mediaType === 'tv' ? 'TV • ' : '')}{(m.genres || []).slice(0, 2).join(', ')}</p>
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
          <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
          {sub && <p className="text-base text-gray-300">{sub}</p>}
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="p-3 rounded-full bg-white/10 hover:bg-red-600 border border-white/10 min-h-[48px] min-w-[48px] grid place-items-center"><ChevronLeft size={22} /></button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="p-3 rounded-full bg-white/10 hover:bg-red-600 border border-white/10 min-h-[48px] min-w-[48px] grid place-items-center"><ChevronRight size={22} /></button>
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
