// REAL 2026 movies part 3 (Jan-Mar + Sep-Dec + horror).
import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/h8gHn0OzBoaefsYseUByqsmEDMY.jpg';
const PH = (t) => 'https://placehold.co/500x750/2b0d0d/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: null, title: r[0], year: 2026, imdb: 0,
    duration: '1h 50m', maturity: 'R', quality: '4K',
    genres: r[1], overview: r[2], cast: [r[3], r[4]], director: r[5],
    poster: PH(r[0]), backdrop: BD, trending: !!r[6], featured: false,
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'In theaters - trailer only',
    watchNote: r[7],
    curatedProviders: { flatrate: p(...(r[8] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple'), theaters: true },
  }));
}
export const REAL2026_C = mk([
['The Backrooms', ['Horror','Sci-Fi'], 'A teen falls into liminal yellow halls. A24 viral horror.', 'Chiwetel Ejiofor', 'Mark Duplass', 'Kane Parsons', 1, 'In theaters May 2026. Later on Max.', []],
['Obsession', ['Horror','Thriller'], 'Blumhouse stalker horror, 2026 box office hit.', 'Michael Johnston', 'Inde Navarrette', 'Curry Barker', 1, 'In theaters May 2026. Later on Peacock.', []],
['The End of Oak Street (2026 Wide)', ['Horror','Thriller'], 'Wide 2026 release: woman haunted after Oak Street move.', 'Becca Hirani', 'Kevin Leslie', 'Victor Jasseron', 1, 'In theaters Aug 12 2026. Rent on Prime Video.', []],
['Whistle', ['Horror'], 'Cursed Aztec death whistle kills teens.', 'Dafne Keen', 'Sophie Nelisse', 'Corin Hardy', 0, 'In theaters Feb 2026. Later on Max.', []],
['The Strangers: Chapter 2', ['Horror'], 'Maya fights back in the woods sequel.', 'Madelaine Petsch', 'Gabriel Basso', 'Renny Harlin', 0, 'In theaters Feb 2026. Rent on Prime Video.', []],
['Resident Evil Reboot', ['Horror','Action'], 'Zach Cregger grounded Raccoon City reboot.', 'Austin Abrams', 'Paul Walter Hauser', 'Zach Cregger', 1, 'In theaters Sep 18 2026. Later on Netflix.', []],
['The Hunger Games: Sunrise on the Reaping', ['Action','Drama'], 'Young Haymitch Second Quarter Quell prequel.', 'Joseph Zada', 'Whitney Peak', 'Francis Lawrence', 1, 'In theaters Nov 20 2026. Later on Peacock.', []],
['Jumanji 3', ['Adventure','Comedy'], 'The game returns for one last round.', 'Dwayne Johnson', 'Kevin Hart', 'Jake Kasdan', 1, 'In theaters Dec 11 2026. Later on Netflix.', []],
['Ice Age 6', ['Animation','Family'], 'Scrat saga continues with the herd.', 'Ray Romano', 'John Leguizamo', 'Mike Thurmeier', 0, 'In theaters Dec 18 2026. Later on Disney+.', []],
['Shrek 5', ['Animation','Comedy','Family'], 'Far Far Away returns with Donkey and Puss.', 'Mike Myers', 'Cameron Diaz', 'Walt Dohrn', 1, 'In theaters Dec 23 2026. Later on Peacock.', []],
]);
