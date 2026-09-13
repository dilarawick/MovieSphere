import { X, Play, Plus, Check, Star, BadgeCheck, ExternalLink, Loader2 } from 'lucide-react';
import { ImdbBadge, Meta } from './bits.jsx';

export function LicenseChip({ m }) {
  const free = m.streamType === 'mp4' || m.streamType === 'hls';
  return (
    <span className={free ? 'inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md bg-green-500/20 text-green-300 border border-green-500/40' : 'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-white/10 text-gray-300 border border-white/15'}>
      <BadgeCheck size={12} /> {free ? 'FREE & LEGAL - Full Film' : (m.license || 'Trailer only')}
    </span>
  );
}

export function DetailModal({ m, onClose, onPlay, inList, onToggle }) {
  if (!m) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-[#12142a] border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto animate-fadeUp">
        <div className="relative h-64 md:h-80">
          <img src={m.backdrop} alt={m.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12142a] via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-red-600"><X size={18} /></button>
          <h2 className="absolute bottom-4 left-6 right-6 text-3xl md:text-5xl font-black drop-shadow">{m.title}</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <ImdbBadge score={m.imdb} />
            <Meta movie={m} light />
            <LicenseChip m={m} />
          </div>
          <div className="mt-4 flex gap-2.5">
            <button onClick={() => onPlay(m)} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-lg font-bold"><Play size={18} fill="currentColor" /> {(m.streamType === 'mp4' || m.streamType === 'hls') ? 'Watch Free Film' : 'Watch Now'}</button>
            <button onClick={() => onToggle(m)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-lg">{inList ? <Check size={17} /> : <Plus size={17} />} My List</button>
          </div>
          <p className="mt-4 text-gray-300 leading-relaxed">{m.overview}</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <p><span className="text-gray-500">Director: </span>{m.director}</p>
            <p><span className="text-gray-500">Cast: </span>{m.cast.join(', ')}</p>
            <p><span className="text-gray-500">Genres: </span>{m.genres.join(', ')}</p>
            <p className="flex items-center gap-1"><Star size={14} className="text-yellow-400" fill="currentColor" /><span className="text-gray-500">IMDb:</span> {m.imdb.toFixed(1)} / 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlayerModal({ m, onClose }) {
  if (!m) return null;
  const free = m.streamType === 'mp4' || m.streamType === 'hls';
  const hasEmbed = !!m.streamUrl;
  const trailer = m.trailer || null;
  const provider = m.provider || null;
  const watchUrl = trailer?.watchUrl || m.streamUrlFallback || null;
  const hasProv = provider && ((provider.flatrate || []).length || (provider.rent || []).length || (provider.buy || []).length);
  const embedSrc = hasEmbed
    ? (m.streamUrl.includes('autoplay') ? m.streamUrl : `${m.streamUrl}${m.streamUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`)
    : null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <div className="relative w-full max-w-5xl animate-fadeUp max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3 gap-3">
          <p className="font-bold text-lg">Now Playing: <span className="text-red-500">{m.title}</span></p>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-red-600 shrink-0"><X size={18} /></button>
        </div>
        <div className="mb-3"><LicenseChip m={m} /></div>
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black grid place-items-center">
          {m._loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Fetching trailer &amp; watch options…</p>
            </div>
          ) : free && hasEmbed ? (
            <video className="h-full w-full" src={m.streamUrl} controls autoPlay playsInline />
          ) : embedSrc ? (
            <iframe key={embedSrc} className="h-full w-full" src={embedSrc} title={`${m.title} trailer`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : (
            <div className="text-center px-8 py-10">
              <p className="font-bold text-lg mb-2">Trailer blocked for embedding</p>
              <p className="text-sm text-gray-400 mb-5">The owner disabled inline playback. Open it on YouTube instead.</p>
              {watchUrl && (<a href={watchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-lg font-bold"><ExternalLink size={16} /> Watch Trailer on YouTube</a>)}
            </div>
          )}
        </div>
        {!m._loading && !free && watchUrl && embedSrc && (
          <p className="mt-2 text-xs text-gray-400">Can&apos;t see it? <a href={watchUrl} target="_blank" rel="noreferrer" className="text-red-400 underline underline-offset-2">Open on YouTube</a></p>
        )}
        {!m._loading && !free && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-bold text-sm">Watch full film legally {provider?.region ? <span className="text-gray-400">({provider.region})</span> : null}</p>
            {hasProv ? (
              <div className="space-y-2.5 mt-2">
                {(provider.flatrate?.length > 0) && (<ProviderRow label="Stream" items={provider.flatrate} />)}
                {(provider.rent?.length > 0) && (<ProviderRow label="Rent" items={provider.rent} />)}
                {(provider.buy?.length > 0) && (<ProviderRow label="Buy" items={provider.buy} />)}
                {provider.link && (<a href={provider.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-sky-300 underline underline-offset-2">All options on TMDB <ExternalLink size={12} /></a>)}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">No streaming offers in this region. {m.tmdbUrl && (<a href={m.tmdbUrl} target="_blank" rel="noreferrer" className="text-sky-300 underline underline-offset-2">Check TMDB</a>)}</p>
            )}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500">{m.notice || (free ? ('Full film from ' + (m.source || 'archive.org')) : 'Trailer only.')}</p>
      </div>
    </div>
  );
}

function ProviderRow({ label, items }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 w-14 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <span key={p.name} className="inline-flex items-center gap-1.5 text-xs bg-black/40 border border-white/15 rounded-full pl-1 pr-3 py-1">
            {p.logo ? <img src={p.logo} alt={p.name} className="w-5 h-5 rounded-full" /> : <Star size={12} className="text-yellow-400 ml-1" />}
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ListDrawer({ open, items, onClose, onMore, onRemove }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#101223] border-l border-white/10 p-5 overflow-y-auto animate-fadeUp">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">My List ({items.length})</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-red-600"><X size={16} /></button>
        </div>
        {items.length === 0 && <p className="text-sm text-gray-400">Nothing saved yet. Hover any poster and tap + to add it here.</p>}
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-2">
              <img src={m.poster} alt={m.title} className="w-14 aspect-[2/3] object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{m.title}</p>
                <p className="text-xs text-gray-400">{m.year} • IMDb {m.imdb.toFixed(1)}</p>
                <div className="mt-1.5 flex gap-2">
                  <button onClick={() => onMore(m)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full">Details</button>
                  <button onClick={() => onRemove(m)} className="text-xs bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white px-3 py-1 rounded-full">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
