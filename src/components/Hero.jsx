import { useEffect, useState, useCallback } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Star, Clock, Plus } from 'lucide-react';
import { ImdbBadge, Meta } from './bits.jsx';

export default function Hero({ movies, onMore, onPlay }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = movies.length;

  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (!count) return null;
  const m = movies[index];

  return (
    <section
      className="relative h-[92vh] min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {movies.map((mv, i) => (
        <div key={mv.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <img src={mv.backdrop} alt={mv.title} className={`${i === index ? 'animate-kenburns' : ''} h-full w-full object-cover`} />
        </div>
      ))}
      <div className="absolute inset-0 hero-gradient z-20" />

      <div className="absolute z-30 left-0 right-0 bottom-0 top-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
          <div key={m.id} className="max-w-2xl animate-fadeUp">
            {m.tagline && (
              <p className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-red-500 mb-3">
                <span className="inline-block h-[2px] w-8 bg-red-600" />{m.tagline}
              </p>
            )}
            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] drop-shadow-2xl">{m.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <ImdbBadge score={m.imdb} />
              <Meta movie={m} light />
            </div>
            <p className="mt-4 text-base md:text-lg text-gray-200/90 line-clamp-3 max-w-xl leading-relaxed">{m.overview}</p>
            <p className="mt-2 text-sm md:text-base text-gray-400">Starring: {(m.cast || []).join(', ')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => onPlay(m)} className="btn-primary text-lg">
                <Play size={22} fill="currentColor" /> Watch Now
              </button>
              <button onClick={() => onMore(m)} className="btn-secondary text-lg">
                <Plus size={20} /> More Info
              </button>
            </div>
            <div className="mt-5 flex gap-2 flex-wrap">
              {m.genres.map((g) => (
                <span key={g} className="text-sm md:text-base px-3.5 py-1.5 rounded-full bg-black/50 border border-white/15">{g}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => go(-1)} aria-label="Previous" className="z-40 absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 hover:bg-red-600 border border-white/15 text-lg"><ChevronLeft size={24} /></button>
      <button onClick={() => go(1)} aria-label="Next" className="z-40 absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 hover:bg-red-600 border border-white/15 text-lg"><ChevronRight size={24} /></button>

      <div className="z-40 absolute bottom-8 right-6 md:right-12 flex items-center gap-2">
        {movies.map((mv, i) => (
          <button key={mv.id} onClick={() => setIndex(i)} aria-label={'Go to ' + mv.title}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-10 bg-red-600' : 'w-4 bg-white/30 hover:bg-white/60'}`} />
        ))}
      </div>
      <div className="z-40 absolute bottom-8 left-6 md:left-10 text-xs text-white/60 font-mono">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</div>
    </section>
  );
}
