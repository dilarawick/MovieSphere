import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg';
const PH = (t) => 'https://placehold.co/500x750/0d1d33/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: r[2], imdb: r[3],
    duration: '2h 10m', maturity: 'PG-13', quality: '4K',
    genres: r[4], overview: r[5], cast: [r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple') },
  }));
}
export const BULK_BIG2 = mk([
[786892, 'Furiosa: A Mad Max Saga Alt', 2024, 7.5, ['Action','Adventure','Sci-Fi'], 'Young Furiosa plots a path home. Alt poster pack.', 'Anya Taylor-Joy', 'George Miller', 1, 'Stream on Max. Rent on Prime Video.', ['max']],
[653346, 'Kingdom of the Planet of the Apes Alt', 2024, 7.0, ['Sci-Fi','Adventure'], 'A young ape questions the past. Alt poster pack.', 'Owen Teague', 'Wes Ball', 1, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
[575264, 'Mission: Impossible - Dead Reckoning', 2023, 7.1, ['Action','Thriller'], 'Ethan hunts a rogue AI weapon.', 'Tom Cruise', 'Christopher McQuarrie', 0, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
[667538, 'Transformers: Rise of the Beasts', 2023, 6.0, ['Action','Sci-Fi'], 'Maximals join the Autobots in Peru.', 'Anthony Ramos', 'Steven Caple Jr', 0, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
[298618, 'The Flash', 2023, 5.9, ['Action','Sci-Fi'], 'Barry resets the multiverse.', 'Ezra Miller', 'Andy Muschietti', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[346698, 'Barbie Alt', 2023, 6.9, ['Comedy','Adventure','Fantasy'], 'Barbie leaves Barbie Land. Alt poster pack.', 'Margot Robbie', 'Greta Gerwig', 1, 'Stream on Max. Rent on Prime Video.', ['max']],
[980489, 'Gran Turismo', 2023, 7.1, ['Action','Drama','Sport'], 'A gamer becomes a real racer.', 'Archie Madekwe', 'Neill Blomkamp', 0, 'Stream on Netflix. Rent on Prime Video.', ['netflix']],
[678512, 'Sound of Freedom', 2023, 7.4, ['Action','Drama'], 'An agent rescues trafficked kids.', 'Jim Caviezel', 'Alejandro Monteverde', 0, 'Stream on Prime Video.', ['prime']],
[976409, 'John Wick: Chapter 4 Alt', 2023, 7.7, ['Action'], 'Alt poster pack - real entry exists.', 'Keanu Reeves', 'Chad Stahelski', 0, 'Rent on Prime Video.', []],
[609681, 'The Marvels', 2023, 5.5, ['Action','Sci-Fi'], 'Captain Marvel teams with Ms Marvel.', 'Brie Larson', 'Nia DaCosta', 0, 'Stream on Disney+. Rent on Prime Video.', ['disney']],
]);
