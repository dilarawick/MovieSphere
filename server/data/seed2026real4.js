// REAL Jan 2026 streaming hits (already out of theaters).
import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg';
const PH = (t) => 'https://placehold.co/500x750/0d1d33/FFF?text=' + encodeURIComponent(t);
function mk(rows, lic, th) {
  return rows.map((r) => ({
    tmdbId: null, title: r[0], year: 2026, imdb: 0,
    duration: '2h 0m', maturity: 'PG-13', quality: '4K',
    genres: r[1], overview: r[2], cast: [r[3], r[4]], director: r[5],
    poster: PH(r[0]), backdrop: BD, trending: !!r[6], featured: false,
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: lic,
    watchNote: r[7],
    curatedProviders: { flatrate: p(...(r[8] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple'), theaters: th },
  }));
}
const OUT = 'All rights reserved - trailer only';
export const REAL2026_D = [
...mk([
['We Bury the Dead', ['Horror','Thriller'], 'Daisy Ridley survives a zombie outbreak in Tasmania.', 'Daisy Ridley', 'Brenton Thwaites', 'Zak Hilditch', 1, 'In theaters Jan 2 2026. Rent on Prime Video.', []],
['The Rip', ['Crime','Thriller'], 'Miami cops find cartel millions. Affleck + Damon.', 'Ben Affleck', 'Matt Damon', 'Joe Carnahan', 1, 'Stream on Netflix from Jan 16 2026.', ['netflix']],
['The Dutchman', ['Drama','Thriller'], 'Subway encounter turns tense. From Amiri Baraka play.', 'Andre Holland', 'Kate Mara', 'Andre Gaines', 0, 'In theaters Jan 2 2026. Rent on Prime Video.', []],
['The Other Woman', ['Comedy','Romance'], 'A widow crashes weddings until love finds her.', 'Amanda Seyfried', 'Robbie Williams', 'Frank Coraci', 0, 'Stream on Netflix from Jan 9 2026.', ['netflix']],
], OUT, false),
];
