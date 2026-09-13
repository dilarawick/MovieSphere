import { Star, Clock, Plus, Check, Play, Info } from 'lucide-react';

export function ImdbBadge({ score, size = 'md' }) {
  const cls = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  const color = score >= 8 ? 'bg-yellow-400 text-black' : score >= 7 ? 'bg-yellow-400/90 text-black' : 'bg-white/15 text-white';
  return (
    <span className={`inline-flex items-center gap-1 rounded-md font-bold ${color} ${cls}`}>
      <Star size={size === 'sm' ? 11 : 13} fill="currentColor" strokeWidth={0} />
      {score.toFixed(1)}
      <span className="font-semibold opacity-70">IMDb</span>
    </span>
  );
}

export function Meta({ movie, light = false }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${light ? 'text-white/80' : 'text-gray-400'}`}>
      <span className="text-green-400 font-semibold">{Math.round(movie.imdb * 10)}% Match</span>
      <span>{movie.year}</span>
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
        <span key={g} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-gray-200">{g}</span>
      ))}
    </div>
  );
}
