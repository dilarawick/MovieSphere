// REAL 2026 movies part 2 (spring-to-fall slate).
import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg';
const PH = (t) => 'https://placehold.co/500x750/241a08/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: 2026, imdb: r[2],
    duration: '1h 55m', maturity: 'PG-13', quality: '4K',
    genres: r[3], overview: r[4], cast: [r[5], r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8], featured: false,
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'In theaters - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple'), theaters: true },
  }));
}
export const REAL2026_B = mk([
[null, 'Avengers: Doomsday', 0, ['Action','Adventure','Sci-Fi'], 'Avengers face Doctor Doom. MCU Phase Six.', 'Robert Downey Jr.', 'Chris Hemsworth', 'Russo Brothers', 1, 'In theaters Dec 18 2026. Later on Disney+.', []],
[null, 'Dune: Part Three', 0, ['Sci-Fi','Adventure'], 'Paul Atreides holy war finale. Villeneuve trilogy end.', 'Timothee Chalamet', 'Zendaya', 'Denis Villeneuve', 1, 'In theaters Dec 18 2026. Later on Max / Netflix.', []],
[null, 'The Super Mario Galaxy Movie', 0, ['Animation','Adventure','Comedy'], 'Mario crosses the galaxy. SMB sequel.', 'Chris Pratt', 'Anya Taylor-Joy', 'Aaron Horvath', 1, 'In theaters Apr 1 2026. Later on Peacock.', []],
[null, 'Minions and Monsters', 0, ['Animation','Family','Comedy'], 'Minions meet monsters. Illumination summer film.', 'Pierre Coffin', 'Steve Carell', 'Pierre Coffin', 1, 'In theaters Jul 1 2026. Later on Peacock.', []],
[null, 'Hokum Carry', 0, ['Thriller','Western','Crime'], 'A lawman hunts a witch in a cursed town.', 'Adam Driver', 'Dan Stevens', 'Damien Chazelle', 0, 'In theaters Apr 24 2026. Later on Paramount+.', []],
[null, 'The Sheep Detectives', 0, ['Comedy','Crime'], 'Sheep solve a murder. From Richard Osman book.', 'Hugh Jackman', 'Emma Thompson', 'Kyle Balda', 0, 'In theaters May 8 2026. Later on Prime Video.', []],
[null, 'Masters of the Universe', 0, ['Action','Fantasy'], 'He-Man returns. Nicholas Galitzine stars.', 'Nicholas Galitzine', 'Jared Leto', 'Travis Knight', 0, 'In theaters Jun 5 2026. Later on Netflix.', []],
[null, 'Ready or Not 2', 0, ['Horror','Comedy'], 'Grace returns in Here I Come sequel.', 'Samara Weaving', 'Kathryn Newton', 'Matt Bettinelli-Olpin', 0, 'In theaters Apr 10 2026. Later on Hulu.', []],
[null, 'Greenland 2: Migration', 0, ['Action','Thriller'], 'Garrity family survives new comets.', 'Gerard Butler', 'Morena Baccarin', 'Ric Roman Waugh', 0, 'In theaters Jan 9 2026. Rent on Prime Video.', []],
[null, '28 Years Later: The Bone Temple', 0, ['Horror','Thriller'], 'Second chapter of Garland rage-virus trilogy.', 'Aaron Taylor-Johnson', 'Ralph Fiennes', 'Nia DaCosta', 1, 'In theaters Jan 16 2026. Later on Netflix.', []],
[null, 'Primate', 0, ['Horror'], 'A plane crash unleashes a killer chimp.', 'Johnny Sequoyah', 'Jessica Alexander', 'Johannes Roberts', 0, 'In theaters Jan 9 2026. Later on Paramount+.', []],
]);
