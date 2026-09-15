import { useEffect, useState } from 'react';
import { X, Play, Plus, Check, Star, BadgeCheck, ExternalLink, Loader2, Tv, Clapperboard } from 'lucide-react';
import { ImdbBadge, Meta } from './bits.jsx';
import { PosterImg } from './Row.jsx';

export function MediaBadge({ type }) {
  if (type === 'tv') {
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/90 text-white"><Tv size={11} /> TV</span>;
  }
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-600/90 text-white"><Clapperboard size={11} /> MOVIE</span>;
}

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
          <PosterImg src={m.backdrop} title={m.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12142a] via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-red-600"><X size={18} /></button>
          <h2 className="absolute bottom-4 left-6 right-6 text-3xl md:text-5xl font-black drop-shadow">{m.title}</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <ImdbBadge score={m.imdb} />
            <MediaBadge type={m.mediaType} />
            <Meta movie={m} light />
            <LicenseChip m={m} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => onPlay(m)} className="btn-primary"><Play size={22} fill="currentColor" /> {(m.streamType === 'mp4' || m.streamType === 'hls') ? 'Watch Free Film' : (m.mediaType === 'tv' ? 'Watch Trailer + Where to Watch' : 'Watch Now')}</button>
            <button onClick={() => onToggle(m)} className="btn-secondary">{inList ? <Check size={20} /> : <Plus size={20} />} My List</button>
          </div>
          <p className="mt-4 text-base md:text-lg text-gray-200 leading-relaxed">{m.overview}</p>
          {m.watchNote && <p className="mt-3 text-base text-sky-200 bg-sky-500/10 border border-sky-500/30 rounded-xl px-4 py-3">Where to watch: {m.watchNote}</p>}
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-base">
            <p><span className="text-gray-500">Director: </span>{m.director || '—'}</p>
            <p><span className="text-gray-500">Cast: </span>{(m.cast || []).join(', ') || '—'}</p>
            <p><span className="text-gray-500">Genres: </span>{(m.genres || []).join(', ')}</p>
            <p className="flex items-center gap-1"><Star size={14} className="text-yellow-400" fill="currentColor" /><span className="text-gray-500">IMDb:</span> {m.imdb ? m.imdb.toFixed(1) : 'NR'} / 10</p>
          </div>
          {m.watchLinks && <WatchLinks links={m.watchLinks} title={m.title} />}
        </div>
      </div>
    </div>
  );
}

