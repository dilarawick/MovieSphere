// REAL 2026 movies part 1 (summer blockbusters).
// Trailer-only + where-to-watch. In-theater titles show theaters:true.
import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg';
const PH = (t) => 'https://placehold.co/500x750/1a1040/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: 2026, imdb: r[2],
    duration: '2h 10m', maturity: 'PG-13', quality: '4K',
    genres: r[3], overview: r[4], cast: [r[5], r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8], featured: !!r[9],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'In theaters - trailer only',
    watchNote: r[10],
    curatedProviders: { flatrate: p(...(r[11] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple'), theaters: true },
  }));
}
export const REAL2026_A = mk([
[null, 'Spider-Man: Brand New Day', 0, ['Action','Adventure','Sci-Fi'], 'Peter Parker faces a new threat after No Way Home. Biggest 2026 box office.', 'Tom Holland', 'Zendaya', 'Destin Daniel Cretton', 1, 1, 'In theaters Jul 2026. Later on Netflix then Disney+.', []],
[null, 'The Odyssey', 0, ['Adventure','Drama','Action'], 'Nolan epic of Odysseus voyage home. Shot for IMAX.', 'Matt Damon', 'Tom Holland', 'Christopher Nolan', 1, 1, 'In theaters Jul 17 2026. Later on Peacock.', []],
[null, 'Toy Story 5', 0, ['Animation','Family','Comedy'], 'Woody and Buzz face smart tablets taking kids attention.', 'Tom Hanks', 'Tim Allen', 'Andrew Stanton', 1, 1, 'In theaters Jun 19 2026. Later on Disney+.', []],
[null, 'Project Hail Mary', 0, ['Sci-Fi','Adventure'], 'A lone astronaut saves Earth from extinction. From Andy Weir novel.', 'Ryan Gosling', 'Sandra Huller', 'Phil Lord', 1, 0, 'In theaters Mar 2026. Later on Prime Video.', []],
[null, 'The Mandalorian and Grogu', 0, ['Sci-Fi','Adventure'], 'Mando and Grogu jump to the big screen.', 'Pedro Pascal', 'Sigourney Weaver', 'Jon Favreau', 1, 0, 'In theaters May 22 2026. Later on Disney+.', []],
[null, 'Moana', 0, ['Adventure','Family','Fantasy'], 'Live-action Moana sails again with Maui.', 'Catherine Laga‘aia', 'Dwayne Johnson', 'Thomas Kail', 1, 0, 'In theaters Jul 10 2026. Later on Disney+.', []],
[null, 'Supergirl', 0, ['Action','Sci-Fi','Adventure'], 'Kara Zor-El headline DCU film from Woman of Tomorrow.', 'Milly Alcock', 'Jason Momoa', 'Craig Gillespie', 1, 0, 'In theaters Jun 26 2026. Later on Max.', []],
[null, 'Coyote vs. Acme', 0, ['Comedy','Family'], 'Wile E. Coyote sues Acme Corp. Live-action/animation.', 'John Cena', 'Will Forte', 'Dave Green', 0, 0, 'In theaters Aug 2026. Later on Max.', []],
[null, 'Scream 7', 0, ['Horror','Thriller'], 'Sidney Prescott returns as Ghostface hunts again.', 'Neve Campbell', 'Courteney Cox', 'Kevin Williamson', 1, 0, 'In theaters Feb 27 2026. Later on Paramount+.', []],
[null, 'Scary Movie 6', 0, ['Comedy','Horror'], 'Wayans reboot spoofs modern horror.', 'Marlon Wayans', 'Anna Faris', 'Michael Tiddes', 0, 0, 'In theaters Jun 12 2026. Later on Paramount+.', []],
[null, 'The Devil Wears Prada 2', 0, ['Comedy','Drama'], 'Miranda vs Emily in collapsing magazine world.', 'Meryl Streep', 'Anne Hathaway', 'David Frankel', 1, 0, 'In theaters May 2026. Later on Hulu / Disney+.', []],
[null, 'Michael', 0, ['Drama','Music'], 'Michael Jackson biopic starring his nephew Jaafar.', 'Jaafar Jackson', 'Colman Domingo', 'Antoine Fuqua', 1, 0, 'In theaters 2026. Later on Paramount+.', []],
]);
