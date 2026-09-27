import { useEffect, useState } from 'react';
import { Search, Clapperboard, Bookmark } from 'lucide-react';

export default function Navbar({ query, setQuery, watchCount, onWatchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'glass border-b border-white/10 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center gap-4">
        <a href="#top" className="flex items-center gap-2 font-display font-black text-xl tracking-tight text-white">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-neon text-black shadow-lg shadow-neon/50"><Clapperboard size={20} /></span>
          Movie<span className="text-neon">Sphere</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70 ml-6 font-body">
          <a href="#top" className="hover:text-white">Home</a>
          <a href="#trending" className="hover:text-white">Trending</a>
          <a href="#latest" className="hover:text-white">2026 Latest</a>
          <a href="#tv" className="hover:text-white">TV Shows</a>
          <a href="#browse" className="hover:text-white">Browse</a>
          <a href="#top-rated" className="hover:text-white">Top IMDb</a>
        </nav>
        <div className="flex-1" />
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies & TV shows..."
            className="w-56 focus:w-72 transition-all bg-white/5 border border-white/20 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-neon placeholder:text-white/50 text-white" />
        </div>
        <button onClick={onWatchOpen} className="relative flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/15 rounded-full px-4 py-2 text-white font-body">
          <Bookmark size={16} /> My List
          {watchCount > 0 && <span className="absolute -top-2 -right-1 w-5 h-5 grid place-items-center rounded-full bg-neon text-black text-[11px] font-bold">{watchCount}</span>}
        </button>
      </div>
      <div className="sm:hidden px-6 pb-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies..."
          className="w-full bg-white/5 border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-neon text-white placeholder:text-white/50 font-body" />
      </div>
    </header>
  );
}