export function PlayerModal({ m, onClose }) {
  // tab: null = auto (play the VidSrc full movie when available, else trailer),
  // 'trailer' = YouTube trailer tab, or a server url from m.servers.
  const [tab, setTab] = useState(null);
  const movieId = m ? m.id : null;
  useEffect(() => { setTab(null); }, [movieId]);
  if (!m) return null;

  const free = m.streamType === 'mp4' || m.streamType === 'hls';
  const embedServers = (m.servers || []).filter((s) => s.type === 'iframe');
  const linkServers = (m.servers || []).filter((s) => s.type === 'link');
  const playEmbed = m.playEmbed || (embedServers[0] ? embedServers[0].url : null);
  const trailer = m.trailer || null;
  const provider = m.provider || null;
  const watchLinks = m.watchLinks || null;
  const watchUrl = trailer?.watchUrl || m.streamUrlFallback || null;
  const hasProv = provider && ((provider.flatrate || []).length || (provider.rent || []).length || (provider.buy || []).length || provider.theaters);
  const yt = (u) => (u.includes('autoplay') ? u : `${u}${u.includes('?') ? '&' : '?'}autoplay=1&rel=0`);
  const trailerSrc = m.streamUrl ? yt(m.streamUrl) : (trailer?.embedUrl ? yt(trailer.embedUrl) : null);

  const activeServer = tab && tab !== 'trailer' ? embedServers.find((s) => s.url === tab) : null;
  const mode = free && m.streamUrl ? 'free'
    : tab === 'trailer' ? 'trailer'
    : (activeServer || (!tab && playEmbed)) ? 'server'
    : trailerSrc ? 'trailer'
    : 'none';
  const activeUrl = mode === 'server' ? (activeServer ? activeServer.url : playEmbed) : mode === 'trailer' ? trailerSrc : null;
  const showTabs = !m._loading && !free && (playEmbed || trailerSrc);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <div className="relative w-full max-w-5xl animate-fadeUp max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3 gap-3">
          <p className="font-bold text-lg">Now Playing: <span className="text-red-500">{m.title}</span></p>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-red-600 shrink-0"><X size={18} /></button>
        </div>
        <div className="mb-3"><LicenseChip m={m} /></div>

        {showTabs && (
          <div className="mb-3 flex flex-wrap gap-2 items-center">
            {embedServers.map((s) => (
              <button
                key={s.url}
                onClick={() => setTab(s.url)}
                className={(mode === 'server' && activeUrl === s.url) ? 'btn-primary text-xs px-3 py-2' : 'btn-secondary text-xs px-3 py-2'}
              >
                <Play size={12} fill="currentColor" /> {s.name} — {s.label || 'Full Movie'}
              </button>
            ))}
            {trailerSrc && (
              <button onClick={() => setTab('trailer')} className={mode === 'trailer' ? 'btn-primary text-xs px-3 py-2' : 'btn-secondary text-xs px-3 py-2'}>
                Trailer (YouTube)
              </button>
            )}
          </div>
        )}
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black grid place-items-center">
          {m._loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Loading stream…</p>
            </div>
          ) : mode === 'free' ? (
            <video className="h-full w-full" src={m.streamUrl} controls autoPlay playsInline />
          ) : mode === 'server' ? (
            <iframe key={activeUrl} className="h-full w-full" src={activeUrl} title={`${m.title} — full stream`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : mode === 'trailer' ? (
            <iframe key={activeUrl} className="h-full w-full" src={trailerSrc} title={`${m.title} trailer`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : (
            <div className="text-center px-8 py-10">
              <p className="font-bold text-lg mb-2">Stream not available in-app</p>
              <p className="text-sm text-gray-400 mb-5">This title has no TMDB id for the embed player. Open it on the search page instead.</p>
              {watchUrl && (<a href={watchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-lg font-bold"><ExternalLink size={16} /> Watch on YouTube</a>)}
            </div>
          )}
        </div>

        {mode === 'server' && activeUrl && (
          <p className="mt-2 text-xs text-gray-400">
            Player not loading? The server may be rate-limited — switch tabs above, or{' '}
            <a href={activeUrl} target="_blank" rel="noreferrer" className="text-red-400 underline underline-offset-2">open the player in a new tab</a>.
          </p>
        )}
        {mode === 'trailer' && watchUrl && (
          <p className="mt-2 text-xs text-gray-400">Can&apos;t see it? <a href={watchUrl} target="_blank" rel="noreferrer" className="text-red-400 underline underline-offset-2">Open on YouTube</a></p>
        )}
        {!m._loading && !free && (provider || watchLinks || linkServers.length > 0) && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            {linkServers.length > 0 && (
              <div className="mb-4">
                <p className="font-bold text-sm mb-2">Alternative Servers</p>
                <div className="flex flex-wrap gap-2">
                  {linkServers.map((s) => (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs px-3 py-1.5">
                      {s.name} — Search
                    </a>
                  ))}
                </div>
              </div>
            )}
            <p className="font-bold text-sm">{m.mediaType === 'tv' ? 'Watch series legally' : 'Watch full film legally'} {provider?.region ? <span className="text-gray-400">({provider.region})</span> : null}</p>
            {m.watchNote && <p className="text-xs text-sky-300 mt-1">{m.watchNote}</p>}
            {hasProv ? (
              <div className="space-y-2.5 mt-2">
                {(provider.flatrate?.length > 0) && (<ProviderRow label="Stream" items={provider.flatrate} />)}
                {(provider.rent?.length > 0) && (<ProviderRow label="Rent" items={provider.rent} />)}
                {(provider.buy?.length > 0) && (<ProviderRow label="Buy" items={provider.buy} />)}
                {provider.theaters && <p className="text-xs text-amber-300">In theaters now — check local listings.</p>}
                {provider.link && (<a href={provider.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-sky-300 underline underline-offset-2">All options on JustWatch / TMDB <ExternalLink size={12} /></a>)}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">No streaming offers in this region. {m.tmdbUrl && (<a href={m.tmdbUrl} target="_blank" rel="noreferrer" className="text-sky-300 underline underline-offset-2">Check TMDB</a>)}</p>
            )}
            {watchLinks && <WatchLinks links={watchLinks} compact />}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500">{m.notice || (free ? ('Full film from ' + (m.source || 'archive.org')) : 'Full movie streams via VidSrc; use the Trailer tab as a fallback.')}</p>
      </div>
    </div>
  );
}

export function WatchLinks({ links, title, compact = false }) {
  const items = [
    ['Netflix', links.netflix],
    ['Prime Video', links.primeVideo],
    ['Disney+', links.disney],
    ['Max', links.max],
    ['Apple TV', links.apple],
    ['Hulu', links.hulu],
    ['JustWatch', links.justwatch],
    ['YouTube', links.youtube],
    ['Google', links.google],
  ];
  return (
    <div className={compact ? 'mt-4' : 'mt-4 rounded-2xl border border-white/10 bg-black/30 p-5'}>
      <p className="font-bold text-base md:text-lg">Find {title ? `"${title}"` : 'this title'} on:</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {items.map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="btn-watch">
            {label} <ExternalLink size={14} />
          </a>
        ))}
        {links.tmdb && (
          <a href={links.tmdb} target="_blank" rel="noreferrer" className="btn-watch">
            TMDB <ExternalLink size={14} />
          </a>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-400">Links open the provider search — availability varies by country. MovieSphere never hosts pirated video.</p>
    </div>
  );
}

function ProviderRow({ label, items }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <span className="text-sm font-bold uppercase tracking-widest text-gray-300 w-16 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <span key={p.name} className="inline-flex items-center gap-2 text-sm md:text-base bg-black/40 border border-white/15 rounded-full pl-1.5 pr-4 py-1.5">
            {p.logo ? <img src={p.logo} alt={p.name} className="w-6 h-6 rounded-full" /> : <Star size={14} className="text-yellow-400 ml-1" />}
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
        {items.length === 0 && <p className="text-base text-gray-300">Nothing saved yet. Hover any poster and tap + to add it here.</p>}
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
              <PosterImg src={m.poster} title={m.title} className="w-16 aspect-[2/3] object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">{m.title}</p>
                <p className="text-sm text-gray-300">{m.year} • {m.mediaLabel || 'Movie'} • IMDb {m.imdb ? m.imdb.toFixed(1) : 'NR'}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => onMore(m)} className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full min-h-[40px]">Details</button>
                  <button onClick={() => onRemove(m)} className="text-sm font-semibold bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white px-4 py-2 rounded-full min-h-[40px]">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
