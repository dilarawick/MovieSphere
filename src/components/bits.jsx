import { Star, Clock, Plus, Check, Play, Info } from 'lucide-react';

export function ImdbBadge({ score, size = 'md' }) {
  const v = Number(score) || 0;
  const cls = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  const color = v >= 8 ? 'bg-yellow-400 text-black' : v >= 7 ? 'bg-yellow-400/90 text-black' : 'bg-white/20 text-white';
  return (
    <span className={`inline-flex items-center gap-1 rounded-md font-bold ${color} ${cls}`}>
      <Star size={size === 'sm' ? 11 : 13} fill="currentColor" strokeWidth={0} />
      {v ? v.toFixed(1) : 'NR'}
      <span className="font-semibold opacity-70">IMDb</span>
    </span>
  );
}

export function Meta({ movie, light = false }) {
  const pct = movie.imdb ? Math.round(movie.imdb * 10) : null;
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${light ? 'text-white/80' : 'text-white/60'}`}>
      {pct ? <span className="text-yellow-400 font-semibold">{pct}% Match</span> : null}
      <span>{movie.year}</span>
      {movie.mediaLabel ? <span className="border border-white/30 text-white/80 px-1.5 rounded text-xs">{movie.mediaLabel}</span> : null}
      <span className="flex items-center gap-1"><Clock size={14} />{movie.duration}</span>
      <span className="border border-white/30 px-1.5 rounded text-xs">{movie.maturity}</span>
      <span className="border border-white/30 px-1.5 rounded text-xs">{movie.quality}</span>
    </div>
  );
}

export function GenrePills({ genres }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {genres.map((g) => (
        <span key={g} className="text-[11px] px-2 py-0.5 rounded-full bg-black/50 border border-white/20 text-white/90">{g}</span>
      ))}
    </div>
  );
}